import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(interaction, client) {
    await interaction.reply(`🏓 Pong! Latency is ${client.ws.ping}ms`);
  },
};
