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
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`;
// input = practice;
input = input.trim();

const board = makeBoard(0);

input.split("\n").forEach((line, y) => {
    line.split("").forEach((c, x) => {
        board.set([x, y], +c);
    });
});

let flashes = 0;


function flash(pos: Vec2) {
    flashes += 1;
    board.set(pos, 0);
    for(const dir of adjacents) {
        const p = pos.add(dir);

        if(board.get(p) === 0) {
            //
        } else {
            board.set(p, board.get(p) + 1);
            incr(p);
        }
    }
}

function incr(pos: Vec2) {
    const value = board.get(pos);
    if(value === 0) {
        return;
    }
    if(value > 9) {
        flash(pos);
        return;
    }
    board.set(pos, value);
}

function step() {
    board.forEach((v, pos) => {
        board.set(pos, board.get(pos) + 1);
    });
    board.forEach((v, pos) => {
        incr(pos);
    });
}

board.print().dwth(log);

for(let i = 0; i < 100; i++) {
    step();
    // board.print().dwth(log);
}
console.log(flashes);

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