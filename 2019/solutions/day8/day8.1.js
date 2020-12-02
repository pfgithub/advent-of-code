/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

let w = 25;
let h = 6;
let img = input.split("");

let layers = [""];
let x = 0;
let y = 0;
img.forEach(v => {
	x++;
	if (x > w) {
		x = 1;
		y++;
	}
	if (y >= h) {
		layers.push("");
		y = 0;
	}
	layers[layers.length - 1] += v;
});

let zcount = Infinity;
let zi = -1;

layers.forEach((layer, li) => {
	let zcountq = layer.split("0").length - 1;
	if (zcountq < zcount) {
		zcount = zcountq;
		zi = li;
	}
});

console.log(zcount, zi);

let l = layers[zi];
console.log((l.split("1").length - 1) * (l.split("2").length - 1));
