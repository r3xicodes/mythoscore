import { SlashCommandBuilder } from 'discord.js';
import { DEFAULT_RACES } from '../../utils/constants.js';
import Lore from '../../database/models/Lore.js';

export default {
  data: new SlashCommandBuilder().setName('listraces').setDescription('List available races.'),
  async execute(interaction) {
    const customs = await Lore.find({ kind: 'race' }).lean();
    const all = [...DEFAULT_RACES, ...customs.map(c=>c.name)];
    const pages = [];
    for (let i=0;i<all.length;i+=10) pages.push(all.slice(i,i+10));
    const display = pages[0].map(r=>`• ${r}`).join('\n');
    await interaction.reply({ embeds: [{ title: '🧬 Races', description: display, footer: { text: `Page 1/${pages.length||1}` } }] });
  }
};