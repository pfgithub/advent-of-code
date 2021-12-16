const std = @import("std");

const endian: std.builtin.Endian = .Big;

const PacketType = enum(u3) {
    literal = 4,

    sum = 0,
    product = 1,
    minimum = 2,
    maximum = 3,
    greater_than = 5,
    less_than = 6,
    equal_to = 7,
};

const LengthMode = enum(u1) {
    bits = 0,
    packets = 1,
};

const Length = union(LengthMode) {
    bits: u15, 
    packets: u11,
};

const PacketResult = u64;

const PacketIter = struct {
    remaining: Length,
    fbs: *std.io.FixedBufferStream([]const u8),
    bits: *std.io.BitReader(endian, std.io.FixedBufferStream([]const u8).Reader),

    pub fn next(pi: *PacketIter) error{InvalidPacket}!?PacketResult {
        switch(pi.remaining) {
            .bits => |*bits| {
                // unfortunately super messy because BitReader doesn't count bits
                if(bits.* == 0) return null;

                const pos_start = pi.fbs.pos;
                const bit_start = 8 - @as(u4, pi.bits.bit_count);

                const result = try eval(pi.fbs, pi.bits);

                const pos_end = pi.fbs.pos;
                const bit_end = 8 - @as(u4, pi.bits.bit_count);

                const total_bits = (pos_end * 8 + bit_end) - (pos_start * 8 + bit_start);

                if(total_bits > std.math.maxInt(u15)) return error.InvalidPacket;
                if(bits.* < total_bits) return error.InvalidPacket;
                bits.* -= @intCast(u15, total_bits);

                return result;
            },
            .packets => |*pc| {
                if(pc.* == 0) return null;
                pc.* -= 1;
                return try eval(pi.fbs, pi.bits);
            },
        }
    }

    pub fn reduce(
        pi: *PacketIter,
        comptime Reducer: type,
    ) !@TypeOf(Reducer.initial) {
        var result = Reducer.initial;
        while(try pi.next()) |value| {
            result = Reducer.cb(result, value);
        }
        return result;
    }
};

const Reducers = struct {
    const Sum = struct {
        const initial: PacketResult = 0;
        pub fn cb(t: PacketResult, a: PacketResult) PacketResult {
            return t + a;
        }
    };
    const Mul = struct {
        const initial: PacketResult = 1;
        pub fn cb(t: PacketResult, a: PacketResult) PacketResult {
            return t * a;
        }
    };
    const Min = struct {
        const initial: PacketResult = std.math.maxInt(u64);
        pub fn cb(t: PacketResult, a: PacketResult) PacketResult {
            return std.math.min(t, a);
        }
    };
    const Max = struct {
        const initial: PacketResult = std.math.minInt(u64);
        pub fn cb(t: PacketResult, a: PacketResult) PacketResult {
            return std.math.max(t, a);
        }
    };
};

pub fn eval(
    fbs: *std.io.FixedBufferStream([]const u8),
    bits: *std.io.BitReader(endian, std.io.FixedBufferStream([]const u8).Reader),
) error{InvalidPacket}!PacketResult {
    const version = bits.readBitsNoEof(u3, 3) catch return error.InvalidPacket;
    _ = version; // no one cares about you
    const packet_type_raw = bits.readBitsNoEof(u3, 3) catch return error.InvalidPacket;
    const packet_type = std.meta.intToEnum(PacketType, packet_type_raw) catch return error.InvalidPacket;

    if(packet_type == .literal) {
        var res: u64 = 0;
        while(true) {
            const cont = 1 == (bits.readBitsNoEof(u1, 1)  catch return error.InvalidPacket);
            res <<= 4;
            res |= bits.readBitsNoEof(u4, 4) catch return error.InvalidPacket;
            if(!cont) break;
        }
        return res;
    }

    const len_kind = @intToEnum(LengthMode, bits.readBitsNoEof(u1, 1) catch return error.InvalidPacket);

    const len: Length = switch(len_kind) {
        .bits => .{.bits = bits.readBitsNoEof(u15, 15) catch return error.InvalidPacket},
        .packets => .{.packets = bits.readBitsNoEof(u11, 11) catch return error.InvalidPacket},
    };

    var iter = PacketIter{
        .remaining = len,
        .fbs = fbs,
        .bits = bits,
    };

    return switch(packet_type) {
        .literal => unreachable,

        .sum => iter.reduce(Reducers.Sum),
        .product => iter.reduce(Reducers.Mul),
        .minimum => iter.reduce(Reducers.Min),
        .maximum => iter.reduce(Reducers.Max),
        .greater_than, .less_than, .equal_to => {
            const a = (iter.next() catch return error.InvalidPacket) orelse return error.InvalidPacket;
            const b = (iter.next() catch return error.InvalidPacket) orelse return error.InvalidPacket;
            if((iter.next() catch return error.InvalidPacket) != null) return error.InvalidPacket;
            return switch(packet_type) {
                .greater_than => @boolToInt(a > b),
                .less_than => @boolToInt(a < b),
                .equal_to => @boolToInt(a == b),
                else => unreachable,
            };
        },
    };
}

pub fn evalFromInput(raw_input: []const u8, alloc: std.mem.Allocator) !usize {
    const input = std.mem.trim(u8, raw_input, "\r\n ");

    var data = try std.ArrayList(u8).initCapacity(
        alloc,
        std.math.divCeil(usize, input.len, 2) catch unreachable,
    );
    defer data.deinit();

    var writer = std.io.bitWriter(endian, data.writer());
    for(input) |char| {
        writer.writeBits(
            @intCast(u4, try std.fmt.charToDigit(char, 16)),
            4,
        ) catch unreachable;
    }

    var fbs = std.io.fixedBufferStream(@as([]const u8, data.items));
    var reader = std.io.bitReader(endian, fbs.reader());

    return try eval(&fbs, &reader);
}

pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const alloc = arena.allocator();

    const input = @embedFile("day16.txt");

    std.log.info("result: {d}", .{try evalFromInput(input, alloc)});
}


fn testCase(input: []const u8, result: usize) !void {
    try std.testing.expectEqual(result, try evalFromInput(input, std.testing.allocator));
}
fn testError(input: []const u8) !void {
    try std.testing.expectError(try evalFromInput(input, std.testing.allocator));
}
test "cases" {
    // C200B40A82 finds the sum of 1 and 2, resulting in the value 3.
    // 04005AC33890 finds the product of 6 and 9, resulting in the value 54.
    // 880086C3E88112 finds the minimum of 7, 8, and 9, resulting in the value 7.
    // CE00C43D881120 finds the maximum of 7, 8, and 9, resulting in the value 9.
    // D8005AC2A8F0 produces 1, because 5 is less than 15.
    // F600BC2D8F produces 0, because 5 is not greater than 15.
    // 9C005AC2F8F0 produces 0, because 5 is not equal to 15.
    // 9C0141080250320F1802104A08 produces 1, because 1 + 3 = 2 * 2.

    try testCase("C200B40A82", 3);
    try testCase("04005AC33890", 54);
    try testCase("880086C3E88112", 7);
    try testCase("CE00C43D881120", 9);
    try testCase("D8005AC2A8F0", 1);
    try testCase("F600BC2D8F", 0);
    try testCase("9C005AC2F8F0", 0);
    try testCase("9C0141080250320F1802104A08", 1);
    // ^ gh copilot converted those into test cases for me, thanks

    try testCase(@embedFile("day16.txt"), 1015320896946);
}