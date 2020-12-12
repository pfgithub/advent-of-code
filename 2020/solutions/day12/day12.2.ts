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

const actions = input.split("\n");

let x = 0;
let y = 0;

let wpx = 10;
let wpy = 1;

// [[0,1],[1,0],[0,-1],[-1,0]][diri / 90]
let diri = 1;

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};
function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [Math.round(nx), Math.round(ny)];
}
actions.forEach(rawact => {
	let [act, ...scale] = [...rawact];
	scale =+ scale.join("");
	
	let wpmove = ({
		E: [1,0],
		S: [0,-1],
		W: [-1,0],
		N: [0,1],
	})[act];
	if(wpmove) {
		wpx += wpmove[0] * scale;
		wpy += wpmove[1] * scale;
	}else if(act == "L"){
        const start = diri;
        diri -= scale;
        const end = diri;
        [wpx, wpy] = rotate(0, 0, wpx, wpy, end - start);
	}else if(act == "R"){
        const start = diri;
        diri += scale;
        const end = diri;
        [wpx, wpy] = rotate(0, 0, wpx, wpy, end - start);
        print(wpx, wpy);
	}else if(act == "F"){
		x += wpx * scale;
		y += wpy * scale;
	}else error("oop");
	
});

print(Math.abs(x) + Math.abs(y));