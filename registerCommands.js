const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("Enviar painel de tickets")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken("SEU_TOKEN");

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands("CLIENT_ID", "GUILD_ID"),
      { body: commands }
    );

    console.log("Comando /painel registrado!");
  } catch (error) {
    console.error(error);
  }
})();
