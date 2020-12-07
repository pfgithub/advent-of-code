/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};

var rules = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;
rules = input;

const expected_bag = "shiny gold";

const holdmap: {[key: string]: [number, string][]} = {};

for(const rule of rules.split("\n")) {
	const [_, container, hold] = rule.match(/^([a-z]+ [a-z]+) bags contain (.*)$/)!;
	
	holdmap[container] = hold.split(", ").map(w => {
		if(w.startsWith("no ")) return [];
		const res = w.match(/^(\d+) ([a-z]+ [a-z]+) /)!;
		return [+res[1], res[2]];
	}).filter(q => q.length);
	// console.log(holdmap[container]);
}

var count = 0;
function addCount(bagname) {
	const baginfo = holdmap[bagname];
	console.log(bagname, baginfo);
	var rescount = 0;
	baginfo.forEach(v => {
		rescount += v[0] + v[0] * addCount(v[1]);
	})
	return rescount;
}
count = addCount(expected_bag);
console.log(count);