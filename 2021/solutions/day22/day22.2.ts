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
on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682
`;
input = practice;
input = input.trim();

type Node = ({
    leaf: false,
    children: [Node, Node, Node, Node, Node, Node, Node, Node],
} | {
    leaf: true,
    value: boolean,
}) & {
    min: Vec3,
    max: Vec3,
};

const octree: Node = {
    value: false,
    leaf: true,
    min: vec(-(8 ** 9), -(8 ** 9), -(8 ** 9)),
    max: vec(8 ** 9, 8 ** 9, 8 ** 9),
};
// const octree: Node = {
//     value: false,
//     leaf: true,
//     min: vec(0, 0, 0),
//     max: vec(16, 16, 16),
// };

// damn there has to be a better way to do this. couldn't find a library with a
// fill method.

function fill(tree: Node, min: Vec3, max: Vec3, value: boolean) {
    // if(tree.min.op(min, (a, b) => a < b).some(v => v)) {
    //     throw new Error("out of range");
    // }
    // if(tree.max.op(max, (a, b) => a > b).some(v => v)) {
    //     throw new Error("out of range");
    // }

    // console.log(tree.min, tree.max, min, max);
    if(min.op(tree.min, (a, b) => a <= b).every(v => v)
    && max.op(tree.max, (a, b) => a >= b).every(v => v)) {
        tree.leaf = true;
        tree.value = value;
        return;
    }

    // 0..10
    //    8..25
    //
    // 0..10
    //        12..30
    
    if(min.op(tree.max, (a, b) => a >= b).some(v => v)
    || max.op(tree.min, (a, b) => a <= b).some(v => v)) {
        return;
    }

    if(tree.leaf) {
        const prev_value = tree.value;
        tree.leaf = false;
        delete tree.value;
        const center = tree.max.sub(tree.min).mapt(v => v / 2 |0).add(tree.min);
        // console.log("subtree", tree.min, center, tree.max, min, max);
        tree.children = [
            {
                leaf: true,
                value: prev_value,
                min: vec(tree.min.x, tree.min.y, tree.min.z),
                max: vec(center.x, center.y, center.z ),
            },
            {
                leaf: true,
                value: prev_value,
                min: vec(center.x, tree.min.y, tree.min.z),
                max: vec(tree.max.x, center.y, center.z),
            },
            {
                leaf: true,
                value: prev_value,
                min: vec(tree.min.x, center.y, tree.min.z),
                max: vec(center.x, tree.max.y, center.z),
            },
            {
                leaf: true,
                value: prev_value,
                min: vec(center.x, center.y, tree.min.z),
                max: vec(tree.max.x, tree.max.y, center.z),
            },

            {
                leaf: true,
                value: prev_value,
                min: vec(tree.min.x, tree.min.y, center.z),
                max: vec(center.x, center.y, tree.max.z),
            },
            {
                leaf: true,
                value: prev_value,
                min: vec(center.x, tree.min.y, center.z),
                max: vec(tree.max.x, center.y, tree.max.z),
            },
            {
                leaf: true,
                value: prev_value,
                min: vec(tree.min.x, center.y, center.z),
                max: vec(center.x, tree.max.y, tree.max.z),
            },
            {
                leaf: true,
                value: prev_value,
                min: vec(center.x, center.y, center.z),
                max: vec(tree.max.x, tree.max.y, tree.max.z),
            },
        ];
    }
    
    for(const child of tree.children) {
        fill(child, min, max, value);
    }
    // also if all children are now equal, we can consolidate
}

fill(octree, vec(0, 0, 0), vec(500, 500, 500), true);

// input.split("\n").forEach((line, i) => {
//     const [mode, rest] = line.split(" ");

//     const [xs, ys, zs] = rest.split(",");

//     let [xmin, xmax] = xs.split("=")[1].split("..").map(x => parseInt(x));
//     let [ymin, ymax] = ys.split("=")[1].split("..").map(x => parseInt(x));
//     let [zmin, zmax] = zs.split("=")[1].split("..").map(x => parseInt(x));

//     fill(octree, vec(xmin, ymin, zmin), vec(xmax + 1, ymax + 1, zmax + 1), mode === "on");
//     console.log(i);
// });

function countTotal(octree: Node): number {
    if(octree.leaf) {
        // console.log("volume", octree.value, (octree.max.x - octree.min.x + 1) * (octree.max.y - octree.min.y + 1) * (octree.max.z - octree.min.z + 1));
        // return (+octree.value) * (octree.max.x - octree.min.x + 1) * (octree.max.y - octree.min.y + 1) * (octree.max.z - octree.min.z + 1);
        return (+octree.value) * (octree.max.x - octree.min.x) * (octree.max.y - octree.min.y) * (octree.max.z - octree.min.z);
    }
    return octree.children.reduce((t, a) => t + countTotal(a), 0);
}

function countNodes(octree: Node): number {
    if(octree.leaf) return 1;
    return octree.children.reduce((t, a) => t + countNodes(a), 0) + 1;
}

console.log(octree);
// console.log(octree.children[0]);
// console.log(octree.children[1]);
// console.log(octree.children[2]);
// console.log(octree.children[3]);
// console.log(octree.children[4]);
console.log(countTotal(octree));
console.log(countNodes(octree));

// well octree was a fun idea I guess but it leaves a bunch of nodes
// around the edges when something isn't sized the same as an actual octree node

// maybe I should just do math and subtract some numbers or something