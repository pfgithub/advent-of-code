/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

let moons = [];

// let scan = input;
let scan = input;

scan.split("\n").forEach(w => {
	let [, x, y, z] = w.match(/<x=([\-0-9]+), y=([\-0-9]+), z=([\-0-9]+)>/);
	moons.push({ x: +x, y: +y, z: +z, dx: 0, dy: 0, dz: 0 });
});

function getPotKin(moon) {
	let pot = Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
	let kin = Math.abs(moon.dx) + Math.abs(moon.dy) + Math.abs(moon.dz);
	return {
		pot,
		kin,
		tot: pot * kin,
	};
}

let prevMatches = {};

let plog = 0;

let iss = 0;
function step() {
	// apply gravity
	moons.forEach(a => {
		moons.forEach(b => {
			if (a === b) return;
			if (a.x < b.x) {
				a.dx += 1;
				b.dx -= 1;
			}
			if (a.y < b.y) {
				a.dy += 1;
				b.dy -= 1;
			}
			if (a.z < b.z) {
				a.dz += 1;
				b.dz -= 1;
			}
		});
	});
	// apply velocity
	moons.forEach(moon => {
		moon.x += moon.dx;
		moon.y += moon.dy;
		moon.z += moon.dz;
	});
	if (prevMatches[JSON.stringify(moons)]) {
		throw iss - 1;
	}
	prevMatches[JSON.stringify(moons)] = iss;
	iss++;
	if (new Date().getTime() > plog + 100) {
		plog = new Date().getTime();
		process.stdout.write(iss + "\r");
	}
}

console.log(moons);
for (let i = 0; i < 1000; i++) step();
console.log(moons);
console.log(moons.reduce((t, a) => t + getPotKin(a).tot, 0));
