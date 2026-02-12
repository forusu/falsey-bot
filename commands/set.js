const { ActivityType } = require("discord.js");
exports.run = async (client, message, args) => {

    let ag1 = args[0];
    let ag2 = args.slice(1).join(" ");


    if (!ag1) {

    let description = "\`\`\`asciidoc\n";
    description += "Usage: \n"
    description += `${client.config.prefix}set + [cmd] + [arg] \n\n`
    description += "> status  ::  Sets a custom status\n"
    description += "> avatar  ::  Sets a custom avatar\n"
    description += ">   name  ::  Sets a custom username \n\n"
    description += ">   desc  ::  Sets a custom status/name\n"
    description += "\`\`\`"
    
    const { emDef } = require('../modules/embedBuilder.js');
    const embed = emDef(client)
    .setTitle("💛 Command help")
    .setDescription(description)
 
    message.channel.send({ embeds: [embed]});

    } else if (ag1 && !ag2) {
        message.channel.send(`💛 No argument provided, you absolute cretin`)
        message.react('❌')
    } else {
        switch (ag1) {
            case 'status':
                client.user.setActivity(ag2, { type: ActivityType.Playing });
                message.channel.send(`💛 Status is now set to **${ag2}**`)
                message.react('💛')
                break;

            case 'name':
                client.user.setUsername(ag2)
                message.react('💛')
                message.channel.send(`💛 Name is now set to **${ag2}**`)
                break;
            
            case 'avatar':
                try {
                    await client.user.setAvatar(ag2)
                    message.channel.send(`Avatar set`)
                    message.react('💛')
                } catch {
                    message.react('❌')
                    message.channel.send(`💛 Oopsies! You didn't use a correct url you absolute imbecile, now your bot is dead`)
                }
                break;
        }
    }
}

exports.conf = {
    permLevel: "finesse"
}