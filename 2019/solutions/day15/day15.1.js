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

	let ms = ms => new Promise(r => setTimeout(r, ms));

	let gameScreen = [];
	for (let y = 0; y < 50; y++) {
		let by = [];
		gameScreen.push(by);
		for (let x = 0; x < 100; x++) {
			by.push(" ");
		}
	}
	// test left
	// if left, go left
	// test straight
	// if straight, go straight
	// else right
	let mode = "test";
	let realdir = north;
	let odat = [];
	let jt = false;
	let mvmt = "ddddddsssssssss"
		.split("")
		.map(ch => ({ a: west, w: north, s: south, d: east }[ch]));
	function doOdat() {
		let [statusCode] = odat;
		odat = [];

		let [dx, dy] = dirinf["" + cdir];
		let [cx, cy] = [dpos.x + dx, dpos.y + dy];
		if (statusCode === status.hitwall) {
			gameScreen[dpos.y][dpos.x] = "d";
			gameScreen[cy][cx] = "#";
		} else {
			gameScreen[dpos.y][dpos.x] = "_";
			gameScreen[cy][cx] = "D";
			dpos.y = cy;
			dpos.x = cx;
		}
		drawGame();
		// if(mode === "straight"){
		// 	if(statusCode === status.hitwall){
		//
		// 	}
		// }
		// if(mode === "left"){
		// 	if(statusCode === status.hitwall){
		// 		cdir = nextdir[""+cdir];
		// 		mode = "straight";
		// 	}
		// }
		console.log(mode, cdir, jt);
		if (mode === "testnew") {
			mode = "test";
			cdir = north;
			jt = false;
		} else if (mode === "test") {
			if (statusCode !== status.hitwall) {
				mode = "reverse";
				cdir = nextdir["" + nextdir["" + cdir]];
			} else {
				if (cdir === north && jt) {
					// test over
					mode = "go";
				}
				cdir = nextdir["" + cdir];
			}
			jt = true;
		} else if (mode === "reverse") {
			cdir = nextdir["" + nextdir["" + cdir]];
			cdir = nextdir["" + cdir];
			mode = "test";
		} else if (mode === "go") {
			if (mvmt.length === 0) throw "out of instructions";
			cdir = mvmt.shift();
			mode = "testnew";
			// let left = realdir;
			// let straight = nextdir["" + realdir];
			// let right = nextdir["" + nextdir["" + realdir]];
			// let [rdx, rdy] = dirinf["" + realdir];
			// let [rcx, rcy] = [dpos.x + rdx, dpos.y + rdy];
			// if (gameScreen[rcy][rcx] === "#") {
			// }
			//
			// cdir = nextdir["" + (Math.floor(Math.random() * 4) + 1)];
			// mode = "test";
		}
		return;
		cdir = nextdir["" + cdir];
		if (statusCode === status.hitwall) {
			// droid pos unchanged
			// oh right. try left, try center, try right
			// aaa
			// ok ready
			if (Math.random() > 0) {
				cdir = nextdir["" + (Math.floor(Math.random() * 4) + 1)];
			}
			gameScreen[cy][cx] = "#";
		} else {
			dpos.x = cx;
			dpos.y = cy;
			if (statusCode === status.atoxy) {
				gameScreen[cy][cx] = "A";
				drawGame();
				throw 0;
			}
		}
		drawGame();
	}
	let drawGame = () => {
		// process.stdout.write("\u001B[2J\u001B[0;0f");
		console.log(gameScreen.map((w, y) => w.join("") + "|").join("\n"));
	};
	await intcode(
		input,
		async () => {
			await ms(10);
			// if (mvmt.length === 0) {
			// 	throw -1;
			// }
			// cdir = mvmt.shift();
			return cdir;
		},
		v => (odat.push(v), odat.length === 1 && doOdat()),
	);
})();
