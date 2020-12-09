/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};

const sample = input.split("\n").map(q => +q);

const preamble_len = 25;

const valid_numbers: number[] = [];
const valid_cache: {[key: string]: boolean} = {};

const setValid = (a: number) => {
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

// let previnvalid = false;
while(sample.length) {
	const first = sample.shift()!;
	if(!isValid(first)) {
			throw new Error("dblinvalid: "+first);
	}
	setValid(first);
	console.log("valid ",first);
}

console.log("done");