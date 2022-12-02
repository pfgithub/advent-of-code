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

const practice = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;
// input = practice;
input = input.trim();

const m = input.split("\n\n").map(q => q.split("\n").reduce((t, w) => +w+t, 0));
const w = (m.sort((a, b) => b - a));
console.log(w[0] + w[1] + w[2])

// input.

// hi! i'm glad you're excited to code
// but consider fully reading the problem statement first.
// Sincerely, future you.

// START AT:
// 1669954380066
// END AT:
// 1669954529020
//
// = about ~149sec = 2min 29sec = not leaderboard