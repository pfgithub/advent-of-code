import {fhmain} from "../../../src/fheader";
fhmain(__filename);

type nobi = number | bigint;
type Board<T> = {
	get(pos: Vec2): T;
	set(pos: Vec2, t: T): void;
	clear(): void;
	forEach(visitor: (v: T, pos: Vec2) => void): void;
	print(printer?: (v: T, pos: Vec2) => string | nobi): string;
	copy(): Board<T>;
	map<U>(fill: U, visitor: (v: T, pos: Vec2) => U): Board<U>;
    fill: T,
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
		fill,
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
			if(v === fill) return;
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
		map: (fill, visitor) => {
			const nb = makeBoard(fill);
			reso.forEach((v, pos) => {
				nb.set(pos, visitor(v, pos));
			});
			return nb;
		},
		copy: () => {
			let nb = makeBoard<T>(fill);
			reso.forEach((v, pos) => nb.set(pos, v));
			return nb;
		},
		print: (printer = v => v as any): string => {
			if (!limits) return "*no board to print*";

			// if I wanted to be super fancy I could support
			// print functions that returned multiline things

			const resc: string[] = [];

			const printed: string[][] = [];
			let xlength = 0;
			const ylines: string[] = [];
			let ylength = 0;

			const xmin = limits.min.x - 1;
			const xmax = limits.max.x + 1;
			for (let y = limits.min.y - 1; y <= limits.max.y + 1; y++) {
				const pline: string[] = [];
				const wyvy = "" + y;
				ylines.push(wyvy);
				ylength = Math.max(wyvy.length, ylength);
				for (let x = xmin; x <= xmax; x++) {
					const envy = "" + printer(reso.get([x, y]), [x, y])
					pline.push(envy);
					xlength = Math.max(envy.length, xlength);
				}
				printed.push(pline);
			}

			const txlenl = 1 + ylength + 3;
			const txlen = (xmax - xmin + 1) * xlength;

			return ",-".padStart(txlenl, " ") + "-".repeat(txlen) + "-. " +
			(limits.min.y - 1) + " .. " + (limits.max.y + 1) + "\n" +
			printed.map((pline, y) => {
				return " " + ylines[y].padStart(ylength, " ") + " | " + pline.map((envy, x) => {
					return envy.padStart(xlength, " ");
				}).join("") + " |";
			}).join("\n") + "\n" + "`-".padStart(txlenl, " ") + "-".repeat(txlen) + "-´";
		},
	};
	return reso;
}

const demoboard = makeBoard(0).dwth(b => b.set([3, 4], 5));
demoboard.set([3, 3], 10);
demoboard.print().dwth(log);

console.log([1, 2, 3].op([4, 5, 6], (a, b) => [a, b])); // zip zoop
