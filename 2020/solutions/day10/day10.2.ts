/*
input: string, lines: string[], dblines: string[][]
copy(text: string) → clipboard
error(message: string) → thrown error
*/

export {};

const aprs = input.split("\n").map(l => +l).sort();

const admax = aprs.reduce((t, a) => Math.max(a, t), -Infinity);
aprs.push(admax + 3);

const charger = 0;


const fits = (ap, expct) => {
	return ap - 3 == expct || ap - 1 == expct || ap - 2 == expct};

var j1 = 0;
var j3 = 0;
var used = {};

const findfor = (fit) => {
	let chains = [];
	for(const ap of aprs) {
		if(fits(ap, fit)) {
			if(ap - fit == 1) j1++;
			if(ap - fit == 3) j3++;
			const founds = findfor(ap);
			chains.push([ap, ...founds]);
			break;
		}
	}
	let min = -Infinity;
	let minc = [];
	for(let chain of chains) {
		if(chain.length > min) {
			minc = chain;
			min = chain.length;
		}
	}
	return minc;
};

const result = findfor(0);

var dif1 = 0;
var dif3 = 0;
result.forEach((item, i) => {
	if(!result[i-1]) result[i-1] = 0;
	const diff = result[i] - result[i-1];
	if(diff == 1) dif1++;
	if(diff == 3) dif3++;
});

console.log(dif1, dif3);