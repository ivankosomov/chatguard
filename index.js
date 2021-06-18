const { Discord, Client, MessageEmbed } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const cfg = require('./config.json');
global.cfg = cfg;
global.client = client;
const fs = require('fs');
const mongoose = require('mongoose');
client.adBlock = new Map()
client.spam = new Map()
mongoose.connect(cfg.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

fs.readdir("./events", (err, files) => {
    if(err) return console.error(err);
    files.filter(file => file.endsWith(".js")).forEach(file => {
        let prop = require(`./events/${file}`);
        if(!prop.configuration) return;
        client.on(prop.configuration.name, prop);
    });
});


client.on("message", async message => {
  const prefikslerim = ["?", ".", "!"];
  let fk = false;
  for (const içindeki of prefikslerim) {
    if (message.content.startsWith(içindeki)) fk = içindeki;
  }
  if (!fk) return;
  const args = message.content.slice(fk.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const event = message.content.toLower;
  const split = message.content.split('"');
  switch (command) {
    case "eval":
    case "hewal":
    if(!cfg.owner.includes(message.author.id)) return
    if (args.join(" ").toLowerCase().includes('token')) return message.channel.send("Token Girilmedi.")
    const clean = text => {
      if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    }
    try {
      const code = args.join(" ");
      let evaled = await eval(code);
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      await message.channel.send(clean(evaled), {
        code: "xl"
      });
    } catch (err) {
      await message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
    break;
  }
})

client.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
client.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
client.on("error", e => console.log(e))
client.on("warn", info => console.log(info));

process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik Hata: ", errorMsg);
    process.exit(1);
});

process.on("unhandledRejection", err => {
    console.error("Yakalanamayan Hata: ", err);
});

client.login(cfg.token)
.then(x => console.log("bağlandı"))
.catch(x => console.error("bağlanamadı"))