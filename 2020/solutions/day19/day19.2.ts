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

let [rules, examples] = input.split("\n\n").map(q => q.split`\n`);

const rlobj = {};

rules.forEach(rule => {
	let [rulenum, items] = rule.split(": ");
	if(rulenum === "8") items = "42 | 42 8";
	if(rulenum === "11") items = "42 31 | 42 11 31";
	
	const orchoices = items.split(" | ");
	const orset = orchoices.map((orchse) => {
		const pchoices = orchse.split(" ");
		return pchoices.map(pchse => {
			if(pchse.charAt(0) == "\"") {
				return ["exact", pchse.charAt(1)];
			}else{
				return ["named", pchse];
			}
		})
	})
	rlobj[rulenum] = orset;
});

function checkAgainst(example: string, rulenme: string, depth: number): string[] {
	if(depth > 1000) return [];
	const ruleors = rlobj[rulenme];
	let matches: string[] = [];
	for(let orv of ruleors) {
		let matchingfull = [[...example]];
		for(let p of orv) {
			let nextitermatching = [];
			orlp: for(let matching of matchingfull) {
				if(p[0] === "exact") {
					const v = matching.shift();
					if(p[1] === v) {
						nextitermatching.push([...matching]);
					} else {
						continue orlp;
					}
				}else{
					let thism = checkAgainst(matching.join(""), p[1], depth + 1);
					if(thism.length === 0) continue orlp;
					for(let match of thism) {
						nextitermatching.push([...match]);
					}
				}
			}
			matchingfull = nextitermatching;
		}
		matches.push(...matchingfull.map(v => v.join("")));
	}
	return matches;
}

let matches = 0;
examples.forEach(example => {
	// print(example);
	
	const res = checkAgainst(example, "0", 0);
	if(res.length && res[0].length === 0) matches ++;
});
print(matches);