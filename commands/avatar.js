exports.run = (client, message, args) => {

    let imageurl
    const author = message.author
    const mention = message.mentions.users.first();

    function oneUser() {
        message.react('❌')
        return message.channel.send("💛 You can only request an avatar from one user!")
    }

    !mention ? imageurl = author.avatarURL({size: 256})
    : mention && args[1] ? oneUser()
    : imageurl = mention.avatarURL({size: 256})

   message.react('💛');

   const { emDef } = require('../modules/embedBuilder.js');
   const embed = emDef(client)
   .setTitle("💛 Here's your avatar!")
   .setImage(imageurl)

    message.channel.send({ embeds: [embed]});
};



exports.conf = {
    permLevel: "User"
}