async function intcode(
	input,
	getInput /*: () => Promise<bigint>*/,
	writeOutput /*: (v: bigint) => void */,
	editv,
) {
	let memory = input.split(",").map(w => BigInt(+w));
	for (let i = 0; i < 10000; i++) {
		memory.push(0n);
	}
	editv && editv(memory);
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
			let value = await getInput();
			if (typeof value === "number") value = BigInt(value);
			memory[out] = value;
		},
		"4": async () => {
			let [value] = [v()];
			writeOutput(value);
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

	// console.log("Done!", memory.join(",").replace(/(\,0)+$/, ""));
}

(async () => {
	let gameScreen = [];
	for (let y = 0; y < 50; y++) {
		let by = [];
		gameScreen.push(by);
		for (let x = 0; x < 50; x++) {
			by.push("_");
		}
	}
	let blockTileCount = 0;
	let odat = [];
	function doOdat() {
		let [x, y, tileid] = odat;
		odat = [];
		if (x === -1n && y === 0n) {
			gameScreen[49][0] = tileid;
			console.log(tileid);
		} else {
			// console.log(x, y, tileid);
			gameScreen[y][x] = tileid;
		}
	}
	let tmt = ms => new Promise(r => setTimeout(r, ms));
	let inp = "sssdddddddddaaasad"
		.split("")
		.map(l => (l === "a" ? -1n : l === "d" ? 1n : 0n));
	let drawGame = () => {
		process.stdout.write("\u001B[2J\u001B[0;0f");
		console.log(
			gameScreen
				.map(w => w.map(q => ({ "0": " ", "3": "_" }["" + q] || q)).join(""))
				.join("\n"),
		);
	};
	await intcode(
		input,
		async () => {
			drawGame();
			// console.log(
			// 	gameScreen
			// 		.map(w => w.map(q => ({ "0": " ", "3": "_" }["" + q] || q)).join(""))
			// 		.join("\n"),
			// );
			let bloc;
			let yloc;
			for (let y = 0; y < gameScreen.length; y++) {
				for (let x = 0; x < gameScreen.length; x++) {
					if (gameScreen[y][x] === 4n) {
						bloc = { y, x };
					}
					if (gameScreen[y][x] === 3n) {
						yloc = { y, x };
					}
				}
			}
			if (inp.length === 0) throw 0;
			await tmt(100);
			return yloc.x > bloc.x ? -1n : yloc.x < bloc.x ? 1n : 0;
			// return inp.shift();
			// return 1n;
		},
		v => (odat.push(v), odat.length === 3 && doOdat()),
		m => (m[0] = 2n),
	);
	drawGame();
})();
