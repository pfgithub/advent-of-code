declare global{
	let input: string;
	let lines: string[];
	let dblines: string[][];
	let output: any;
	function print<T>(i: T, ...r: any[]): T;
	function log(...r: any[]): void;
	function copy(text: string): void;
	function clearScreen(): void;
	function error(message: string): never;
	interface Number {
		mod: (this: number, wrap: number) => number;
	}
	interface Object {
		dwth: <T>(this: T, cb: (v: T) => unknown) => T;
	}

	type Point2D = [number, number];
	type Point3D = [number, number, number];
	type Point4D = [number, number, number, number];
	type PointND = Point2D | Point3D | Point4D;

	interface Array<T> {
		add: <N extends PointND>(this: N, other: N) => N,
		sub: <N extends PointND>(this: N, other: N) => N,
		mul: <N extends PointND>(this: N, other: N) => N,
		div: <N extends PointND>(this: N, other: N) => N,
		// op: <N extends PointND, W>(this: N, other: N, mix: (a: N, b: M) => W) => W[],
		mapt: <N extends PointND>(this: N, each: (item: N[number], index: number, array: N) => N[number]) => N,

		x: T,
		y: T,
		z: T,
		a: T,
	}
	function point<T extends PointND>(pt: T): T;

	let cardinals: Point2D[];
	let diagonals: Point2D[];
	let adjacents: Point2D[];
}
export {};