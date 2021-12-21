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

let [p1s, p2s] = input.split("\n").map(l => +l.split(" ")[4]);

let diev = 0;
let dier = 0;
function die(): number {
    dier++;
    return (diev++) % 100 + 1;
}

const players = [
    {n: 0, pos: p1s, score: 0},
    {n: 1, pos: p2s, score: 0},
];

console.log(players);

function pmove(player: {pos: number, score: number}, roll: number) {
    player.pos += roll;
    player.pos = ((player.pos - 1) % 10) + 1;
    player.score += player.pos;
    if(player.score >= 1000) {
        console.log(players[(player.n + 1) % 2].score * dier); // expect=503478
        throw new Error("good");
    }
}

function step() {
    pmove(players[0], die() + die() + die());
    pmove(players[1], die() + die() + die());
}

while(true) {
    step();
}

// input.

// hi! i'm glad you're excited to code
// but consider fully reading the problem statement first.
// Sincerely, future you.