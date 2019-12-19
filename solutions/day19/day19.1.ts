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

(async () => {
	let board = makeBoard(5n);
	let rl = ratelimit(1000);
	// 93,51
	let thingCount = 0;
	let sx = 99;
	let sy = 99;
	let startPosForOnes = 0;
	let prevMinY = 0;
	let beamPoints = [];

	async function getPointAtPos(x: number, y: number) {
		if (x < 0 || y < 0) return 0n;
		let item = board.get(x, y);
		if (item === 5n) {
			let program = intcode(input);
			program.write(BigInt(x));
			program.write(BigInt(y));
			let mode = await program.read();
			board.set(x, y, mode);
			// rl.do(() => board.print());
			return mode;
		}
		return item;
	}

	async function testSquare(tlx: number, tly: number) {
		let res = true;
		let tr = await getPointAtPos(tlx + sx, tly);
		let bl = await getPointAtPos(tlx, tly + sy);
		// for (let y = tly; y < tly + sy; y++) {
		// 	for (let x = tlx; x < tlx + sx; x++) {
		// 		let point = await getPointAtPos(x, y);
		// 		if (point !== 1n) return false;
		// 	}
		// 	// console.log(y);
		// }
		return tr === 1n && bl === 1n;
	}

	// for(let y = 550; y < 570; y++){
	// 	for (let x = )
	// }

	let minDist = Infinity;
	for (let x = 1000; x < 1030; x++) {
		for (let y = 500; y < 600; y++) {
			let pass = await testSquare(x, y);
			// console.log(x, y, pass);
			if (pass) {
				let dist = Math.sqrt(x * x + y * y);
				if (dist < minDist) {
					minDist = dist;
					console.log("!!!!!", x, y, x * 10000 + y, dist);
				}
			}
		}
	}

	console.log("welp");
	// 10200560

	// 10110555
	// 10110555

	// let xst = 0;
	// for (let y = 0; true; y++) {
	// 	while (true) {
	// 		let value = await getPointAtPos(xst, y);
	// 		if (value === 1n) {
	// 			break;
	// 		}
	// 		xst++;
	// 	}
	// 	let otherPointX = xst + sx;
	// 	let otherPointY = y - sy;
	// 	if ((await getPointAtPos(otherPointX, otherPointY)) === 1n) {
	// 		console.log(xst, y, otherPointX, otherPointY, xst * 10000 + otherPointY);
	// 		throw -1;
	// 	}
	// 	console.log(xst, y, otherPointX, otherPointY, xst * 10000 + otherPointY);
	// 	// throw -1;
	// 	// await ms(1000);
	// }

	// let maxy = 0;
	//
	// // for (let y = 500; y < 700 + 100; y++) {
	// // 	for (let x = 900; x < 1100 + 100; x++) {
	// // 		let point = await getPointAtPos(x, y);
	// // 	}
	// // }
	//
	// let m = 150;
	//
	// while (true) {
	// 	let x = m * 10;
	// 	let y = m * 6;
	// 	let p = await getPointAtPos(x, y);
	// 	if (p === 0n) throw "aaa" + x + "," + y;
	// 	// board.print();
	// 	if (await testSquare(x, y)) {
	// 		throw "found!! " + (x * 10000 + y) + " (x is)" + x + "(y is)" + y;
	// 	}
	// 	console.log(m, x, y);
	// 	++m;
	// 	await ms(100);
	// }
	// // this returned 21101266 but that's bad
	//
	// board.print();
	// // console.log(await testSquare(10000, 6000));

	// board.print();

	// for (let y = 0; true; y++) {
	// 	let oneThisTick = 0;
	// 	let spfostt = false;
	// 	for (let x = startPosForOnes; true; x++) {
	// 		let program = intcode(input);
	// 		program.write(BigInt(x));
	// 		program.write(BigInt(y));
	// 		let mode = await program.read();
	// 		board.set(x, y, mode);
	// 		if (mode === 1n) {
	// 			thingCount++;
	// 			oneThisTick++;
	// 			if (!spfostt) {
	// 				startPosForOnes = x - 1;
	// 				spfostt = true;
	// 				beamPoints.push([x]);
	// 			}
	// 		}
	// 		if (mode === 0n && oneThisTick) {
	// 			beamPoints[beamPoints.length - 1].push(x);
	// 			break;
	// 		}
	// 	}
	// 	console.log(beamPoints);
	// 	// let inARowCount = 0;
	// 	// board.forEach((m, x, y) => {
	// 	// 	for (let dy = 0; dy < sy; dy++) {
	// 	// 		for (let dx = 0; dx < sy; dx++) {
	// 	// 			if (board.get(dx + x, dy + y) === 0n) {
	// 	// 				return;
	// 	// 			}
	// 	// 		}
	// 	// 		if (dy > prevMinY) {
	// 	// 			console.log(x, y, dy, startPosForOnes);
	// 	// 			prevMinY = dy;
	// 	// 		}
	// 	// 	}
	// 	// 	for (let dy = 0; dy < sy; dy++) {
	// 	// 		for (let dx = 0; dx < sy; dx++) {
	// 	// 			board.set(dx + x, dy + y, 2n);
	// 	// 		}
	// 	// 	}
	// 	// 	board.print();
	// 	// 	console.log(x * 10000 + y);
	// 	// 	throw "a";
	// 	// });
	// 	// rl.do(() => board.print());
	// 	// console.log(y, oneThisTick);
	// }

	// console.log(thingCount);
})();
