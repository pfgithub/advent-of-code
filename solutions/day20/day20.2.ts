export {};

function oneway<T>(): { read: () => Promise<T>; write: (v: T) => void } {
	let stream: T[] = [];
	let waitingnow: ((v: T) => void) | undefined;
	return {
		read: () => {
			return new Promise(resolve => {
				if (stream.length > 0) {
					return resolve(stream.shift());
				} else {
					waitingnow = v => {
						waitingnow = undefined;
						resolve(v);
					};
				}
			});
		},
		write: v => {
			if (waitingnow) {
				waitingnow(v);
			} else {
				stream.push(v);
			}
		},
	};
}

function intcode(input: string) {
	let inputs = oneway<number>();
	let outputs = oneway<number>();
	let over = { over: false };

	let done = (async () => {
		let memory: number[] = input.split(",").map(w => +w);
		for (let i = 0; i < 10000; i++) {
			memory.push(0);
		}
		// editv && editv(memory);
		let instructionPointer = 0;

		let relativeBase = 0;

		let parameterModes: number[] = [];
		let parameterIndex = 0;

		let exit = false;

		let getMem = (v: number) => memory[Number(v)];
		let setMem = (v: number, w: number) => (memory[Number(v)] = w);

		let getPointer_ = () => {
			let parameterMode = parameterModes[Number(parameterIndex)];
			if (parameterMode === 0) {
				return getMem(instructionPointer + parameterIndex);
			}
			if (parameterMode === 1) {
				return instructionPointer + parameterIndex;
			}
			if (parameterMode === 2) {
				return relativeBase + getMem(instructionPointer + parameterIndex);
			}
			throw new Error("Unknown parameter mode " + parameterMode);
		};
		let getPointer = () => {
			let res = getPointer_();
			parameterIndex++;
			return res;
		};
		let getValue = () => getMem(getPointer());
		let p = getPointer;
		let v = getValue;

		let opcodes: { [key: string]: () => Promise<void> | undefined } = {
			"1": async () => {
				let [a, b, out] = [v(), v(), p()];
				setMem(out, a + b);
			},
			"2": async () => {
				let [a, b, out] = [v(), v(), p()];
				setMem(out, a * b);
			},
			"3": async () => {
				let [out] = [p()];
				let value = await inputs.read();
				setMem(out, value);
			},
			"4": async () => {
				let [value] = [v()];
				outputs.write(value);
			},
			"5": async () => {
				let [test, iftrue] = [v(), v()];
				if (test !== 0) {
					instructionPointer = iftrue;
					parameterIndex = 0;
				}
			},
			"6": async () => {
				let [test, iffalse] = [v(), v()];
				if (test === 0) {
					instructionPointer = iffalse;
					parameterIndex = 0;
				}
			},
			"7": async () => {
				let [f, s, out] = [v(), v(), p()];
				if (f < s) setMem(out, 1);
				else setMem(out, 0);
			},
			"8": async () => {
				let [f, s, out] = [v(), v(), p()];
				if (f === s) setMem(out, 1);
				else setMem(out, 0);
			},
			"9": async () => {
				let [incrRelativeBy] = [v()];
				relativeBase += incrRelativeBy;
			},
			"99": async () => {
				exit = true;
			},
		};

		while (!exit) {
			parameterIndex = 0;
			parameterModes = [1];
			let opcode = v();
			let [e, d, c, b, a] = ("" + opcode).split("").reverse();
			let de = (d || "0") + e;
			parameterModes = [0, +c || 0, +b || 0, +a || 0];

			if (opcodes["" + +de]) {
				await opcodes["" + +de]();
			} else {
				throw new Error("opcode " + "" + +de + " does not exist.");
			}

			instructionPointer += parameterIndex;
		}
		over.over = true;
	})();

	return {
		done,
		read: async () => await outputs.read(),
		write: (v: number | number) => inputs.write(v),
		over,
	};

	// return {write: (value) => , read: async () => readvalue}

	// console.log("Done!", memory.join(",").replace(/(\,0)+$/, ""));
}

