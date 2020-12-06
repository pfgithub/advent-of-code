declare global{
	let input: string;
	let lines: string[];
	let dblines: string[][];
	let output: any;
	function print<T>(i: T, ...r: any[]): T;
	function copy(text: string): void;
	function clearScreen(): void;
}
export {};