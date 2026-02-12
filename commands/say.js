exports.run = (client, message, args) => {

    let say = args.join(" ");
    

    if (!say) {

        let description = "\`\`\`asciidoc\n";
        description += "Usage: \n"
        description += `${client.config.prefix}say + [text]\n\n`
        description += "> description :: Says something in chat\n"
        description += "\`\`\`"
        

        const { emDef } = require('../modules/embedBuilder.js');
        const embed = emDef(client)
        .setTitle("💛 Command help")
        .setDescription(description)
     
        message.channel.send({ embeds: [embed]});
    } else {
        message.channel.send(`${say}`)
        console.log(`Bot said: ${say}`)
    }

}

exports.conf = {
    permLevel: "finesse"
}