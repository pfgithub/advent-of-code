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

const practicebasic = `
--- scanner 0 ---
-1,-1,1
-2,-2,2
-3,-3,3
-2,-3,1
5,6,-4
8,0,7

--- scanner 0 ---
1,-1,1
2,-2,2
3,-3,3
2,-1,3
-5,4,-6
-8,-7,0

--- scanner 0 ---
-1,-1,-1
-2,-2,-2
-3,-3,-3
-1,-3,-2
4,6,5
-7,0,8

--- scanner 0 ---
1,1,-1
2,2,-2
3,3,-3
1,3,-2
-4,-6,5
7,0,8

--- scanner 0 ---
1,1,1
2,2,2
3,3,3
3,1,2
-6,-4,-5
0,7,-8
`;
const practice = `
--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14
`;
// input = practice;
// input = practicebasic;
input = input.trim();

// at least 12 beacons that both scanners detect within the overlap. By establishing 12
// common beacons, you can precisely determine where the scanners are relative to each
// other, allowing you to reconstruct the beacon map one scanner at a time

// ok:

const scanners = input.split("\n\n").map(l => l.split("\n").slice(1).map(l => l.split(",").map(Number) as Point3D));

const rotations = [
    // That is, one scanner might call a direction positive x, while another scanner might
    // call that direction negative y. Or, two scanners might agree on which direction is
    // positive x, but one scanner might be upside-down from the perspective of the other
    // scanner. In total, each scanner could be in any of 24 different orientations:
    // facing positive or negative x, y, or z, and considering any of four directions
    // "up" from that facing.
    // // (v: Point3D) => vec(v.x, v.y, v.z),
    // // (v: Point3D) => vec(-v.y, v.x, v.z),
    // // (v: Point3D) => vec(-v.x, -v.y, v.z),
    // // (v: Point3D) => vec(v.y, -v.x, v.z),
    // // (v: Point3D) => vec(v.x, v.y, -v.z),
    // // (v: Point3D) => vec(-v.y, v.x, -v.z),
    // // (v: Point3D) => vec(-v.x, -v.y, -v.z),
    // // (v: Point3D) => vec(v.y, -v.x, -v.z),
    // // //
    // // (v: Point3D) => vec(v.x, v.y, -v.z),
    // // (v: Point3D) => vec(-v.y, v.x, -v.z),
    // // (v: Point3D) => vec(-v.x, -v.y, -v.z),
    // // (v: Point3D) => vec(v.y, -v.x, -v.z),
    // // (v: Point3D) => vec(v.x, v.y, v.z),
    // // (v: Point3D) => vec(-v.y, v.x, v.z),
    // // (v: Point3D) => vec(-v.x, -v.y, v.z),
    // // (v: Point3D) => vec(v.y, -v.x, v.z),
    // // //
    // // (v: Point3D) => vec(v.x, v.y, -v.z),
    // // (v: Point3D) => vec(-v.y, v.x, -v.z),
    // // (v: Point3D) => vec(-v.x, -v.y, -v.z),
    // // (v: Point3D) => vec(v.y, -v.x, -v.z),
    // // (v: Point3D) => vec(v.x, v.y, v.z),
    // // (v: Point3D) => vec(-v.y, v.x, v.z),
    // // (v: Point3D) => vec(-v.x, -v.y, v.z),
    // // (v: Point3D) => vec(v.y, -v.x, v.z),
    // ok wow I hope that's correct… not checking it

    // here, this one was generated with math:
    // (v: Point3D) => vec( v.x,  v.y,  v.z),
    // (v: Point3D) => vec( v.x, -v.z,  v.y),
    // (v: Point3D) => vec( v.x, -v.y, -v.z),
    // (v: Point3D) => vec( v.x,  v.z, -v.y),
    // (v: Point3D) => vec( v.z,  v.y, -v.x),
    // (v: Point3D) => vec(-v.x,  v.y, -v.z),
    // (v: Point3D) => vec(-v.z,  v.y,  v.x),
    // (v: Point3D) => vec(-v.y,  v.x,  v.z),
    // (v: Point3D) => vec(-v.x, -v.y,  v.z),
    // (v: Point3D) => vec( v.y, -v.x,  v.z),
    // damn it turns out the above one wasn't correct…
    // :/

    // damn it turns out math is wrong sometimes
    // (spoiler alert: I probably applied it wrong somehow)
    (v: Point3D) => vec(v.x,v.y,v.z),
    (v: Point3D) => vec(v.x,v.z,-v.y),
    (v: Point3D) => vec(v.x,-v.y,-v.z),
    (v: Point3D) => vec(v.x,-v.z,v.y),
    (v: Point3D) => vec(-v.x,-v.y,v.z),
    (v: Point3D) => vec(-v.x,-v.z,-v.y),
    (v: Point3D) => vec(-v.x,v.y,-v.z),
    (v: Point3D) => vec(-v.x,v.z,v.y),
    (v: Point3D) => vec(v.z,v.x,v.y),
    (v: Point3D) => vec(v.z,v.y,-v.x),
    (v: Point3D) => vec(v.z,-v.x,-v.y),
    (v: Point3D) => vec(v.z,-v.y,v.x),
    (v: Point3D) => vec(-v.z,-v.x,v.y),
    (v: Point3D) => vec(-v.z,-v.y,-v.x),
    (v: Point3D) => vec(-v.z,v.x,-v.y),
    (v: Point3D) => vec(-v.z,v.y,v.x),
    (v: Point3D) => vec(v.y,v.z,v.x),
    (v: Point3D) => vec(v.y,v.x,-v.z),
    (v: Point3D) => vec(v.y,-v.z,-v.x),
    (v: Point3D) => vec(v.y,-v.x,v.z),
    (v: Point3D) => vec(-v.y,-v.z,v.x),
    (v: Point3D) => vec(-v.y,-v.x,-v.z),
    (v: Point3D) => vec(-v.y,v.z,-v.x),
    (v: Point3D) => vec(-v.y,v.x,v.z),
];

