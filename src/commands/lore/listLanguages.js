import { SlashCommandBuilder } from 'discord.js';
import { DEFAULT_LANGUAGES } from '../../utils/constants.js';
import Lore from '../../database/models/Lore.js';

export default {
  data: new SlashCommandBuilder().setName('listlanguages').setDescription('List available languages.'),
  async execute(interaction) {
    const customs = await Lore.find({ kind: 'language' }).lean();
    const all = [...DEFAULT_LANGUAGES, ...customs.map(c=>c.name)];
    const lines = all.map(l=>`• ${l}`).join('\n');
    await interaction.reply({ embeds: [{ title: '🗣️ Languages', description: lines }] });
  }
};