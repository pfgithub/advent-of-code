/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};


const itq = input.trim().split("\n\n").map(q => q.split("\n"));

var total = 0;
for(const itm of itq) {
	const answered = {};
	for(const w of itm) {
		for(const m of [...w]) {
			if(answered[m] === undefined) answered[m] = itm.length;
			answered[m] -= 1;
		}
	}
	
	const nv = (Object.values(answered).filter(w => w === 0).length);
	console.log(itm, nv);
	total += nv;
}
console.log(total)