async function intcode(input) {
	let memory = input.split(",").map(w => BigInt(+w));
	for (let i = 0; i < 10000; i++) {
		memory.push(0n);
	}
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

	console.log("Done!", memory.join(",").replace(/(\,0)+$/, ""));
}

(async () => {
	let ca = intcode(input);
	ca.write(2n);
	console.log(await ca.read());
	await ca.done();
})();
