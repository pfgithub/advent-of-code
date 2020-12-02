/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

let orbits = {};

// c orbits b

input.split("\n").map(desc => {
	let [a, b] = desc.split`)`;
	if (!orbits[b]) orbits[b] = [];
	orbits[b].push(a);
});

let totalOrbits = 0;

function countOrbits(planet) {
	let orbitsa = orbits[planet] || [];
	let fres = orbitsa.length;
	orbitsa.forEach(orbit => {
		// count indirect orbits
		fres += countOrbits(orbit);
	});
	return fres;
}

Object.keys(orbits).forEach(planet => {
	totalOrbits += countOrbits(planet);
});

console.log(countOrbits("D"));

output = totalOrbits;

/*

COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L

*/
