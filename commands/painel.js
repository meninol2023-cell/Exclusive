const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  name: "painel",

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle("🎫 Exclusive • Central de Atendimento")
      .setDescription(`
Bem-vindo à **Exclusive**!

Selecione uma opção abaixo para abrir um ticket.

━━━━━━━━━━━━━━━━━━

📌 **Regras:**
• Sem spam  
• Sem tickets desnecessários  
• Explique bem seu problema  

━━━━━━━━━━━━━━━━━━
`)
      .setImage(process.env.IMAGEM)
      .setColor("#6a0dad")
      .setFooter({ text: "Exclusive • Suporte" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("duvidas")
        .setLabel("Dúvidas")
        .setEmoji("❓")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("compras")
        .setLabel("Compras")
        .setEmoji("💰")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("denuncias")
        .setLabel("Denúncias")
        .setEmoji("🚨")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("parceria")
        .setLabel("Parceria")
        .setEmoji("🤝")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("outros")
        .setLabel("Outros")
        .setEmoji("📂")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
