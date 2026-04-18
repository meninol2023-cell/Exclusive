require("./web/server");

const { 
  Client, 
  GatewayIntentBits, 
  Collection, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// ===== CARREGAR COMANDOS =====
const commandFiles = fs.readdirSync("./commands");
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// ===== EVENTOS =====
require("./events/interactionCreate")(client);

// ===== REGISTRAR /PAINEL AUTOMÁTICO =====
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("Enviar painel de tickets")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Comando /painel registrado!");
  } catch (error) {
    console.error(error);
  }
})();

// ===== BOT ONLINE =====
client.once("ready", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// ===== LOGIN =====
console.log("TOKEN:", process.env.TOKEN);
