import {fhmain} from "../../../src/fheader";
fhmain(__filename);

const input = `{
    0 => { rotation: [Function (anonymous)], offset_rel0: [ 0, 0, 0 ] },
    2 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -178, 1390, -45 ]
    },
    9 => { rotation: [Function (anonymous)], offset_rel0: [ -58, -1056, 76 ] },
    27 => { rotation: [Function (anonymous)], offset_rel0: [ 1089, 52, 14 ] },
    7 => { rotation: [Function (anonymous)], offset_rel0: [ 1123, 1240, 53 ] },
    21 => { rotation: [Function (anonymous)], offset_rel0: [ -156, 2463, 59 ] },
    26 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -1334, 1239, -24 ]
    },
    8 => { rotation: [Function (anonymous)], offset_rel0: [ 1021, 2560, 77 ] },
    18 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 1088, 1305, -1251 ]
    },
    16 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 1149, 2483, 1198 ]
    },
    11 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -153, -2244, -25 ]
    },
    15 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -1323, -1072, 93 ]
    },
    29 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -1304, -2210, -1 ]
    },
    10 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 2262, 2524, 1285 ]
    },
    31 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 2408, 2531, 2336 ]
    },
    30 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 1188, 2581, 2305 ]
    },
    32 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 1113, 3780, 1270 ]
    },
    23 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 2414, 1301, -1153 ]
    },
    35 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 1035, 1312, -2405 ]
    },
    3 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -152, 2487, -1264 ]
    },
    22 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -1334, 2447, -1137 ]
    },
    12 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -1311, 2549, -2 ]
    },
    17 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -1365, 3782, 25 ]
    },
    24 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -2460, 3720, 84 ]
    },
    28 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -2407, 2483, -1256 ]
    },
    13 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -2556, 4944, -80 ]
    },
    33 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -2529, 3686, 1249 ]
    },
    25 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -1217, 1224, 1144 ]
    },
    20 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -2444, 2590, -2362 ]
    },
    4 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -2513, 3628, -2488 ]
    },
    14 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -2444, 4985, -2372 ]
    },
    34 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -2568, 4991, -3602 ]
    },
    36 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -3627, 2431, -1212 ]
    },
    37 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -2481, 1297, -1164 ]
    },
    5 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 1031, 4947, 1284 ]
    },
    1 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 1094, 4878, -23 ]
    },
    6 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ -122, 4932, -105 ]
    },
    19 => {
      rotation: [Function (anonymous)],
      offset_rel0: [ 1069, 113, -2365 ]
    }
  }`;


const allm = [...input.matchAll(/(\d+) => [^§]+?offset_rel0: \[ (-?\d+), (-?\d+), (-?\d+) \]/gm)]
    .map(w => [+w[1], vec(+w[2], +w[3], +w[4])])
;

function manhattanDistance(l: Vec3, r: Vec3): number {
    return Math.abs(l.x - r.x) + Math.abs(l.y - r.y) + Math.abs(l.z - r.z);
}

let maxd = 0;

for(const a of allm) {
    for(const b of allm) {
        const dist = manhattanDistance(a[1], b[1])
        if(dist > maxd) {
            maxd = dist;
            console.log(maxd);
        }
    }
}
console.log(maxd);