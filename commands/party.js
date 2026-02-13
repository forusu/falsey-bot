const { GuildChannel } = require('discord.js');
const activeGames = new Map();
const fs = require("fs");
const statsPath = "./fsqparty/stats.json";

// let stats = {};

// if (fs.existsSync(statsPath)) {
//     stats = JSON.parse(fs.readFileSync(statsPath));
// }


let stats = {};

try {
    if (!fs.existsSync(statsPath)) {
        fs.writeFileSync(statsPath, JSON.stringify({
            users: {},
            usedWords: []
        }, null, 2));
    }

    const raw = fs.readFileSync(statsPath, "utf8");
    stats = raw.trim() ? JSON.parse(raw) : { users: {}, usedWords: [] };

    if (!stats.users) stats.users = {};
    if (!stats.usedWords) stats.usedWords = [];
    stats.usedWords = new Set(stats.usedWords);

} catch (err) {
    console.error("Stats file corrupted. Resetting...");
    stats = { users: {}, usedWords: new Set() };
    fs.writeFileSync(statsPath, JSON.stringify({
        users: {},
        usedWords: []
    }, null, 2));
}

exports.run = async (client, message, args) => {
    const dictionaryArray = require('../fsqparty/dict.json');
    const dictionary = new Set(dictionaryArray.map(w => w.toLowerCase().trim()));

    const targetChannel = message.mentions.channels.first() || message.channel;
    const channelId = targetChannel.id;

    // END game
    if (args[0] === "end") {
        if (!activeGames.has(channelId)) return message.reply("No active game in this channel.");
        activeGames.get(channelId).running = false;
        activeGames.delete(channelId);
        return message.channel.send("fparty ended.");
    }

    // PROMPT check
    if (args[0] === "prompt") {
        if (!activeGames.has(channelId)) {
            return message.reply("No active fparty game in this channel.");
        }
        const gameState = activeGames.get(channelId);
        return message.channel.send(`[ **${gameState.syllable.toUpperCase()}** ] (sub ${gameState.maxWords})`);
    }

    // Prevent starting another game in same channel
    if (activeGames.has(channelId)) {
        return message.reply("An fparty game is already running in that channel.");
    }

    // Start new game
    const gameState = { running: true };
    activeGames.set(channelId, gameState);

    message.reply(`> fparty started in ${targetChannel}. \n Use \`f!fparty end\` to stop it.`);

    function getRandomWord(dict) {
        return dict[Math.floor(Math.random() * dict.length)];
    }

    function getRandomSyllable(word) {
        const cleanWord = word.replace(/-/g, ""); // remove hyphens
        const length = Math.random() < 0.5 ? 2 : 3;
        if (cleanWord.length <= length) return cleanWord;
        const start = Math.floor(Math.random() * (cleanWord.length - length));
        return cleanWord.substring(start, start + length);
    }

    let baseWord = getRandomWord(dictionaryArray);
    let syllable = getRandomSyllable(baseWord).toLowerCase();
    let maxWords = dictionaryArray.filter(word =>
        word.toLowerCase().replace(/-/g, "").includes(syllable)
    ).length;

    // Store prompt in game state
    gameState.syllable = syllable;
    gameState.maxWords = maxWords;

    await targetChannel.send(`--> [ **${syllable.toUpperCase()}** ] (sub ${maxWords})`);

    while (gameState.running) {
        const filter = m => !m.author.bot;
        const collector = targetChannel.createMessageCollector({ filter });

        const winner = await new Promise(resolve => {
            collector.on("collect", msg => {
                const word = msg.content.toLowerCase().trim();
                if (!word.includes(syllable)) return;
                if (!dictionary.has(word)) return;

                resolve(msg);
                collector.stop();
            });
        });

        if (!gameState.running) break;
        if (!winner) continue;

        await winner.react("💛");

        const userId = winner.author.id;
        const wordUsed = winner.content.toLowerCase().trim();
        if (!stats.users[userId]) stats.users[userId] = {
            username: winner.author.tag,
            correct: 0,
            discoveries: 0,
            discoveredWords: []
        };

        const user = stats.users[userId];
        user.correct++;
        user.username = winner.author.tag;

        let isNewDiscovery = false;
        if (!stats.usedWords.has(wordUsed)) {
            stats.usedWords.add(wordUsed);
            user.discoveries++;
            user.discoveredWords.push(wordUsed);
            isNewDiscovery = true;
        }

        let resultMessage =
            `## \`${winner.content}\` is correct!
            > Prompt generated from \`${baseWord.toUpperCase()}\`
            > **${user.username}**'s stats: \n>     **${user.correct}** solutions ( **${user.discoveries}** discoveries ) \n\n`;

        if (isNewDiscovery) resultMessage = `> **${user.username}** discovered \`${wordUsed}\` \n` + resultMessage;

        fs.writeFileSync(statsPath, JSON.stringify({
            users: stats.users,
            usedWords: [...stats.usedWords]
        }, null, 2));

        baseWord = getRandomWord(dictionaryArray);
        syllable = getRandomSyllable(baseWord).toLowerCase();
        maxWords = dictionaryArray.filter(word =>
            word.toLowerCase().replace(/-/g, "").includes(syllable)
        ).length;

        gameState.syllable = syllable; // update prompt in game state
        gameState.maxWords = maxWords;

        await targetChannel.send(resultMessage + `--> [ **${syllable.toUpperCase()}** ] (sub ${maxWords})`);
    }

    activeGames.delete(channelId);
};


exports.conf = {
    permLevel: "User"
};
