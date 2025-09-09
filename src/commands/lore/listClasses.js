import { SlashCommandBuilder } from 'discord.js';
import { DEFAULT_CLASSES } from '../../utils/constants.js';
import Lore from '../../database/models/Lore.js';

export default {
  data: new SlashCommandBuilder().setName('listclasses').setDescription('List available classes.'),
  async execute(interaction) {
    const customs = await Lore.find({ kind: 'class' }).lean();
    const all = [...DEFAULT_CLASSES, ...customs.map(c=>c.name)];
    const lines = all.map(c=>`• ${c}`).join('\n');
    await interaction.reply({ embeds: [{ title: '🛡️ Classes', description: lines }] });
  }
};