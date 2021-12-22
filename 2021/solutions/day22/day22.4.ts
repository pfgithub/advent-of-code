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
on x=-5..47,y=-31..22,z=-19..33
on x=-44..5,y=-27..21,z=-14..35
on x=-49..-1,y=-11..42,z=-10..38
on x=-20..34,y=-40..6,z=-44..1
off x=26..39,y=40..50,z=-2..11
on x=-41..5,y=-41..6,z=-36..8
off x=-43..-33,y=-45..-28,z=7..25
on x=-33..15,y=-32..19,z=-34..11
off x=35..47,y=-46..-34,z=-11..5
on x=-14..36,y=-6..44,z=-16..29
on x=-57795..-6158,y=29564..72030,z=20435..90618
on x=36731..105352,y=-21140..28532,z=16094..90401
on x=30999..107136,y=-53464..15513,z=8553..71215
on x=13528..83982,y=-99403..-27377,z=-24141..23996
on x=-72682..-12347,y=18159..111354,z=7391..80950
on x=-1060..80757,y=-65301..-20884,z=-103788..-16709
on x=-83015..-9461,y=-72160..-8347,z=-81239..-26856
on x=-52752..22273,y=-49450..9096,z=54442..119054
on x=-29982..40483,y=-108474..-28371,z=-24328..38471
on x=-4958..62750,y=40422..118853,z=-7672..65583
on x=55694..108686,y=-43367..46958,z=-26781..48729
on x=-98497..-18186,y=-63569..3412,z=1232..88485
on x=-726..56291,y=-62629..13224,z=18033..85226
on x=-110886..-34664,y=-81338..-8658,z=8914..63723
on x=-55829..24974,y=-16897..54165,z=-121762..-28058
on x=-65152..-11147,y=22489..91432,z=-58782..1780
on x=-120100..-32970,y=-46592..27473,z=-11695..61039
on x=-18631..37533,y=-124565..-50804,z=-35667..28308
on x=-57817..18248,y=49321..117703,z=5745..55881
on x=14781..98692,y=-1341..70827,z=15753..70151
on x=-34419..55919,y=-19626..40991,z=39015..114138
on x=-60785..11593,y=-56135..2999,z=-95368..-26915
on x=-32178..58085,y=17647..101866,z=-91405..-8878
on x=-53655..12091,y=50097..105568,z=-75335..-4862
on x=-111166..-40997,y=-71714..2688,z=5609..50954
on x=-16602..70118,y=-98693..-44401,z=5197..76897
on x=16383..101554,y=4615..83635,z=-44907..18747
off x=-95822..-15171,y=-19987..48940,z=10804..104439
on x=-89813..-14614,y=16069..88491,z=-3297..45228
on x=41075..99376,y=-20427..49978,z=-52012..13762
on x=-21330..50085,y=-17944..62733,z=-112280..-30197
on x=-16478..35915,y=36008..118594,z=-7885..47086
off x=-98156..-27851,y=-49952..43171,z=-99005..-8456
off x=2032..69770,y=-71013..4824,z=7471..94418
on x=43670..120875,y=-42068..12382,z=-24787..38892
off x=37514..111226,y=-45862..25743,z=-16714..54663
off x=25699..97951,y=-30668..59918,z=-15349..69697
off x=-44271..17935,y=-9516..60759,z=49131..112598
on x=-61695..-5813,y=40978..94975,z=8655..80240
off x=-101086..-9439,y=-7088..67543,z=33935..83858
off x=18020..114017,y=-48931..32606,z=21474..89843
off x=-77139..10506,y=-89994..-18797,z=-80..59318
off x=8476..79288,y=-75520..11602,z=-96624..-24783
on x=-47488..-1262,y=24338..100707,z=16292..72967
off x=-84341..13987,y=2429..92914,z=-90671..-1318
off x=-37810..49457,y=-71013..-7894,z=-105357..-13188
off x=-27365..46395,y=31009..98017,z=15428..76570
off x=-70369..-16548,y=22648..78696,z=-1892..86821
on x=-53470..21291,y=-120233..-33476,z=-44150..38147
off x=-93533..-4276,y=-16170..68771,z=-104985..-24507
`;
const p2 = `
on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10
`;
// input = practice;
input = input.trim();

type Region = {
    min: Vec3,
    max: Vec3,
};

let regions: Region[] = [];

// oh I checked discord. turns out the solution is :(

input.split("\n").forEach((line, i) => {
    const [mode, rest] = line.split(" ");

    const [xs, ys, zs] = rest.split(",");

    let [xmin, xmax] = xs.split("=")[1].split("..").map(x => parseInt(x));
    let [ymin, ymax] = ys.split("=")[1].split("..").map(x => parseInt(x));
    let [zmin, zmax] = zs.split("=")[1].split("..").map(x => parseInt(x));

    const newregion: Region = {
        min: vec(xmin, ymin, zmin),
        max: vec(xmax + 1, ymax + 1, zmax + 1),
    }

    regions = regions.flatMap((oldregion): Region[] => {
        if(!touches(oldregion, newregion)) return [oldregion];

        // this isn't going to be fun to implement, is it

        // ok tbh I don't want to do this like really?

        let x_0 = Math.min(oldregion.min.x, newregion.min.x);
        let x_1 = Math.max(oldregion.min.x, newregion.min.x);
        let x_2 = Math.min(oldregion.max.x, newregion.max.x);
        let x_3 = Math.max(oldregion.max.x, newregion.max.x);
        
        let y_0 = Math.min(oldregion.min.y, newregion.min.y);
        let y_1 = Math.max(oldregion.min.y, newregion.min.y);
        let y_2 = Math.min(oldregion.max.y, newregion.max.y);
        let y_3 = Math.max(oldregion.max.y, newregion.max.y);

        let z_0 = Math.min(oldregion.min.z, newregion.min.z);
        let z_1 = Math.max(oldregion.min.z, newregion.min.z);
        let z_2 = Math.min(oldregion.max.z, newregion.max.z);
        let z_3 = Math.max(oldregion.max.z, newregion.max.z);

        if(x_2 < x_1) [x_1, x_2] = [x_2, x_1];
        if(y_2 < y_1) [y_1, y_2] = [y_2, y_1];
        if(z_2 < z_1) [z_1, z_2] = [z_2, z_1];

        if(x_2 > x_3) x_2 = x_3;
        if(x_1 > x_2) x_1 = x_2;
        if(x_0 > x_1) x_0 = x_1;

        if(y_2 > y_3) y_2 = y_3;
        if(y_1 > y_2) y_1 = y_2;
        if(y_0 > y_1) y_0 = y_1;

        if(z_2 > z_3) z_2 = z_3;
        if(z_1 > z_2) z_1 = z_2;
        if(z_0 > z_1) z_0 = z_1;

        if(x_1 < x_0) x_1 = x_0;
        if(x_2 < x_1) x_2 = x_1;
        if(x_3 < x_2) x_3 = x_2;

        if(y_1 < y_0) y_1 = y_0;
        if(y_2 < y_1) y_2 = y_1;
        if(y_3 < y_2) y_3 = y_2;

        if(z_1 < z_0) z_1 = z_0;
        if(z_2 < z_1) z_2 = z_1;
        if(z_3 < z_2) z_3 = z_2;

        // create 27 new regions
        let res_regions: Region[] = [];

        for(const x of [[x_0, x_1], [x_1, x_2], [x_2, x_3]]) {
            for(const y of [[y_0, y_1], [y_1, y_2], [y_2, y_3]]) {
                for(const z of [[z_0, z_1], [z_1, z_2], [z_2, z_3]]) {
                    const splitregion = {
                        min: vec(x[0], y[0], z[0]),
                        max: vec(x[1], y[1], z[1]),
                    };
                    if(fullyContainedWithin(splitregion, oldregion)) {
                        res_regions.push(splitregion);
                    }
                }
            }
        }

        return res_regions.filter(region => {
            if(region.min.x === region.max.x) return false;
            if(region.min.y === region.max.y) return false;
            if(region.min.z === region.max.z) return false;

            if(fullyContainedWithin(region, newregion)) return false;
            if(touches(region, newregion)) {
                // console.log(region, newregion);
                throw new Error("touch disallowed");
            }

            return true;
        });

        // spoiler alert:
        // it was not fun to program
    });

    if(mode === "on") regions.push(newregion);

    // console.log(regions);

    console.log(i, count(regions));
});

/// if region a is fully contained within region b
function fullyContainedWithin(a: Region, b: Region) {
    return a.min.x >= b.min.x && a.min.y >= b.min.y && a.min.z >= b.min.z &&
        a.max.x <= b.max.x && a.max.y <= b.max.y && a.max.z <= b.max.z;
}

/// if region a touches region b (ignoring the edges)
function touches(a: Region, b: Region) {
    return a.min.x < b.max.x && a.max.x > b.min.x &&
        a.min.y < b.max.y && a.max.y > b.min.y &&
        a.min.z < b.max.z && a.max.z > b.min.z
    ;
}

function count(regions: Region[]): number {
    return regions.reduce((t, r) => {
        return t + (r.max.x - r.min.x) * (r.max.y - r.min.y) * (r.max.z - r.min.z);
    }, 0);
}

console.log(count(regions));