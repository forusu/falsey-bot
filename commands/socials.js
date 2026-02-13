const { User, MessageFlags, GuildMember } = require("discord.js")
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, user) => {
    
    const { emDef } = require('../modules/embedBuilder.js');
    const help = emDef(client)
    .setTitle("💛 Falsequalified's socials")
    .setImage('https://cdn.discordapp.com/attachments/1233458854075957309/1471484161490686045/banner.webp?ex=698f19ea&is=698dc86a&hm=117fbb58eff88bf79d78fa0cd41898de366df6d6c35fc770e4ca94a219932391')
    .setThumbnail('https://media.discordapp.net/attachments/1233458854075957309/1471486134830891048/fsq.png?ex=698f1bc1&is=698dca41&hm=91a120c5ec0ef63fa856411a6956e0c62ed35d7bed30c62bc441a702892531a7&=&format=webp&quality=lossless&width=741&height=762')
    .addFields(
        { name: '> Twitch', value: 'https://twitch.tv/falsequalified' },
        { name: '> Twitter', value: 'https://twitter.com/fsqs_' },
        { name: '> Website', value: 'https://falsey.mom' },
        { name: '> Webring', value: 'https://friendsof.falsey.mom' },
        { name: '> Email', value: 'melissa@falsey.mom' }
    )
    .setDescription("> You can find me in the following places:")
    
    message.channel.send({ embeds: [help]});
    
}

exports.conf = {
    permLevel: "User"
}
