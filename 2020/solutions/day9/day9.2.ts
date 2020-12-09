/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};

const sample = input.split("\n").map(q => +q);

const preamble_len = 25;

const tvn: number[] = [];
const valid_numbers: number[] = [];
const valid_cache: {[key: string]: boolean} = {};

const setValid = (a: number) => {
	tvn.push(a);
	valid_numbers.push(a);
	valid_cache[a] = true;
	if(valid_numbers.length > preamble_len) {
		valid_cache[valid_numbers.shift()!] = false;
	}
}
console.log(sample);

for(let i = 0; i < preamble_len; i++) {
	setValid(sample.shift()!);
}

const isValid = (nv: number) => {
	const expctd_sum = nv;
	for(const valid_num of valid_numbers) {
		if(valid_cache[nv - valid_num]) return true;
	}
	return false;
};

const findTotal = (req_total: number): number[] | false => {
	let total = 0;
	let ti0 = 0;
	for(let i = 0; i < tvn.length; i++) {
		total += tvn[i];
		while(total > req_total) {
			total -= tvn[ti0];
			ti0 += 1;
		}
		if(total == req_total) {
			var resa = [];
			let min = Infinity;
			let max = -Infinity;
			for(let m = ti0; m <= i; m++) {
				resa.push(tvn[m]);
				min = Math.min(tvn[m], min);
				max = Math.max(tvn[m], max);
			}
			console.log("done");
			return min + max;
		}
	}
	// let contiguous = true;
	// for(let i = start; i < tvn.length; i++) {
	// 	console.log(i, tvn[i], total);
	// 	if(tvn[i] == total) return [tvn[i]];
	// 	if(tvn[i] > total) return false;
	// 	const res = findTotal(total - tvn[i], start);
	// 	if(!res) {
	// 
	// 		continue;
	// 	}
	// 	return [tvn[i], ...res];
	// }
	// throw new Error("end of loop");
}

// let previnvalid = false;
while(sample.length) {
	const first = sample.shift()!;
	if(!isValid(first)) {
		console.log("invalid: "+first);
		var req_total = first;
		const found = findTotal(req_total);
		console.log(found);
		throw new Error("dblinvalid: "+first);
	}
	setValid(first);
	console.log("valid ",first);
}

console.log("done");