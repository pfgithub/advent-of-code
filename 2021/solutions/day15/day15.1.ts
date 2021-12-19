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
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`;
// input = practice;
input = input.trim();


const board = makeBoard(Infinity);
input.split("\n").forEach((line, y) => {
    line.split("").forEach((c, x) => {
        board.set([x, y], +c);
    });
});

const fastestPathToPoint = makeBoard(Infinity);

// function calculateRisk(path: Point2D[]): number {
//     let res = 0;
//     for(const step of path) {
//         res += board.get(step);
//     }
//     res -= board.get(path[0]!);
//     return res;
// }

fastestPathToPoint.set([0, 0], 0);

function step() {
    let dv = false;
    fastestPathToPoint.forEach((v, pos) => {
        const c = board.get(pos);
        let min = v;
        for(const orth of cardinals) {
            const val = fastestPathToPoint.get(pos.add(orth)) + c;
            if(val < min) min = val;
        }
        if(min !== v && isFinite(min)) {
            dv = true;
            fastestPathToPoint.set(pos, min);
        }
        // console.log(pos, min);
    });
    return dv;
}

while(step()) {}
fastestPathToPoint.print(v => !isFinite(v) ? " " : "!").dwth(log);

const minv = vec(input.split("\n")[0].length - 1, input.split("\n").length - 1);

console.log(fastestPathToPoint.get(minv)); // expect=619






type nobi = number | bigint;
type Board<T> = {
	get(pos: Vec2): T;
	set(pos: Vec2, t: T): void;
	clear(): void;
	forEach(visitor: (v: T, pos: Vec2) => void): void;
	print(printer?: (v: T, pos: Vec2) => string | nobi): string;
	copy(): Board<T>;
};
function makeBoard<T>(fill: T): Board<T> {
	// it would be useful if board could center at 0,0 and expand infinitely
	let board: T[][] = [];
	let limits:
		| { min: Vec2, max: Vec2 }
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
            const miny = limits.min.y - 1;
            const maxy = limits.max.y + 1;
            const minx = limits.min.x - 1;
            const maxx = limits.max.x + 1;
			for (let y = miny; y <= maxy; y++) {
				for (let x = minx; x <= maxx; x++) {
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