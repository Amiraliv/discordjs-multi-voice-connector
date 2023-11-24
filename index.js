const { readFileSync } = require("node:fs");
const { Client } = require("discord.js-selfbot");
const { guildID, channels } = require("./config.json");


let Tokens = readFileSync("Tokens.txt", "utf-8")
  .trim()
  .replace(/\r/gi, "")
  .split("\n");
  
if(!Tokens[0]) return console.error("Not Found Token in (Tokens.txt) file");
const UniqueTokens = new Array(...new Set(Tokens));

async function joining(client) {
  const guild = await client.guilds.cache.get(guildID);
  const index = Math.floor(Math.random() * channels.length);
  const channel = await guild.channels.cache.get(channels[index])


  channel.join().then(() => {
    console.log(client.user.tag, "join to", channel.name)
  })
}


async function connect(token) {
  let client = new Client();
  client.login(token).then(() => console.log("connect to", client.user.tag));

  client.on("ready", () => {

    joining(client);
    setInterval(() => {
      joining(client);
    }, 1000 * 60 * 10);
  })
}

Promise.all(
  UniqueTokens.map(async (token) => {
    await connect(token);
  })
);


process.on("unhandledRejection", (err) => {
  return console.error("process has Error:", err.message);
})
