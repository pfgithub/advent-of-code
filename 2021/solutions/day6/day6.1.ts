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

function step() {
    let newfish: number[] = [];
    fish = fish.flatMap(f => {
        if(f === 0) {
            newfish.push(8);
            return [6];
        }
        return [f - 1];
    });
    fish = [...fish, ...newfish];
}

for(let i = 0; i < 80; i++) {
    step();
}

fish.dwth(log);
console.log(fish.length);