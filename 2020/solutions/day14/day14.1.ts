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

const prog = input.split("\n");

const mem = [];
let mask = "";
for(let line of prog) {
	if(line.startsWith("mask = ")) {
		mask = [...line.replace("mask = ", "")];
	}else{
		let match = line.match(/^mem\[(\d+)\] = (\d+)$/)!;
		if(!match) error("oop");
		const num = +match[1];
		let v = (+match[2]).toString(2).padStart(36, "0");
		v = [...v].map((q, i) => mask[i] === "X" ? q : mask[i]).join("");
		mem[num] = v;
	}
}

print(parseInt(mem[8], 2));

let total = 0;

mem.forEach(v => {
	if(!v) return;
	total += parseInt(v, 2);
})

print(total);