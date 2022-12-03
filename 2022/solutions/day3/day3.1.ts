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
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;
// input = practice;
input = input.trim();

let total = 0;
for(const rs of input.split("\n")) {
    const lhs = rs.substring(0, rs.length / 2 |0);
    const rhs = rs.substring(rs.length / 2 |0);
    const bc = new Set();
    for(const itm of [...lhs]) bc.add(itm);
    let res: string;
    for(const itm of [...rhs]) {
        if(bc.has(itm)) res = itm;
    }
    const icp = res.codePointAt();
    const acp = 'a'.codePointAt();
    const zcp = 'z'.codePointAt();
    const Acp = 'A'.codePointAt();
    let rv = 0;
    if(icp >= acp) {
        rv = icp - acp + 1;
    }else{
        rv = icp - Acp + 27;
    }
    total += rv;
    // console.log(res, rv);
}
console.log(total);