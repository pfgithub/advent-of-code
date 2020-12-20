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

// oh no…

const sample_input = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;

const tiles = input.split("\n\n").map(l => {
	const [top, ...rest] = l.split("\n");
	return [top.match(/\d+/)![0], rest.map(v => [...v])];
})

print(tiles[0][0]);

print(tiles.length);

const side_width = Math.sqrt(tiles.length);

print(side_width);

// my goal is not to leaderboard today, I just want to solve

// ok so loop over all orientations

const rotate = (tile: string[][]): string[][] => {
	let res: string[][] = [];
	for(let y = 0; y < tile.length; y++) {
		for(let x = 0; x < tile.length; x++) {
			if(!res[x]) res[x] = [];
			res[x][tile.length-y-1] = tile[y][x];
		}
	}
	return res;
}
const hflip = (tile: string[][]): string[][] => {
	let res: string[][] = [];
	for(let y = 0; y < tile.length; y++) {
		for(let x = 0; x < tile.length; x++) {
			if(!res[y]) res[y] = [];
			res[y][tile.length-x-1] = tile[y][x];
		}
	}
	return res;
}
const vflip = (tile: string[][]): string[][] => {
	let res: string[][] = [];
	for(let y = 0; y < tile.length; y++) {
		for(let x = 0; x < tile.length; x++) {
			if(!res[tile.length-y-1]) res[tile.length-y-1] = [];
			res[tile.length-y-1][x] = tile[y][x];
		}
	}
	return res;
}

const printile = (tile: string[][]) => {
	print(tile.map(v => v.join("")).join("\n"),"\n\n");
}

let tilev: {[key: string]: string[][][]} = {};

for(let [id, tile] of tiles) {
	let tc = tile as string[][];
	let res = [tc];
	res.push(hflip(tc));
	res.push(vflip(tc));
	tc = rotate(tc);
	res.push(tc);
	tc = rotate(tc);
	res.push(tc);
	tc = rotate(tc);
	res.push(tc);
	tc = res[1];
	tc = rotate(tc);
	res.push(tc);
	tc = rotate(tc);
	res.push(tc);
	tc = rotate(tc);
	res.push(tc);
	tc = res[2];
	tc = rotate(tc);
	res.push(tc);
	tc = rotate(tc);
	res.push(tc);
	tc = rotate(tc);
	res.push(tc);
	tilev["" + id] = res as any;
}

const vrow = (tile: string[][], x: number) => {
	let res = "";
	for(let y = 0; y < tile.length; y++) {
		res += tile[y][x];
	}
	return res;
}
const hrow = (tile: string[][], y: number) => {
	let res = "";
	for(let x = 0; x < tile.length; x++) {
		res += tile[y][x];
	}
	return res;
}

function findFittingTile(attempt: [string, number][], available: string[]): [string, number][] | undefined {
	if(available.length < 134) print(available.length);
	if(available.length == 0) return attempt;
	for(let try_piece_i = 0; try_piece_i < available.length; try_piece_i++) {
		for(let try_dir = 0; try_dir < 12; try_dir++) {
			const add_piece = available[try_piece_i];
			
			let this_index = attempt.length;
			
			let [x, y] = [this_index % side_width, this_index / side_width >> 0];
			
			let fits = [[-1,0],[0, -1]].every(([dx, dy]) => {
				if(x + dx < 0 || y + dy < 0) return true;
				let iv = ((y + dy) * side_width) + (x + dx);
				
				let tileat = attempt[iv];
				if(dx == -1) {
					let tile_squares = tilev[tileat[0]][tileat[1]];
					let left_tile = vrow(tile_squares, tile_squares.length - 1);
					let this_squares = tilev[add_piece][try_dir];
					let this_tile = vrow(this_squares, 0);
					if(available.length == 133) {
						print(left_tile, this_tile, left_tile == this_tile);
					}
					return left_tile == this_tile;
				}else{
					let tile_squares = tilev[tileat[0]][tileat[1]];
					let top_tile = hrow(tile_squares, tile_squares.length - 1);
					let this_squares = tilev[add_piece][try_dir];
					let this_tile = hrow(this_squares, 0);
					print(top_tile+"\n"+this_tile);
					return top_tile == this_tile;
				}
			});
			// if(available.length == 133) {
			// 	print(fits, "trying to put at ",[x,y]);
			// }
			if(!fits) continue;
			
			let new_available = available.filter((_, i) => i !== try_piece_i);
			let new_attempt: [string, number][] = [...attempt, [add_piece, try_dir]];
			
			let found_pattern = findFittingTile(new_attempt, new_available);
			if(found_pattern) return found_pattern;
		}
	}
	return undefined;
}

print(Object.keys(tilev).length);
const found_attempt = findFittingTile([], Object.keys(tilev))!;

print(found_attempt);

const ul = 0;
const ur = side_width - 1;
const bl = found_attempt.length - side_width;
const br = found_attempt.length - 1;



print(+found_attempt[ul][0] * +found_attempt[ur][0] * +found_attempt[bl][0] * +found_attempt[br][0]);
