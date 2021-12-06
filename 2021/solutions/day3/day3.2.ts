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


let res = [...itms];
let ares = [...itms];
range(itms[0].length).map(i => {
    let zeros = 0;
    let ones = 0;

    res.forEach(cv => {
        const c = cv[i];
        if(c === "0") zeros++;
        else ones++;
    })
    if(zeros > ones) {
        if(res.length !== 1) res = res.filter(v => v[i] === "0");
    } else {
        if(res.length !== 1) res = res.filter(v => v[i] === "1");
    }

    let zeroes = 0;
    ones = 0;

    ares.forEach(cv => {
        const c = cv[i];
        if(c === "0") zeroes++;
        else ones++;
    });
    if(zeroes <= ones) {
        if(ares.length !== 1) ares = ares.filter(v => v[i] === "0");
    } else {
        if(ares.length !== 1) ares = ares.filter(v => v[i] === "1");
    }
})


const arat = parseInt(res[0], 2);
const brat = parseInt(ares[0], 2);

[arat, brat].dwth(log);

(arat * brat).dwth(log); // expect-equal 4412188


// const ares = res.map(w => 1 - w);

// console.log(parseInt(res.join(""), 2) * parseInt(ares.join(""), 2));

[res, ares].dwth(log)
// ares.dwth(log)