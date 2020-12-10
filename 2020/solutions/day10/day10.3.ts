/*
input: string, lines: string[], dblines: string[][]
copy(text: string) → clipboard
error(message: string) → thrown error
*/

export {};

const aprs = input.split("\n").map(l => +l).sort((a, b) => +a - +b);

const admax = aprs.reduce((t, a) => Math.max(a, t), -Infinity);
aprs.push(admax + 3);

const charger = 0;


const fits = (ap, expct) => {
	return ap - 3 == expct || ap - 1 == expct || ap - 2 == expct};

var j1 = 0;
var j3 = 0;
var used = {};

aprs.unshift(0);
print(aprs);

var objs = 0;
var cbjs = 0;

var total = 0;

let adapterchoices = {};
adapterchoices[0] = 1;

aprs.forEach((item, i) => {
	if(item == 0) return;
	const next = [];
	for(let q = i - 4; q <= i - 1; q++) {
		if(q < 0) continue;
		const tv = aprs[q];
		// print(item, tv);
		if(tv >= item - 3) next.push(aprs[q]);
	}
	let pastchoices = 0;
	for(const v of next) {
		pastchoices += adapterchoices[v] || 0;
	}
	print(item, next, pastchoices);
	adapterchoices[item] = pastchoices;
});