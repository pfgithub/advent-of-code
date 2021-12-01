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
}
export {};