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
A0016C880162017C3686B18A3D4780
`;
// input = practice;
input = input.trim();

const hex2bin = (hex: string) => {
    return [...hex].map(c => parseInt(c, 16).toString(2).padStart(4, "0")).join("");
};

let data = [...hex2bin(input).dwth(log)];

function parse(): T {
    const version = data.splice(0, 3).join("").use(v => parseInt(v, 2));
    const typeid = data.splice(0, 3).join("").use(v => parseInt(v, 2));
    console.log(version, typeid);

    if(typeid === 4) {
        let bins = "";
        while(true) {
            const bit = data.shift();
            bins += data.splice(0, 4).join("");
            if(bit !== "1") break;
        }
        // return [parseInt(bins, 2)];
        return [version];
    }

    const lentid = data.splice(0, 1).join("").use(v => parseInt(v, 2));

    const res: T = [];
    if(lentid === 0) {
        const length = data.splice(0, 15).join("").use(v => parseInt(v, 2));

        const resv = data.length - length;
        while(data.length > resv) {
            res.push(parse());
        }
        return [version, ...res];
    }else{
        const iterc = data.splice(0, 11).join("").use(v => parseInt(v, 2));
        
        for(let i = 0; i < iterc; i++) {
            res.push(parse());
        }
    }
    return [version, ...res];
}

parse().dwth(log).flat(Infinity).reduce((t, a) => t + a, 0).dwth(log);

// added after completion
// i just didn't specify a return type for parse while solving
// also tbh i should have done flat in the code instead of using .flat() because
// it took me too long to figure out you had to .flat(Infinity) (I thought flat did
// that by defualt)
type T = (number | T)[];