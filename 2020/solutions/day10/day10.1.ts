/*
input: string, lines: string[], dblines: string[][]
copy(text: string) → clipboard
error(message: string) → thrown error
*/

export {};

let demo = ``.split("\n");

let tryv = (itxt: string) => {
	let prog = itxt.split("\n").map(l => l.split(" "));

	let acc = 0;
	let instr = 0;

	let instrs: {[key: string]: (...a: number[]) => void} = {
		nop: () => {},
		acc: (i, v) => {
			acc += v;
		},
		jmp: (i, v) => {
			instr += v - 1;
		}
	};

	while(true) {
		if(instr >= prog.length) {
			console.log(acc);
			throw new Error("success "+acc);
		}
		let progv = prog[instr];
		console.log(progv);
		instrs[progv[0]](...progv.map(q => +q));
		instr += 1;
	}
};