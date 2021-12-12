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
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`;
// input = practice;
input = input.trim();

const system: {[key: string]: string[]} = {

};

input.split("\n").forEach(line => {
    const [left, right] = line.split("-");
    (system[left] ??= []).push(right);
    (system[right] ??= []).push(left);
});

const unique_paths = new Set<string>();

function isUppercase(a: string): boolean {
    return a.toUpperCase() === a;
}

// visit small caves at most once, and can visit big caves any number of times
function findPath(begin: string[]): string[] {
    if(begin[begin.length - 1] === "end") {
        return [begin.join(",")];
    }

    let choices = system[begin[begin.length-1]];

    let has = new Set<string>();
    let allowv = 2;
    begin.some(v => {
        if(isUppercase(v)) return false;
        if(has.has(v)) {
            allowv = 1;
            return true;
        }
        has.add(v);
        return false;
    });
    // console.log(begin, allowv);

    choices = choices.filter(c => {
        if(isUppercase(c)) return true;
        if(c === "start") return false;
        // check if begin has any item twice
        return begin.filter(v => v === c).length < allowv;
    });

    return choices.flatMap((c) => findPath([...begin, c]));
}

findPath(["start"]).dwth(log).dwth(v => log(v.length)); // expect=114189

// input.

// hi! i'm glad you're excited to code
// but consider fully reading the problem statement first.
// Sincerely, future you.