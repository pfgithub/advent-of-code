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

function intcode(
	input: string,
	// getInput /*: () => Promise<bigint>*/,
	// writeOutput /*: (v: bigint) => void */,
	// editv,
) {
	let inputs = oneway<bigint>();
	let outputs = oneway<bigint>();
	let over = { over: false };

	let done = (async () => {
		let memory: bigint[] = input.split(",").map(w => BigInt(+w));
		for (let i = 0; i < 10000; i++) {
			memory.push(0n);
		}
		// editv && editv(memory);
		let instructionPointer = 0n;

		let relativeBase = 0n;

		let parameterModes: number[] = [];
		let parameterIndex = 0n;

		let exit = false;

		let getMem = (v: bigint) => memory[Number(v)];
		let setMem = (v: bigint, w: bigint) => (memory[Number(v)] = w);

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
				if (typeof value === "number") value = BigInt(value);
				// ^ in case we ignore typescript errors
				setMem(out, value);
			},
			"4": async () => {
				let [value] = [v()];
				outputs.write(value);
			},
			"5": async () => {
				let [test, iftrue] = [v(), v()];
				if (test !== 0n) {
					instructionPointer = iftrue;
					parameterIndex = 0n;
				}
			},
			"6": async () => {
				let [test, iffalse] = [v(), v()];
				if (test === 0n) {
					instructionPointer = iffalse;
					parameterIndex = 0n;
				}
			},
			"7": async () => {
				let [f, s, out] = [v(), v(), p()];
				if (f < s) setMem(out, 1n);
				else setMem(out, 0n);
			},
			"8": async () => {
				let [f, s, out] = [v(), v(), p()];
				if (f === s) setMem(out, 1n);
				else setMem(out, 0n);
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
			parameterIndex = 0n;
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
		write: (v: bigint) => inputs.write(v),
		over,
	};

	// return {write: (value) => , read: async () => readvalue}

	// console.log("Done!", memory.join(",").replace(/(\,0)+$/, ""));
}

type nobi = number | bigint;
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
					ymax: Number(x),
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

(async () => {
	let board = `    .------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------.
 -1 | 3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333 |
  0 | 3100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
  1 | 3001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
  2 | 3000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
  3 | 3000001100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
  4 | 3000000011000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
  5 | 3000000001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
  6 | 3000000000011100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
  7 | 3000000000001111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
  8 | 3000000000000011110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
  9 | 3000000000000001111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 10 | 3000000000000000011111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 11 | 3000000000000000001111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 12 | 3000000000000000000011111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 13 | 3000000000000000000000111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 14 | 3000000000000000000000011111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 15 | 3000000000000000000000000111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 16 | 3000000000000000000000000011111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 17 | 3000000000000000000000000000111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 18 | 3000000000000000000000000000011111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 19 | 3000000000000000000000000000000111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 20 | 3000000000000000000000000000000011111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 21 | 3000000000000000000000000000000000111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 22 | 3000000000000000000000000000000000011111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 23 | 3000000000000000000000000000000000000111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 24 | 3000000000000000000000000000000000000001111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 25 | 3000000000000000000000000000000000000000111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 26 | 3000000000000000000000000000000000000000001111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 27 | 3000000000000000000000000000000000000000000111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 28 | 3000000000000000000000000000000000000000000001111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 29 | 3000000000000000000000000000000000000000000000111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 30 | 3000000000000000000000000000000000000000000000001111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 31 | 3000000000000000000000000000000000000000000000000111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 32 | 3000000000000000000000000000000000000000000000000001111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 33 | 3000000000000000000000000000000000000000000000000000111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 34 | 3000000000000000000000000000000000000000000000000000001111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 35 | 3000000000000000000000000000000000000000000000000000000011111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 36 | 3000000000000000000000000000000000000000000000000000000001111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 37 | 3000000000000000000000000000000000000000000000000000000000011111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 38 | 3000000000000000000000000000000000000000000000000000000000001111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 39 | 3000000000000000000000000000000000000000000000000000000000000011111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 40 | 3000000000000000000000000000000000000000000000000000000000000001111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 41 | 3000000000000000000000000000000000000000000000000000000000000000011111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 42 | 3000000000000000000000000000000000000000000000000000000000000000001111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 43 | 3000000000000000000000000000000000000000000000000000000000000000000011111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 44 | 3000000000000000000000000000000000000000000000000000000000000000000001111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 45 | 3000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 46 | 3000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 47 | 3000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 48 | 3000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 49 | 3000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 50 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 51 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 52 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 53 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 54 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 55 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 56 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 57 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 58 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 59 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 60 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 61 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000003 |
 62 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000003 |
 63 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000003 |
 64 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000003 |
 65 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000003 |
 66 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000003 |
 67 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000003 |
 68 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000003 |
 69 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000003 |
 70 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111000000000000000000000000000000000000000000000000000000000003 |
 71 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111110000000000000000000000000000000000000000000000000000000003 |
 72 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111100000000000000000000000000000000000000000000000000000003 |
 73 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111000000000000000000000000000000000000000000000000000003 |
 74 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111110000000000000000000000000000000000000000000000000003 |
 75 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111100000000000000000000000000000000000000000000000003 |
 76 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111000000000000000000000000000000000000000000000003 |
 77 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111110000000000000000000000000000000000000000000003 |
 78 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111100000000000000000000000000000000000000000003 |
 79 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111000000000000000000000000000000000000000003 |
 80 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111110000000000000000000000000000000000000003 |
 81 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111100000000000000000000000000000000000003 |
 82 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111000000000000000000000000000000000003 |
 83 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111110000000000000000000000000000000003 |
 84 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111100000000000000000000000000000003 |
 85 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111000000000000000000000000000003 |
 86 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111110000000000000000000000000003 |
 87 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111100000000000000000000000003 |
 88 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111000000000000000000000003 |
 89 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111110000000000000000000003 |
 90 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111100000000000000000003 |
 91 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111000000000000000003 |
 92 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111110000000000000003 |
 93 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111100000000000003 |
 94 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111000000000003 |
 95 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111110000000003 |
 96 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111100000003 |
 97 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111000003 |
 98 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111110003 |
 99 | 3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111103 |
100 | 3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333 |
    '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
`;
})();
