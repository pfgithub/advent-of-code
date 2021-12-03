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
		use: <T, U>(this: T, cb: (v: T) => U) => U;
		log: <T>(this: T) => T;
	}

	type Vector<N extends number, T> = (
		N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never
	) & {__is_vector?: never | N};
	type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

	type Point2D = Vector<2, number>;
	type Point3D = Vector<3, number>;
	type Point4D = Vector<4, number>;

	type LowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

	// type InferLen<V extends Vector<LowNumber, unknown>> = V extends Vector<infer U, unknown> ? U : never;
	type InferLen<V extends Vector<LowNumber, unknown>> = V["__is_vector"];

	interface Array<T> {
		add: <N extends number>(this: Vector<N, T>, other: Vector<N, number>) => Vector<N, number>,
		sub: <N extends number>(this: Vector<N, T>, other: Vector<N, number>) => Vector<N, number>,
		mul: <N extends number>(this: Vector<N, T>, other: Vector<N, number>) => Vector<N, number>,
		div: <N extends number>(this: Vector<N, T>, other: Vector<N, number>) => Vector<N, number>,

		op: <N extends number, B, C>(this: Vector<N, T>, other: Vector<N, B>, mix: (a: T, b: B, index: number, aarr: Vector<N, T>, barr: Vector<N, B>) => C) => Vector<N, C>,
		mapt: <N extends number, R>(this: Vector<N, T>, each: (item: T, index: number, array: Vector<N, T>) => R) => Vector<N, R>,

		x: T,
		y: T,
		z: T,
		a: T,
	}
	// function point<T extends Vector<LowNumber, number>>(pt: T): T;
	// function vec<N extends LowNumber, U>(n: N, v: Vector<N, U>): Vector<N, U>;
	function vec<U>(v: U): Vector<1, U>;
	function vec<U>(v: U, w: U): Vector<2, U>;
	function vec<U>(v: U, w: U, x: U): Vector<3, U>;
	function vec<U>(v: U, w: U, x: U, y: U): Vector<4, U>;
	function vec<U>(v: U, w: U, x: U, y: U, z: U): Vector<5, U>;
	function vec<U>(v: U, w: U, x: U, y: U, z: U, a: U): Vector<6, U>;
	function vec<U>(v: U, w: U, x: U, y: U, z: U, a: U, b: U): Vector<7, U>;
	function vec<U>(a: Vector<1, U>, v: U): Vector<2, U>;
	function vec<U>(a: Vector<2, U>, v: U): Vector<3, U>;
	function vec<U>(a: Vector<3, U>, v: U): Vector<4, U>;
	function vec<U>(a: Vector<4, U>, v: U): Vector<5, U>;
	function dupe<U extends unknown[]>(v: U): U;

	function range(end: number): number[];
	function range(start: number, end: number): number[];
	function range(start: number, end: number, step: number): number[];

	let cardinals: Point2D[];
	let diagonals: Point2D[];
	let adjacents: Point2D[];
}
export {};