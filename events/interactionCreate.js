const {
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {

    // ===== COMANDOS =====
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) command.execute(interaction);
    }

    // ===== BOTÕES =====
    if (interaction.isButton()) {

      const tipos = ["duvidas", "compras", "denuncias", "parceria", "outros"];

      // ===== CRIAR TICKET =====
      if (tipos.includes(interaction.customId)) {

        const user = interaction.user;
        const guild = interaction.guild;

        const existente = guild.channels.cache.find(c => c.name === `ticket-${user.username}`);
        if (existente) {
          return interaction.reply({
            content: "❌ Você já tem um ticket aberto!",
            ephemeral: true
          });
        }

        const categoria = await guild.channels.create({
          name: `Tickets - ${user.username}`,
          type: ChannelType.GuildCategory
        });

        const canal = await guild.channels.create({
          name: `ticket-${user.username}`,
          type: ChannelType.GuildText,
          parent: categoria.id,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: user.id,
              allow: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: process.env.STAFF_ROLE,
              allow: [PermissionsBitField.Flags.ViewChannel]
            }
          ]
        });

        const botoes = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("assumir_ticket")
            .setLabel("Assumir")
            .setEmoji("🛠️")
            .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
            .setCustomId("fechar_ticket")
            .setLabel("Fechar")
            .setEmoji("❌")
            .setStyle(ButtonStyle.Danger)
        );

        await canal.send({
          content: `🎫 ${user} abriu um ticket (${interaction.customId})\n\nAguarde atendimento.`,
          components: [botoes]
        });

        await interaction.reply({
          content: `✅ Ticket criado: ${canal}`,
          ephemeral: true
        });
      }

      // ===== ASSUMIR =====
      if (interaction.customId === "assumir_ticket") {

        if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE)) {
          return interaction.reply({
            content: "❌ Apenas staff pode assumir!",
            ephemeral: true
          });
        }

        await interaction.reply({
          content: `🛠️ ${interaction.user} assumiu o ticket!`
        });
      }

      // ===== FECHAR =====
      if (interaction.customId === "fechar_ticket") {

        if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE)) {
          return interaction.reply({
            content: "❌ Apenas staff pode fechar!",
            ephemeral: true
          });
        }

        await interaction.reply({
          content: "❌ Fechando em 5 segundos..."
        });

        setTimeout(() => {
          interaction.channel.delete().catch(() => {});
        }, 5000);
      }
    }
  });
};
