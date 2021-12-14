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

let paircounts = new Map<string, number>();

[...templ].op([...templ].slice(1), (a, b) => {
    if(!b) {
        paircounts.set(a + "!", (paircounts.get(a + "!") ?? 0) + 1);
        return;
    }
    paircounts.set(a + b, (paircounts.get(a + b) ?? 0) + 1);
}).join("")

console.log(templ, paircounts);

/*
Map(6) {
  'NC' => 1,
  'CN' => 2, // ?
  'NB' => 1,
  'BC' => 2,
  'CH' => 1,
  'HB' => 2
}
NNCB
1 NCNBCHB

NC
CN
NB
BC
CH
HB
*/

for(let i = 0; i < 40; i++) {

let npc = new Map<string, number>();
for(const [key, value] of paircounts.entries()) {
    const match = rules.get(key);
    if(match) {
        const k = key[0] + match;
        npc.set(k, (npc.get(k) ?? 0) + value);
        const l = match + key[1];
        npc.set(l, (npc.get(l) ?? 0) + value);
    }else{
        const k = key;
        npc.set(k, (npc.get(k) ?? 0) + value);
    }
}
paircounts = npc;

}

console.log(paircounts);

let occurances = new Map<string, number>();
for(const [key, value] of paircounts.entries()) {
    occurances.set(key[0], (occurances.get(key[0]) ?? 0) + value);
}
console.log(occurances);
console.log([...occurances.entries()].map(([k, v]) => v).sort((a, b) => a - b).use((
    a
) => {
    return a.at(-1) - a.at(0);
}));

