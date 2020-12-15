/*
input: string, lines: string[], dblines: string[][]
copy(text: string) → clipboard
error(message: string) → thrown error
-5..mod(3) → @mod(-5, 3)
*/

// Cardinals:
// [[1,0],[-1,0],[0,1],[0,-1]]
// +Diagonals:
// [[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[-1,1],[1,-1],[1,1]]

export {};

let numbers = input.split(",").map(q => +q);

let counts = {};

let lastnum = -101489924239867;
for(let i = 1; i <= 30000000; i++) {
	let res = -101489924239867;
	if(i - 1 < numbers.length) {
		res = numbers[i - 1];
	}else{
		if(counts[lastnum].length == 1) {
			res = 0;
		}else{
			let prev = counts[lastnum];
			res = prev[1] - prev[0];
		}
	}
	if(!counts[res]) counts[res] = [];
	counts[res].push(i);
	while(counts[res].length > 2) counts[res].shift();
	if(i % 10000 == 0) print(i, res);
	lastnum = res;
}