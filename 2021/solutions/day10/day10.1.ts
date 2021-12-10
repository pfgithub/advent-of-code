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

const practice = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;
// input = practice;
input = input.trim();

// hi! i'm glad you're excited to code
// but consider fully reading the problem statement first.
// Sincerely, future you.

let opens = [..."([{<"];
let closes = [...")]}>"];

let respts = 0;
input.split("\n").map(line => {
    // find first non-matching parenthesis

    let stack: string[] = [];
    for(const char of [...line]) {
        if(opens.includes(char)) {
            stack.push(char);
        }else{
            let last = stack.pop();
            if(!last) return;
            if(!last || closes.indexOf(char) !== opens.indexOf(last)) {
                const pts = {
                    ")": 3,
                    "]": 57,
                    "}": 1197,
                    ">": 25137,
                }[char];
                console.log(`${line} is not balanced, ${pts}`);
                respts += pts;
                return;
            }
        }
    }
});

console.log(respts); // expect=215229