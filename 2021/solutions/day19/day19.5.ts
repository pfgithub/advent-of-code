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

const practice = ``;
input = practice;
input = input.trim();

function quaternionFromAxisAngle(x: number, y: number, z: number, angle: number): [number, number, number, number] {
    const halfAngle = angle / 2;
    const sinHalfAngle = Math.sin(halfAngle);
    return [
        x * sinHalfAngle,
        y * sinHalfAngle,
        z * sinHalfAngle,
        Math.cos(halfAngle)
    ];
}

function vector3RotateByQuaternion(v, q) {
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const qw = q[3];

    const ix = qw * v[0] + qy * v[2] - qz * v[1];
    const iy = qw * v[1] + qz * v[0] - qx * v[2];
    const iz = qw * v[2] + qx * v[1] - qy * v[0];
    const iw = -qx * v[0] - qy * v[1] - qz * v[2];

    return [
        ix * qw + iw * -qx + iy * -qz - iz * -qy,
        iy * qw + iw * -qy + iz * -qx - ix * -qz,
        iz * qw + iw * -qz + ix * -qy - iy * -qx,
    ];
}

const axes = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1,],
    [0, 0, -1,],
];

const angles = [
    0,
    Math.PI / 2,
    Math.PI,
    Math.PI * 1.5,
];

let results: string[] = [];

for(const axis of axes) {
    for(const angle of angles) {
        const res = vector3RotateByQuaternion(
            [25, 12, 9],
            quaternionFromAxisAngle(...axis, angle)
        );

        results.push(res.map(w => w.toFixed(0)).map(w => {
            return w.replace("25", "v.x").replace("12", "v.y").replace("9", "v.z");
        }).join(", "));
    }
}

results = `686,422,578
-686,-578,-422
-422,-686,-578
422,578,686
578,686,422
-578,-422,-686
686,-578,422
686,-422,-578
686,578,-422
-686,422,-578
-686,578,422
-686,-422,578
-422,578,-686
-422,686,578
-422,-578,686
422,-686,578
422,-578,-686
422,686,-578
578,-422,686
578,-686,-422
578,422,-686
-578,686,-422
-578,422,686
-578,-686,422`.split("\n").map(l => {
    return l.replace("686", "v.x").replace("422", "v.y").replace("578", "v.z");
});

results = `v.x,v.y,v.z
v.x,v.z,-v.y
v.x,-v.y,-v.z
v.x,-v.z,v.y
-v.x,-v.y,v.z
-v.x,-v.z,-v.y
-v.x,v.y,-v.z
-v.x,v.z,v.y
v.z,v.x,v.y
v.z,v.y,-v.x
v.z,-v.x,-v.y
v.z,-v.y,v.x
-v.z,-v.x,v.y
-v.z,-v.y,-v.x
-v.z,v.x,-v.y
-v.z,v.y,v.x
v.y,v.z,v.x
v.y,v.x,-v.z
v.y,-v.z,-v.x
v.y,-v.x,v.z
-v.y,-v.z,v.x
-v.y,-v.x,-v.z
-v.y,v.z,-v.x
-v.y,v.x,v.z`.split("\n");

function deduplicate() {
    const seen = new Set();
    const unique = [];
    for(const item of results) {
        if(!seen.has(item)) {
            unique.push(item);
            seen.add(item);
        }
    }
    return unique;
}
results = deduplicate();

console.log(results.map(result => {
    return "(v: Point3D) => vec(" + result + "),";
}).join("\n"));