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
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
// input = practice;
input = input.trim();

let count = 0;
for(const line of input.split("\n")) {
    let pv = null;
    let pass_incr = true;
    let pass_decr = true;

    for(const itm of line.split(/\s+/)) {
        const v = +itm;
        if(pv != null) {
            // 3 - 1 = 2
            const diff = v - pv;
            const dabs = Math.abs(diff);
            if(diff > 0) {} else {pass_incr = false}
            if(diff < 0) {} else {pass_decr = false}
            if(dabs >= 1 && dabs <= 3) {
                
            }else{
                pass_incr = false;
                pass_decr = false;
            }
        }
        pv = v;
    }
    console.log(pass_incr, pass_decr);
    if(pass_incr || pass_decr) {
        count += 1;
    }
}
console.log(count);

// input.

// hi! i'm glad you're excited to code
// but consider fully reading the problem statement first.
// Sincerely, future you.


// 4:32