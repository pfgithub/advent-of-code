
type nobi = number | bigint;
type Board<T> = {
	get(pos: Point2D): T;
	set(pos: Point2D, t: T): void;
	clear(): void;
	forEach(visitor: (v: T, pos: Point2D) => void): void;
	print(printer?: (v: T, pos: Point2D) => string | nobi): void;
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
                [pos, limits.min].mix((a, b) => a < b).some(w => w) ||
                [pos, limits.max].mix((a, b) => a > b).some(w => w)
            ) return fill;
			if (!board[pos.y]) return fill;
			let bval = board[pos.y][pos.x];
			return bval === undefined ? fill : bval;
		},
		set: (pos, v) => {
			if (!limits) {
				limits = {min: [...pos], max: [...pos]};
            }
            limits.min = [pos, limits.min].mix((a, b) => Math.min(a, b));
            limits.max = [pos, limits.min].mix((a, b) => Math.max(a, b));
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
		print: (printer = v => v as any) => {
			// ratelimit print
			if (!limits) return console.log("*no board to print*");
			let ylength = 0;
			for (let y = limits.min.y - 1; y <= limits.max.y + 1; y++) {
				ylength = Math.max(y.toString().length, ylength);
			}
			console.log(
				" ".repeat(ylength) +
					" .-" +
					"-".repeat(limits.max.x - limits.min.x + 3) +
					"-.",
			);
			for (let y = limits.min.y - 1; y <= limits.max.y + 1; y++) {
				let line = "";
				for (let x = limits.min.x - 1; x <= limits.max.x + 1; x++) {
					line += printer(reso.get([x, y]), [x, y]);
				}
				console.log(y.toString().padStart(ylength, " ") + " | " + line + " |");
			}
			console.log(
				" ".repeat(ylength) +
					" '-" +
					"-".repeat(limits.max.x - limits.min.x + 3) +
					"-'",
			);
		},
	};
	return reso;
}