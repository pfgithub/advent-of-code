const fs = require("fs");
const path = require("path");

let solnName = process.argv[2];

let initialText = fs.readFileSync(
	path.join(__dirname, "solutions", "_defaults", "_defaults.0.ts"),
);

fs.mkdirSync(path.join(__dirname, "solutions", solnName));
[
	solnName + ".1.ts",
	solnName + ".2.ts",
	solnName + ".3.ts",
	solnName + ".4.ts",
	solnName + ".5.ts",
	solnName + ".txt",
].forEach((v, i) =>
	fs.writeFileSync(
		path.join(__dirname, "solutions", solnName, v),
		v.endsWith(".ts") ? initialText : "",
		"utf-8",
	),
);

console.log("done");
