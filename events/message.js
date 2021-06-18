let capsLockSended = false;
let sended = false;
let emojiSended = false;
const cfg = require("../config.json")
const ms = require("ms");
const client = global.client;
module.exports = (message) => {
if (message.author.bot || !message.guild) return;
if (message.channel.id == cfg.genelchat) {
      if (message.activity !== null) {
        let obje = Object.values(message.activity)
        if (obje.includes(3)) {
          if(message.member.hasPermission("ADMINISTRATOR")) return
          message.delete().catch(e => console.error(e))
          message.channel.send("<@!" + message.author.id + "> Spotify paylaşımlarını genel sohbet kanalı üzerinde kullanma!").then(msg => msg.delete({ timeout: 5000 }))
        }
      }
  }
if (!message.member.hasPermission("ADMINISTRATOR")) {
        const reklam = [`discord.gg`, `.gg/`, `.gg /`, `. gg /`, `. gg/`, `discord .gg /`, `discord.gg /`, `discord .gg/`, `discord .gg`, `discord . gg`, `discord. gg`, `discord gg`, `discordgg`, `discord gg /`]
        if (reklam.some(word => message.content.toLowerCase().includes(word))) {
            let warnCount = client.adBlock.get(message.author.id) || 0
            client.adBlock.set(message.author.id, warnCount + 1)
            if (warnCount >= 3) {
                message.channel.send("Reklam yaptığınız için sunucudan atıldınız.")
                message.member.kick()
                message.delete()
            } else {
                let totalWarnCount = 3 - warnCount
                message.channel.send("Lütfen reklam yapmayınız devam ederseniz sunucudan atılacaksınız. Kalan uyarı hakkınız: **" + totalWarnCount + "**")
                message.delete()
            }
            setTimeout(() => {
                client.adBlock.delete(message.author.id)
            }, ms("30s"))
        }
    }
    if(!message.member.hasPermission("ADMINISTRATOR")) {
      const capsLockRegex = /[^A-ZĞÜŞİÖÇ]/g;
      const emojiRegex = /<a?:.+?:\d+>|[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
      if (message.content.replace(capsLockRegex, "").length >= message.content.length / 2) {
        if (message.content.length <= 5) return;
        if (message.deletable) message.delete();
        if (!capsLockSended) {
          message.channel.send("<@!"+ message.author.id +"> Caps kullanımı yasak.").then(x => x.delete({timeout: 5000}))
          capsLockSended = true;
          setTimeout(() => {
            capsLockSended = false;
          }, 10000);
        }
      } else if (emojiRegex.test(message.content) && message.content.match(emojiRegex).length > 3) {
        if (message.deletable) message.delete();
        if (!emojiSended) {
        message.channel.send("<@!"+ message.author.id +"> çok fazla emoji kullanıyorsun.").then((x) => x.delete({ timeout: 5000 }));
        emojiSended = true;
        setTimeout(() => {
          emojiSended = false;
        }, 10000);
      }
    }
  }
    if(!message.member.hasPermission("ADMINISTRATOR")) {
    if (client.spam.has(message.author.id)) {
      const data = client.spam.get(message.author.id);
      const { lastMessage, timer } = data;
      const diff = message.createdTimestamp - lastMessage.createdTimestamp;
      let count = data.count;
      if (diff > 7000) {
        clearTimeout(timer);
        data.count = 1;
        data.lastMessage = message;
        data.timer = setTimeout(() => {
          client.spam.delete(message.author.id);
        }, 10000);
        client.spam.set(message.author.id, data);
        sended = false;
      } else {
        count++;
        if (parseInt(count) === cfg.warnLimit) {
          let messages = message.channel.messages.fetch({ limit: 100 });
          let filtered = messages.filter((x) => x.author.id === message.author.id).array().splice(0, cfg.warnLimit);
          message.channel.bulkDelete(filtered);
          if (!sended) {
            sended = true;
            setTimeout(() => { sended = false }, 10000);
            return message.channel.send("<@!"+ message.author.id +"> Spam yapmaya devam etme.").then((x) => x.delete({ timeout: 6000 }));
          }
        }
        if (parseInt(count) === cfg.limit) {
          let messages = message.channel.messages.fetch({ limit: 100 });
          let filtered = messages
            .filter((x) => x.author.id === message.author.id)
            .array()
            .splice(0, cfg.limit - cfg.warnLimit);
          message.channel.bulkDelete(filtered);
          if (!sended) {
            sended = true;
            setTimeout(() => {
              sended = false
            }, 10000);
            message.channel.send("<@!"+ message.author.id +"> Spam yapmaya devam ettiğin için susturuldun "+ cfg.evetemoji +"").then((x) => x.delete({ timeout: 6000 }));
          }
          message.member.roles.add(cfg.mutedrole);
          setTimeout(() => {
            message.member.roles.remove(cfg.mutedrole);
          }, cfg.duration);
        } else {
          data.count = count;
          client.spam.set(message.author.id, data);
        }
      }
    } else {
      let fn = setTimeout(() => {
      client.spam.delete(message.author.id);
      }, 10000);
      client.spam.set(message.author.id, {
        count: 1,
        lastMessage: message,
        timer: fn,
      });
    }
  }
}
module.exports.configuration = {
  name: "message"
}
