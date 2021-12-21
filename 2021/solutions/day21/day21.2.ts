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
Player 1 starting position: 4
Player 2 starting position: 8
`;
// input = practice;
input = input.trim();

let [initial, initial2] = input.split("\n").map(l => +l.split(" ")[4]);

// pos += die() + die() + die();
// pos = ((pos - 1) % 10) + 1;
// score += pos;

const rollopts = [
    [1, 1, 1],
    [1, 1, 2],
    [1, 1, 3],
    [1, 2, 1],
    [1, 2, 2],
    [1, 2, 3],
    [1, 3, 1],
    [1, 3, 2],
    [1, 3, 3],
    [2, 1, 1],
    [2, 1, 2],
    [2, 1, 3],
    [2, 2, 1],
    [2, 2, 2],
    [2, 2, 3],
    [2, 3, 1],
    [2, 3, 2],
    [2, 3, 3],
    [3, 1, 1],
    [3, 1, 2],
    [3, 1, 3],
    [3, 2, 1],
    [3, 2, 2],
    [3, 2, 3],
    [3, 3, 1],
    [3, 3, 2],
    [3, 3, 3],
];

console.log(
    rollopts.map(ropt => ropt.reduce((a, b) => a + b)).sort((a, b) => a - b),
);

// 1:  3
// 3:  4, 4, 4,
// 6:  5, 5, 5, 5, 5, 5,
// 7:  6, 6, 6, 6, 6, 6, 6,
// 6:  7, 7, 7, 7, 7, 7,
// 3:  8, 8, 8,
// 1:  9,

const rolls = [
    [3, 1],
    [4, 3],
    [5, 6],
    [6, 7],
    [7, 6],
    [8, 3],
    [9, 1],
];

// ok those are the # universes each given roll occurs in
// that's not very helpful is it
// oh it's only up to 21. huh.

// interesting

// this means there are 7 possibilities per turn
// and that's like
// 5.5854586e+17
// hmmm

// let's see for both players why not
// since the maximum number is 21, this should work shouldn't it?
// and there's only 10 possible wait
// we have to count score
// ok yeah
// whatever we'll ok

let universes = new Map<string, number>();

universes.set("0,"+initial+",0,"+initial2, 1);

function step(universes: Map<string, number>) {
    const res = new Map<string, number>();

    for(const [key, universe_count] of universes) {
        const [p1s_in, p1p_in, p2s, p2p] = key.split(",").map(n => +n);
        
        rolls.forEach((roll) => {
            let [p1s, p1p] = [p1s_in, p1p_in];

            p1p += roll[0];
            p1p = ((p1p - 1) % 10) + 1;
            p1s += p1p;
            if(p1s >= 21) {
                wp1 += universe_count * roll[1];
                return;
            }

            const mstr = `${p1s},${p1p},${p2s},${p2p}`;
            res.set(mstr, (res.get(mstr) ?? 0) + (universe_count * roll[1]));
        });
    }

    return res;
}
function step2(universes: Map<string, number>) {
    const res = new Map<string, number>();

    for(const [key, universe_count] of universes) {
        const [p1s, p1p, p2s_in, p2p_in] = key.split(",").map(n => +n);

        rolls.forEach((roll) => {
            let [p2s, p2p] = [p2s_in, p2p_in];

            p2p += roll[0];
            p2p = ((p2p - 1) % 10) + 1;
            p2s += p2p;
            if(p2s >= 21) {
                wp2 += universe_count * roll[1];
                return;
            }

            const mstr = `${p1s},${p1p},${p2s},${p2p}`;
            if(mstr === "10,10,4,4") {
                console.log(mstr, res.get(mstr))
            }
            res.set(mstr, (res.get(mstr) ?? 0) + (universe_count * roll[1]));
        });
    }

    return res;
}

let wp1 = 0;
let wp2 = 0;
for(let i = 0; i < 11; i++) {
    universes = step(universes);
    // console.log(universes);
    universes = step2(universes);

    // console.log(universes);
    // break;
}

if(universes.size !== 0) {
    throw new Error("bad");
}

console.log(wp1, wp2); // expect="716241959649754 436714381695627"