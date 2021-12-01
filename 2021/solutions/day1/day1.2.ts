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

console.log(vec(2, [2, 3]).add([3, 4]));
console.log(vec(3, [2, 3, 4]).add([3, 4, 5]).mapt(l => l + 2));

const v = vec(3, [2, 3, 4]).add([3, 4, 5]);

const a: Point2D = vec(2, [1, 2]).add([3, 4]);
const b: Point3D = vec(3, [1, 2, 3]).add([3, 4, 5]).mapt(l => l + 2);
const g: Point3D = b.mapt(l => l + 2);
const wa: Point3D = b.add([3, 4, 5]).mapt(l => l + 2).mapt(l => l + 2);

const d = vec(3, [1, 2, 3]);//.add([3, 4, 5]).mapt(l => l + 2);

const sample = vec(3, [1, 6, 3]).op([4, 5, 6], (va, vb) => va > vb).dwth(log).some(w => w).dwth(log);

const c: (typeof d)["__is_vector"] = 3;
// @ts-expect-error
const e: InferLen<typeof d> = 4;

(-1).mod(3).dwth(log)
