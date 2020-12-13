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

const [earliest_depart, servicesv] = input.split("\n");
const services = servicesv.split(",").map(n => +n);

let i = -1;
print("[")
for(const bus of services) {
	i++;
	if(isNaN(bus)) continue;
	print("(t+"+i+") mod "+bus+" = 0,");
}
print("]")
