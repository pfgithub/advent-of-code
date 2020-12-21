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

const foods = input.split("\n").map(v => {
	const [_, ingredients, allergens] = v.match(/^(.+?) \(contains (.+?)\)$/)!;
	return {ingredients: ingredients.split(" "), allergens: allergens.split(", ")};
});
print(foods);

const acs = {};

for(let {ingredients, allergens} of foods) {
	for(const allergen of allergens) {
		print(allergen, ingredients);
		if(!acs[allergen]) {
			acs[allergen] = ingredients;
		}else {
			const pv = acs[allergen] || [];
			acs[allergen] = ingredients.filter(igr => pv.includes(igr));
		}
	}
}

let nopossible = new Set(foods.map(food => food.ingredients).flat());

Object.values(acs).forEach(v => v.forEach(c => nopossible.delete(c)));

print(acs);

let finals = {};

while(true) {
	for(const [k, v] of Object.entries(acs)) {
		acs[k] = v.filter(q => !finals[q]);
	}
	let minv = Object.entries(acs).find(([k, v]) => v.length == 1);
	if(!minv) break;
	print("min", minv);
	finals[minv[1][0]] = minv[0];
	delete acs[minv[0]];
}
print(finals, acs);

const sorted = Object.entries(finals).sort(([di, all], [di2, all2]) => {
	return (all as string).localeCompare(all2 as string);
})
print(sorted.map(q => q[0]).join(","));

// ?? how do we know it's not mxmxvkd contains fish and sqjhc soy
// oh dumb lol

// print(nopossible);
// 
// let total = 0;
// for(let a of foods) {
// 	a.ingredients.forEach(b => {
// 		if(nopossible.has(b)) {
// 			total++;
// 		}
// 	})
// }
// print(total);