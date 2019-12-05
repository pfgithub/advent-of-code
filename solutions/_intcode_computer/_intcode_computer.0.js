// base intcode computer to copy from
// after completing both parts of a level using this, go back and update this with changes in better code quality

function runComputer(instrv, prgin) {
	let inv = instrv.split`,`;
	let output = [];
	class IntcodeComputer {
		constructor(inv) {
			this.memory = inv.map(v => +v);
			this.go = true;
			this.index = 0;
		}
		stop() {
			this.go = false;
		}
		get i() {
			return this.index;
		}
		set i(nv) {
			let prevV = this.index;
			this.index = nv;
		}
		get n() {
			// *(index++)
			return this.getAt(this.i++);
		}
		get p() {
			this.pmindex++;
			let mode = this.parameterMode[this.pmindex];
			if (mode === 0) {
				return this.getAt(this.n);
			}
			if (mode === 1) {
				return this.n;
			}
			throw new Error(
				"invalid parameter mode " + this.parameterMode[this.pmindex],
			);
		}
		get w() {
			this.pmindex++;
			return this.n;
		}
		get m() {
			return this.memory;
		}
		boundsCheck(index) {
			if (index > this.m.length - 1 || index < 0) {
				throw new Error(
					"out of bounds (" + index + " / " + this.m.length + ")",
				);
			}
		}
		getAt(index) {
			this.boundsCheck(index);
			return this.memory[index];
		}
		setAt(index, value) {
			this.boundsCheck(index);
			let prevV = this.memory[index];
			this.memory[index] = value;
			return prevV;
		}
	}
	let mkv = das =>
		new Proxy(new IntcodeComputer(das), {
			get: (obj, prop) =>
				(+prop).toString() === prop ? obj.getAt(+prop) : obj[prop],
			set: (obj, prop, value) =>
				(+prop).toString() === prop
					? obj.setAt(+prop, value)
					: ((obj[prop] = value), true),
		});
	let v = mkv(inv);

	// adding an intcode:
	// v.p: read as parameter
	// v.w: read as output
	let intcodes = {
		"1": () => {
			let [a, b, out] = [v.p, v.p, v.w];
			v[out] = a + b;
		},
		"2": () => {
			let [a, b, out] = [v.p, v.p, v.w];
			v[out] = a * b;
		},
		"3": () => {
			let [addr] = [v.w];
			v[addr] = prgin.shift();
		},
		"4": () => {
			let [a] = [v.p];
			output.push(a);
		},
		"5": () => {
			let [f, iftrue] = [v.p, v.p];
			if (f !== 0) {
				v.i = iftrue;
			}
		},
		"6": () => {
			let [f, iffalse] = [v.p, v.p];
			if (f === 0) {
				v.i = iffalse;
			}
		},
		"7": () => {
			let [f, s, out] = [v.p, v.p, v.w];
			if (f < s) v[out] = 1;
			else v[out] = 0;
		},
		"8": () => {
			let [f, s, out] = [v.p, v.p, v.w];
			if (f === s) v[out] = 1;
			else v[out] = 0;
		},
		"99": () => {
			return v.stop();
		},
		"404": () => {
			console.log("uh oh! invalid instruction", v[v.i - 1]);
			return v.stop();
		},
	};

	while (v.go) {
		let [e, d, c, b, a] = ("" + v.n).split("").reverse();
		let de = (d || "0") + e;
		let opcode = +de;
		v.pmindex = -1;
		v.parameterMode = [+c || 0, +b || 0, +a || 0];
		console.log("== opcode ", opcode);
		(intcodes["" + opcode] || intcodes["404"])();
	}

	console.log(v.m.join(","));
	return output;
}

output = runComputer(input, [5])[0];

/*
============================= TESTS ===========================
*/

let allTestsPassed = true;
let test = (descr, prog, cb) =>
	cb((description, input, expectedOutput, loud) => {
		let log;
		if (!loud) {
			log = console.log;
			console.log = () => {};
		}
		let rres = runComputer(prog, input);
		if (!loud) console.log = log;
		if (rres.join() !== expectedOutput.join()) {
			console.log(
				"Test failed: ",
				descr + " - " + description,
				"; Expected ",
				expectedOutput,
				" got ",
				rres,
			);
			console.log(new Error(descr + " - " + description));
			allTestsPassed = false;
		}
	});

console.log("--- running tests");

test("opcode 8", "3,9,8,9,10,9,4,9,99,-1,8", check => {
	check("< 8", [3], [0], false);
	check("> 8", [12], [0], false);
	check("= 8", [8], [1], false);
});

test("opcode 8 (immediate)", "3,3,1108,-1,8,3,4,3,99", check => {
	check("< 8", [3], [0], false);
	check("> 8", [12], [0], false);
	check("= 8", [8], [1], false);
});

test("opcode 7", "3,9,7,9,10,9,4,9,99,-1,8", check => {
	check("< 8", [3], [1], false);
	check("> 8", [12], [0], false);
	check("= 8", [8], [0], false);
});

test("opcode 7 (immediate)", "3,3,1107,-1,8,3,4,3,99", check => {
	check("< 8", [3], [1], false);
	check("> 8", [12], [0], false);
	check("= 8", [8], [0], false);
});

test("opcode 6", "3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9", check => {
	check("= 0", [0], [0], false);
	check("!= 0", [-6], [1], false);
	check("!= 0 (2)", [23], [1], false);
});

test("opcode 5 (immediate)", "3,3,1105,-1,9,1101,0,0,12,4,12,99,1", check => {
	check("= 0", [0], [0], false);
	check("!= 0", [-6], [1], false);
	check("!= 0 (2)", [23], [1], false);
});

console.log(allTestsPassed ? "--- ok " : "--- some tests failed");
