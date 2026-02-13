const { User, MessageFlags, GuildMember } = require("discord.js")
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, user) => {
    
    let imageurl
    let uname
    let userId
    let userTag
    let userCreationDate
    let userJoinDate

    const mention = message.mentions.users.first();
    const mentionMember = message.mentions.members.first();

    if (!mention) {
        imageurl = message.author.avatarURL()
        userTag = message.author.tag
        uname = message.author.username
        userId = message.author.id
        userJoinDate = moment(message.member.joinedTimestamp).format("DD/MM/YYYY HH:mm:ss")
        userCreationDate = moment(message.author.createdTimestamp).format("DD/MM/YYYY HH:mm:ss")

    } else if (mention && args[1]) {
        message.react('❌')
        return message.channel.send("💛 You can only request user info from one user!")

    } else if (mention) {

        imageurl = mention.avatarURL()
        uname = mention.username
        userTag = mention.tag
        userId = mention.id
        userJoinDate = moment(mentionMember.joinedTimestamp).format("DD/MM/YYYY HH:mm:ss")
        userCreationDate = moment(mention.createdTimestamp).format("DD/MM/YYYY HH:mm:ss")

    }

    const embed = {
        color: client.config.embc, 
        // "title": "💛 Your user info!",
        author: {
            name: userTag,
            icon_url: imageurl
        },
        thumbnail: {
            url: imageurl,
        },
        fields: [{
            name: '> username',
			value: "`"+uname+"`",
        },
        {
            name: '> id',
            value: "`"+userId+"`",
        },
        {
            name: '> creation date',
            value: userCreationDate,
        },
        {
            name: '> join date',
            value: userJoinDate,
        }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: `Terrors with ❤︎ from ${client.config.name}`
    }};
    message.react('💛')
    return message.channel.send({ embeds: [embed]});

}

exports.conf = {
    permLevel: "User"
}
