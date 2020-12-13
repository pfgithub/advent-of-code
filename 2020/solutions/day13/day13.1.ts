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
const services = servicesv.split(",");

let minb = [Infinity, 0];
for(const bus of services) {
	if(bus === "x") continue;
	const b =+ bus;
	let dt = +earliest_depart % b;
	let sdt = +earliest_depart;
	let q = 0;
	while(dt > 0) {
		sdt += 1;
		dt = +sdt % b;
		q += 1;
	}
	print(dt, sdt);
	if(q < minb[0]) {
		minb = [q, b];
	}
}
print(minb[0] * minb[1]);