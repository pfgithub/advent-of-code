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

const nv = (i: number, a: number[]) => {
    return a[i] + a[i + 1] + a[i + 2];
}

const practice = `199
200
208
210
200
207
240
269
260
263`;

const res = input.trim().split("\n").map(w =>+ w).map((m, i, a) => nv(i, a));
console.log(res);
const rv = res.map((w, i, a) => w > a[i - 1]);
rv.shift();
console.log(rv.reduce((t, a) => t + +a, 0));
