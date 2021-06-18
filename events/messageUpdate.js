let capsLockSended = false;
let emojiSended = false;
const cfg = require("../config.json")
const ms = require("ms");
const client = global.client;
module.exports = (oldMessage, newMessage) => {
if (newMessage.author.bot) return;
if (!newMessage.member.hasPermission("ADMINISTRATOR")) {
        const reklam = [`discord.gg`, `.gg/`, `.gg /`, `. gg /`, `. gg/`, `discord .gg /`, `discord.gg /`, `discord .gg/`, `discord .gg`, `discord . gg`, `discord. gg`, `discord gg`, `discordgg`, `discord gg /`]
        if (reklam.some(word => newMessage.content.toLowerCase().includes(word))) {
            let warnCount = client.adBlock.get(newMessage.author.id) || 0
            client.adBlock.set(newMessage.author.id, warnCount + 1)
            if (warnCount >= 3) {
                newMessage.channel.send("Reklam yaptığınız için sunucudan atıldınız.")
                newMessage.member.kick()
                newMessage.delete()
            } else {
                let totalWarnCount = 3 - warnCount
                newMessage.channel.send("Lütfen reklam yapmayınız devam ederseniz sunucudan atılacaksınız. Kalan uyarı hakkınız: **" + totalWarnCount + "**")
                newMessage.delete()
            }
            setTimeout(() => {
                client.adBlock.delete(newMessage.author.id)
            }, ms("30s"))
        }
    }
    if(!newMessage.member.hasPermission("ADMINISTRATOR")) {
    const capsLockRegex = /[^A-ZĞÜŞİÖÇ]/g;
    const emojiRegex = /<a?:.+?:\d+>|[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
    if (newMessage.content.replace(capsLockRegex, "").length >= newMessage.content.length / 2) {
        if (newMessage.content.length <= 5) return;
        if (newMessage.deletable) newMessage.delete();
        if (!capsLockSended) {
          newMessage.channel.send("<@!"+ message.author.id +"> Caps kullanımı yasak.").then((x) => x.delete({ timeout: 6000 }));
          capsLockSended = true;
          setTimeout(() => {
            capsLockSended = false;
          }, 10000);
        }
      } else if (emojiRegex.test(newMessage.content) && newMessage.content.match(emojiRegex).length > 3) {
        if (newMessage.deletable) newMessage.delete();
        if (!emojiSended) {
          newMessage.channel.send("<@!"+ message.author.id +"> çok fazla emoji kullanıyorsun.").then((x) => x.delete({ timeout: 6000 }));
          emojiSended = true;
          setTimeout(() => {
            emojiSended = false;
          }, 10000);
        }
      }
}


}
module.exports.configuration = {
  name: "messageUpdate"
}