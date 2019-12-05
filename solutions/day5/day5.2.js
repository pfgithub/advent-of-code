/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

let inv = input.split`,`;
let prgin = [5];

class V {
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
			throw new Error("out of bounds (" + index + " / " + this.m.length + ")");
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
	new Proxy(new V(das), {
		get: (obj, prop) =>
			(+prop).toString() === prop ? obj.getAt(+prop) : obj[prop],
		set: (obj, prop, value) =>
			(+prop).toString() === prop
				? obj.setAt(+prop, value)
				: ((obj[prop] = value), true),
	});
let v = mkv(inv);
let inputv = mkv(prgin);

let intcodes = {
	"1": () => {
		let [a, b, ri] = [v.p, v.p, v.w];
		v[ri] = a + b;
	},
	"2": () => {
		let [a, b, ri] = [v.p, v.p, v.w];
		v[ri] = a * b;
	},
	"3": () => {
		let [addr] = [v.w];
		v[addr] = inputv.n;
	},
	"4": () => {
		let [a] = [v.p];
		output = a;
	},
	["5"]() {
		let [f, iftrue] = [v.p, v.p];
		if (f !== 0) {
			v.i = iftrue;
		}
	},
	["6"]() {
		let [f, iffalse] = [v.p, v.p];
		if (f === 0) {
			v.i = iffalse;
		}
	},
	["7"]() {
		let [f, s, out] = [v.p, v.p, v.w];
		if (f < s) v[out] = 1;
		else v[out] = 0;
	},
	["8"]() {
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
	let [, ed, c, b, a] = ("" + v.n)
		.split("")
		.reverse()
		.join("")
		.match(/(..?)(.?)(.?)(.?)/);
	let de = ed
		.split("")
		.reverse()
		.join("");
	let opcode = +de;
	v.pmindex = -1;
	v.parameterMode = [+c || 0, +b || 0, +a || 0];
	console.log("== opcode ", opcode);
	(intcodes["" + opcode] || intcodes["404"])();
}

console.log(v.m.join(","));
