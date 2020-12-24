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

const instrs = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`.split("\n");

let settiles = {};

//   0 2 4
// 0 o o o o o
//    o o o o o
//   o o o o o

for(let line of instrs) {
	let x = 0;
	let y = 0;
	let linev = [...line];
	while(linev.length) {
		let c0 = linev.shift()!;
		if(c0 == "s") {
			let c1 = linev.shift()!;
			if(c1 == "e") {
				// down and right
				x += 1;
				y += 1;
			}else if(c1 == "w") {
				// down and left
				x -= 1;
				y += 1;
			}
		}else if(c0 == "w") {
			x -= 2;
		}else if(c0 == "e") {
			x += 2;
		}else if(c0 == "n") {
			let c1 = linev.shift()!;
			if(c1 == "e") {
				x += 1;
				y -= 1;
			}else if(c1 == "w") {
				x -= 1;
				y -= 1;
			}
		}
	}
	const resp = `${x},${y}`;
	if(settiles[resp] === undefined) settiles[resp] = false;
	settiles[resp] =! settiles[resp];
}

function cleanup() {
	for(let [key, value] of Object.entries(settiles)) {
		if(!value) delete settiles[key];
	}
}

function applyeven() {
	let newup = {};
	cleanup();
	
	const dotile = (x, y) => {
		let hasv = (x, y) => !!settiles[`${x},${y}`];
		let count = 0;
		count +=+ hasv(x + 2, y);
		count +=+ hasv(x - 2, y);
		count +=+ hasv(x + 1, y + 1);
		count +=+ hasv(x + 1, y - 1);
		count +=+ hasv(x - 1, y + 1);
		count +=+ hasv(x - 1, y - 1);
		
		// true = black
		// false = white
		// count = number of black tiles
		
		let thist = hasv(x, y);
		
		print("the tile at ",x,y," has",count," surrounding it and is",thist);
		
		if(thist == true) { // black
			if(count > 2 || count == 0) {
				// white
				newup[[x, y].join(",")] = "white";
			}else{
				// black
			}
		}else{
			if(count == 2) {
				// black;
			}else{
				newup[[x, y].join(",")] = "white;"
			}
		}
	}
	for(let [key, value] of Object.entries(settiles)) {
		let [x, y] = key.split(",").map(v => +v);
		dotile(x + 2, y); dotile(x - 2, y); dotile(x + 1, y + 1);
		dotile(x + 1, y - 1);
		dotile(x - 1, y + 1); dotile(x - 1, y - 1); dotile(x, y);
	}
	// print(settiles, newup);
	settiles = newup;
}

function applyodd(){
	// unknown tiles are black
	
	let newup = {};
	cleanup();
	
	const dotile = (x, y) => {
		let hasv = (x, y) => !!settiles[`${x},${y}`];
		let count = 0;
		count +=+! hasv(x + 2, y);
		count +=+! hasv(x - 2, y);
		count +=+! hasv(x + 1, y + 1);
		count +=+! hasv(x + 1, y - 1);
		count +=+! hasv(x - 1, y + 1);
		count +=+! hasv(x - 1, y - 1);
		// true = white
		// false = black
		// count = number of black tiles
		
		let thist = hasv(x, y);
		// print("tile ",x,y,", is",thist,"has",count,"black tiles surrounding");
		
		if(thist == false) {
			// this tile is black
			if(count > 2 || count == 0) {
				// change to white
			}else{
				// keep black
				newup[[x, y].join(",")] = "black";
			}
		}else{
			// this tile is white
			// print("this tile is white and count is",count);
			if(count == 2) {
				// change to black
				newup[[x, y].join(",")] = "black;"
			}else{
				// keep white
			}
			// print("newup is now", newup);
		}
	}
	for(let [key, value] of Object.entries(settiles)) {
		let [x, y] = key.split(",").map(v => +v);
		dotile(x + 2, y); dotile(x - 2, y); dotile(x + 1, y + 1);
		dotile(x + 1, y - 1);
		dotile(x - 1, y + 1); dotile(x - 1, y - 1); dotile(x, y);
	}
	// print(settiles, newup);
	settiles = newup;
	
	// now unknown tiles are white
}

function printboard(a) {
	const bhx = "⬡";
	const whx = "⬢";
	let board = makeBoard(a ? whx : bhx);
	for(let [key, value] of Object.entries(settiles)) {
		let [x, y] = key.split(",").map(v => +v);
		
		board.set(x, y, a ? bhx : whx);
	}
	board.print((v, x, y) => {
		if(y.mod(2) == (x + 1).mod(2)) {
			return " ";
		}
		return v;
	});
}

for(let i = 1; i <= 5; i++) {
	printboard(i % 2 == 0);
	console.log(Object.entries(settiles).length);
	if(i % 2 == 0) applyeven();
	else applyodd();
};


console.log(Object.entries(settiles).length);

// I guess I could precreate a 100x100 grid and do that idk


type nobi = number | number;
type Board<T> = {
	get(x: nobi, y: nobi): T;
	set(x: nobi, y: nobi, t: T): void;
	clear(): void;
	forEach(visitor: (v: T, x: number, y: number) => void): void;
	print(printer?: (v: T, x: number, y: number) => string | nobi): void;
	copy(): Board<T>;
};
function makeBoard<T>(fill: T): Board<T> {
	// it would be useful if board could center at 0,0 and expand infinitely
	let board: T[][] = [];
	let limits:
		| { xmin: number; xmax: number; ymin: number; ymax: number }
		| undefined;
	let reso: Board<T> = {
		clear: () => {
			board = [];
		},
		get: (x, y) => {
			if (!limits) return fill;
			if (
				x < limits.xmin ||
				x > limits.xmax ||
				y < limits.ymin ||
				y > limits.ymax
			)
				return fill;
			if (!board[Number(y)]) return fill;
			let bval = board[Number(y)][Number(x)];
			return bval === undefined ? fill : bval;
		},
		set: (x, y, v) => {
			if (!limits)
				limits = {
					xmin: Number(x),
					ymin: Number(y),
					xmax: Number(x),
					ymax: Number(y),
				};
			if (x < limits.xmin) limits.xmin = Number(x);
			if (y < limits.ymin) limits.ymin = Number(y);
			if (x > limits.xmax) limits.xmax = Number(x);
			if (y > limits.ymax) limits.ymax = Number(y);
			if (!board[Number(y)]) board[Number(y)] = [];
			board[Number(y)][Number(x)] = v;
		},
		forEach: visitor => {
			if (!limits) return;
			let ym = limits.ymin;
			let yma = limits.ymax;
			let xm = limits.xmin;
			let xma = limits.xmax;
			for (let y = ym; y <= yma; y++) {
				for (let x = xm; x <= xma; x++) {
					visitor(reso.get(x, y), x, y);
				}
			}
		},
		copy: () => {
			let nb = makeBoard<T>(fill);
			reso.forEach((v, x, y) => nb.set(x, y, v));
			return nb;
		},
		print: (printer = v => v as any) => {
			// ratelimit print
			if (!limits) return console.log("*no board to print*");
			let ylength = 0;
			for (let y = limits.ymin - 1; y <= limits.ymax + 1; y++) {
				ylength = Math.max(y.toString().length, ylength);
			}
			console.log(
				" ".repeat(ylength) +
					" .-" +
					"-".repeat(limits.xmax - limits.xmin + 5) +
					"-.",
			);
			for (let y = limits.ymin - 1; y <= limits.ymax + 1; y++) {
				let line = "";
				for (let x = limits.xmin - 2; x <= limits.xmax + 2; x++) {
					line += printer(reso.get(x, y), x, y);
				}
				console.log(y.toString().padStart(ylength, " ") + " | " + line + " |");
			}
			console.log(
				" ".repeat(ylength) +
					" '-" +
					"-".repeat(limits.xmax - limits.xmin + 5) +
					"-'",
			);
		},
	};
	return reso;
}