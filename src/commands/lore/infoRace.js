import { SlashCommandBuilder } from 'discord.js';
import Lore from '../../database/models/Lore.js';

export default {
  data: new SlashCommandBuilder().setName('inforace').setDescription('Show lore for a race.')
    .addStringOption(o=>o.setName('name').setDescription('Race name').setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const lore = await Lore.findOne({ kind: 'race', name: new RegExp(`^${name}$`, 'i') });
    if (!lore) return interaction.reply({ content: 'No lore found for that race.', ephemeral: true });
    return interaction.reply({ embeds: [{ title: `Race: ${lore.name}`, description: lore.description || '—', fields: lore.stats ? [{ name: 'Stats', value: lore.stats }] : [] }] });
  }
};