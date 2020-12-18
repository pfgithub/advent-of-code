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

const parse = (texts: string[]): bigint => {
	let total = parseAdd(texts);
	while(texts[0] == "*") {
		texts.shift();
		total *= parseAdd(texts);
	}
	return total;
}

const parseAdd = (texts: string[]): bigint => {
	let total = parseOne(texts);
	while(texts[0] == "+") {
		texts.shift();
		total += parseOne(texts);
	}
	return total;
}
const parseOne = (texts: string[]): bigint => {
	const first = texts.shift();
	if(first === "+" || first === "*" || first === undefined || first === ")") {
		error("oop");
	}
	if(first === "(") {
		const res = parse(texts);
		texts.shift();
		return res;
	}
	return BigInt(+first);
};
print(input.split("\n").map(line => parse(line.split``.filter(v => v !== " "))).reduce((t, a) => a + t, BigInt(0)));
