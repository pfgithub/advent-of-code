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
let txtName = filename.replace(/\.[0-9]+\.(?:js|ts)$/, ".txt");
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

const sandbox = {
	input: inputcont.trim(),
	output: undefined,
	copy: text => (clipboardy.writeSync(text), text),
	print: (...v) => console.log(...v),
	console,
	process,
	require,
	setTimeout,
	Math,
	require,
};

vm.createContext(sandbox);

console.log("Compiling...");
babel.transform(
	filecont,
	{
		filename: "day.tsx",
		presets: ["@babel/preset-typescript"],
		plugins: ["@babel/plugin-syntax-bigint"],
	},
	(err, res) => {
		if (err) {
			throw err;
		}
		console.log("Compiled");
		console.log("====================================");
		vm.runInContext(res.code, sandbox);
	},
);

// console.log("====================================");
// console.log(sandbox.output);
