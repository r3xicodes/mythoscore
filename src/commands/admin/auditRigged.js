import { SlashCommandBuilder } from 'discord.js';
import Blessing from '../../database/models/Blessing.js';
import { config } from '../../config.js';

export default {
  data: new SlashCommandBuilder().setName('auditrigged').setDescription('Owner: list all rigged users.'),
  async execute(interaction) {
  await interaction.deferReply({ ephemeral: true });
  if (interaction.user.id !== config.ownerId) return interaction.editReply({ content: 'Owner only.' });
  const list = await Blessing.find({ active: true });
  const lines = list.length ? list.map(b => `• <@${b.userId}> — ${b.reason}`).join('\n') : 'None';
  return interaction.editReply({ content: `� Rigged Users:\n${lines}` });
  }
};