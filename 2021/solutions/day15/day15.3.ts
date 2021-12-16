import {fhmain} from "../../../src/fheader";
fhmain(__filename);
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

const practice = `
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`;
// input = practice;
input = input.trim();

// @ts-expect-error
import * as as from "./astar.js";

const graph = new as.Graph(input.split("\n").map(line => line.split("").map(Number)));

const start = graph.grid[0][0];
const end = graph.grid[graph.grid.length - 1][graph.grid[0].length - 1];
const result = as.astar.search(graph, start, end);

console.log(result.reduce((t: any, w: any) => t + w.weight, 0)); // expect=619