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
			"3": async () => {
				let [addr] = [v.w];
				v[addr] = await instream.next();
			},
			"4": async () => {
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

async function doq(phaseSettings) {
	let cyclev = 0;
	let ares = runComputer(inqrew);
	let bres = runComputer(inqrew);
	let cres = runComputer(inqrew);
	let dres = runComputer(inqrew);
	let eres = runComputer(inqrew);
	await ares.ins.emit(phaseSettings[0]);
	await bres.ins.emit(phaseSettings[1]);
	await cres.ins.emit(phaseSettings[2]);
	await dres.ins.emit(phaseSettings[3]);
	await eres.ins.emit(phaseSettings[4]);
	while (true) {
		if (ares.over.v) break;
		await ares.ins.emit(cyclev);
		console.log("ares");
		cyclev = await ares.outs.next();
		await bres.ins.emit(cyclev);
		console.log("bres");
		cyclev = await bres.outs.next();
		await cres.ins.emit(cyclev);
		console.log("cres");
		cyclev = await cres.outs.next();
		await dres.ins.emit(cyclev);
		console.log("dres");
		cyclev = await dres.outs.next();
		await eres.ins.emit(cyclev);
		console.log("eres");
		cyclev = await eres.outs.next();
	}
	return cyclev;
}

let items = [5, 6, 7, 8, 9];
let arrangements = [];
function doarr(arr) {
	if (arr.length === 1) return [arr];
	let resvs = [];
	arr.forEach((q, i) => {
		let newa = [...arr];
		let it = newa[i];
		newa = newa.filter((_, iw) => iw !== i);
		let resv = it;
		let subopts = doarr(newa);
		resvs.push(...subopts.map(sopt => [resv, ...sopt]));
	});
	return resvs;
}

// console.log(doarr(items).join("\n"));

let min = 0;

let rq = [];

(async () => {
	let max = 0;
	for (let list of doarr(items)) {
		let result = await doq(list);
		max = Math.max(result, max);
	}
	console.log("FINALL!!", max);
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
