exports.run = (client, message, args) => {

    let say = args.join(" ");

    const { emDef } = require('../modules/embedBuilder.js');
    const embed = emDef(client)
    .setTitle("💛 Here is your embed!")
    .setDescription(say)
 
    message.channel.send({ embeds: [embed]});
}

exports.conf = {
    permLevel: "User"
}