const fs = require('fs');
const emojis = JSON.parse(
  fs.readFileSync('./emojis.json')
);

let md =
  "| Name | Emoji | Name | Emoji |\n" +
  "|:----:|:-----:|:----:|:-----:|\n";

let tmp = [];
for (let k in emojis) {
  if (tmp.length < 3) {
    tmp.push(`\`:${k}:\``);
    tmp.push(`![](https://cdn.discordapp.com/emojis/${emojis[k]}.png)`);
    continue;
  }

  md += tmp.join("|") + "|\n";
  tmp = [];
}

console.log(
  `Listing ${Object.keys(emojis).length} emojis :o\n\n` +
  md
);