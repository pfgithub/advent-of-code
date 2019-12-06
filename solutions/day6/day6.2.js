/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

let orbits = {};

// c orbits b

let vin = input;

// from san and you go to the highest point we both orbit

vin.split("\n").map(desc => {
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

// find you

let orbitCounts = {};

function markOrbits(planet, startIndex = 0) {
	let orbitsa = orbits[planet] || [];
	// go up the tree marking
	console.log(orbitCounts);
	if (orbitCounts[planet]) {
		throw new Error(
			"already encountered " + (orbitCounts[planet] + startIndex),
		);
	}
	orbitCounts[planet] = startIndex;
	orbitsa.forEach(orbit => markOrbits(orbit, startIndex + 1));
}

markOrbits("YOU", -1);
markOrbits("SAN", -1);

console.log(countOrbits("D"));

output = totalOrbits;
