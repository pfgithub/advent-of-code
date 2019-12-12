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

let first = [];

scan.split("\n").forEach(w => {
	let [, x, y, z] = w.match(/<x=([\-0-9]+), y=([\-0-9]+), z=([\-0-9]+)>/);
	first.push({ x: +x, y: +y, z: +z, dx: 0, dy: 0, dz: 0 });
});

let plog = 0;

let isFirst = false;
let iss = 0;
let xmin = 0;
let ymin = 0;
let zmin = 0;
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
	// if (prevMatches[JSON.stringify(moons)]) {
	// 	throw iss - 1;
	// }
	let vx = moons.every((m, i) => m.x === first[i].x && m.dx === first[i].dx);
	if (vx && !xmin) xmin = iss + 1;
	let vy = moons.every((m, i) => m.y === first[i].y && m.dy === first[i].dy);
	if (vy && !ymin) ymin = iss + 1;
	let vz = moons.every((m, i) => m.z === first[i].z && m.dz === first[i].dz);
	if (vz && !zmin) zmin = iss + 1;
	if (xmin && ymin && zmin) {
		throw "found " + [xmin, ymin, zmin].join();
	}
	// if (!isFirst) prevMatches[JSON.stringify(moons)] = iss;
	// isFirst = true;
	iss++;
	if (new Date().getTime() > plog + 100) {
		plog = new Date().getTime();
		process.stdout.write(iss + "\r");
	}
}

console.log(moons);
while (true) step();
console.log(moons);
console.log(moons.reduce((t, a) => t + getPotKin(a).tot, 0));

/*
//    1006232
// 4686774924
*/
