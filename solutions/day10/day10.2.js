/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

let amin = input;
let asteroidmap = amin.split("\n").map(l => l.split(""));
let resmap = amin.split("\n").map(l => l.split(""));

function gcd_two_numbers(x, y) {
	if (typeof x !== "number" || typeof y !== "number") return false;
	x = Math.abs(x);
	y = Math.abs(y);
	while (y) {
		var t = y;
		y = x % y;
		x = t;
	}
	return x;
}

function getAngle(x1, y1, x2, y2) {
	var angleRadians = (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI;
	if (angleRadians < 0) angleRadians += 360;
	angleRadians -= 90;
	if (angleRadians < 0) angleRadians += 360;
	console.log(x1, x2, y1, y2, angleRadians);
	return angleRadians;
}

function checkLineOfSight(x1, y1, x2, y2) {
	if (asteroidmap[y2][x2] !== "#") return false;
	if (asteroidmap[y1][x1] !== "#") return false;
	if (y2 === y1 && x2 === x1) return false;
	let dy = y2 - y1; // 4
	let dx = x2 - x1; // 2
	if (dx === dy && dy === 0) {
	} else {
		let gcd = gcd_two_numbers(dy, dx);
		dy /= gcd;
		dx /= gcd;
	}
	let x = x1 + dx;
	let y = y1 + dy;
	let ibtcount = 0;
	while (asteroidmap[y] && asteroidmap[y][x]) {
		if (asteroidmap[y][x] === "#") {
			if (y === y2 && x === x2) {
				return ibtcount;
			}
			ibtcount++;
			return false;
		}
		y += dy;
		x += dx;
	}
}

let maxCount = 0;
let y = 31;
let x = 25; // 329 25 31

let count = 0;
let allSlopes = []; // [angle, numInBetween, x, y]
for (let y2 = 0; y2 < asteroidmap.length; y2++) {
	for (let x2 = 0; x2 < asteroidmap[0].length; x2++) {
		let los = checkLineOfSight(x, y, x2, y2);
		if (los === false) continue;
		allSlopes.push([getAngle(x, y, x2, y2), los, x2, y2]);
	}
}
allSlopes.sort((a, b) => (a[0] - b[0] === 0 ? a[1] - b[1] : a[0] - b[0]));
console.log(allSlopes[199]);

// resmap[y][x] = count;
// maxCount = Math.max(count, maxCount);
//
// console.log(maxCount);
