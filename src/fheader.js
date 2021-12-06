import * as path from "path";
import * as fs from "fs";

process.stdout.write("\u001b[2J\u001b[0;0H");

const sessionid = Math.random();

export function fhmain(filename) {
	console.log(`${sessionid} - ${new Date().getTime()}
====================================
${path.basename(filename).replace(/\.(?:js|ts)/, "")}
====================================`);
	let txt_name = path.dirname(filename) + "/" + path.basename(path.dirname(filename)) + ".txt";

	global.input = fs.readFileSync(txt_name, "utf-8");
	global.lines = global.input.split("\n");
	global.dblines = global.input.split("\n\n");
	global.output = undefined;
	global.start_time = Date.now();
}

global.highlight = msg => "\x1b[31m"+msg+"\x1b(B\x1b[m";
global.copy = text => {
	require("clipboardy").writeSync(text);
	return text;
};
global.print = (...a) => console.log(...a);
global.error = (...a) => {throw new Error(highlight(a.join(" ")))},
global.clearScreen = () => process.stdout.write("\u001b[2J\u001b[0;0H");

process.on("exit", () => {
	let total_ms = Date.now() - start_time;
	console.log("\n\x1b[90mCompleted in "+total_ms+" ms. ("+sessionid+")\x1b(B\x1b[m\x1b[A\x1b[A")
});
process.on("uncaughtException", (e) => {
	console.log();
	console.log(e.stack.replace(e.message, highlight(e.message)));
	process.exit(1);
});

function _defproto(thing, name, cb) {
	Object.defineProperty(thing.prototype, name, {
		enumerable: false,
		value: function(...args) {
			return cb(
				this,
				...args,
			);
		},
	});
}
_defproto(Object, "defproto", _defproto);

Number.defproto("mod", (m, n) => ((m%n)+n)%n);
// Object.defproto("dwth", (me, cb) => (cb(me), me));
_defproto(Object, "dwth", (me, cb) => (cb(me), me));
Object.defproto("use", (me, cb) => cb(me));
global.log = (...a) => {
	console.log(...a.map(w => {
		if(w instanceof Number) return +w;
		if(w instanceof String) return ""+w;
		return w;
	}));
};

global.vec = (...a) => a.flat();
global.dupe = (a) => [...a];
Array.defproto("op", (a, b, cb) => a.map((v, i) => cb(v, b[i], i, a, b)));
Array.defproto("add", (a, b) => a.op(b, (a, b) => a + b));
Array.defproto("sub", (a, b) => a.op(b, (a, b) => a - b));
Array.defproto("mul", (a, b) => a.op(b, (a, b) => a * b));
Array.defproto("div", (a, b) => a.op(b, (a, b) => a / b));
Array.defproto("mod", (a, b) => a.op(b, (a, b) => a.mod(b)));
Array.prototype.mapt = Array.prototype.map;
for(const [index, name] of ["x", "y", "z", "a"].entries()) {
	Object.defineProperty(Array.prototype, name, {
		enumerable: false,
		get: function() {return this[index]},
		set: function(v) {this[index] = v},
	});
}

global.cardinals = [[1,0],[-1,0],[0,1],[0,-1]];
global.diagonals = [[-1,-1],[-1,1],[1,-1],[1,1]];
global.adjacents = [...cardinals, ...diagonals];

global.range = (...a) => {
	const [start, end, step] = (a.length === 1 ? [0, a[0], 1] : a.length === 2 ? [...a, 1] : a);
	return Array.from({length: Math.ceil((end - start) / step)}, (_, i) => i * step + start);
}