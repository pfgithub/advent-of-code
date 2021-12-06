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
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`;
// input = practice;


const itms = input.trim().split('\n');


let res: number[] = [];
range(itms[0].length).map(i => {
    let zeros = 0;
    let ones = 0;
    itms.forEach(cv => {
        const c = cv[i];
        if(c === "0") zeros++;
        else ones++;
    })
    if(zeros > ones) res.push(0);
    else res.push(1);
});

const ares = res.map(w => 1 - w);

console.log(parseInt(res.join(""), 2) * parseInt(ares.join(""), 2));

res.dwth(log)
ares.dwth(log)