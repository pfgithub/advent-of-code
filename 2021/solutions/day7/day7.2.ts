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

const practice = `16,1,2,0,4,2,7,1,2,14`;
// input = practice;
input = input.trim();

const hpos = input.split(",").map(Number);

// As it turns out, crab submarine engines don't burn fuel at a constant rate. Instead, each change of 1 step in horizontal position costs 1 more unit of fuel than the last: the first step costs 1, the second step costs 2, the third step costs 3, and so on.
function getCost(start: number, end: number): number {
    const steps = Math.abs(start - end);
    let res = 0;
    for(let i = 0; i < steps; i++) {
        res += i + 1;
    }
    // console.log(start, end, res);
    return res;
}

let mincost = Infinity;

for(const start_p of range(0, hpos.reduce((a, b) => Math.max(a, b), 0))) {
    // Each change of 1 step in horizontal position of a single crab costs 1 fuel. You could choose any horizontal position to align them all on, but the one that costs the least fuel is horizontal position 2:

    let cost = 0;
    for(const crab of hpos) {
        cost += getCost(crab, start_p);
    }

    if(cost < mincost) {
        mincost = cost;
    }
}

console.log(mincost); // = 92948968