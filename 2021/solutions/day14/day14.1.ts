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
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C

`;
// input = practice;
input = input.trim();

const [template, insertionrules] = input.split("\n\n");

const ruleso = insertionrules.split("\n").map(r => r.split(" -> "));
const rules = new Map<string, string>();

ruleso.forEach(([lhs, rhs]) => rules.set(lhs, rhs));

let templ = template;

const paircounts = new Map<string, number>();

[...templ].op([...templ].slice(1), (a, b) => {
    if(!b) return;
    paircounts.set(a + b, (paircounts.get(a + b) ?? 0) + 1);
}).join("")

console.log(templ);
for(let i = 0; i < 10; i++) {
    // zip(a, a[1..])
    
    templ = [...templ].op([...templ].slice(1), (a, b) => {
        const match = rules.get(a + b);
        if(match) return a + match;
        return a;
    }).join("");

    // console.log(i + 1, templ);
}

const arr = [...templ];

// most common element in arer

function mostCommon(arr: string[]) {
    const counts = arr.reduce((acc, cur) => {
        acc[cur] = (acc[cur] || 0) + 1;
        return acc;
    }, {} as {[key: string]: number});

    const max = Math.max(...Object.values(counts));
    const min = Math.min(...Object.values(counts));
    const mostCommon = Object.keys(counts).filter(k => counts[k] === max || counts[k] === min);
    return [counts[mostCommon[0]], counts[mostCommon[1]]].sort((a, b) => a - b);
}


console.log(mostCommon(arr).use(([a, b]) => b - a));