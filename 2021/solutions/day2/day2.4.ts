/*
input: string, lines: string[], dblines: string[][]
copy(text: string) → clipboard
error(message: string) → thrown error
-5..mod(3) → @mod(-5, 3)
*/

// Cardinals:
// [[1,0],[-1,0],[0,1],[0,-1]]
// +Diagonals:
// [[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[-1,1],[1,-1],[1,1]]

export {};

const practice = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

const inv = input;

let pos = vec(2, [0, 0]);
let aim = 0;

inv.trim().split("\n").map(w => w.split(" ")).forEach(([dir, cntv]) => {
    const cnt = +cntv;
    if(dir === "forward") pos = pos.add(vec(2, [cnt, aim * cnt]));
    if(dir === "up") aim -= cnt;
    if(dir === "down") aim += cnt;
});

(pos.x * pos.y).dwth(log)

// input = practice;