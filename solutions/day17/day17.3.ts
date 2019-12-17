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

(async () => {
	let program = intcode(input.replace("1,", "2,"));
	let board = makeBoard("·");

	async function printCamera() {
		board.clear();
		let x = 0;
		let y = 0;
		let m = 0;
		while (true) {
			let v = await program.read();
			if (v === 10n) {
				y++;
				x = 0;
			} else {
				board.set(x, y, String.fromCodePoint(Number(v)));
				x++;
			}
			m++;
			// console.log(m);
			if (m === 2843) break;
		}
		board.print();
	}
	await printCamera();
	async function readLine() {
		let text = "";
		while (true) {
			let v = String.fromCodePoint(Number(await program.read()));
			if (v === "\n") break;
			text += v;
		}
		return text;
	}
	async function sendText(text: string) {
		console.log("I>", text);
		text += "\n";
		let t = text.split("").map(l => BigInt(l.codePointAt(0)));
		for (let m of t) {
			await program.write(m);
		}
	}

	/*
	A,C,A,B,A,A,B,C,B,C

	A: L,12,L,8,R,12
	B: R,12,L,8,L,10
	C: L,10,L,8,L,12,R,12
	*/

	console.log(await readLine());
	await sendText("A,C,A,B,A,A,B,C,B,C"); // fns a,b,c
	console.log(await readLine());
	await sendText("L,12,L,8,R,12");
	console.log(await readLine());
	await sendText("R,12,L,8,L,10");
	console.log(await readLine());
	await sendText("L,10,L,8,L,12,R,12");
	console.log(await readLine());
	await sendText("N");
	while (true) {
		await printCamera();
		await ms(100);
	}
})();
