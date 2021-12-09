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
2199943210
3987894921
9856789892
8767896789
9899965678
`;
// input = practice;
input = input.trim();

const v = input.split("\n").map(l => l.split("").map(q => +q));

const board = makeBoard({v: Infinity, basin: false});
v.forEach((line, y) => {
    line.forEach((q, x) => {
        board.set([x, y], {v: q, basin: false});
    });
});

let mq = 1;

let basins: Point2D[] = [];

board.forEach((v, [x, y]) => {
    if(
        v.v < board.get([x, y - 1]).v
        && v.v < board.get([x, y + 1]).v
        && v.v < board.get([x - 1, y]).v
        && v.v < board.get([x + 1, y]).v
    ) {
        basins.push([x, y]);
    }
});

let bsz: number[] = [];

for(const basin of basins) {
    board.forEach(v => v.basin = false);
    board.get(basin).basin = true;

    let chg = true;
    for(let i = 0; i < 1000 && chg; i++) {
        chg = false;
        board.forEach((v, pos) => {
            if(v.basin) return;
            if(v.v === 9) return;
            let hb = -1;
            for(const direction of [...cardinals]) {
                const next = board.get(pos.add(direction));
                if(next.basin) {
                    hb = Math.max(hb, next.v);
                }else{
                    //
                }
            }
            if(hb === -1) return;
            // console.log("hb", hb, v.v, pos);
            if(v.v < hb) return;
            hb = v.v;
            for(const direction of [...cardinals]) {
                const next = board.get(pos.add(direction));
                // console.log(next);
                if(next.basin) {
                    // hb = Math.max(hb, next.v);
                }else{
                    // console.log(next.v, hb);
                    if(next.v < hb) {
                        console.log("nosetbasin", pos);
                        return;
                    }
                }
            }
            // console.log("Setbasin");
            v.basin = true;
            chg = true;
        });
    }
    if(chg) throw new Error("Change");

    // board.print(v => {
    //     return (v.basin ? "(" : " ") + (v.v > 10 ? "I" : v.v == -1 ? "z" : v.v ) + (v.basin ? ")" : " ");
    // }).dwth(log);

    let res = 0;
    board.forEach((v) => {
        res +=+ v.basin;
    });
    log(basin, res);

    bsz.push(res);
}

// find top 3 items of bsz
const items = bsz.sort((a, b) => b - a);
console.log(items.slice(0, 3).reduce((t, a) => a * t, 1));


// input.

// hi! i'm glad you're excited to code
// but consider fully reading the problem statement first.
// Sincerely, future you.


type nobi = number | bigint;
type Board<T> = {
	get(pos: Point2D): T;
	set(pos: Point2D, t: T): void;
	clear(): void;
	forEach(visitor: (v: T, pos: Point2D) => void): void;
	print(printer?: (v: T, pos: Point2D) => string | nobi): string;
	copy(): Board<T>;
};
function makeBoard<T>(fill: T): Board<T> {
	// it would be useful if board could center at 0,0 and expand infinitely
	let board: T[][] = [];
	let limits:
		| { min: Point2D, max: Point2D }
		| undefined;
	let reso: Board<T> = {
		clear: () => {
			board = [];
		},
		get: (pos) => {
			if (!limits) return fill;
			if (
                pos.op(limits.min, (a, b) => a < b).some(w => w) ||
                pos.op(limits.max, (a, b) => a > b).some(w => w)
            ) return fill;
			if (!board[pos.y]) return fill;
			let bval = board[pos.y][pos.x];
			return bval === undefined ? fill : bval;
		},
		set: (pos, v) => {
			if (!limits) {
				limits = {min: dupe(pos), max: dupe(pos)};
            }
            limits.min = pos.op(limits.min, (a, b) => Math.min(a, b));
            limits.max = pos.op(limits.max, (a, b) => Math.max(a, b));
			if (!board[pos.y]) board[pos.y] = [];
			board[pos.y][pos.x] = v;
		},
		forEach: visitor => {
			if (!limits) return;
			for (let y = limits.min.y; y <= limits.max.y; y++) {
				for (let x = limits.min.x; x <= limits.max.x; x++) {
					visitor(reso.get([x, y]), [x, y]);
				}
			}
		},
		copy: () => {
			let nb = makeBoard<T>(fill);
			reso.forEach((v, pos) => nb.set(pos, v));
			return nb;
		},
		print: (printer = v => v as any): string => {
			// ratelimit print
			if (!limits) return "*no board to print*";
			let ylength = 0;
			for (let y = limits.min.y - 1; y <= limits.max.y + 1; y++) {
				ylength = Math.max(y.toString().length, ylength);
			}
			const resc: string[] = [];
			let llen: number = limits.max.x - limits.min.x + 3;
			for (let y = limits.min.y - 1; y <= limits.max.y + 1; y++) {
				let line = "";
				for (let x = limits.min.x - 1; x <= limits.max.x + 1; x++) {
					line += printer(reso.get([x, y]), [x, y]);
				}
				if(line.length > llen) llen = line.length;
				resc.push(y.toString().padStart(ylength, " ") + " | " + line + " |");
			}
			resc.unshift(
				" ".repeat(ylength) +
					" .-" +
					"-".repeat(llen) +
					"-. " + (limits.min.y - 1) + " .. " + (limits.max.y + 1),
			);
			resc.push(
				" ".repeat(ylength) +
					" '-" +
					"-".repeat(llen) +
					"-'",
			);
			return resc.join("\n");
		},
	};
	return reso;
}
