const fs = require("fs");
const path = require("path");
// eslint-disable-next-line
const fetch = require("node-fetch");

const cookietext = fs.readFileSync(path.join(__dirname, "cookie.txt"));

function th(num) {
    const str = "" + num;
    if(str[str.length-1] === "1") {
        return num + "ˢᵗ";
    }else if(str[str.length-1] === "2") {
        return num + "ⁿᵈ";
    }else if(str[str.length-1] === "3") {
        return num + "ʳᵈ";
    }else return num + "ᵗʰ";
}

async function runfor(year) {
    /** @type {string} */
    const input_text_raw = (await (await fetch("https://adventofcode.com/"+year+"/leaderboard/self", {
        headers: {"Cookie": cookietext},
    })).text());
    const input_text = input_text_raw.match(/oard-daydesc-both">.+?<\/span>([^<]+?)<\/pre>/)[1].trim();

    const inv = input_text.split("\n").map(l => l.trim().split(/ +/g))
        .map(([day, time, pos, pts, time2, pos2, pts2]) => ({day: +day, time, pos: +pos, pts: +pts, time2, pos2: +pos2, pts2: +pts2}))
    ;
    const attemptedlb = a => (
        year === "2020" && a.day === 1 ? false
        : year === "2021" && a.day === 1 ? false
        : year === "2019" && a.day === 5 ? false
        : year === "2018" && a.day === 1 ? false
        : year === "2021" && a.day === 5 ? false
        : year === "2022" && a.day === 1 ? false
        : a.time.split(":").length === 3 && a.time2.split(":").length === 3
    );

    const attemptsonly = inv.filter(attemptedlb);

    const txtv = inv
        .map(v => {
            if(!attemptedlb(v)) {
                return "| " + ("" + v.day).padStart(3, " ") +
                " |      n/a |  --- |       |      n/a |  --- |       |";
            }
            return "| " + ("" + v.day).padStart(3, " ") +
            " | " + v.time.padStart(8, " ") +
            " | " + ("" + v.pos).padStart(4, " ") +
            " | " + (v.pts ? "" + v.pts : "").padStart(5, " ") +
            " | " + v.time2.padStart(8, " ") +
            " | " + ("" + v.pos2).padStart(4, " ") +
            " | " + (v.pts2 ? "" + v.pts2 : "").padStart(5, " ") +
        " |"})
        .join("\n")
    ;

    const timesonlb = attemptsonly.reduce((t, a) => t + +!! a.pts + +!! a.pts2, 0);
    const timestop1k = attemptsonly.reduce((t, a) => t + +(a.pos <= 1000) + +(a.pos2 <= 1000), 0);
    const lb_attempts = attemptsonly.length * 2;
    const bestday = attemptsonly.reduce((t, a) => a.pts + a.pts2 > t.pts + t.pts2 ? a : t, {day: -1, pts: 0, pts2: 0});
    const avg = attemptsonly.reduce((t, a) => t + a.pos + a.pos2, 0) / (attemptsonly.length * 2);
    const median = attemptsonly.flatMap(a => [a.pos, a.pos2]).sort((a, b) => a - b)[attemptsonly.length];

    const res = ""
        + "### "+year+"\n"
        + "\n"
        + "- Total Score: " + (inv.reduce((t, a) => t + a.pts + (a.pts2 || 0), 0)) + "\n"
        + "- Times On Leaderboard: " + (timesonlb) + " / "+(lb_attempts)+" (~"
            + (timesonlb / lb_attempts).toLocaleString(undefined, {style: "percent"}) + ")"+"\n"
        + "- Times Top 1000: " + (timestop1k) + " / "+(lb_attempts)+" (~"
            + (timestop1k / lb_attempts).toLocaleString(undefined, {style: "percent"}) + ")"+"\n"
        + "- Best Leaderboard Position: " + th(inv.reduce((t, a) => Math.min(t, a.pos, a.pos2 || Infinity), Infinity))
            + " place\n"
        + "- Worst Leaderboard Position: " + th(attemptsonly.reduce((t, a) => Math.max(t, a.pos, a.pos2 || Infinity), 0))
            + " place\n"
        + "- Average Leaderboard Position: " + th(avg |0) + " place\n"
        + "- Median Leaderboard Position: " + th(median) + " place\n"
        + "- Best Day was "+`Day ${bestday.day}: ${bestday.pts + bestday.pts2} points, #${bestday.pos}/#${bestday.pos2}`+"\n"
        + "\n"
        + "| Day |     Time | Rank | Score |     Time | Rank | Score |\n"
        + "| --: | -------: | ---: | ----: | -------: | ---: | ----: |\n"
        + txtv + "\n"

    return res;
}

/*

        + "<!-- start-results -->\n"
        + "\n"
        + "<!-- end-results -->\n"
*/

async function main() {
    const year = "2022";
    const v = await runfor(year);

    const rt = ""
        + "<!-- dynamic-results:"+year+" start -->\n"
        + "\n"
        + v
        + "\n"
        + "<!-- dynamic-results:"+year+" end -->"
    ;
    console.log(rt);

    const mc = fs.readFileSync("./README.md", "utf-8");
    const wc = mc.replace(new RegExp("<!-- dynamic-results:"+year+" start -->[^\\x1b]+<!-- dynamic-results:"+year+" end -->"), rt);
    fs.writeFileSync("./README.md", wc);
}

main().catch(e => {throw e;});