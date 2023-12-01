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

const practice = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;
// input = practice;
input = input.trim();

print(input.split("\n").map(l => {
    const nums = [...new Array(l.length).fill(0).map((_, i) => l.substring(i)).map(c => c.match(/[0-9]|one|two|three|four|five|six|seven|eight|nine/)).filter(c => c).map(c => c![0])];
    // zdgtfqszsctjtvr7qqhvsninesevenxtcmdhfzxvfrtjqhzmm6
    const ni = (v: string) => ""+(+v || ["zero","one","two","three","four","five","six","seven","eight","nine"].indexOf(v));
    print(l, ni(nums[0])+ni(nums[nums.length - 1]));
    return +(ni(nums[0]) + ni(nums[nums.length - 1]));
}).reduce((t, a) => t + a))
