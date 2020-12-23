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

let cups = input.split("").map(v => +v);

const move = () => {
	let current = cups.shift();
	let [a, b, c] = [cups.shift(), cups.shift(), cups.shift()];
	let findv = current;
	let foundi: number;
	while(true) {
		findv -= 1;
		findv = findv.mod(10);
		foundi = cups.findIndex((q) => q == findv);
		if(foundi == -1) continue;
		break;
	}
	[a, b, c].forEach((v, i) => {
		cups.splice(foundi + i + 1, 0, v);
	})
	cups.push(current);
	print(cups.join(", "));
}

for(let i = 0; i < 100; i++) move();

print(cups.join(","));

while(cups[0] !== 1) {
	cups.push(cups.shift());
}
cups.shift();

print(cups.join(""));