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

const [rules, yourtck, nearbytck] = input.split("\n\n").map(q => q.split("\n"));

let ruleset = [];

for(let line of rules) {
	let ranges = line.split(" ").filter(q => q.indexOf("-") > -1);
	for(let range of ranges) {
		let [start, end] = range.split("-");
		ruleset.push([+start, +end, line.split(":")[0]]);
	}
}

yourtck.shift();
nearbytck.shift();
nearbytck.unshift(yourtck[0]);

let nnum = nearbytck.map(q => q.split(",").map(w => +w));

let validtkts = [];

flp: for(let ticket of nnum) {
	for(let num of ticket) {
		let matches = false;
		ruleset.forEach(([start, end]) => {
			if(num >= start && num <= end) matches = true;
		});
		if(!matches) {
			continue flp;
		}
	}
	validtkts.push(ticket);
}

let possibles = [];

for(let ticket of validtkts) {
	let tv = [];
	for(let num of ticket) {
		let matches = [];
		ruleset.forEach(([start, end, rule]) => {
			if(num >= start && num <= end) matches.push(rule);
		});
		tv.push(matches);
	}
	tv.forEach((c, i) => {
		if(!possibles[i]) {
			possibles[i] = c;
		}else{
			let overlap = {};
			possibles[i].forEach(v => {
				if(!overlap[v]) overlap[v] = 0;
				overlap[v]++;
			})
			c.forEach(v => {
				if(!overlap[v]) overlap[v] = 0;
				overlap[v]++;
			})
			possibles[i] = Object.entries(overlap).filter(([k, v]) => v == 2).map(([k, v]) => k);
		}
	});
}

let setv = {};
let setvalues = [];
for(let i = 0; i < 1000; i++) {
	possibles.forEach((psbl, i) => {
		if(setvalues[i]) return;
		let filtered = psbl.filter(v => !setv[v]);
		possibles[i] = filtered;
		if(filtered.length == 1) {
			setvalues[i] = filtered[0];
			setv[filtered[0]] = true;
		}
	})
}

let ytk = yourtck[0].split(",").map(q => +q);

let total = 1;
Object.entries(setvalues).forEach(([idx, v]) => {
	idx =+ idx;
	if(v.startsWith("departure")) {
		total *= ytk[idx];
		print(ytk[idx]);
	}
})
print(total);

// print(setvalues.length, setvalues.filter(q => q.length == 1).length);
