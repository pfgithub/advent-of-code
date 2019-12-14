/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

/*

solution concept:
loop fuel until the right thing is found

*/

let reaxin = input;

let reactions = reaxin.split("\n").map(l => {
	let [inv, out] = l.split(" => ");
	let inresrc = inv.split(", ").map(l => l.split(" "));
	return [inresrc, out.split(" ")];
});

function findTotal(incounttjnkad) {
	let total = 0;
	let process = {};
	function findDependencies(name) {
		if (name === "ORE") return [];
		let [inputs, [outcount]] = reactions.find(
			([inarr, out]) => out[1] === name,
		);
		let v = inputs.flatMap(input => {
			return [input[1], ...findDependencies(input[1])];
		});
		let o = {};
		v.forEach(m => (o[m] = m));
		return Object.keys(o);
	}
	function go() {
		let didProcessLastTick = true;
		while (didProcessLastTick) {
			let pcopy = JSON.parse(JSON.stringify(process));
			let keys = Object.keys(pcopy);
			didProcessLastTick = false;
			keys.forEach((key, i) => {
				let count = pcopy[key];
				if (count === 0) {
					return;
				}

				if (key === "ORE") {
					total += count;
					process[key] -= count;
					return;
				}
				// console.log(key);
				let [inputs, [outcount]] = reactions.find(
					([inarr, out]) => out[1] === key,
				);

				if (count % +outcount !== 0) {
					return; // can't process rn
				}
				inputs.forEach(input => {
					let [cnta, v] = input;
					if (!process[v]) process[v] = 0;
					process[v] += +cnta * (count / +outcount);
				});
				process[key] -= count;
				// req:
				didProcessLastTick = true;
			});
		}
	}
	function fixAThing() {
		let pcopy = JSON.parse(JSON.stringify(process));
		let keys = Object.keys(pcopy);
		let dependedon = {};
		keys
			.filter(k => pcopy[k] !== 0)
			.forEach(k => {
				if (!dependedon[k]) dependedon[k] = 0;
				let deps = findDependencies(k);
				deps.forEach(dep => {
					if (!dependedon[dep]) dependedon[dep] = 0;
					dependedon[dep]++;
				});
			});
		let noOverlap = Object.keys(dependedon).find(w => dependedon[w] === 0);
		// let inNeedOfFixingMost = keys
		// 	.filter(k => pcopy[k] !== 0)
		// 	.sort((a, b) => {
		// 		findDependencies(b).length - findDependencies(a).length;
		// 	});
		// find the thing that doesn't depend on anything else that we are also trying to fix
		// console.log("inof,", inNeedOfFixingMost);
		let inof = noOverlap;
		let currcount = pcopy[inof];
		let [inputs, [outcount]] = reactions.find(
			([inarr, out]) => out[1] === inof,
		);
		// console.log(currcount, outcount);
		process[inof] += outcount - (currcount % outcount);
	}
	process["FUEL"] = incounttjnkad;
	while (true) {
		go();
		// console.log(process, total);
		try {
			fixAThing();
		} catch (e) {
			break; // 10/10 code right here
		}
		// console.log(process, total);
	}
	return total;
}

let estimateLow = 1;
let estimateHigh = 2;
let reqc = 1000000000000;
while (true) {
	let totalHigh = findTotal(estimateHigh);
	if (totalHigh < reqc) {
		estimateHigh *= 2;
		estimateLow *= 2;
		continue;
	}
	let totalLow = findTotal(estimateLow);
	let estimateMed = Math.ceil((estimateHigh - estimateLow) / 2 + estimateLow);
	let totalMed = findTotal(estimateMed);
	if (totalMed > reqc && findTotal(estimateMed - 1) < reqc) {
		console.log(estimateMed - 1);
		throw "got;";
	}
	if (totalMed === reqc) {
	}
	if (totalMed < reqc) {
		estimateLow = estimateMed;
	} else {
		estimateHigh = estimateMed;
	}
	console.log(estimateLow, estimateHigh, estimateMed);
	// throw "got";
}

// now this needs to figure out what to do. there is 28 a but a has to be 30
// what if there was b and b depended on a. what if it did a first. it needs to find what depends on nothing and do that