type nobi = number | number;
type Board<T> = {
	get(x: nobi, y: nobi): T;
	set(x: nobi, y: nobi, t: T): void;
	clear(): void;
	forEach(visitor: (v: T, x: number, y: number) => void): void;
	print(printer?: (v: T, x: number, y: number) => string | nobi): void;
	copy(): Board<T>;
};
function makeBoard<T>(fill: T): Board<T> {
	// it would be useful if board could center at 0,0 and expand infinitely
	let board: T[][] = [];
	let limits:
		| { xmin: number; xmax: number; ymin: number; ymax: number }
		| undefined;
	let reso: Board<T> = {
		clear: () => {
			board = [];
		},
		get: (x, y) => {
			if (!limits) return fill;
			if (
				x < limits.xmin ||
				x > limits.xmax ||
				y < limits.ymin ||
				y > limits.ymax
			)
				return fill;
			if (!board[Number(y)]) return fill;
			let bval = board[Number(y)][Number(x)];
			return bval === undefined ? fill : bval;
		},
		set: (x, y, v) => {
			if (!limits)
				limits = {
					xmin: Number(x),
					ymin: Number(y),
					xmax: Number(x),
					ymax: Number(y),
				};
			if (x < limits.xmin) limits.xmin = Number(x);
			if (y < limits.ymin) limits.ymin = Number(y);
			if (x > limits.xmax) limits.xmax = Number(x);
			if (y > limits.ymax) limits.ymax = Number(y);
			if (!board[Number(y)]) board[Number(y)] = [];
			board[Number(y)][Number(x)] = v;
		},
		forEach: visitor => {
			if (!limits) return;
			let ym = limits.ymin;
			let yma = limits.ymax;
			let xm = limits.xmin;
			let xma = limits.xmax;
			for (let y = ym; y <= yma; y++) {
				for (let x = xm; x <= xma; x++) {
					visitor(reso.get(x, y), x, y);
				}
			}
		},
		copy: () => {
			let nb = makeBoard<T>(fill);
			reso.forEach((v, x, y) => nb.set(x, y, v));
			return nb;
		},
		print: (printer = v => v as any) => {
			// ratelimit print
			if (!limits) return console.log("*no board to print*");
			let ylength = 0;
			for (let y = limits.ymin - 1; y <= limits.ymax + 1; y++) {
				ylength = Math.max(y.toString().length, ylength);
			}
			console.log(
				" ".repeat(ylength) +
					" .-" +
					"-".repeat(limits.xmax - limits.xmin + 3) +
					"-.",
			);
			for (let y = limits.ymin - 1; y <= limits.ymax + 1; y++) {
				let line = "";
				for (let x = limits.xmin - 1; x <= limits.xmax + 1; x++) {
					line += printer(reso.get(x, y), x, y);
				}
				console.log(y.toString().padStart(ylength, " ") + " | " + line + " |");
			}
			console.log(
				" ".repeat(ylength) +
					" '-" +
					"-".repeat(limits.xmax - limits.xmin + 3) +
					"-'",
			);
		},
	};
	return reso;
}

function ratelimit(timeout: number) {
	let ctime = 0;
	return {
		do: (cb: () => void) => {
			let time = new Date().getTime();
			if (time > ctime + timeout) {
				cb();
				ctime = time;
			}
		},
	};
}

function ms(t: number) {
	return new Promise(r => setTimeout(r, t));
}

