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

const practice = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`;
// input = practice;
input = input.trim();

print(input.split("\n").map(l => {
    const nums = [...l.matchAll(/[0-9]/g)];
    return +(nums[0][0] + nums[nums.length - 1][0]);
}).reduce((t, a) => t + a))
