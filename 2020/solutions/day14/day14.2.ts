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

const mem = {};
let mask = "";
let iww = -1;
for(let line of prog) {
	iww++
	print(iww);
	if(line.startsWith("mask = ")) {
		mask = [...line.replace("mask = ", "")];
	}else{
		let match = line.match(/^mem\[(\d+)\] = (\d+)$/)!;
		if(!match) error("oop");
		const num = +match[1];
		let memadr = num.toString(2).padStart(36, "0");
		memadr = [...memadr].map((q, i) => mask[i] === "0" ? q : mask[i]).join("");
		let choices = [...memadr].filter(q => q === "X");
		// print(choices);
		let adrs = [];
		for(let i = 0; i < 2 ** choices.length; i++) {
			let thischoice = [...i.toString(2).padStart(choices.length, "0")];
			// print("tx", thischoice);
			let xi = 0;
			let tca = [...memadr].map((q) => {
				if(q === "X") {
					let res = thischoice[xi];
					xi++;
					return res;
				}else return q;
			})
			adrs.push(parseInt(tca.join(""), 2));
		}
		
		let v = (+match[2]).toString(2).padStart(36, "0");
		// v = [...v].map((q, i) => mask[i] === "X" ? q : mask[i]).join("");
		adrs.map(q => mem[q] = v);
	}
}

let total = 0;

Object.entries(mem).forEach(([k, v]) => {
	print(v);
	if(!v) return;
	total += parseInt(v, 2);
})

print("T", total);