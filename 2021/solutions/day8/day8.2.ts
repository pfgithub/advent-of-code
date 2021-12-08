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
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`;
// input = practice;
input = input.trim();

// seven segment display
const v: {[key: string]: number} = {
    "cf": 1,
    "acf": 7,
    "bcdf": 4,
    "abdfg": 5,
    "acdeg": 2,
    "acdfg": 3,
    "abcefg": 0,
    "abdefg": 6,
    "abcdfg": 9,
    "abcdefg": 8,
};
const w = Object.entries(v);
const vi = Object.fromEntries(Object.entries(v).map(l => l.reverse()));

let count = 0;

// how many possible mappings are there?

const permutator = (inputArr: string[]) => {
    let result: string[][] = [];
  
    const permute = (arr: string[], m: string[] = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
};

const stdperm = [..."abcdefg"];
const permutations = permutator([..."abcdefg"]);


let final = 0;
input.split("\n").map((entry, i, a) => {
    const [inputs, outputs] = entry.split(" | ");


    for(const permutation of permutations) {
        const matches = [...inputs.split(" "), ...outputs.split(" ")].map(output => {
            return v[[...output].map(c => {
                return stdperm[permutation.indexOf(c)];
            }).sort().join("")];
        });
        if(matches.some(m => m == null)) continue;
        // get last 4 items of matches
        console.log(matches.slice(0, -4).sort().join(""));
        const last4 = matches.slice(-4);

        final +=+ last4.join("");
        break;
    }

    console.log(i, a.length, "…");

    // let mappings: {[key: string]: string[]} = {
    //     a: ["a", "b", "c", "d", "e", "f", "g"],
    //     b: ["a", "b", "c", "d", "e", "f", "g"],
    //     c: ["a", "b", "c", "d", "e", "f", "g"],
    //     d: ["a", "b", "c", "d", "e", "f", "g"],
    //     e: ["a", "b", "c", "d", "e", "f", "g"],
    //     f: ["a", "b", "c", "d", "e", "f", "g"],
    //     g: ["a", "b", "c", "d", "e", "f", "g"],
    // };

    // [...inputs.split(" "), ...outputs.split(" ")].forEach(item => {
    //     // const m = {
    //     //     2: "cf",
    //     //     3: "acf",
    //     //     4: "bcdf",
    //     //     7: "abcdefg",
    //     // }[item.length] ?? undefined;
    //     const m = w.map(v => v[0]).filter(v => v.length === item.length);
    //     if(m.length === 1) {
    //         [...m[0]].map((char, i) => {
    //             mappings[char] = mappings[char].filter(c => {
    //                 return item.includes(c);
    //             });
    //         });
    //     }
    // });

    // mappings.dwth(log);

    // [...inputs.split(" "), ...outputs.split(" ")].map(output => {
    //     if([2, 3, 4, 7].includes(output.length)) {
    //         const m = {
    //             2: "cf",
    //             3: "acf",
    //             4: "bcdf",
    //             7: "abcdefg",
    //         }[output.length]!;
    //         // console.log([...output, m);
    //         [...output].map((char, i) => {
    //             mappings[char] = m[i];
    //         });
    //     }
    // });

    // console.log(mappings);
    // if(Object.entries(mappings).length !== 7) throw new Error("bad");

    // const im = Object.fromEntries(Object.entries(mappings).map(l => l.reverse()));

    // const ores = outputs.split(" ").map(output => {
    //     console.log(output, [...output].map(char => mappings[char]).sort().join(""));
    //     return v[[...output].map(char => im[char]).sort().join("")];
    // });
    // console.log(ores)
});

console.log(final); // = 973292

console.log(count);