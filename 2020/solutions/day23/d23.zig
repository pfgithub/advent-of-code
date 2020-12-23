const std = @import("std");

pub fn range(max: usize) []const void {
    return @as([]const void, &[_]void{}).ptr[0..max];
}

pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const alloc = &arena.allocator;
    const array_space = try alloc.alloc(usize, 20_000_000);
    
    var array: []usize = array_space[0..1_000_000];
    
    for(range(1_000_000)) |_, i| {
        array[i] = i + 1;
    }
    for("389125467") |char, i| {
        array[i] = (char - '0');
    }
    
    for(range(10_000_000)) |_, iter_index| {
        const current = array[0];
        const three = array[1..4];
        array = array[4..];
        array.len += 4;
        // this is going to be too slow isn't it
        var searchv = current - 1;
        if(searchv == 0) searchv = array.len;
        for(range(3)) |_| {
            for(three) |v| {
                if(searchv == v) searchv -= 1;
                if(searchv == 0) searchv = array.len;
            }
        }
        const foundi = for(array) |v, i| {
            if(v == searchv) break i;
        } else std.debug.panic("Did not find {} in array", .{searchv});
        // 2 1 0 3
        // 2 . . . 1 0 3
        // TODO if it's faster, go the other direction?
        std.mem.copyBackwards(usize, array[foundi + 4..], array[foundi + 1..array.len - 3]);
        std.mem.copy(usize, array[foundi + 1..foundi + 4], three);
        array[array.len - 1] = current;
    
        if(iter_index % 1_000 == 0) std.log.emerg("iter index: {}", .{iter_index});
    }
}