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
*    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;
// input = practice;
input = input.trim().substring(1);

const [stacksin, instrs] = input.split("\n\n");
const stacksinl = stacksin.split("\n");
const cnt = (stacksinl.reduce((t, v) => Math.max(t, v.length), 0) + 1) / 4;

const stacks = new Array(cnt).fill(0).map((_, i) => {
    const res = [];
    for(let y = 0; y < stacksinl.length - 1; y++) {
        const v = stacksinl[y][1 + i * 4];
        if(v != null && v != ' ') res.push(v);
    }
    return res;
});
console.log(stacks);

for(const instr of instrs.split("\n")) {
    const [count, from, to] = [...instr.match(/\d+/g)];
    stacks[+to - 1].unshift(...stacks[+from - 1].splice(0, +count));
    console.log(stacks);
}
console.log(stacks.map(v => v[0]).join(""));


// input.

// hi! i'm glad you're excited to code
// but consider fully reading the problem statement first.
// Sincerely, future you.
