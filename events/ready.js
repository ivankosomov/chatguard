const cfg = require("../config.json")
const client = global.client;
module.exports = () => {
  console.log("Bot aktif!");
  client.user.setActivity(cfg.status);
  const x = client.channels.cache.get(cfg.sesKanalı)
  if(x) x.join().catch(err => console.log("bağlanmadı"))
}
module.exports.configuration = {
  name: "ready"
}