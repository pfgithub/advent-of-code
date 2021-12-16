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
880086C3E88112
`;
// input = practice;
input = input.trim();

const hex2bin = (hex: string) => {
    return [...hex].map(c => parseInt(c, 16).toString(2).padStart(4, "0")).join("");
};

let data = [...hex2bin(input).dwth(log)];

function parse() {
    const version = data.splice(0, 3).join("").use(v => parseInt(v, 2));
    const typeid = data.splice(0, 3).join("").use(v => parseInt(v, 2));

    if(typeid === 4) {
        let bins = "";
        while(true) {
            const bit = data.shift();
            bins += data.splice(0, 4).join("");
            if(bit !== "1") break;
        }
        return parseInt(bins, 2);
        // return [version];
    }

    const lentid = data.splice(0, 1).join("").use(v => parseInt(v, 2));

    const res: number[] = [];
    if(lentid === 0) {
        const length = data.splice(0, 15).join("").use(v => parseInt(v, 2));

        const resv = data.length - length;
        while(data.length > resv) {
            res.push(parse());
        }
    }else{
        const iterc = data.splice(0, 11).join("").use(v => parseInt(v, 2));
        
        for(let i = 0; i < iterc; i++) {
            res.push(parse());
        }
    }
    console.log(res, typeid);

    if(typeid === 0) {
        return res.reduce((t, a) => t + a, 0);
    }else if(typeid === 1) {
        return res.reduce((t, a) => t * a, 1);
    }else if(typeid === 2) {
        return res.reduce((t, a) => Math.min(t, a), Infinity);
    }else if(typeid === 3) {
        return res.reduce((t, a) => Math.max(t, a), -Infinity);
    }else if(typeid === 5) {
        return res[0] > res[1] ? 1 : 0;
    }else if(typeid === 6) {
        return res[0] < res[1] ? 1 : 0;
    }else if(typeid === 7) {
        return res[0] === res[1] ? 1 : 0;
    }else throw new Error("bad")
}

parse().dwth(log);