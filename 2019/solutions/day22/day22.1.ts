export {};

let stack: number[] = [];
// for(let i = 0; i < 10; i++) stack.push(i);
for(let i = 0; i < 10; i++) stack.push(i);

const demo = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`.split("\n");
lines = `deal with increment 9`.split("\n");

for(const line of lines) {
	if(line == "deal into new stack") {
		stack = stack.reverse();
	}else if(line.startsWith("cut ")) {
		let [a, b] = line.split(" ");
		let ncards =+ b;
		if(ncards > 0) {
			const taken = stack.splice(0, ncards);
			stack.push(...taken);
		} else {
			const taken = stack.splice(stack.length + ncards);
			stack.unshift(...taken);
		}
	}else if(line.startsWith("deal with increment ")) {
		let [, , , a] = line.split(" ");
		const increment =+ a;
		var ns = [];
		for(var i = 0; i < stack.length; i++) {
			ns[(i * increment) % stack.length] = stack[i];
		}
		stack = ns;
	}else{
		console.log(line);
		break;
	}
}
// console.log(stack.indexOf(2019));
// console.log(stack[2019]);
console.log(stack.join(" "));