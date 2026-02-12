exports.run = (client, message, EmbedBuilder) => {

    let flip = Math.round(Math.random()*10)
    const result = flip < 5 ? `\`\`\`Heads!\`\`\`` : `\`\`\`Tails!\`\`\``

    const { emDef } = require('../modules/embedBuilder.js');
    const embed = emDef(client)
    .setTitle("💛 Here's the result!")
    .setDescription(result)
 
     message.channel.send({ embeds: [embed]});
}
       
    

exports.conf = {
    permLevel: "User"
}