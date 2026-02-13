const fs = require("fs");
const path = require("path");
const dictPath = path.join(__dirname, "../fsqparty/dict.json");

// Load dictionary
let dictionaryArray = fs.existsSync(dictPath)
    ? JSON.parse(fs.readFileSync(dictPath, "utf8"))
    : [];

let dictionarySet = new Set(dictionaryArray.map(w => w.toLowerCase().trim()));

exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply("Please provide an action: `add` or `remove`.");
    const action = args[0].toLowerCase();
    if (!["add", "remove"].includes(action)) return message.reply("Action must be `add` or `remove`.");

    let words = args.slice(1).join(" ").split(/[\s,]+/).map(w => w.toLowerCase().trim()).filter(Boolean);

    if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        try {
            const fileContent = await fetch(attachment.url).then(res => res.text());
            const fileWords = fileContent.split(/\r?\n/).map(w => w.toLowerCase().trim()).filter(Boolean);
            words = words.concat(fileWords);
        } catch (err) {
            console.error(err);
            return message.reply("Failed to read attached file.");
        }
    }

    if (words.length === 0) return message.reply("No valid words provided.");

    const added = [];
    const removed = [];
    const skipped = [];

    for (let word of words) {
        if (!/^[a-zA-Z'-]+$/.test(word)) {
            skipped.push(word);
            continue;
        }

        if (action === "add") {
            if (!dictionarySet.has(word)) {
                dictionarySet.add(word);
                added.push(word);
            } else {
                skipped.push(word);
            }
        } else {
            if (dictionarySet.has(word)) {
                dictionarySet.delete(word);
                removed.push(word);
            } else {
                skipped.push(word);
            }
        }
    }

    dictionaryArray = [...dictionarySet].sort();
    fs.writeFileSync(dictPath, JSON.stringify(dictionaryArray, null, 2));

    const formatList = (arr) => {
        if (!arr.length) return null;
        const display = arr.slice(0, 50).join(", ").toUpperCase();
        return `${display}${arr.length > 50 ? ", ..." : ""} (total: ${arr.length})`;
    };

    let reply = "";
    const addedDisplay = formatList(added);
    const removedDisplay = formatList(removed);
    const skippedDisplay = formatList(skipped);

    if (addedDisplay) reply += `> Added: [ ${addedDisplay} ]\n`;
    if (removedDisplay) reply += `> Removed: [ ${removedDisplay} ]\n`;
    if (skippedDisplay) reply += `⚠ Skipped (invalid/already exists/doesn't exist): [ ${skippedDisplay} ]`;

    if (!reply) reply = "No changes made.";
    await message.channel.send(reply);
};

exports.conf = {
    permLevel: "finesse"
};
