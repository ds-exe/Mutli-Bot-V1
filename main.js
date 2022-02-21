const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const bot = new Discord.Client();

const token = config.token;
const prefix = config.prefix

client.login(token); // Log in token pulled from .gitignore

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
 //Setting activity: "Now listening to !help"
  client.user.setActivity("!come", { type: "LISTENING" });
});
bot.on("error", console.error);
bot.login(token);