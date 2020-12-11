/*
input: string, lines: string[], dblines: string[][]
copy(text: string) → clipboard
error(message: string) → thrown error
*/

export {};

let layout = input.split("\n").map(q => [...q]);

const at = (y,x) => layout[y] ? (layout[y][x] || "!") : "!";

const apply = () => {
	let cl = layout;
	let nl = [...layout.map(q => [...q])];
	for(let y = 0; y < nl.length; y++) {
		for(let x = 0; x < nl[y].length; x++) {
			if(cl[y][x] === "L") {
				let total = 0;
				[[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([ay, ax]) => {
					for(let i = 1; true; i++) {
						let by = ay * i;
						let bx = ax * i;
						let ats = at(y+by, x+bx);
						if(ats === "#") {
							total += 1;
						}
						if(ats === ".") {
						}else break;
					}
				})
				if(total == 0) {
					nl[y][x] = "#";
				}
			}else if(cl[y][x] == "#") {
				let total = 0;
				[[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([ay, ax]) => {
					for(let i = 1; true; i++) {
						let by = ay * i;
						let bx = ax * i;
						let ats = at(y+by, x+bx);
						if(ats === "#") {
							total += 1;
						}
						if(ats === ".") {
						}else break;
					}
				})
				if(total >= 5) {
					nl[y][x] = "L";
				}
			}
		}
	}
	layout = nl;
};
for(let i = 0; i < 1000; i++) {
	apply();
}
apply();
apply();
apply();
print(layout.map(l => l.join``).join("\n"));

let total = 0;
layout.flat().forEach(v => {
	if(v == "#") total += 1;
});
print(total);