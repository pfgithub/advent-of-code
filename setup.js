const fs = require("fs");
const path = require("path");

let solnName = process.argv[2];

let initialText = `/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/
`

fs.mkdirSync(path.join(__dirname, "solutions", solnName));
[solnName + ".1.js", solnName + ".2.js", solnName + ".txt"].forEach((v, i) =>
	fs.writeFileSync(path.join(__dirname, "solutions", solnName, v), i < 2 ? initialText : "", "utf-8")
);

console.log("done");
