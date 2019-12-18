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
	let rl = ratelimit(100);
	inv.split("\n").forEach((l, y) => {
		l.split("").forEach((q, x) => {
			board.set(x, y, q);
		});
	});
	board.print();
	let currentPos = { x: 0, y: 0 };
	board.forEach((v, x, y) => {
		if (v === "@") {
			currentPos = { x, y };
			board.set(x, y, ".");
		}
	});

	let paths: { doors: string[]; distance: number }[] = [
		{
			doors: [],
			distance: 0,
		},
	];
	function pathfind(
		pfb: Board<number>,
		x: number,
		y: number,
		distance: number,
	): { door: string; distance: number }[] {
		// check if current pos contains a key;
		// check if current pos contains a dot .
		let boardv = board.get(x, y);
		let resm: { door: string; distance: number }[] = [];
		if (
			boardv === "." ||
			(boardv.charAt(0) >= "a".charAt(0) && boardv.charAt(0) <= "z".charAt(0))
		) {
			if (pfb.get(x, y) > distance) {
				pfb.set(x, y, distance);
				if (boardv === ".") {
					resm.push(...pathfind(pfb, x + 1, y, distance + 1));
					resm.push(...pathfind(pfb, x - 1, y, distance + 1));
					resm.push(...pathfind(pfb, x, y + 1, distance + 1));
					resm.push(...pathfind(pfb, x, y - 1, distance + 1));
				} else {
					resm.push({ door: board.get(x, y), distance });
				}
			}
		}
		return resm;
	}
	while (true) {
		paths = paths.sort((pa, pb) => pa.distance - pb.distance);
		let currentPath = paths.shift()!;
		rl.do(() => console.log(currentPath.doors.join(""), currentPath.distance));
		// remove all doors
		let itemsRemoved: { x: number; y: number; c: string }[] = [];
		let cpos = { x: currentPos.x, y: currentPos.y };

		let finalDoor = currentPath.doors[currentPath.doors.length - 1];
		board.forEach((v, x, y) => {
			currentPath.doors.forEach(door => {
				if (v === door || v === door.toUpperCase()) {
					if (v === finalDoor) {
						cpos = { x, y };
					}
					itemsRemoved.push({ x, y, c: v });
					board.set(x, y, ".");
				}
			});
		});
		// currentPath.doors.forEach(door => {
		// 	board.forEach((v, x, y) => {
		// 		if (v === door.toUpperCase()) cpos = { x, y };
		// 	});
		// 	itemsRemoved.push({ x: cpos.x, y: cpos.y, c: door.toUpperCase() });
		// 	board.set(cpos.x, cpos.y, ".");
		// 	board.forEach((v, x, y) => {
		// 		if (v === door) cpos = { x, y };
		// 	});
		// 	itemsRemoved.push({ x: cpos.x, y: cpos.y, c: door });
		// 	board.set(cpos.x, cpos.y, ".");
		// });

		let pfb = makeBoard(Infinity);
		let nextAvailableDoors = pathfind(pfb, cpos.x, cpos.y, 0);
		if (nextAvailableDoors.length === 0) {
			console.log("!!!done", currentPath);
			break;
		}
		nextAvailableDoors.forEach(nad => {
			paths.push({
				doors: [...currentPath.doors, nad.door],
				distance: currentPath.distance + nad.distance,
			});
		});
		// add back doors
		itemsRemoved.forEach(it => {
			board.set(it.x, it.y, it.c);
		});

		// break;
	}
})();
