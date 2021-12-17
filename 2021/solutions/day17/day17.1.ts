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
target area: x=20..30, y=-10..-5
`;
// input = practice;
input = input.trim();


const [[, [xmin, xmax]], [, [ymin, ymax]]] = input.split(": ")[1].split(", ").map(w => w.split("=").map(e => e.split("..").map(Number)));
console.log(xmin, xmax, ymin, ymax, input);

let probe_pos = vec(0, 0);
let probe_vel = vec(0, 0);

function step() {
    probe_pos = probe_pos.add(probe_vel);
    probe_vel.x -= 1;
    if(probe_vel.x < 0) probe_vel.x = 0;
    probe_vel.y -= 1;
}

function inarea() {
    if(probe_pos.x < xmin || probe_pos.x > xmax) return false;
    if(probe_pos.y < ymin || probe_pos.y > ymax) return false;
    return true;
}


let mh = 0;
let mp = vec(0, 0);

range(0, 200).forEach((initial_x) => {
    range(0, 200).forEach((initial_y) => {
        probe_vel = vec(initial_x, initial_y);
        probe_pos = vec(0, 0);

        let highest = probe_pos.y;
        while(!inarea()) {
            step();
            if(probe_pos.y > highest) highest = probe_pos.y;
            if(probe_pos.y < ymin) return;
        }
        if(highest > mh) {
            mh = highest;
            mp = vec(initial_x, initial_y);
        }
        console.log(probe_pos.x, probe_pos.y);
    });
});

console.log("!H: ", mh);
