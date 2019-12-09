const fs = require("fs");
const path = require("path");
const vm = require("vm");
const clipboardy = require("clipboardy");

const filename = process.argv[2];
let txtName = filename.replace(/\.[0-9]+\.js$/, ".txt");
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
${path.basename(filename).replace(/\.js/, "")}
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
};

vm.createContext(sandbox);

vm.runInContext(filecont, sandbox);

console.log("====================================");
console.log(sandbox.output);
