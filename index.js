const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const { Client, GatewayIntentBits,  ActivityType, Partials } = require('discord.js');
const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ]
});
const config = require("./config.js");
client.logger = require("./modules/Logger");
require("./modules/functions.js")(client);
const talkedRecently = new Set();
client.config = config;
  //On ready event handler, does stuff on the ready event!!!!!!
  client.on("clientReady", () => {

    const guildNames = client.guilds.cache.map(guild => guild.name);

    console.log("💛 initialisation complete!")

    if (client.guilds.cache.size < 2) {
      console.log(`💛 Ready to spread terror and fear on ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} members of a single server!`);
    } else {
      console.log(`💛 Ready to spread terror and fear on ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} members from ${client.guilds.cache.size} servers!`);
      console.log(`💛 Guilds I am in: ${guildNames}`);
    }

    client.user.setStatus("dnd");
    client.user.setActivity('77 | 3328', { type: ActivityType.Playing });
    // talk events
  client.on('messageCreate', message => {
    switch (message.content.toLowerCase()) {
      case "good morning": 
        message.channel.send("peopel, this mornign i boiling my, coffee maker <:oh:1233760491718053908>")
        break;
      case "stus":
        message.channel.send("OH AND ONE MORE THING CASSIUS, STUS. <:stus:1233512808654573569>")
        break;
      case "bulgaria":
        message.channel.send("more like Boo!lgaria heh haha idiot.")
        break;
      case "gella ma hue":
        message.channel.send("https://media.discordapp.net/attachments/965307821052813342/1430650436695621752/a.gif?ex=698edd4c&is=698d8bcc&hm=04c7f14b56f3523bfb3416a309a6bf5bb08eb1a2354531ffd5a6c66c81afc21c&=&width=585&height=439")
        break;
    }

  })

  });

  //Preventing errors and warnings from crashing the bot
  client.on("error", (e) => console.error(e));
  client.on("warn", (e) => console.warn(e));
  //client.on("debug", (e) => console.info(e));  -  debug and heartbeat stuff, fucking useless just like me


  fs.readdir("./events/", (err, files) => {
      if (err) return console.error(err);
      files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
      });
    });
    
    client.commands = new Enmap();

    fs.readdir("./commands/", (err, files) => {
      if (err) return console.error(err);
      files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`${commandName} loaded`);
        client.commands.set(commandName, props);
      });
    });

    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
      const thisLevel = client.config.permLevels[i];
      client.levelCache[thisLevel.name] = thisLevel.level;
    }

    client.login(client.config.token);


