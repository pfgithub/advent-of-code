/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};

var maxuu = 0;

var used = [];

for(let eg of lines) {
	var min = 0;
	var max = 127;
	var left = 0;
	var right = 7;

	for(var char of [...eg]) {
		if(char === "F") {
			max = Math.floor((max - min) / 2) + min;
		}else if(char === "B") {
			min = Math.ceil((max - min) / 2) + min;
		}else if(char === "L") {
			right = Math.floor((right - left) / 2) + left;
		}else if(char === "R") {
			left = Math.ceil((right - left) / 2) + left;
		}
	}
	if(min !== max) throw new Error('bad');
	if(left !== right) throw new Error("bad");

	var seatid = min * 8 + left;

	if(seatid > maxuu) maxuu = seatid;
	
	used[seatid] = true;
}
for(let i = 0; i < 1023; i++) {
	if(used[i-1] && used[i +1] && !used[i]) {
		console.log(i);
	}
}