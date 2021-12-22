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
const p2 = `on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10
`;
input = p2;
input = input.trim();

const regions: {
    min: Vec3,
    max: Vec3,
}[] = [];

let total = 0;

input.split("\n").forEach(line => {
    const [mode, rest] = line.split(" ");

    const [xs, ys, zs] = rest.split(",");

    let [xmin, xmax] = xs.split("=")[1].split("..").map(x => parseInt(x));
    let [ymin, ymax] = ys.split("=")[1].split("..").map(x => parseInt(x));
    let [zmin, zmax] = zs.split("=")[1].split("..").map(x => parseInt(x));

    xmax += 1;
    ymax += 1;
    zmax += 1;

    if(mode === "on") {
        let itmtotal = (xmax - xmin) * (ymax - ymin) * (zmax - zmin);
        // subtract totals of overlapping area of other regions
        regions.forEach(region => {
            const [xmin2, xmax2] = [Math.max(xmin, region.min.x), Math.min(xmax, region.max.x)];
            const [ymin2, ymax2] = [Math.max(ymin, region.min.y), Math.min(ymax, region.max.y)];
            const [zmin2, zmax2] = [Math.max(zmin, region.min.z), Math.min(zmax, region.max.z)];
            console.log(xmin2, xmax2);
            const overlap = (xmax2 - xmin2) * (ymax2 - ymin2) * (zmax2 - zmin2);
            itmtotal -= overlap;
            // oh this double subtracts stuff uuh
            // maybe just add all the totals and then subtract all the overlaps at the end
        });
        console.log(itmtotal);
        total += itmtotal;
    }

    regions.push({
        min: vec(xmin, ymin, zmin),
        max: vec(xmax, ymax, zmax),
    });
});

console.log(total);