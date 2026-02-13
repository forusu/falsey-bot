const path = require("path");
const fs = require("fs");
const dictPath = "./fsqparty/dict.json";

function loadDictionary() {
    try {
        const array = JSON.parse(fs.readFileSync(dictPath, "utf8"));
        return array.map(w => w.toLowerCase().trim());
    } catch (err) {
        console.error("Failed to load dictionary:", err);
        return [];
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply("Please provide a search string or regex.");

    const query = args.join(" ");
    const dictionaryArray = loadDictionary(); 

    let regex;
    try {
        regex = new RegExp(query, "gi"); 
    } catch (err) {
        return message.reply("Invalid regex pattern.");
    }

    const matches = dictionaryArray.filter(word => regex.test(word));

    if (matches.length === 0) return message.channel.send("No matches found.");

    // Shuffle and take up to 25 words
    const subset = shuffleArray(matches).slice(0, 25);

    const highlighted = subset.map(word => word.replace(regex, match => `[${match}]`)).join("\n"); 

    let description = "```asciidoc\n";
    description += `total: ${matches.length}\n`;
    description += `--------------------------------\n`;
    description += highlighted.toUpperCase();
    if (matches.length > 25) description += "\n...";
    description += "```";

    const { emDef } = require('../modules/embedBuilder.js');
    const embed = emDef(client)
        .setTitle(`💛 Results for [ **${query.toUpperCase()}** ]`)
        .setDescription(description);

    await message.channel.send({ embeds: [embed] });
};

exports.conf = {
    permLevel: "User"
};
