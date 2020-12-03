/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};

const map = lines.map(l => [...l]);

const at = (x, y) => map[y][x % map[y].length];

let x = 0;
let y = 0;
let total = 0;
while(true) {
	x += 3;
	y += 1;
	if(at(x, y) == "#") total += 1;
	console.log(total);
}