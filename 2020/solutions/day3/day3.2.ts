/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

const map = lines.map(l => [...l]);

const at = (x, y) => map[y][x % map[y].length];

export {};

const check = (a, b) => {
let x = 0;
let y = 0;
let total = 0;
while(true) {
	x += a;
	y += b;
	if(y >= map.length) break;
	if(at(x, y) == "#") total += 1;
}
return total;
}

console.log(check(3, 1) * check(1, 1) * check(5, 1) * check(7, 1) * check(1, 2));