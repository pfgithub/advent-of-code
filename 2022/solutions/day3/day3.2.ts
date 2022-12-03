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
const splitv = input.split("\n");
for(let i = 0; i < splitv.length; i += 3) {
    const sacks = splitv.slice(i, i + 3);
    let commons = {};
    for(const sack of sacks) {
        for(const itm of new Set([...sack])) {
            commons[itm] ??= 0;
            commons[itm]++;
        }
    }
    let res;
    for(const [k, v] of Object.entries(commons)) {
        if(v === 3) res = k;
    }
    // console.log(sacks, commons);
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