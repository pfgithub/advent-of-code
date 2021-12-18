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
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`;
// input = practice;
input = input.trim();

const data = JSON.parse("["+input.split("\n").join(",")+"]").map(v => mknum(v));

function mknum(v: any, parent: Num | null = null): Num {
    if(typeof v === "number") return {parent, value: v};
    const res: Num = {
        parent,
    };
    res.lhs = mknum(v[0], res);
    res.rhs = mknum(v[1], res);
    return res;
}

type Num = {
    parent: Num | null,
    lhs: Num,
    rhs: Num,
} | {
    parent: Num | null,
    value: number,
};

function firstleft(num: Num): Num | null {
    if(!num.parent) return null;
    if(num.parent.lhs === num) return firstleft(num.parent);
    const v = num.parent.lhs;
    return rightmost(v);
}
function rightmost(v: Num): Num {
    if('value' in v) return v;
    return rightmost(v.rhs);
}

function firstright(num: Num): Num | null {
    if(!num.parent) console.log("stop at", print(num));
    if(!num.parent) return null;
    if(num.parent.rhs === num) return firstright(num.parent);
    const v = num.parent.rhs;
    return leftmost(v);
}
function leftmost(v: Num): Num {
    if('value' in v) return v;
    return leftmost(v.lhs);
}

function explode(num: Num, depth = 0): boolean {
    if('value' in num) return false;
    if(depth === 4) {
        console.log("* *",print(num));
        console.log("* *",print(num.parent));
        const lhs = num.lhs;
        const rhs = num.rhs;
    
        delete num.lhs;
        delete num.rhs;
        num.value = 0;

        const fl = firstleft(num);
        const fr = firstright(num);
        if(fl) fl.value += lhs.value;
        if(fr) fr.value += rhs.value;

        return true;
    }
    return explode(num.lhs, depth + 1) || explode(num.rhs, depth + 1);
}

function split(num: Num): boolean {
    if(!('value' in num)) {
        return split(num.lhs) || split(num.rhs);
    }
    if(num.value < 10) return false;

    // To split a regular number, replace it with a pair; the left element of the pair should be the regular number divided by two and rounded down, while the right element of the pair should be the regular number divided by two and rounded up. For example, 10 becomes [5,5], 11 becomes [5,6], 12 becomes [6,6], and so on.
    const lhs = Math.floor(num.value / 2);
    const rhs = Math.ceil(num.value / 2);
    num.lhs = {value: lhs, parent: num};
    num.rhs = {value: rhs, parent: num};
    delete num.value;
    return true;
}

function reduce(num: Num): Num {
    while(true) {
        console.log("|", print(num));
        if(explode(num)) {
            console.log("boom!");
            continue;
        }
        if(split(num)) {
            console.log("split!");
            continue;
        }
        break;
    }
    return num;
}

function print(num: Num): string {
    if('value' in num) return "" + num.value;
    return `[${print(num.lhs)},${print(num.rhs)}]`;
}

function add(lhs: Num, rhs: Num): Num {
    const parent: Num = {
        parent: null,
        lhs,
        rhs,
    };
    lhs.parent = parent;
    rhs.parent = parent;
    return parent;
}


function solve(data: Num[]): Num {
    // Add the first snailfish number and the second, then add that result and the third, then add that result and the fourth, and so on until all numbers in the list have been used once
    while(true) {
        const first = data.shift()!;
        const second = data.shift();
        if(!second) return first;
        console.log(print(first), "+", print(second));
        data.unshift(reduce(add(first, second)));
    }
}

function magnitude(num: Num): number {
    if('value' in num) return num.value;
    return 3*magnitude(num.lhs) + 2*magnitude(num.rhs);
}

solve(data.map(l => reduce(l))).dwth(v => log(print(v))).dwth(v => log(magnitude(v)));