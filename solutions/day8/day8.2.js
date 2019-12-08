/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

let w = 25;
let h = 6;
let img = input.split("").map(l => +l);

let zcount = Infinity;
let zi = -1;

let finalimage = [];

let setfi = (x, y, v) => {
	if (!finalimage[y]) finalimage[y] = new Array(w).fill(5);
	finalimage[y][x] = v;
};

for (let l = 100; l >= 0; l--) {
	for (let x = 0; x < w; x++) {
		for (let y = 0; y < h; y++) {
			let imgv = img[x + y * w + l * w * h];
			if (imgv === undefined) break;
			if (imgv === 2) continue;
			setfi(x, y, imgv);
		}
	}
}
console.log(
	finalimage.map(q => q.map(r => (r ? "#" : " ")).join("")).join("\n"),
);
