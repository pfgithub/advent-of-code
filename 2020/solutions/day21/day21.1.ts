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

const foods = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`.split("\n").map(v => {
	const [_, ingredients, allergens] = v.match(/^(.+?) \(contains (.+?)\)$/)!;
	return {ingredients: ingredients.split(" "), allergens: allergens.split(", ")};
});
print(foods);

const allergen_choices = {};

for(let {ingredients, allergens} of foods) {
	for(const allergen of allergens) {
		print(allergen, ingredients);
		if(!allergen_choices[allergen]) {
			allergen_choices[allergen] = ingredients;
		}else {
			const pv = allergen_choices[allergen] || [];
			allergen_choices[allergen] = ingredients.filter(igr => pv.includes(igr));
		}
	}
}

let nopossible = new Set(foods.map(food => food.ingredients).flat());

Object.values(allergen_choices).forEach(v => v.forEach(c => nopossible.delete(c)));

print(allergen_choices);
print(nopossible);

let total = 0;
for(let a of foods) {
	a.ingredients.forEach(b => {
		if(nopossible.has(b)) {
			total++;
		}
	})
}
print(total);