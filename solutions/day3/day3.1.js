/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/
let wireGrid = [];
function get([x, y], v) {
	if (!wireGrid[y]) wireGrid[y] = new Array(200).fill(" ");
	return wireGrid[y][x];
}
function set([x, y], v) {
	if (!wireGrid[y]) wireGrid[y] = new Array(200).fill(" ");
	wireGrid[y][x] = v;
}
let startPos = [1, 1];
let [sx, sy] = startPos;
let inv = input.split("\n");
let crossMarks = [];
inv.forEach((wire, wireIndex) => {
	let [x, y] = startPos;
	wire.split`,`.forEach(segment => {
		let dir = segment.charAt(0);
		let number = +segment.substr(1);
		let q = {
			R: [1, 0],
			L: [-1, 0],
			U: [0, 1],
			D: [0, -1],
		};
		let mv = q[dir];
		set([x, y], "+");
		for (let i = 0; i < number; i++) {
			[x, y] = [x + mv[0], y + mv[1]];
			let gv = get([x, y]);
			let qrwkjlnfdas = false;
			let dw = dir === "R" || dir === "L" ? "-" : "|";
			let dw2 = "" + (wireIndex + 1);
			if (gv && gv.trim() && gv !== dw2) {
				crossMarks.push([x, y]);
				qrwkjlnfdas = true;
			}
			set([x, y], dw2);
			if (qrwkjlnfdas) {
				set([x, y], "X");
			}
		}
	});
});
set([sx, sy], "O");
// console.log(wireGrid.join("\n"));
console.log(crossMarks);

let lowestDistance = Infinity;
crossMarks.forEach(([x, y]) => {
	lowestDistance = Math.min(
		lowestDistance,
		Math.abs(x - sx) + Math.abs(y - sy),
	);
	console.log([x, y], Math.abs(x - sx) + Math.abs(y - sy), get([x, y]));
});

output = lowestDistance;
