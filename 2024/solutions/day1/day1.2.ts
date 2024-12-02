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

const practice = `
3   4
4   3
2   5
1   3
3   9
3   3`;
// input = practice;
input = input.trim();

const lvl = [];
const lvr = [];
for(const seg of input.split("\n").map(l => l.split(/\s+/).map(v => +v))) {
    lvl.push(seg[0]);
    lvr.push(seg[1]);
}
lvl.sort((a, b) => a - b);
lvr.sort((a, b) => a - b);
let total = 0;
for(let i = 0; i < lvl.length; i++) {
    let sc = 0;
    for(let j = 0; j < lvr.length; j++) {
        if(lvr[j] === lvl[i]) {
            sc += 1;
        }
    }
    total += lvl[i] * sc;
}
console.log(total);

// input.

// hi! i'm glad you're excited to code
// but consider fully reading the problem statement first.
// Sincerely, future you.
