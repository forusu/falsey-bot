const { EmbedBuilder } = require('discord.js');


function emDef(client) {

    return new EmbedBuilder()
        .setColor(client.config.embc)
        .setTimestamp()
        .setFooter({ text: `Terrors with ❤︎ from ${client.config.name}` });
}

module.exports = { emDef };