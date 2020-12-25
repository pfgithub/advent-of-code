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

const [card_pkey, door_pkey] = input.split("\n").map(v => +v);

function check(loop_size, subject) {
let value = 1;

for(let i = 0; i < loop_size; i++) {
	value *= subject;
	value %= 20201227;
}
// let value = (BigInt(subject) ** BigInt(loop_size)) % BigInt(20201227);

return value;
}

// let lp_sz = 0;
// let lp_sz2 = 0;
// for(let i = 0; i < 200000; i++) {
// 	for(let j = 7; j < 8; j++) {
// 		const v = check(i, j);
// 		if(v == card_pkey) {
// 			lp_sz = i;
// 		}else if(v == door_pkey){
// 			lp_sz2 = i;
// 		}
// 	}
// }

// print("lp sz:",lp_sz, lp_sz2);

print(check(11570336, 19241437)); // 15767163
print(check(8808305, 17346587)); // 12181021

print(check(8808305, 7) == 19241437); // 19241437 right
print(check(11570336, 7) == 17346587); // 19241437 right

// solve mod(7^l,20201227)=19241437
// solve mod(7^l,20201227)=17346587

// ???

// 11570337