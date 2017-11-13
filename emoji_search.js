/**
 * Helper script to search for exported emojis using regular expressions.
 *
 * Just call it with your regex:
 *    node emoji_search.js ".*th[oi]nk.*"
 *
 * It will then spit out a markdown table with your emojis o/
 */

let _re;
if (process.argv[0].indexOf("node") > -1) {
  _re = process.argv[2];
} else {
  _re = process.argv[1];
}

let re = new RegExp(_re, "gi");

const fs = require('fs');
const emojiJson = JSON.parse(
  fs.readFileSync('./emojis.json')
);

let md =
  "|      |       |      |       |\n" +
  "|:----:|:-----:|:----:|:-----:|\n";

let tmp = [];

for (let guild in emojiJson) {
  for(let k in emojiJson[guild]) {
    if (re.exec(k) === null) {
      continue;
    }

    if (tmp.length < 4) {
      tmp.push(`![](https://cdn.discordapp.com/emojis/${emojiJson[guild][k]}.png)<br>\`:${k}:\``);
      continue;
    }

    md += tmp.join("|") + "|\n";
    tmp = [];
  }
}

console.log(md);