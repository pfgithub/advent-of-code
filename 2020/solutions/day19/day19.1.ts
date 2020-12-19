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
	const [rulenum, items] = rule.split(": ");
	
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

function checkAgainst(example: string, rulenme: string): string[] {
	const ruleors = rlobj[rulenme];
	let matches: string[] = [];
	orlp: for(let orv of ruleors) {
		let matching = [...example];
		for(let p of orv) {
			if(p[0] === "exact") {
				const v = matching.shift();
				if(p[1] === v) {} else {
					continue orlp;
				}
			}else{
				let matches = checkAgainst(matching.join(""), p[1]);
				if(matches.length === 0) continue orlp;
				matching = [...matches[0]];
			}
		}
		matches.push(matching.join(""));
	}
	return matches;
}

let matches = 0;
examples.forEach(example => {
	// print(example);
	
	const res = checkAgainst(example, "0");
	if(res.length && res[0].length === 0) matches ++;
});
print(matches);