function shuffle<T>(a: T[]): T[] {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

// function binarySearch(passFail: (input: number) => boolean) {
// 	let prev = 1;
// 	let current = 2;
// 	let passes = passFail(current);
// 	while (!passes) {
// 		current *= 2;
// 		prev *= 2;
// 		passes = passFail(current);
// 	}
// 	while (current - prev > 1) {}
// }

(async () => {
	let board = makeBoard("·");
	let rl = ratelimit(100);

	let mazin = `                                         C   U A   Z     A   D         U   I         R                                       
                                         W   Y A   Z     U   Q         R   W         O                                       
  #######################################.###.#.###.#####.###.#########.###.#########.#####################################  
  #.........#.....#...#.....#.............#.......#.#.......#.....#.#...#.#...#.....#.#.#.#.#...#.#...#.....#...#...#.....#  
  #####.#.#.#.###.###.###.#############.#.#######.#.#.#.###.#####.#.#.###.#.#.#.#.###.#.#.#.###.#.#.###.#####.#####.#####.#  
  #.#...#.#.#.#...#.........#.#...#.#.#.#.#.......#...#.#.....#...#...#...#.#...#.#.#.#...#...#.#.#...#...#.....#.#.#.#...#  
  #.#######.#####.#######.###.#.###.#.#.#####.###.#####.#.#.#.###.#.###.#.#######.#.#.###.#.###.#.#.###.#####.###.#.#.###.#  
  #...#...#...#.#.#.#.#.....#.#.............#...#.#.....#.#.#.#.#.#...#.#.#.......#.........#.#.#.....#.....#.#.#.....#.#.#  
  ###.###.###.#.#.#.#.###.###.#######.#######.#########.###.###.#.#.###.###.###########.#.###.#.#.#####.#####.#.###.###.#.#  
  #.......#...............................#...#.#.......#...#.....#.#.#.......#.#.....#.#.#.#.#...........#.#.#.#...#.....#  
  ###.###.###.#.###.###.#####.###.#####.#####.#.#.#.#############.#.#.#####.###.###.#####.#.#.#.#####.#.#.#.#.#.###.#####.#  
  #...#.......#...#.#...#.....#.#.#.........#...#.#.......#...#...#...#.#.........#...#.#.#.......#...#.#.#.#...#.......#.#  
  #########.###.#####.#####.###.#####.#####.#.#######.#.###.#.###.#.###.#######.#.###.#.#.###.###.#########.###.#####.###.#  
  #.#.....#.#.#...#.#.#.#...#...#.......#...#.....#...#.#...#.#...#.......#.....#.#.....#.......#.....#.....#.....#.....#.#  
  #.###.#####.#.#.#.###.#.#####.#####.###.###.#.#.#####.###.#####.###.#.###.#########.#.#.#######.#.#####.#######.#.#####.#  
  #.#.#.....#.#.#.#.......#.#.#.........#.#...#.#.#...........#...#...#.#.#...#.......#.....#...#.#...#.#...#.#.#.........#  
  #.#.###.#.#.#####.###.#.#.#.#.#.#.#.#######.###########.#######.###.###.###.#####.#.###.#.#.#######.#.#.###.#.#####.###.#  
  #.....#.#...#...#...#.#.#...#.#.#.#.#.#.........#...#.....#.....#...#.......#.....#...#.#.....#.#...#.....#...#.#...#.#.#  
  #####.#####.###.#####.#####.#######.#.#.#####.#####.###.#######.#.#.###.#.#.#####.#######.#.#.#.#######.#####.#.###.#.###  
  #.....#.#.#...#...#.#.#.....#.#.....#...#.......#.#.........#...#.#...#.#.#.#...#.#.#.#.#.#.#.......#.....#.#...#.......#  
  #####.#.#.#.###.###.#######.#.#####.#####.#.#.#.#.#.###.#######.#.#####.#.#####.#.#.#.#.#####.#.#.#####.###.#.#####.#####  
  #.#.#.........#.#.#...#.............#...#.#.#.#.#...#.......#...#.....#.#.#.#.......#.....#.#.#.#...#.#...#...#.#.......#  
  #.#.#######.###.#.#.#####.###.#.###.#.###.#.#####.###.#.#####.#.#.#######.#.#######.#.#.#.#.###.###.#.#.#.#.#.#.###.###.#  
  #.......#.....#.......#.#.#.#.#.#.......#.#.#.#.#.#.#.#.....#.#.#.#.#.#.....#...#...#.#.#.#...#.#.#.#...#.#.#.....#...#.#  
  ###.#####.#.#####.#.#.#.#.#.#######.#######.#.#.###.###.#.#####.#.#.#.###.#####.#.###.#.###.#.#.#.#######.###.#######.###  
  #...#.#...#.#...#.#.#...#.#.#.#.#.#.#...#.#.#.#.#...#...#.#.#...#.......#.....#.......#.....#.#.#.....#.........#.......#  
  #.#.#.###.#####.###.#.#.###.#.#.#.#.###.#.#.#.#.###.###.###.###.###.#.#.#.#############.###########.#####.###.###.#.###.#  
  #.#.#...#...#.....#.#.#...#.#.#.#.#.#.#.....#...#.......#.....#...#.#.#.#.#.....#...#.......#.....#.....#.#.....#.#...#.#  
  ###.###.###.###.#.###.###.#.#.#.#.#.#.#####.#.#####.#.#.#.###.#.#######.#.###.#####.###.#####.#####.#.###.#####.###.#####  
  #.#.#...#.......#.#.#.#.....#...#.#.......#.....#...#.#.#.#.#...#.....#.#.#.......................#.#.#.#.#.#.#.#.....#.#  
  #.#.###.###.###.###.#.#.###.###.#.#######.#.#.#########.#.#.#####.###.#.#.#####.#.###.#.###########.###.###.#.#.###.###.#  
  #...#...#.#...#.#...#.#.#.....#...........#.#.....#.....#.....#.....#...#.....#.#.#...#.........#...#...#.#.....#.......#  
  #.#####.#.#.#######.#######.#######.###########.#####.#####.#####.#######.#########.###############.#.###.#.#.#.#.###.###  
  #.....#.....#.#.#.#.#.#.......#    C           Y     G     D     C       D         S      #...#.......#...#.#.#.....#...#  
  #.#####.#.#.#.#.#.#.#.###.#.#.#    S           J     O     X     W       N         I      #.#.#####.#.#.#######.#.#######  
  #.....#.#.#.#.#.....#.#.#.#.#.#                                                           #.#.#...#.#.......#...#.#......SF
  #.#####.###.#.#.###.#.#.###.#.#                                                           #.#####.###.###.#######.#####.#  
  #.....#.#...#...#.#.#.#.#.#.#.#                                                           #.#.#.#.#.....#.#.....#.......#  
  ###.#######.###.#.###.#.#.#.###                                                           #.#.#.#.###.#######.###.#####.#  
  #...#.#...#.#...#.#.#.....#.#.#                                                         DQ..........................#.#.#  
  #.#.#.###.#.#.###.#.#####.#.#.#                                                           #####.#.###.###.#.#.#####.#.###  
  #.#.#...#.......#.#.#.......#..BG                                                         #...#.#.#.#...#.#.#.#.#.#.#...#  
  #.#.#.#.#.###.#.#.#.#####.#.#.#                                                           ###.#####.#########.#.#.###.#.#  
CE..#...#.....#.#...........#...#                                                           #...#.....#.......#.#...#...#..ZN
  #####.###.#######.#####.#######                                                           #.#.#.###.#####.#####.#.###.#.#  
  #...#...#.....#...#...#.#.#.#..AU                                                       UR..#...#...............#.....#.#  
  #.#.###.#.#.###.#.#.#.#.#.#.#.#                                                           ###############.#############.#  
BG..#...#.#.#.#.#.#.#.#.#.#.....#                                                         UY..#.....#...#.#.#...........#.#  
  #.#.#########.#.###.#.###.###.#                                                           #.#.###.#.#.#.#####.#######.###  
  #.#.......#.#.#.#.#.#.....#...#                                                           #.#...#.#.#.............#.#.#..CS
  #.#####.###.#.###.#.#.###.#####                                                           #.###.#.#.###.###.#.#####.#.#.#  
  #...#...............#.#.#.#...#                                                           #.....#.#...#...#.#...#.#...#.#  
  #########.###.#.#######.###.###                                                           #######.#.#######.###.#.#.###.#  
  #.#.#...#.#.#.#.#.....#.....#..LU                                                         #...#.......#.#.#.#...#.#.....#  
  #.#.#.#####.###.###.###.###.#.#                                                           ###.#########.#.#######.#######  
  #.#.....#.#...#.#.........#...#                                                           #.....#...#.......#.........#..PM
  #.#.###.#.#.#########.###.###.#                                                           #.###.#.###.###.###.###.###.#.#  
  #.#.#.....#.#...#.#.#.#.#...#.#                                                           #.#.......#...#.......#...#....LU
  #.#####.#.#.#.#.#.#.#######.#.#                                                           #.#######.###.#####.###.#####.#  
DX........#.....#.............#.#                                                         GI....#.............#.#...#...#.#  
  #########.#.#####.#.###.#.#####                                                           #.###########.###.#######.#####  
  #.....#...#...#.#.#.#...#...#.#                                                         ZN..#.#...#.#.#.#.#...#.#.#...#.#  
  #.#.###.#.#.###.#############.#                                                           ###.###.#.#.###.#####.#.#.###.#  
DN..#...#.#.#.#.#.#.#.........#..UE                                                         #...........#.....#.....#.....#  
  #####.#.#####.#.#.###.#####.#.#                                                           #.#.#######.#.#.###.###.#.###.#  
  #.....#.#.#.#.#.....#.....#...#                                                         UN..#...#.......#.....#...#...#..CX
  #.#######.#.#.#.###.###.#.#####                                                           #.#####.###.#.#.#.###.#####.###  
  #.................#.....#.#...#                                                           #...#.#.#.#.#.#.#...#.....#...#  
  ###.#######.###############.###                                                           #####.###.#########.#.###.###.#  
  #.#.#.....#.#.................#                                                           #.#.#.#.#...#.#...#.#.#.#.....#  
  #.#####.#.###.#.#####.###.#####                                                           #.#.#.#.#.###.#.#######.#####.#  
YJ........#...#.#.#...#.#........XW                                                       PM..........#...#.#.#.....#...#.#  
  #.#.#######.#.###.###.#.#.#.#.#                                                           #.###.#.#####.#.#.#####.#.#####  
  #.#.#.#.....#...#.#.#.#.#.#.#.#                                                           #.#.#.#...#.......#.#.......#.#  
  #####.#.#.###.###.#.#.#######.#                                                           #.#.#.###########.#.###.#.###.#  
  #.#...#.#.....#.....#.#.#.#.#.#                                                           #.#.....#.#.#.#...#.#...#...#..XW
  #.###.###########.#####.#.#.#.#                                                           #######.#.#.#.###.#.#.#.###.#.#  
  #.....#.............#.......#.#                                                           #...#.................#...#...#  
  #.#.#.#.#.###.#.###.###.#.#####                                                           #.#######.###.###.###########.#  
  #.#.#...#...#.#.#...#.#.#.....#                                                         DI........#...#.#...#.........#.#  
  #.#.#.#.#####.#####.#.#.#.###.#                                                           #.###.#############.#####.#.###  
  #.#.#.#...#.#...#...#...#.#...#                                                           #.#.#.#...#...........#...#....UN
  #.#########.#.#####.#.#####.###                                                           #####.#.#.#.###.###.#.#.#.#.#.#  
GI........#.......#.....#........IW                                                         #.#...#.#.#.#.#...#.#.#.#.#.#.#  
  ###.#####.#####.###.#####.#.#.#                                                           #.#.###.#.#.#.#########.###.###  
  #.......#.#.....#.....#...#.#.#                                                           #.......#.........#.......#...#  
  #.#.#.#.#.#.#.#.#.#.###.#.###.#        C     C       C         S         R   J            ###.#.#.###.###.#####.#########  
  #.#.#.#.#.#.#.#.#.#...#.#.#.#.#        E     Z       X         F         O   W            #...#.#...#.#...#...#.......#.#  
  ###.###.#####.#####.#.#.#.#.#.#########.#####.#######.#########.#########.###.###############.#####.#.#####.#.#.#######.#  
  #...#...#.......#...#.#.#...#...#...#...#.#.......#...........#.....#.#.....#.#...#.#.#.........#.#.#.....#.#...........#  
  ###.###.###.#########.#.#.#.#.#.#.#.###.#.#####.#.###.#.###.#.#.###.#.#####.#.#.###.#.#####.###.#.###.#.#######.#####.#.#  
  #...#.....#.#.#...#.#.#.#.#.#.#.#.#.......#.#...#...#.#.#.#.#.#.#...#.......#...........#.....#.....#.#.#.....#...#.#.#.#  
  #.###.#.#.###.###.#.#.###########.#####.#.#.###.#.#####.#.#.#####.#.#.###.###.#.#.#.###########.#.###.#.###.#.#.#.#.#.###  
  #.#...#.#.#.#.............#.#...#.#.....#.#.....#.#.#.#.#.......#.#.#...#.#.#.#.#.#.#.......#...#.#.#.#.#...#...#.#.#.#.#  
  #.#####.###.###.#.###.###.#.#.#########.#####.#.###.#.#####.#####.#.#.###.#.###.#######.#####.#.#.#.#######.#####.#.###.#  
  #.#.#.......#.#.#.#.#...#.#.....#.#.......#...#...#...#.#...#.#...#.#...#.#...............#.#.#.#.......#...#...........#  
  #.#.###.###.#.#.#.#.#.#.#.#.###.#.###.#.#######.#.###.#.#.#.#.#####.#.#######.###########.#.#####.#####.###.#####.###.###  
  #.#.......#...#.#.#...#.#.#.#.........#.#.#.....#.......#.#...#.....#.....#.....#.#...#.........#.....#.#.......#...#...#  
  #####.#.#####.#####.###########.###.#.#.#.#######.#.#.#####.###.###.###.#####.#.#.#.#########.###.###.###########.###.###  
  #.....#...#.....#...#.#.#.#.....#...#.#...#.......#.#.#...#.#...#...#.......#.#.....#.......#.#.#...#.....#.#.......#...#  
  ###.#####.###.#####.#.#.#.#############.#######.###.###.#.#.#######.#.#.#########.#.#.###.#####.#####.#.###.#.###.###.#.#  
  #.......#.#...#...#.#.#.#.#.#...#.#.......#...#.#.#...#.#...#.#.#.#.#.#.....#...#.#.....#.#.#.....#.#.#.#.#.#.#.....#.#.#  
  #.#.#.#.###.#####.###.#.#.#.###.#.###.#.###.#.###.#.#######.#.#.#.#.#.#######.#.###.#.#.###.###.###.#####.#.#####.#.#####  
  #.#.#.#.#...#...........#...#...#.....#...#.#.#.#.#...#.......#.#.#.#.#...#.#.#.#...#.#.#.............#.#.#.#.#.#.#.....#  
  ###.#######.#####.#.#.#.#.#.###.#.###.###.#.###.#.#.#######.###.#.#.#.#.###.#.###.#.#######.###.#.#.###.#.#.#.#.#.#.#####  
  #.......#...#.....#.#.#.#.#.#.....#.....#.#...#.....#.....#...#.....#.#...#.#.....#.#...#...#...#.#.#.#.........#.#.....#  
  #.#.#####.#####.#.#####.###.#######.#.#####.#######.#.#####.###.#.###.#.###.#.#######.#####.###.#####.#.#.###.###.#.#.###  
  #.#.#.#.#.#.#...#.#.#...........#.#.#...........#.....#...#...#.#...#...#.#.............#.#...#.#.#.#.#.#.#.#...#.#.#...#  
  #.###.#.###.#####.#.#####.#######.#####.#####.#####.#####.#.###.#######.#.#.#######.#.###.#.#####.#.#.#.###.#.#######.#.#  
  #.#.....#.........#...#.#.#.......#.#.....#.....#...#.......#.....#.......#.#.#.....#...#.#.....#...........#.#.#.....#.#  
  #.#####.#######.###.#.#.#.#######.#.###.#####.#.###.#.#######.#######.#.#####.#.###.#.#.#.#.#####.#.###.###.###.#####.###  
  #.#...#...#.#.#.#.#.#.#.....................#.#.#...#.......#.#.#...#.#...#.......#.#.#...........#...#...#...#.........#  
  #.#.###.###.#.###.###.#.###.#.#########.#.###.#####.#######.#.#.#.###.#######.#.###.#.#.###.#####.###.###.###.###.#.#.###  
  #.#.#.........#.....#.....#.#.#.....#...#...#...#...#.......#.....#...#...#.#.#...#.#.#.#.#.....#.#.#.#.#.#.....#.#.#...#  
  ###.#.#.#.###.#####.###.###.#.#.#.#.###.#########.#####.#.#.#####.###.#.###.###.###.###.#.#.#.#####.###.#############.#.#  
  #.....#.#.#.#...#.......#...#.#.#.#.......#...#.......#.#.#...#.....#.#.#.....#...#.#...#...#...#.#.#.....#.#.#.....#.#.#  
  ###.###.###.#.#########.#####.#.#.#.#.#####.#######.###.#.#.#######.#.###.#.###.###########.#####.#.###.#.#.#.#.#.#.#.###  
  #.....#...#...............#...#.#.#.#.........#.....#...#.#...#.....#.....#.#.......#...................#.....#.#.#.....#  
  ###########################################.###.#######.#########.#########.###.#########################################  
                                             U   J       S         D         C   G                                           
                                             E   W       I         I         Z   O                                           
`;
	mazin
		.split("\n")
		.map((l, y) => l.split("").map((q, x) => board.set(x, y, q)));

	function findPortal(name: string) {
		let [c1, c2] = name.split("");
		let restile: { x: number; y: number }[] = [];
		board.forEach((tile, x, y) => {
			if (tile !== c1) return;
			let down = board.get(x, y + 1);
			let right = board.get(x + 1, y);
			if (down === c2) {
				let uc = board.get(x, y - 1);
				let dc = board.get(x, y + 2);
				if (uc === ".") {
					restile.push({ x, y: y - 1 });
				} else if (dc === ".") {
					restile.push({ x, y: y + 2 });
				}
			} else if (right === c2) {
				let lc = board.get(x - 1, y);
				let rc = board.get(x + 2, y);
				if (lc === ".") {
					restile.push({ x: x - 1, y });
				} else if (rc === ".") {
					restile.push({ x: x + 2, y });
				}
			}
		});
		return restile;
	}

	let isLetter = (m: string) =>
		m.charAt(0) >= "A".charAt(0) && m.charAt(0) <= "Z".charAt(0);

	function findOpenPortals(x: number, y: number, steps: number, level: number) {
		if (level === 0) {
			// skip outermost portals except zz
		} else {
			// return all portals except zz
		}
	}

	let cachedAdjPortals: {
		[key: string]: {
			x: number;
			y: number;
			deltadistance: number;
			name: string;
			deltalevel: number;
		}[];
	} = {};
	function getPortals(
		x: number,
		y: number,
		steps: number,
		level: number,
	): {
		x: number;
		y: number;
		distance: number;
		name: string;
		level: number;
	}[] {
		let cacheName = x + "," + y + "," + (level === 0 ? "0" : "+");
		if (cachedAdjPortals[cacheName]) {
			let res: {
				x: number;
				y: number;
				distance: number;
				name: string;
				level: number;
			}[] = [];
			cachedAdjPortals[cacheName].forEach(portal => {
				res.push({
					x: portal.x,
					y: portal.y,
					distance: portal.deltadistance + steps,
					name: portal.name,
					level: portal.deltalevel + level,
				});
			});
			return res;
		}

		let paths = makeBoard(Infinity);
		let resPortals: {
			[key: string]: {
				x: number;
				y: number;
				deltadistance: number;
				name: string;
				deltalevel: number;
			} /*steps*/;
		} = {};
		let initialsteps = steps;
		function pathfind(x: number, y: number, steps: number, level: number) {
			if (steps < paths.get(x, y)) {
				paths.set(x, y, steps);
				let ctile = board.get(x, y);
				if (ctile === ".") {
					pathfind(x + 1, y, steps + 1, level);
					pathfind(x - 1, y, steps + 1, level);
					pathfind(x, y + 1, steps + 1, level);
					pathfind(x, y - 1, steps + 1, level);
				} else if (isLetter(ctile)) {
					let right = board.get(x + 1, y);
					let left = board.get(x - 1, y);
					let up = board.get(x, y - 1);
					let down = board.get(x, y + 1);
					let rx = x;
					let ry = y;
					let word = "";
					let portalType = 43124;
					if (isLetter(up)) {
						word = up + ctile;
						portalType = board.get(x, y - 2) === " " ? 1 : -1; // out
						ry++;
					} else if (isLetter(down)) {
						word = ctile + down;
						portalType = board.get(x, y + 2) === " " ? 1 : -1; // in
						ry--;
					} else if (isLetter(left)) {
						word = left + ctile;
						portalType = board.get(x - 2, y) === " " ? 1 : -1; // out
						rx++;
					} else if (isLetter(right)) {
						word = ctile + right;
						portalType = board.get(x + 2, y) === " " ? 1 : -1; // in
						rx--;
					}
					// console.log(portalType, level, word);
					if (portalType === -1 && level === 0 && word !== "ZZ") return;
					if (word === "AA") return;
					if (word === "ZZ" && level !== 0) return;
					resPortals[word] = {
						x: rx,
						y: ry,
						deltadistance: steps - initialsteps,
						deltalevel: portalType,
						name: word,
					};
				}
			}
		}
		pathfind(x, y, steps, level);
		cachedAdjPortals[cacheName] = Object.values(resPortals);
		return getPortals(x, y, steps, level);
		// return Object.values(resPortals);
	}
	let startPortal = findPortal("AA")[0];
	let actions: {
		steps: number;
		x: number;
		y: number;
		level: number;
		path: string[];
	}[] = [{ x: startPortal.x, y: startPortal.y, level: 0, steps: 0, path: [] }];

	console.log(getPortals(startPortal.x, startPortal.y, 0, 0));

	let beenHereBefore: { [key: string]: boolean } = {};

	while (true) {
		actions = actions.sort((a, b) => a.steps - b.steps);
		let action = actions.shift();
		if (!action) throw "!vasdds";
		let bhbKey = action.x + "," + action.y + "," + action.level;
		if (beenHereBefore[bhbKey]) continue;
		beenHereBefore[bhbKey] = true;
		// check which portal is adjacent
		let adjp = getPortals(action.x, action.y, action.steps, action.level);
		// go through
		// find list of portals that can be gone through
		// add those
		rl.do(() => console.log(action, adjp));
		adjp.forEach(portal => {
			if (portal.name === "ZZ") {
				console.log(action, adjp);
				console.log(portal.distance - 1, portal);
				throw -1;
			}
			let similar = findPortal(portal.name);
			let otherp = similar.find(sp => sp.x !== portal.x && sp.y !== portal.y);
			if (!otherp) throw "!otherp " + portal.name;
			actions.push({
				x: otherp.x,
				y: otherp.y,
				steps: portal.distance,
				level: portal.level,
				path: [...action!.path, portal.name],
			});
		});
	}
	// board.print();
	// console.log(startPortal);
	// pathfind(startPortal[0].x, startPortal[0].y, 0);
	// let endPortal = findPortal("ZZ")[0];
	// console.log(paths.get(endPortal.x, endPortal.y));
	// paths.print(p => p.toString().padStart(" ", 5));
})();
