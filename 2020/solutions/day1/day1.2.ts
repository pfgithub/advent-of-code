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
		for(const c of items) {
			if(a == b) continue;
			if(b == c) continue;
			if(a == c) continue;
			if(a + b + c == 2020) print(a * b * c);
		}
	}
}