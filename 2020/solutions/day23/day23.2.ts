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

// 389125467
// 28915467 … 3
// 5467 … 891 3 2
// … 891 3 467 2 5

let cups = "389125467".split("").map(v => +v);

let starti = cups.length + 1;
print(starti);
while(cups.length < 1000000) {
	cups.push(starti);
	starti += 1;
}

// 10,000,000 times:
// take four from the start
// find the number either 1-, 2-, 3-, or 4- the first one taken, depending on the next three
// insert the three after that
// insert the first at the end
// very fast

// so 

print(cups);
error("bye");

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
	// print(cups.join(", "));
}

for(let i = 0; i < 10000000; i++) move();

print(cups.join(","));

while(cups[0] !== 1) {
	cups.push(cups.shift());
}
cups.shift();

print(cups.shift(), cups.shift());