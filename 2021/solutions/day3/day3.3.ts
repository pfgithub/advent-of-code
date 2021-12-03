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
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`;
// input = practice;


const itms = input.trim().split('\n');

const num0 = itms[0].length.dwth(log); // 12
const num1 = (itms.length) / 2; // 500

const codegolf = m=>(q=a=>parseInt(a.join``,2),v1=new Array(m[0].length).fill``.map((_,i)=>+(m.reduce((t,a)=>t+(a[i]==0),0)<m.length/2)),v2=v1.map(w=>1-w),q(v1)*q(v2));
// const codegolf = m=>(q=a=>parseInt(a.join``,2),v1=new Array(m[0].length).fill``.map((_,i)=>+(m.reduce((t,a)=>t+(a[i]==0),0)<m.length/2)),v2=v1.map(w=>1-w),q(v1)*q(v2));
// const codegolf = v=>(q=a=>parseInt(a.join``,2),m=v.trim().split`\n`,v1=new Array(m[0].length).fill``.map((_,i)=>+(m.reduce((t,a)=>t+(a[i]==0),0)<m.length/2)),v2=v1.map(w=>1-w),q(v1)*q(v2));
// const codegolf = v=>(q=a=>parseInt(a.join``,2),m=v.trim().split`\n`,v1=new Array(m[0].length).fill``.map((_,i)=>+(m.reduce((t,a)=>t+(a[i]=="0"),0)<m.length/2)),v2=v1.map(w=>1-w),q(v1)*q(v2));
// const codegolf = v=>(q=a=>parseInt(a.join``,2),m=v.trim().split`\n`,v1=new Array(m[0].length).fill(0).map((_,i)=>+(m.reduce((t,a)=>t+(a[i]=="0"),0)<m.length/2)),v2=v1.map(w=>1-w),q(v1)*q(v2));
// const codegolf = v=>(q=a=>parseInt(a.join``,2),m=v.trim().split`\n`,v1=range(m[0].length).map(i=>+(m.reduce((t,a)=>t+(a[i]=="0"),0)<m.length/2)),v2=v1.map(w=>1-w),q(v1)*q(v2));
// const codegolf = v=>(q=parseInt,m=v.trim().split`\n`,v1=range(m[0].length).map(i=>+(m.reduce((t,a)=>t+(a[i]=="0"),0)<m.length/2)),v2=v1.map(w=>1-w),q(v1.join``,2)*q(v2.join``,2));
// const codegolf = v=>(m=v.trim().split`\n`,v1=range(m[0].length).map(i=>+(m.reduce((t,a)=>t+(a[i]=="0"),0)<m.length/2)),v2=v1.map(w=>1-w),parseInt(v1.join``,2)*parseInt(v2.join``,2));
console.log(codegolf(input.trim().split("\n")));


let res: number[] = [];
range(itms[0].length).map(i => {
    let zeros = 0;
    let ones = 0;
    itms.forEach(cv => {
        const c = cv[i];
        if(c === "0") zeros++;
        else ones++;
    })
    if(zeros > ones) res.push(0);
    else res.push(1);
});

const ares = res.map(w => 1 - w);

console.log(parseInt(res.join(""), 2) * parseInt(ares.join(""), 2));

res.dwth(log)
ares.dwth(log)