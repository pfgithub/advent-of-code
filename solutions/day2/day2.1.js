/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

let inv = input.split`,`;
inv[1] = 12;
inv[2] = 2;

class V {
	constructor() {
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
		// *(*(index++))
		return this.getAt(this.n);
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
let v = new Proxy(new V(), {
	get: (obj, prop) =>
		(+prop).toString() === prop ? obj.getAt(+prop) : obj[prop],
	set: (obj, prop, value) =>
		(+prop).toString() === prop
			? obj.setAt(+prop, value)
			: ((obj[prop] = value), true),
});

let intcodes = {
	"1": () => {
		let [a, b, ri] = [v.p, v.p, v.n];
		v[ri] = a + b;
	},
	"2": () => {
		let [a, b, ri] = [v.p, v.p, v.n];
		v[ri] = a * b;
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
	let opcode = v.n;
	console.log("== opcode ", opcode);
	(intcodes["" + opcode] || intcodes["404"])();
}

console.log(v.m.join(","));

output = v[0];
