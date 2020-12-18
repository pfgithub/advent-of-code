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

const parse = (texts: string[]) => {
	let op = "";
	let value = BigInt(0);
	while(texts.length) {
		let text = texts.shift()!;
		let thisnum = undefined;
		let breaknext = false;
		
		if(text == "(") {
			thisnum = parse(texts);
		}else if(text == ")") {
			return value;
		}else if(+text) {
			thisnum = BigInt(+text);
		}else{
			op = text;
			continue;
		}
		
		let sv = value;
		if(!op) value = BigInt(thisnum);
		if(op == "+") value = value + thisnum;
		if(op == "*") value = value * thisnum;
		print(sv, op, thisnum, "=", value, "(", text, ")");
		
		if(breaknext) break;
	}
	return value;
}
print(input.split("\n").map(line => parse(line.split``.filter(v => v !== " "))).reduce((t, a) => a + t, BigInt(0)));
