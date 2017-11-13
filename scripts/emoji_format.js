/**
 * Helper script to format exported emojis.
 *
 * Just call it ("node emoji_format.js") and let it work it's magic.
 * Nothing to configure.
 */

const fs = require('fs');
const emojiJson = JSON.parse(
  fs.readFileSync('./emojis.json')
);

const table =
  "|      |       |      |       |\n" +
  "|:----:|:-----:|:----:|:-----:|\n";

let md = "";

for (let guild in emojiJson) {
  md += `### ${guild}\n\n`;
  md += table;

  let tmp = [];
  for(let k in emojiJson[guild]) {
    if (tmp.length < 4) {
      tmp.push(`![](https://cdn.discordapp.com/emojis/${emojiJson[guild][k]}.png)<br>\`:${k}:\``);
      continue;
    }

    md += tmp.join("|") + "|\n";
    tmp = [];
  }

  md += "\n";
}

console.log(md);