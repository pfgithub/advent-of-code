/*
declare let input: string;
declare let output: any;
copy(text: string): text
print(text: string): undefined
*/

// can I loop 497970 times?
// why not

function valid(password) {
	let strq = ("" + password).split("");
	let prev = undefined;
	let hasSingleDouble = false;
	let acdm = 0;
	for (let i = 1; i < 6; i++) {
		let curr = +strq[i];
		let prev = +strq[i - 1];
		if (prev > curr) {
			return false;
		}
		if (curr === prev) acdm++;
		else {
			if (acdm === 1) hasSingleDouble = true;
			acdm = 0;
		}
	}
	return hasSingleDouble || acdm === 1;
}

console.log(valid(122233));

let countSuccess = 0;
let [minV, maxV] = input.split("-");
for (let i = +minV; i <= +maxV; i++) {
	if (valid(i)) countSuccess++;
}
output = countSuccess;
