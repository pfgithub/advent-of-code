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

input.split("\n").filter(line => {
    // find first non-matching parenthesis

    let stack: string[] = [];
    for(const char of [...line]) {
        if(opens.includes(char)) {
            stack.push(char);
        }else{
            let last = stack.pop();
            if(!last) return true;
            if(closes.indexOf(char) !== opens.indexOf(last)) {
                return false;
            }
        }
    }
    return true;
}).map(line => {
    let stack: string[] = [];
    let res = "";
    for(const char of [...line]) {
        if(opens.includes(char)) {
            stack.push(char);
        }else{
            stack.pop();
        }
    }
    return (stack.map(st => closes[opens.indexOf(st)]));
}).map(v => {
    let pts = 0;
    for(const i of [...v].reverse()) {
        const score = {
            ")": 1,
            "]": 2,
            "}": 3,
            ">": 4,
        }[i];
        pts *= 5;
        pts += score!;
    }
    return pts;
}).dwth(log).sort((a, b) => a - b).use(v => (
    v[v.length / 2 |0]
)).dwth(log); // expect=1105996483
