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
	let board = makeBoard("·");
	let inv = input;
	inv.split("\n").forEach((l, y) => {
		l.split("").forEach((q, x) => {
			board.set(x, y, q);
		});
	});
	board.print();
	function openDoor(name: string, board: Board<string>) {
		board.forEach((v, x, y) => {
			if (v === name) {
				board.set(x, y, ".");
			}
		});
	}
	let currentPos = { x: 0, y: 0 };
	board.forEach((v, x, y) => {
		if (v === "@") {
			currentPos = { x, y };
			board.set(x, y, ".");
		}
	});
	let minTotal = Infinity;
	let minTotalPath = "";
	function trySolve(
		board: Board<string>,
		currentPos: { x: number; y: number },
		totalSteps: number,
		layer: number,
		pathmmm: string,
	): number {
		let accessableKeys: {
			[key: string]: { x: number; y: number; steps: number };
		} = {};
		let paths = makeBoard(Infinity);
		// pathfind steps and keys
		function pathfind(x: number, y: number, steps: number) {
			// check if current pos contains a key;
			// check if current pos contains a dot .
			let boardv = board.get(x, y);
			let alphabet = "qwertyuiopasdfghjklzxcvbnm";
			if (boardv === "." || alphabet.indexOf(boardv) > -1) {
				if (paths.get(x, y) > steps) {
					paths.set(x, y, steps);
					if (boardv === ".") {
						pathfind(x + 1, y, steps + 1);
						pathfind(x - 1, y, steps + 1);
						pathfind(x, y + 1, steps + 1);
						pathfind(x, y - 1, steps + 1);
					} else {
						accessableKeys[boardv] = { x, y, steps };
					}
				}
			}
		}
		pathfind(currentPos.x, currentPos.y, 0);
		// for each accessable key, try solving. get the best solution.
		let finalStepCount = Infinity;
		let objk = Object.keys(accessableKeys);
		if (objk.length === 0) {
			if (totalSteps < minTotal) {
				minTotal = totalSteps;
				minTotalPath = pathmmm;
			}
			console.log(pathmmm + " !!FINAL", totalSteps, pathmmm);
			console.log(pathmmm + " !!MIN", minTotal, minTotalPath);
			return totalSteps;
		}
		// checked 5242, 4950, 4946
		/*
		.sort((a, b) => {
			return accessableKeys[a].steps - accessableKeys[b].steps;
		})
		*/
		objk
			.sort((a, b) => {
				return accessableKeys[a].steps + accessableKeys[b].steps;
			})
			.forEach((key, i) => {
				console.log(pathmmm + " step " + i + "/" + objk.length);
				let keyinfo = accessableKeys[key];
				// console.log("Attempting solution by opening door", key);
				let nb = board.copy();
				// nb.print();
				openDoor(key, nb);
				openDoor(key.toUpperCase(), nb);
				nb.set(keyinfo.x, keyinfo.y, "@");
				// nb.print();
				nb.set(keyinfo.x, keyinfo.y, ".");
				let stepCount = trySolve(
					nb,
					{ x: keyinfo.x, y: keyinfo.y },
					totalSteps + keyinfo.steps,
					layer + 1,
					pathmmm + key,
				);
				// console.log("Got in", stepCount);
				finalStepCount = Math.min(finalStepCount, stepCount);
			});
		// console.log(currentPos, accessableKeys);
		return finalStepCount;
	}
	let stepCount = trySolve(board.copy(), currentPos, 0, 0, "");
	console.log(stepCount);
})();
