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

const [p1r, p2r] = input.split("\n\n").map(v => {
	const m = v.split("\n");
	m.shift();
	return m.map(w => +w);
})

const previousgames = {};

function rc(p1, p2, depth) {
	let cache = p1.join(",")+p2.join(",");
	if(previousgames[cache]) {
		// print("cached game! depth "+depth);
		return previousgames[cache];
	}
	
	let previouses = {};

	let ri = 0;
	while(p1.length > 0 && p2.length > 0) {
		let name = p1.join(",")+p2.join(",");
		if(previouses[name]) {
			// print("exit, seen before");
			break;
		}
		previouses[name] = true;
		const t1 = p1.shift()!;
		const t2 = p2.shift()!;
		if(p1.length >= t1 && p2.length >= t2) {
			const a = p1.filter((a, i) => i < t1);
			print(a.length == t1);
			const recurseres = rc(p1.filter((a, i) => i < t1), p2.filter((a, i) => i < t2), depth + 1);
			// print("recursewnr "+recurseres);
			if(recurseres === "p1") {
				p1.push(t1);
				p1.push(t2);
			}else{
				p2.push(t2);
				p2.push(t1);
			}
			continue;
		};
		if(t1 > t2) {
			p1.push(t1);
			p1.push(t2);
		}else{
			p2.push(t2);
			p2.push(t1);
		}
	}

	let winner = p2;
	if(p1.length > 0) winner = p1;

	if(depth == 0) {
		let score = 0;
		winner.forEach((card, i) => {
			score += card * (winner.length - i);
		})
		print(score);
	}

	previousgames[cache] = (winner == p1 ? "p1" : "p2");
	return previousgames[cache];
}

rc([...p1r], [...p2r], 0);