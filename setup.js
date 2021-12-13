const fs = require("fs");
const path = require("path");
// eslint-disable-next-line

let soln_day = process.argv[3];

const year = process.argv[2];

if(!year || !+year) throw new Error("!year");
if(!soln_day || !+soln_day) throw new Error("!solnName");

const solnName = "day"+soln_day;

let initialText = fs.readFileSync(
	path.join(__dirname, year, "/solutions", "_defaults", "_defaults.0.ts"),
);

const txtfile = solnName + ".txt";
const txtfile_path = path.join(__dirname, year, "solutions", solnName, txtfile);

fs.mkdirSync(path.join(__dirname, year, "solutions", solnName));
[
	solnName + ".1.ts",
	solnName + ".2.ts",
	solnName + ".3.ts",
	solnName + ".4.ts",
	solnName + ".5.ts",
].forEach((v, i) =>
	fs.writeFileSync(
		path.join(__dirname, year, "solutions", solnName, v),
		initialText,
		"utf-8",
	),
);
fs.writeFileSync(txtfile_path, "", "utf-8");

console.log("done. waiting for the time…");

const cookietext = fs.readFileSync(path.join(__dirname, "cookie.txt"));

const res_time = new Date();
res_time.setUTCSeconds(1); // buffer time
res_time.setUTCMinutes(0);
res_time.setUTCHours(5);
res_time.setUTCDate(+soln_day);
res_time.setUTCMonth(11);
res_time.setUTCFullYear(+year);
console.log(res_time.toString());

const interval = setInterval(() => {
	const wait_time = res_time.getTime() - Date.now();
	if(wait_time < 0) return clearInterval(interval);
	process.stdout.write("\r"+wait_time+"ms\x1b[K");
}, 1000);

setTimeout(async () => {
	console.log("\nWait over! Fetching…");
	const input_text = await (await (await import("node-fetch").default)("https://adventofcode.com/"+year+"/day/"+soln_day+"/input", {
		headers: {"Cookie": cookietext},
	})).text();
	fs.writeFileSync(txtfile_path, input_text, "utf-8");
	console.log("Fetched!");
}, res_time.getTime() - Date.now());