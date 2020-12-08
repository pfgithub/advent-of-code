/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};

const demo = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

const tryv = (prog) => {

let acc = 0;
let instr = 0;

const executed = [];

const instrs: {[key: string]: (a: number) => void} = {
	nop: () => {},
	acc: (v) => {
		acc += v;
	},
	jmp: (v) => {
		instr += v;
		instr -= 1;
	}
};

while(true) {
	if(instr >= prog.length) {
		console.log(acc);
		throw new Error("success "+acc);
	}
	if(executed[instr]) break;
	executed[instr] = true;
	const progv = prog[instr];
	console.log(progv);
	instrs[progv[0]](+progv[1]);
	instr += 1;
}
};
{
	
	const prog = input.split("\n").map(l => l.split(" "));
	for(let i = 0; i < prog.length; i++) {
		if(prog[i][0] === "nop") {
			prog[i][0] = "jmp";
			tryv(prog);
			prog[i][0] = "nop";
		}else if(prog[i][0] === "jmp") {
			prog[i][0] = "nop";
			tryv(prog);
			prog[i][0] = "jmp";
		}else continue;
	}
}