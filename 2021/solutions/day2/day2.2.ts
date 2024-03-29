import {fhmain} from "../../../src/fheader";
fhmain(__filename);
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

let hp = 0;
let dp = 0;
let aim = 0;

inv.trim().split("\n").map(w => w.split(" ")).forEach(([dir, cntv]) => {
    const cnt = +cntv;
    if(dir === "forward") {
        hp += cnt;
        dp += aim * cnt;
    }
    if(dir === "up") aim -= cnt;
    if(dir === "down") aim += cnt;
});

(hp * dp).dwth(log)

// input = practice;

// TODO expect = 1698850445;