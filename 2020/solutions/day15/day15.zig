const std = @import("std");

// brute force because why not?
pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const alloc = &arena.allocator;
    
    const initials = [_]usize{8,0,17,4,1,12};
    var prev_spoken = std.AutoHashMap(usize, usize).init(alloc);
    
    var turn: usize = 0;
    var last_number: usize = 0;
    for(initials) |initial| {
        turn += 1;
        if(turn != initials.len) try prev_spoken.putNoClobber(initial, turn);
        last_number = initial;
    }
    while(turn < 30000000) {
        turn += 1;
        if(prev_spoken.get(last_number)) |last_spoken_turn| {
            try prev_spoken.put(last_number, turn - 1);
            const diff = (turn - 1) - last_spoken_turn;
            last_number = diff;
        }else{
            // last time the number was spoken was now
            try prev_spoken.putNoClobber(last_number, turn - 1);
            last_number = 0;
        }
        // std.debug.warn("{}: {}\n", .{turn, last_number});
    }
    std.debug.warn("{}: {}\n", .{turn, last_number});
}