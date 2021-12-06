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

const practice = `3,4,3,1,2
`;
// input = practice;

let fish = input.trim().split(",").map(w => +w);

let counts = new Array(9).fill(0);

for(const fsh of fish) {
    counts[fsh]++;
}

function step() {
    let nc: number[] = [...counts];
    counts.forEach((c, i) => {
        if(i == 0) {
            nc[i] -= c;
            nc[6] += c;
            nc[8] += c;
        }else{
            nc[i] -= c;
            nc[i - 1] += c;
        }
    });
    counts = nc;
}

for(let i = 0; i < 256; i++) {
    step();
}


counts.dwth(log);
console.log(Array.dwth.bind(counts)(log));
console.log(counts.reduce((t, c) => t + c, 0));