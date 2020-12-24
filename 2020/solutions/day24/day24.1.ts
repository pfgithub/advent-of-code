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

const instrs = input.split("\n");

let settiles = {};

//   0 2 4
// 0 o o o o o
//    o o o o o
//   o o o o o

for(let line of instrs) {
	let x = 0;
	let y = 0;
	let linev = [...line];
	while(linev.length) {
		let c0 = linev.shift()!;
		if(c0 == "s") {
			let c1 = linev.shift()!;
			if(c1 == "e") {
				// down and right
				x += 1;
				y += 1;
			}else if(c1 == "w") {
				// down and left
				x -= 1;
				y += 1;
			}
		}else if(c0 == "w") {
			x -= 2;
		}else if(c0 == "e") {
			x += 2;
		}else if(c0 == "n") {
			let c1 = linev.shift()!;
			if(c1 == "e") {
				x += 1;
				y -= 1;
			}else if(c1 == "w") {
				x -= 1;
				y -= 1;
			}
		}
	}
	const resp = `${x},${y}`;
	if(settiles[resp] === undefined) settiles[resp] = false;
	settiles[resp] =! settiles[resp];
}

let finalc = 0;
Object.entries(settiles).forEach(([a, b]) => {
	if(b) finalc ++;
})

print(finalc);