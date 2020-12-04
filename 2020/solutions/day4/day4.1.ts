/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};

const results = input.split("\n\n").filter(l => {
	const items = l.split("\n").join(" ").split(" ");
	var reqfld = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
	var valid = true;
	for(const item of items) {
		const [a, b] = item.split(":");
		reqfld = reqfld.filter(q => a !== q);
		const v: {[key: string]: () => boolean} = ({
			byr: () => !!b.match(/^\d\d\d\d$/) && (+b >= 1920) && (+b <= 2002),
			iyr: () => !!b.match(/^\d\d\d\d$/) && (+b >= 2010) && (+b <= 2020),
			eyr: () => !!b.match(/^\d\d\d\d$/) && (+b >= 2020) && (+b <= 2030),
			hgt: () => {
				const cm = b.match(/^(\d+)cm$/);
				if(cm) {
					const mq = +cm[1];
					if(mq >= 150 && mq <= 193) return true;
					return false;
				}
				const mq = b.match(/^(\d+)in$/);
				console.log(mq);
				if(mq) {
					const rw = +mq[1];
					if(rw >= 59 && rw <= 76) return true;
					return false;
				}
				return false;
			},
			hcl: () => !!b.match(/^#[0-9a-f]{6}$/),
			ecl: () => !!({amb: true, blu: true, brn: true, gry: true, grn: true, hzl: true, oth: true})[b as any],
			pid: () => !!b.match(/^\d{9}$/),
			cid: () => true,
		});
		if(v[a]) if(!v[a]()) {
			console.log("invalid", a, b);
			valid = false;
		}
	}
	console.log(reqfld);
	if(!valid) return false;
	if(reqfld.length === 0) return true;
	return false;
});
console.log(results.length);