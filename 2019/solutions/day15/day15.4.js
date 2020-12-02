// const getLine = () =>
// 	new Promise(reslv => {
// 		rlint.question("? ", v => {
// 			reslv(v);
// 		});
// 	});

/*

---- getline()

const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let linev = oneway();
let getLine = linev.read;

process.stdin.resume();
process.stdin.on("keypress", (str, key) => {
	if (key.sequence === "\u0003") {
		process.exit();
	}
	console.log("`" + str + "`");
	linev.write(str);
});

*/

// const getLine = (function() {
// 	const getLineGen = (async function*() {
// 		for await (const line of rl) {
// 			yield line;
// 		}
// 	})();
// 	return async () => (await getLineGen.next()).value;
// })();

function oneway() {
	let stream = [];
	let waitingnow;
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
	input,
	// getInput /*: () => Promise<bigint>*/,
	// writeOutput /*: (v: bigint) => void */,
	// editv,
) {
	let inputs = oneway();
	let outputs = oneway();

	let done = (async () => {
		let memory = input.split(",").map(w => BigInt(+w));
		for (let i = 0; i < 10000; i++) {
			memory.push(0n);
		}
		// editv && editv(memory);
		let instructionPointer = 0n;

		let relativeBase = 0n;

		let parameterModes = [];
		let parameterIndex = 0n;

		let exit = false;

		let getPointer_ = () => {
			let parameterMode = parameterModes[parameterIndex];
			if (parameterMode === 0) {
				return memory[instructionPointer + parameterIndex];
			}
			if (parameterMode === 1) {
				return instructionPointer + parameterIndex;
			}
			if (parameterMode === 2) {
				return relativeBase + memory[instructionPointer + parameterIndex];
			}
		};
		let getPointer = () => {
			let res = getPointer_();
			parameterIndex++;
			return res;
		};
		let getValue = () => memory[getPointer()];
		let p = getPointer;
		let v = getValue;

		let opcodes = {
			"1": async () => {
				let [a, b, out] = [v(), v(), p()];
				memory[out] = a + b;
			},
			"2": async () => {
				let [a, b, out] = [v(), v(), p()];
				memory[out] = a * b;
			},
			"3": async () => {
				let [out] = [p()];
				let value = await inputs.read();
				if (typeof value === "number") value = BigInt(value);
				memory[out] = value;
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
			"7": () => {
				let [f, s, out] = [v(), v(), p()];
				if (f < s) memory[out] = 1n;
				else memory[out] = 0n;
			},
			"8": async () => {
				let [f, s, out] = [v(), v(), p()];
				if (f === s) memory[out] = 1n;
				else memory[out] = 0n;
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
		write: v => inputs.write(v),
	};

	// return {write: (value) => , read: async () => readvalue}

	// console.log("Done!", memory.join(",").replace(/(\,0)+$/, ""));
}

(async () => {
	let program = intcode(input);

	let north = 1n;
	let south = 2n;
	let east = 3n;
	let west = 4n;

	let dpos = { x: 50, y: 25 };

	let cdir = north;
	let nextdir = {
		["" + north]: east,
		["" + east]: south,
		["" + south]: west,
		["" + west]: north,
	};
	let dirinf = {
		["" + north]: [0, -1],
		["" + east]: [1, 0],
		["" + south]: [0, 1],
		["" + west]: [-1, 0],
	};

	let status = {
		hitwall: 0n,
		moved: 1n,
		atoxy: 2n,
	};
	let gameScreen = [];
	let pathingInfo = [];
	for (let y = 0; y < 50; y++) {
		let by = [];
		gameScreen.push(by);
		for (let x = 0; x < 100; x++) {
			by.push(" ");
		}
	}
	for (let y = 0; y < 50; y++) {
		let by = [];
		pathingInfo.push(by);
		for (let x = 0; x < 100; x++) {
			by.push(Infinity);
		}
	}

	let drawGame = () => {
		clearScreen();
		console.log(gameScreen.map((w, y) => w.join("") + "|").join("\n"));
	};
	let lastDraw = 0;
	function updateScreen(direction, result) {
		let [statusCode] = [result];
		let [cdir] = [direction];
		// odat = [];

		let [dx, dy] = dirinf["" + cdir];
		let [cx, cy] = [dpos.x + dx, dpos.y + dy];
		if (statusCode === status.hitwall) {
			gameScreen[dpos.y][dpos.x] = "d";
			gameScreen[cy][cx] = "#";
		} else {
			gameScreen[dpos.y][dpos.x] = "·";
			gameScreen[cy][cx] = "D";
			dpos.y = cy;
			dpos.x = cx;
		}
	}

	let moveCount = 0;

	async function go(direction) {
		// console.log("writing");
		program.write(direction);
		// console.log("waiting for read");
		let result = await program.read();
		updateScreen(direction, result);
		await ms(1);

		if (result === status.hitwall) {
		} else {
			moveCount++;
		}
		if (moveCount > pathingInfo[dpos.y][dpos.x]) {
			moveCount = pathingInfo[dpos.y][dpos.x];
		}
		pathingInfo[dpos.y][dpos.x] = moveCount;

		if (new Date().getTime() > lastDraw + 100) {
			let largestPathV = 0;
			for (let y = 0; y < pathingInfo.length; y++) {
				for (let x = 0; x < pathingInfo[0].length; x++) {
					let cv = pathingInfo[y][x];
					if (!Number.isFinite(cv)) continue;
					if (cv > largestPathV) largestPathV = cv;
				}
			}
			drawGame();
			lastDraw = new Date().getTime();
			console.log(largestPathV);
		}

		return result;
	}

	let ms = ms => new Promise(r => setTimeout(r, ms));
	let n = dir => nextdir["" + dir];
	let testdir = async dir => {
		let result = await go(dir);
		if (result === status.atoxy) {
			gameScreen[25][50] = "s";

			// clear path information
			gameScreen = [];
			for (let y = 0; y < 50; y++) {
				let by = [];
				gameScreen.push(by);
				for (let x = 0; x < 100; x++) {
					by.push(" ");
				}
			}
			pathingInfo = [];
			moveCount = 0;
			for (let y = 0; y < 50; y++) {
				let by = [];
				pathingInfo.push(by);
				for (let x = 0; x < 100; x++) {
					by.push(Infinity);
				}
			}
			// traverse entire map
			// throw "atoxy";
		}
		if (result !== status.hitwall) {
			await go(n(n(dir)));
		}
		return result;
	};
	let testall = async () => {
		await testdir(north);
		await testdir(east);
		await testdir(south);
		await testdir(west);
	};

	let currentDirection = north;

	while (true) {
		// await testall();
		let canGoLeft = await testdir(n(n(n(currentDirection))));
		if (canGoLeft === status.hitwall) {
			let canGoStraight = await testdir(currentDirection);
			if (canGoStraight === status.hitwall) {
				currentDirection = n(currentDirection);
			}
		} else {
			currentDirection = n(n(n(currentDirection)));
		}
		currentDirection = currentDirection;
		await go(currentDirection);
		// let dirToGo = await getLine();
		// let dirNum = { w: north, s: south, d: east, a: west }[dirToGo];
		// await go(dirNum);
	}
})();
