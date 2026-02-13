const fs = require("fs");
const path = "./fsqparty/stats.json";

exports.run = async (client, message, args) => {

    if (!fs.existsSync(path)) {
        return message.channel.send("No stats found yet.");
    }

    const stats = JSON.parse(fs.readFileSync(path));

    const users = Object.entries(stats.users);

    users.sort((a, b) => {
        // Primary: discoveries
        if (b[1].discoveries !== a[1].discoveries) {
            return b[1].discoveries - a[1].discoveries;
        }
        // Secondary: correct
        return b[1].correct - a[1].correct;
    });

    if (users.length === 0) {
        return message.channel.send("No stats recorded yet.");
    }

    const top = users.slice(0, 10);

    const leaderboard = await Promise.all(
        top.map(async ([id, data], index) => {
            try {
                const user = await client.users.fetch(id);
                return ` #${index + 1} | ${user.tag} :: ${data.correct} sol. | ${data.discoveries} disc.\n`;
            } catch {
                return ` #${index + 1} | Unknown User :: ${data.correct} sol. | ${data.discoveries} disc.`;
            }
        })
    );

    let description = "\`\`\`asciidoc\n";
    description += leaderboard.join("");;
    description += "\`\`\`";

    const { emDef } = require('../modules/embedBuilder.js');
    const embed = emDef(client)
    .setTitle( "💛 fparty leaderboard!")
    .setDescription(description)
 
    message.channel.send({ embeds: [embed]});
};

exports.conf = {
    permLevel: "User"
};