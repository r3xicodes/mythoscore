import { SlashCommandBuilder } from 'discord.js';
import Blessing from '../../database/models/Blessing.js';
import { config } from '../../config.js';

export default {
  data: new SlashCommandBuilder().setName('auditrigged').setDescription('Owner: list all rigged users.'),
  async execute(interaction) {
    if (interaction.user.id !== config.ownerId) return interaction.reply({ content: 'Owner only.', ephemeral: true });
    const list = await Blessing.find({ active: true });
    const lines = list.length ? list.map(b => `• <@${b.userId}> — ${b.reason}`).join('\n') : 'None';
    return interaction.reply({ content: `📜 Rigged Users:\n${lines}`, ephemeral: true });
  }
};