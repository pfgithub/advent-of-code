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

const practice = `A Y
B X
C Z
`;
// input = practice;
input = input.trim();

let score = 0;
const youscore = {
    'X': 1,
    'Y': 2,
    'Z': 3,
};
for(const line of input.split("\n")) {
    const [they, you] = line.split(" ");
    score += youscore[you]!;
    if(they === "A") {
        if(you === "X") {
            score += 3;
        }else if(you === "Y") {
            score += 6;
        }else score += 0;
    }else if(they === "B") {
        if(you === "Y") {
            score += 3;
        }else if(you === "Z") {
            score += 6;
        }
    }else if(they === "C") {
        if(you === "X") {
            score += 6;
        }else if(you === "Z") {
            score += 3;
        }
    }
    console.log(score);
}