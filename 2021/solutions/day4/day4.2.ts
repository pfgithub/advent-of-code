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

const practice = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;
// input = practice;


let [selections, ...boardsraw] = input.split("\n\n");

let boards = boardsraw.map(b => {
    const v = b.trim().split("\n").map(l => l.trim().split(/ +/));
    return v;
});
boards.dwth(log);

function checkWin(board: string[][]): boolean {
    let win = false;
    range(5).forEach(y => {
        if(!win) win = range(5).every(x => {
            return board[y][x] === "X";
        });
    });
    range(5).forEach(x => {
        if(!win) win = range(5).every(y => {
            return board[y][x] === "X";
        });
    });
    return win;
}

let wnext = false;
for(const selection of selections.split(",")) {
    let nwin = false;
    boards = boards.map(board => {
        // if(nwin) return board;
        const res = board.map(line => line.map(col => col === selection ? "X" : col))
        // if(checkWin(res)) nwin = true;
        return res;
    });
    if(wnext) {
        selection.dwth(log);
        const board = boards[0];
        const res = board.reduce((a, b) => a + b.reduce((t, v) => t + (v === "X" ? 0 : +v), 0), 0);
        res.dwth(log);
        (res * +selection).dwth(log); // expect-equal 7075
        throw new Error(`${board} wins`);
    }
    boards = boards.dwth(log).filter(board => !checkWin(board));

    if(boards.length === 1) {
        wnext = true;
    }
}










type nobi = number | bigint;
type Board<T> = {
	get(pos: Point2D): T;
	set(pos: Point2D, t: T): void;
	clear(): void;
	forEach(visitor: (v: T, pos: Point2D) => void): void;
	print(printer?: (v: T, pos: Point2D) => string | nobi): string;
	copy(): Board<T>;
};
function makeBoard<T>(fill: T): Board<T> {
	// it would be useful if board could center at 0,0 and expand infinitely
	let board: T[][] = [];
	let limits:
		| { min: Point2D, max: Point2D }
		| undefined;
	let reso: Board<T> = {
		clear: () => {
			board = [];
		},
		get: (pos) => {
			if (!limits) return fill;
			if (
                pos.op(limits.min, (a, b) => a < b).some(w => w) ||
                pos.op(limits.max, (a, b) => a > b).some(w => w)
            ) return fill;
			if (!board[pos.y]) return fill;
			let bval = board[pos.y][pos.x];
			return bval === undefined ? fill : bval;
		},
		set: (pos, v) => {
			if (!limits) {
				limits = {min: dupe(pos), max: dupe(pos)};
            }
            limits.min = pos.op(limits.min, (a, b) => Math.min(a, b));
            limits.max = pos.op(limits.max, (a, b) => Math.max(a, b));
			if (!board[pos.y]) board[pos.y] = [];
			board[pos.y][pos.x] = v;
		},
		forEach: visitor => {
			if (!limits) return;
			for (let y = limits.min.y; y <= limits.max.y; y++) {
				for (let x = limits.min.x; x <= limits.max.x; x++) {
					visitor(reso.get([x, y]), [x, y]);
				}
			}
		},
		copy: () => {
			let nb = makeBoard<T>(fill);
			reso.forEach((v, pos) => nb.set(pos, v));
			return nb;
		},
		print: (printer = v => v as any): string => {
			// ratelimit print
			if (!limits) return "*no board to print*";
			let ylength = 0;
			for (let y = limits.min.y - 1; y <= limits.max.y + 1; y++) {
				ylength = Math.max(y.toString().length, ylength);
			}
			const resc: string[] = [];
			let llen: number = limits.max.x - limits.min.x + 3;
			for (let y = limits.min.y - 1; y <= limits.max.y + 1; y++) {
				let line = "";
				for (let x = limits.min.x - 1; x <= limits.max.x + 1; x++) {
					line += printer(reso.get([x, y]), [x, y]);
				}
				if(line.length > llen) llen = line.length;
				resc.push(y.toString().padStart(ylength, " ") + " | " + line + " |");
			}
			resc.unshift(
				" ".repeat(ylength) +
					" .-" +
					"-".repeat(llen) +
					"-. " + (limits.min.y - 1) + " .. " + (limits.max.y + 1),
			);
			resc.push(
				" ".repeat(ylength) +
					" '-" +
					"-".repeat(llen) +
					"-'",
			);
			return resc.join("\n");
		},
	};
	return reso;
}