declare global{
	let input: string;
	let output: any;
	function print<T>(i: T, ...r: any[]): T;
	function copy(text: string): void;
}
export {};