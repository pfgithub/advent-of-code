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

type nobi = number | number;
type Board<T> = {
	get(x: nobi, y: nobi, z: nobi, a: nobi): T;
	set(x: nobi, y: nobi, z: nobi, a: nobi, t: T): void;
	clear(): void;
	forEach(visitor: (v: T, x: number, y: number, z: number, a: number) => void): void;
	print(printer?: (v: T, x: number, y: number, z: number, a: number) => string | nobi): void;
	copy(): Board<T>;
};
function makeBoard<T>(fill: T): Board<T> {
	// it would be useful if board could center at 0,0 and expand infinitely
	let board: T[][][][] = [];
	let limits:
		| { xmin: number; xmax: number; ymin: number; ymax: number; zmin: number; zmax: number; amin: number; amax: number }
		| undefined;
	let reso: Board<T> = {
		clear: () => {
			board = [];
		},
		get: (x, y, z, a) => {
			if (!limits) return fill;
			if (
				x < limits.xmin ||
				x > limits.xmax ||
				y < limits.ymin ||
				y > limits.ymax ||
				z < limits.zmin ||
				z > limits.zmax ||
				a < limits.amin ||
				a > limits.amax
			)
				return fill;
			if (!board[+a]) return fill;
			if (!board[+a][+z]) return fill;
			if (!board[+a][+z][+y]) return fill;
			let bval = board[+a][+z][+y][+x];
			return bval === undefined ? fill : bval;
		},
		set: (x, y, z, a, v) => {
			if(v == fill) return;
			if (!limits)
				limits = {
					xmin: Number(x),
					ymin: Number(y),
					xmax: Number(x),
					ymax: Number(y),
					zmin: +z,
					zmax: +z,
					amin: +a,
					amax: +a,
				};
			if (x < limits.xmin) limits.xmin = Number(x);
			if (y < limits.ymin) limits.ymin = Number(y);
			if (x > limits.xmax) limits.xmax = Number(x);
			if (y > limits.ymax) limits.ymax = Number(y);
			if (z < limits.zmin) limits.zmin = Number(z);
			if (z > limits.zmax) limits.zmax = Number(z);
			if (a < limits.amin) limits.amin = +a;
			if (a > limits.amax) limits.amax = +a;
			if (!board[+a]) board[+a] = [];
			if (!board[+a][+z]) board[+a][+z] = [];
			if (!board[+a][+z][Number(y)]) board[+a][+z][Number(y)] = [];
			board[+a][+z][Number(y)][Number(x)] = v;
		},
		forEach: visitor => {
			if (!limits) return;
			let ym = limits.ymin - 1;
			let yma = limits.ymax + 1;
			let xm = limits.xmin - 1;
			let xma = limits.xmax + 1;
			for (let a = limits.amin - 1; a <= limits.amax + 1; a++) {
			for (let z = limits.zmin - 1; z <= limits.zmax + 1; z++) {
				for (let y = ym; y <= yma; y++) {
					for (let x = xm; x <= xma; x++) {
						visitor(reso.get(x, y, z, a), x, y, z, a);
					}
				}
			}
			}
		},
		copy: () => {
			let nb = makeBoard<T>(fill);
			reso.forEach((v, x, y, z, a) => nb.set(x, y, z, a, v));
			return nb;
		},
		print: (printer = v => v as any) => {
			// ratelimit print
			if (!limits) return console.log("*no board to print*");
			let ylength = 0;
			for (let y = limits.ymin - 1; y <= limits.ymax + 1; y++) {
				ylength = Math.max(y.toString().length, ylength);
			}
			for(let a = limits.amin; a <= limits.amax; a++) {
			for(let z = limits.zmin; z <= limits.zmax; z++) {
				console.log(
					" ".repeat(ylength) +
						" .-" +
						"-".repeat(limits.xmax - limits.xmin + 3) +
						"-.",
				);
				for (let y = limits.ymin - 1; y <= limits.ymax + 1; y++) {
					let line = "";
					for (let x = limits.xmin - 1; x <= limits.xmax + 1; x++) {
						line += printer(reso.get(x, y, z, a), x, y, z, a);
					}
					console.log(y.toString().padStart(ylength, " ") + " | " + line + " |");
				}
				console.log(
					" ".repeat(ylength) +
						" '-" +
						"-".repeat(limits.xmax - limits.xmin + 3) +
						"-'",
				);
			}
			}
		},
	};
	return reso;
}


let board = makeBoard(".");

const egb = input.split("\n").map((l, y) => {
	[...l].forEach((state, x) => {
		board.set(x, y, 0, 0, state);
	})
})

for(let i = 0; i < 6; i++) {
	let duplb = makeBoard(".");

	board.forEach((value, x, y, z, a) => {
		let actv = 0;
		for(let xo = -1; xo <= 1; xo++) {
			for(let yo = -1; yo <= 1; yo++) {
				for(let zo = -1; zo <= 1; zo++) {
					for(let ao = -1; ao <= 1; ao++) {
						if(xo == 0 && yo == 0 && zo == 0 && ao == 0) continue;
						actv +=+ (board.get(x + xo, y + yo, z + zo, a + ao) == "#");
					}
				}
			}
		}
		if(value == "#") {
			if(actv == 2 || actv == 3) {
				duplb.set(x, y, z, a, "#");
			}else {
				duplb.set(x, y, z, a, ".");
			}
		}else{
			if(actv == 3) {
				duplb.set(x, y, z, a, "#");
			}else {
				duplb.set(x, y, z, a, ".");
			}
		}
	});

	board = duplb;
}
// board.print();

let total = 0;
board.forEach(v => {
	if(v == "#") total ++;
})
print(total);