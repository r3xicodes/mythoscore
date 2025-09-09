import { SlashCommandBuilder } from 'discord.js';
import Lore from '../../database/models/Lore.js';

export default {
  data: new SlashCommandBuilder().setName('infolanguage').setDescription('Show lore for a language.')
    .addStringOption(o=>o.setName('name').setDescription('Language name').setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const lore = await Lore.findOne({ kind: 'language', name: new RegExp(`^${name}$`, 'i') });
    if (!lore) return interaction.reply({ content: 'No lore found for that language.', ephemeral: true });
    return interaction.reply({ embeds: [{ title: `Language: ${lore.name}`, description: lore.description || '—', fields: lore.stats ? [{ name: 'Notes', value: lore.stats }] : [] }] });
  }
};