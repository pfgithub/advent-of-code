/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

var valid = 0;
for(const line of lines) {
	let [l, c, r] = line.split(" ");
	c = c.split(":").join("");
	let [v, w] = l.split("-").map(q => +q);
	const m = [...r];
	const ax = m[v-1] === c;
	const bx = m[w-1] === c;
	if((ax && !bx) || (bx && !ax)) {
		print(l, c, r, ax, bx, m[v+1], m[w+1]);
		valid += 1;
	}
}
print(valid);