/*
declare let input: string;
declare let output: any;
declare function copy(text: string): text;
declare function print(text: string): undefined;
*/

export {};

var rules = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;
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
	console.log(holdmap[container]);
}

const contains_gold = new Set();
contains_gold.add(expected_bag);
for(var i = 0; i < 10000; i++) {
	for(const [outbag, inbags] of Object.entries(holdmap)) {
		if(inbags.filter(q => contains_gold.has(q[1])).length) {
			contains_gold.add(outbag);
		}
	}
}

console.log([...contains_gold]);
console.log([...contains_gold].length - 1);