let ic = 0;

console.log("…");

const offsets = new Map<number, {
    rotation: (v: Point3D) => Point3D,
    offset_rel0: Point3D,
}>();
const checkedvs = new Set<string>();
let centered = false;

const final_beacons = new Set<string>();

const scan = () => scanners.forEach((scanner_a_raw, scanner_a_i) => {
    let aoffsetraw = offsets.get(scanner_a_i);
    
    if(centered) {
        if(!aoffsetraw) return;
    }
    // if(norepeatas.has(scanner_a_i)) return;
    console.log(scanner_a_i);

    const scanner_a = centered ? scanner_a_raw.map(a => {
        return aoffsetraw!.rotation(a).add(aoffsetraw!.offset_rel0);
    }) : scanner_a_raw;

    scanners.forEach((scanner_b_raw, scanner_b_i) => {
        if(scanner_a_i === scanner_b_i) return;
        if(offsets.get(scanner_b_i)) return;

        if(checkedvs.has(scanner_a_i + "-" + scanner_b_i)) return;
        checkedvs.add(`${scanner_a_i}-${scanner_b_i}`);

        console.log("  v", scanner_b_i);

        let logon = scanner_a_i === 1 && scanner_b_i === 4;

        for(const b_rotation_v of rotations) {
            const scanner_b = scanner_b_raw.map(pt => b_rotation_v(pt));

            const afsets = [...scanner_a];
            for(let i = 0; i < 11; i++ ){
                afsets.shift();
            }

            for(const arel of afsets) {
                let possible_offsets = scanner_b.map(brel => {
                    return arel.sub(brel);
                });
                for(let i = 0; i < 11; i++ ){
                    possible_offsets.shift();
                }

                for(const offset of possible_offsets) {
                    let bcms: string[] = [];
                    for(const b_pt of scanner_b) {
                        const b_point_arel = b_pt.add(offset);

                        for(const a_pt of scanner_a) {
                            const a_point_arel = a_pt;
                            ic += 1;
                            if(a_point_arel.join() === b_point_arel.join()) {
                                bcms.push(b_point_arel.join());
                                break;
                            }
                        }
                    }
                    if(bcms.length >= 12) {
                        console.log("FOUND RELATIVE OFFSET!");
                        console.log(`${scanner_a_i} ${scanner_b_i} ${offset.join(",")}`);
                        console.log(b_rotation_v.toString());

                        if(!centered) {
                            centered = true;
                            aoffsetraw = {
                                rotation: rotations[0],
                                offset_rel0: vec(0, 0, 0),
                            };
                            offsets.set(scanner_a_i, aoffsetraw);
                        }
                        
                        offsets.set(scanner_b_i, {
                            rotation: b_rotation_v,
                            offset_rel0: offset,
                        });

                        for(const bcm of bcms) {
                            final_beacons.add(bcm);
                        }

                        throw new Error("go again");
                    }
                }
            }
        }

        // throw new Error("not found in first test (scanner "+i+" vs "+j+")")
    });
});

function done() {
    scanners.forEach((scanner, i) => {
        const offset = offsets.get(i);
        if(!offset) throw new Error("wrong");

        for(const abeacon of scanner) {
            const a_point_arel = offset.rotation(abeacon).add(offset.offset_rel0);
            final_beacons.add(a_point_arel.join());
        }
    });
}

while(true) {
    try {
        scan();
    }catch(e) {
        console.log(offsets, final_beacons);
        if(e.message === "go again") {
            continue;
        }
        throw e;
    }
    console.log(offsets, final_beacons);
    done();
    console.log(offsets, final_beacons);
    throw new Error("did not error");
}

console.log(ic);