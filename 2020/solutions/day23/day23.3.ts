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


type thisv = [number, thisv]
let cups: thisv[] = input.split("").map(v => [+v]) as any as thisv[];

let starti = cups.length + 1;
print(starti);
while(cups.length < 1000000) {
	cups.push([starti] as any as thisv);
	starti += 1;
}

let start = cups[0];

cups.forEach((v, i) => {
    v[1] = cups[(i + 1) % cups.length];
});

let end = cups[cups.length - 1];

const value_map: thisv[] = [];

cups.forEach(q => {
    value_map[q[0]] = q;
});

// ok no one cares about the cups array anymore

const move = () => {
	
    let current = start;
    start = start[1];

    let a = start;
    start = start[1];
    let b = start;
    start = start[1];
    let c = start;
    start = start[1];

    end[1] = start;

	let findv = current[0] - 1;
    if(findv == 0) findv = cups.length;
    if(findv == a[0] || findv == b[0] || findv == c[0]) findv -= 1;
    if(findv == 0) findv = cups.length;
    if(findv == a[0] || findv == b[0] || findv == c[0]) findv -= 1;
    if(findv == 0) findv = cups.length;
    if(findv == a[0] || findv == b[0] || findv == c[0]) findv -= 1;
    if(findv == 0) findv = cups.length;

    let found = value_map[findv];

    if(found == end) end = c;
    c[1] = found[1];
    found[1] = a;

    end[1] = current;
    current[1] = start;
	end = current;
}

for(let i = 0; i < 10000000; i++) {
    move();
}

const oneloc = value_map[1];

print(oneloc[1][0] * oneloc[1][1][0]);

