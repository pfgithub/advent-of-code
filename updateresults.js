const fs = require("fs");
const path = require("path");
// eslint-disable-next-line
const fetch = require("node-fetch");

const cookietext = fs.readFileSync(path.join(__dirname, "cookie.txt"));

async function runfor(year) {
    /** @type {string} */
    const input_text = (await (await fetch("https://adventofcode.com/"+year+"/leaderboard/self", {
        headers: {"Cookie": cookietext},
    })).text()).match(/oard-daydesc-both">    Time   Rank  Score<\/span>([^<]+?)<\/pre>/)[1].trim();

    const inv = input_text.split("\n").map(l => l.trim().split(/ +/g))
        .map(([day, time, pos, pts, time2, pos2, pts2]) => ({day: +day, time, pos: +pos, pts: +pts, time2, pos2: +pos2, pts2: +pts2}))
    ;
    const txtv = inv
        .map(v => {
            return "| " + ("" + v.day).padStart(3, " ") +
            " | " + v.time.padStart(10, " ") +
            " | " + ("" + v.pos).padStart(6, " ") +
            " | " + (v.pts ? "" + v.pts : "").padStart(6, " ") +
            " | " + v.time2.padStart(10, " ") +
            " | " + ("" + v.pos2).padStart(6, " ") +
            " | " + (v.pts2 ? "" + v.pts2 : "").padStart(6, " ") +
        " |"})
        .join("\n")
    ;

    const timesonlb = inv.reduce((t, a) => t + +!! a.pts + +!! a.pts2, 0);
    const lb_attempts = inv.reduce((t, a) => t + (
        year === "2020" && a.day === 1 ? 0
        : + (a.time.split(":").length === 3) + + (a.time2.split(":").length === 3)
    ), 0);

    const res = ""
        + "### "+year+"\n"
        + "\n"
        + "Total Score: " + (inv.reduce((t, a) => t + a.pts + a.pts2, 0)) + "  \n"
        + "Times On Leaderboard: " + (timesonlb) + " / "+(lb_attempts)+" (~"
            + (timesonlb / lb_attempts).toLocaleString(undefined, {style: "percent"}) + ")"+"\n"
        + "\n"
        + "| Day |      Time  |  Rank  | Score  |      Time  |  Rank  | Score  |\n"
        + "| -:  |      -:    |  -:    | -:     |      -:    |  -:    | -:     |\n"
        + txtv + "\n"

    return res;
}

/*

        + "<!-- start-results -->\n"
        + "\n"
        + "<!-- end-results -->\n"
*/

async function main() {
    const v = await Promise.all([
        runfor("2021"),
        runfor("2020"),
        runfor("2019"),
    ]);

    const rt = ""
        + "<!-- start-results -->\n"
        + "\n"
        + v.join("\n")
        + "\n"
        + "<!-- end-results -->"
    ;

    const mc = fs.readFileSync("./README.md", "utf-8");
    const wc = mc.replace(/<!-- start-results -->[^\x1b]+<!-- end-results -->/, rt);
    fs.writeFileSync("./README.md", wc);
}

main().catch(e => {throw e;});