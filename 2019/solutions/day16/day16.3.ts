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
	})();

	return {
		done,
		read: async () => await outputs.read(),
		write: (v: bigint) => inputs.write(v),
	};

	// return {write: (value) => , read: async () => readvalue}

	// console.log("Done!", memory.join(",").replace(/(\,0)+$/, ""));
}

type nobi = number | bigint;
type Board<T> = {
	get(x: nobi, y: nobi): T;
	set(x: nobi, y: nobi, t: T): void;
	clear(): void;
	print(printer?: (v: T, x: number, y: number) => string | nobi): void;
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
		print: (printer = v => v as any) => {
			// ratelimit print
			if (!limits) return console.log("*no board to print*");
			let ylength = 0;
			for (let y = limits.ymin; y <= limits.ymax; y++) {
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

function gcd_two_numbers(x, y) {
	if (typeof x !== "number" || typeof y !== "number") return false;
	x = Math.abs(x);
	y = Math.abs(y);
	while (y) {
		var t = y;
		y = x % y;
		x = t;
	}
	return x;
}

let savedlcm = {};
function lcm_two_numbers(x, y) {
	// if (savedlcm["" + x + "," + y]) return savedlcm["" + x + "," + y];
	let rv = !x || !y ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));
	// savedlcm["" + x + "," + y] = rv;
	return rv;
}

(async () => {
	let initnumbers = "03036732577212944063491565474664";
	let numbers = initnumbers
		.repeat(100000)
		.split("")
		.map(n => +n);
	let inputlen = initnumbers.length;

	let rl = ratelimit(100);

	function repeatQ(list: number[], c: number) {
		return list.flatMap(m => new Array(c).fill(m));
	}
	function doPhase(list: number[], patterninit: number[]) {
		let newList: number[] = [];
		let patternI = 0;
		let precalc: { [key: string]: number } = {};
		// we don't need to do this entire list either
		// we can reuse previous values with the same pattern
		// instead of recalculating
		// no that's not helpful
		for (let mi = 0; mi < list.length; mi++) {
			// let pattern = patterninit;
			// ^ this can be sped up by not actually calculating the pattern
			// say mi is 12 and i is 3,
			// divide i by mi + 1
			// floor
			// add 1
			// mod pattern length

			// let pattern = patterninit;
			// console.log(mi, pattern);
			let restotal = 0;
			let mwp = 0;

			if (mi > numbers.length / 2) {
				for (let i = mi + 1; i < numbers.length; i++) {
					mwp += numbers[i];
				}
			} else {
				// we can probably optimize this by not actually repeating
				// over the entire list...
				// if pattern is 4 long and min input list is 20 long,
				// go 5 times and then repeat that for the remainder of the list
				// that's not true. 5 times means you only get over 5 patterns and

				// let minlen = Math.min(
				// 	lcm_two_numbers(patterninit.length * (mi + 1), inputlen),
				// 	numbers.length,
				// );
				let minlen = numbers.length;
				// it feels like there should be some test cases where
				// instead of repeating 10 000 times, you just repeat 10 times
				// or something
				// maybe I can test this current thing on previous tests
				// idk if I'll ever solve this it's a mess
				let currPatternIndex = 0;
				let currPatternValue = patterninit[currPatternIndex];
				let progress = 1;
				// throw -1;
				for (let i = 0; i < minlen; i++) {
					if (progress >= mi + 1) {
						progress = 0;
						currPatternIndex++;
						currPatternIndex %= patterninit.length;
						currPatternValue = patterninit[currPatternIndex];
					}
					if (currPatternValue === 0) continue;
					let elem = list[i];
					// let pi = (Math.floor(i / (mi + 1)) + 1) % patterninit.length;

					let rq = elem * currPatternValue;
					// let [fdsknjla, fdjkas] = [elem, patterninit[currPatternIndex]];
					progress++;
					// console.log(progress, mi, currPatternIndex);
					// console.log(progress, mi, currPatternIndex);
					restotal += rq;
					// console.log(list[i], "became", rq, fdsknjla, "*", fdjkas);
				}
				let srt = restotal;
				srt *= numbers.length / minlen;
				mwp = srt;
			}

			// console.log(minlen, srt);

			let strn = mwp.toString();
			newList.push(+strn.toString().charAt(strn.toString().length - 1));
			// rl.do(() => console.log(mi, "/", list.length));
			// hecc
			rl.do(() =>
				process.stdout.write(
					mi +
						"/" +
						list.length +
						` srt: ${mwp} numslen: ${
							numbers.length
						} minlen: ${"idk"}          ` +
						"\r",
				),
			);
		}
		newList = newList.map(n => +n.toString().charAt(n.toString().length - 1));
		return newList;
	}

	let cv = numbers;
	for (let i = 0; i < 100; i++) {
		cv = doPhase(cv, [0, 1, 0, -1]);
		// console.log(i + 1);
		// 82261580 // that's correct but shifted left one for some reason
		// console.log("");
		console.log(i + 1, cv.join(""));
	}

	console.log(cv.join(""));

	throw -1;

	let resstring = cv.join("");
	let firstSeven = +input.substr(0, 7);

	copy(resstring);
	console.log("Copied!");

	(() => {
		let list = resstring;
		let len = list.length;
		let offset = firstSeven;
		// there is 0 chance we will get this first try
		// there is 100% chance we will not and it will be very hard to debug
		// but I can hope...
		// rip 32330323
		let res = "";
		for (let i = offset; i < offset + 8; i++) {
			res += list.charAt(i % len);
		}
		console.log(res);
	})();

	// let program = intcode(input);
	// let board = makeBoard("·");
	// let rl = ratelimit(25);
	// rl.do(() => board.print());
	// board.set(5, 6, "?");
	// rl.do(() => board.print());
	// await ms(50);
	// rl.do(() => board.print());
	// board.set(-3, -4, "!");
	// await ms(50);
	// rl.do(() => board.print(v => (v === "?" ? ")" : v)));
})();