/*
fuel:
req. 7a, 1e
7a: req. unknown
1e: req. 7a 1d
14a: req. unknown
1d: req. 7a 1c
21a: req. unknown
1c: req. 7a 1b
28a: req. unknown
1b: req. 1 ore

total so far: 1 ore, 28a


*/

// console.log(reactions);
//
// let production = {};
// function findCost(name, count) {
// 	console.log("producing", count, name);
// 	if (!production[name]) {
// 		production[name] = { req: 0, unitSize: 0 };
// 	}
// 	if (name === "ORE") {
// 		production[name].unitSize = 1;
// 		production[name].req += count;
// 		return count;
// 	}
// 	let [inputs, [outcount]] = reactions.find(([inarr, out]) => out[1] === name);
// 	production[name].req += +count;
// 	production[name].unitSize = +outcount;
// 	let totalCost = 0;
// 	inputs.forEach(input => {
// 		let cost = findCost(input[1], (+input[0] / +outcount) * +count);
// 		totalCost += +cost;
// 	});
// 	return totalCost * +count;
// }
// function balanceProduction() {
// 	// loop over all things to produce
// 	// find cost of producing the right amount
// 	// repeat until nothing is wrong
// 	let fix;
// 	while (
// 		(fix = Object.keys(production).find(
// 			k =>
// 				production[k].req % production[k].unitSize !== 0 &&
// 				k !== "ORE" &&
// 				Number.isInteger(production[k].req),
// 		))
// 	) {
// 		let countToFix =
// 			production[fix].unitSize -
// 			(production[fix].req % production[fix].unitSize);
// 		console.log(
// 			"fixing",
// 			fix,
// 			"by producing",
// 			countToFix,
// 			production[fix].req,
// 			production[fix].unitSize,
// 		);
// 		findCost(fix, countToFix);
// 	}
// }
//
// findCost("FUEL", 1);
// console.log(production);
// balanceProduction();
// console.log(production);
// console.log(production.ORE.req);

// let resourcesReqd = {};
// function findCost(name) {
// 	let found = reactions.find(([inarr, out]) => out[1] === name);
// 	// to produce 1 name, we need ... resources. add these to rreq
// 	// then go over rreq and try and produce these resources
// 	found[0].forEach(([count, name]) => {
// 		if (!resourcesReqd[name]) {
// 			resourcesReqd[name] = { reqd: 0, produced: 0 };
// 		}
// 		resourcesReqd[name].reqd += +count;
// 	});
// 	// costs will say we need 1 e and 7 a
// 	// findCost of the 7 a
// 	// will say we need 7 ore
// 	// findCost of 7 e
// 	// will say we need 7 a, 1 d
// 	// findCost 7 a
// 	// we need 14 ore
// 	// ...
// 	// findCost 1 b
// 	// will need 1 ore
// 	// go through and produce things
// 	// produce one fuel
// 	// will need 29 a
// 	// less than req
// 	// produce 29, req +1
// 	// go again
// 	// produce 1
// }
//
// console.log(findCost("FUEL"));

// function findCost(name) {
// 	if (name === "ORE") return [1, 1];
// 	let found = reactions.find(([inarr, out]) => out[1] === name);
// 	if (!found) throw "aaa " + name;
// 	let [inarr, [outcount]] = found;
// 	let total = 0;
// 	inarr.forEach(([count, name]) => {
// 		// let [cost, costCount] = findCost(name);
// 		// cost is 10, cc is 10, cpu is
// 		// let amountToProduce = Math.ceil(+count / +costCount) * costCount;
// 		// console.log(amountToProduce);
// 		// console.log(cost / costCount);
// 		// console.log(cost, costCount, amountToProduce);
// 		// total += (cost / costCount) * amountToProduce;
// 		// console.log(
// 		// 	"getting cost of",
// 		// 	count,
// 		// 	name,
// 		// 	"is",
// 		// 	(cost / costCount) * amountToProduce,
// 		// );
// 		let [cost, costCount] = findCost(name);
// 		if (!amountUsed[name]) amountUsed[name] = 0;
// 		amountUsed[name] += +count;
// 		total += (cost / costCount) * count;
// 	});
// 	return [total, outcount];
// }
//
// console.log(findCost("FUEL"));
// console.log(amountUsed);
// // loop over again? aaa this would be easy with a graph or something
