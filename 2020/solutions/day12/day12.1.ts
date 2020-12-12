/*
input: string, lines: string[], dblines: string[][]
copy(text: string) → clipboard
error(message: string) → thrown error
*/

// Cardinals:
// [[1,0],[-1,0],[0,1],[0,-1]]
// +Diagonals:
// [[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[-1,1],[1,-1],[1,1]]

export {};

const actions = `F10
N3
F7
R90
F11`.split("\n");

let x = 0;
let y = 0;

let wpx = 10;
let wpy = 1;

let diri = 90;

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};
actions.forEach(rawact => {
	let [act, ...q] = [...rawact];
	q =+ q.join("");
	
	let mb = ({
		F: [[0,1],[1,0],[0,-1],[-1,0]][diri / 90],
		E: [1,0],
		S: [0,-1],
		W: [-1,0],
		N: [0,1],
	})[act];
	if(!mb) {
		if(act == "L") {
			diri -= q;
		}
		if(act == "R") {
			diri += q;
		}
		diri = diri.mod(360);
	}else{
		x += mb[0] * q * wpx;
		y += mb[1] * q * wpy;
	}
});

print(Math.abs(x) + Math.abs(y));