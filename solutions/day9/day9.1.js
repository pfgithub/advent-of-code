// base intcode computer to copy from
// after completing both parts of a level using this, go back and update this with changes in better code quality

let gid = 0;
class M {
	constructor() {
		this.id = gid++;
	}
	reset() {
		this.vimmediate = undefined;
		this.waiting = undefined;
		this.onsent = undefined;
	}
	emit(v) {
		return new Promise((resolve, reject) => {
			if (this.waiting) {
				this.waiting(v);
				this.reset();
				resolve();
				return;
			}
			this.vimmediate = v;
			this.onsent = () => {
				this.reset();
				resolve();
			};
		});
	}
	next() {
		return new Promise((resolve, reject) => {
			if (this.vimmediate !== undefined) {
				resolve(this.vimmediate);
				this.onsent();
				return;
			}
			this.waiting = v => {
				resolve(v);
				return;
			};
		});
	}
}

function runComputer(instrv) {
	let instream = new M();
	let outstream = new M();
	let donestream = new M();

	let over = { v: false };

	setTimeout(async (reslv, rejec) => {
		let inv = instrv.split`,`;
		let output = [];

		class IntcodeComputer {
			constructor(inv) {
				this.memory = inv.map(v => BigInt(+v));
				for (let i = 0; i < 10000; i++) {
					this.memory.push(0n);
				}
				this.go = true;
				this.index = 0;
				this.relativebase = 0n;
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
				if (mode === 2) {
					let fasd = this.getAt(this.i);
					console.log(
						"reading relativemode",
						fasd,
						this.relativebase,
						this.relativebase + fasd,
					);
					return this.getAt(this.relativebase + this.n);
				}
				throw new Error(
					"invalid parameter mode " + this.parameterMode[this.pmindex],
				);
			}
			get w() {
				this.pmindex++;
				let mode = this.parameterMode[this.pmindex];
				console.log("w in relative mode");
				if (mode === 2) {
					let fasd = this.getAt(this.i);
					console.log(
						"reading relativemode w",
						fasd,
						this.relativebase,
						this.relativebase + fasd,
					);
					return this.relativebase + this.n;
				}
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
			adjustBase(v) {
				// console.log("adjustbase", v, this.relativebase);
				this.relativebase += v;
				// console.log("adjustbase", v, this.relativebase);
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
			"3": async () => {
				let [addr] = [v.w];
				v[addr] = await instream.next();
				console.log("wrote to", addr, v[addr]);
			},
			"4": async () => {
				// console.log(v);
				let [a] = [v.p];
				await outstream.emit(a);
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
			"9": () => {
				let [adj] = [v.p];
				console.log("adjusting base by", adj);
				v.adjustBase(adj);
				console.log("adjusting base by", v.relativebase);
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
			await (intcodes["" + opcode] || intcodes["404"])();
		}

		console.log(v.m.join(","));

		over.v = true;
		await donestream.emit("done!");
	}, 0);

	return { ins: instream, outs: outstream, done: donestream, over };
}

let phaseSetting = [4, 3, 2, 1, 0];

let inqrew = input;
(async () => {
	try {
		let comp = runComputer(input);
		await comp.ins.emit(1n);
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
		console.log("v", await comp.outs.next());
	} catch (e) {
		console.log(e);
	}
})();

// doarr(items).map(arrq => {
// 	let val = doq(arrq);
// 	rq.push(["new min", val, arrq]);
// 	if (val > min) {
// 		min = val;
// 	}
// });
// console.log(rq.join("\n"));
// console.log(min);

// console.log(doq([4, 3, 2, 1, 0]));
