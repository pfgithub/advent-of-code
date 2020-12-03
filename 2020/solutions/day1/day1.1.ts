/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};

const items = input.split("\n").filter(l => l).map(q => +q);

for(const a of items) {
	for(const b of items) {
		if(a == b) continue;
		if(a + b == 2020) print(a * b);
	}
}