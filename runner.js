const fs = require("fs");
const path = require("path");
const vm = require("vm");
const clipboardy = require("clipboardy");
const babel = require("@babel/core");
// const readline = require("readline");
// const rlint = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout,
// });

const filename = process.argv[2];
const fnsplit = filename.split("/");
fnsplit.pop();
const dayName = fnsplit[fnsplit.length - 1];

let txtName = fnsplit.join("/")+"/"+dayName+".txt";
const filecont = fs.readFileSync(path.resolve(filename), "utf-8");
const inputcont = fs.readFileSync(path.resolve(txtName), "utf-8");

process.on("unhandledRejection", (reason, p) => {
	console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
	// application specific logging, throwing an error, or other logic here
});

process.stdout.write("\u001b[2J\u001b[0;0H");
// process.stdout.write("\033c");

console.log(`
${Math.random()} - ${new Date().getTime()}
====================================
${path.basename(filename).replace(/\.(?:js|ts)/, "")}
====================================`);

const highlight = msg => "\x1b[31m"+msg+"\x1b(B\x1b[m";

const sandbox = {
	input: inputcont.trim(),
	lines: inputcont.trim().split("\n"),
	dblines: inputcont.trim().split("\n\n").map(q => q.split("\n")),
	output: undefined,
	copy: text => (clipboardy.writeSync(text), text),
	print: (...v) => console.log(...v),
	error: (...a) => {throw new Error(highlight(a.join(" ")))},
	highlight,
	console,
	process,
	require,
	setTimeout,
	Math,
	require,
	exports: {},
	clearScreen: () => process.stdout.write("\u001b[2J\u001b[0;0H"),
};
const js = (a) => a[0];
const precode = js`
Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};
`;

vm.createContext(sandbox);

console.log("Compiling…");
const cb = (err, res) => {
	if (err) {
		throw err;
	}
	console.log("Compiled");
	console.log("====================================");
	let start_time = Date.now();
	try {
		vm.runInContext(precode + "\n" + res.code, sandbox);
	}catch(e) {
		console.log(e.stack.replace(e.message, highlight(e.message)));
	}
	let total_ms = Date.now() - start_time;
	console.log("\n\x1b[90mCompleted in "+total_ms+" ms.\x1b(B\x1b[m\x1b[A\x1b[A")
};
if(filename.endsWith(".js")) {
	cb(undefined, filecont);
}else{
	babel.transform(
		filecont,
		{
			filename: "day.tsx",
			presets: ["@babel/preset-typescript"],
			plugins: [
				"@babel/plugin-syntax-bigint",
				"@babel/plugin-transform-modules-commonjs",
			],
		},
		cb,
	);
}

// console.log("====================================");
// console.log(sandbox.output);
