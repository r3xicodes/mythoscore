import { SlashCommandBuilder } from 'discord.js';
import Character from '../../database/models/Character.js';
import Item from '../../database/models/Item.js';

export default {
  data: new SlashCommandBuilder().setName('inventory').setDescription('List your inventory.'),
  async execute(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const charDoc = await Character.findOne({ userId: interaction.user.id }).populate('inventory');
  if (!charDoc) return interaction.editReply({ content: 'Create a character first.' });
  const inv = charDoc.inventory || [];
  const lines = inv.length ? inv.map(i => `• ${i.name} [${i.rarity}] (${i.slot})`).join('\n') : '— Empty —';
  return interaction.editReply({ embeds: [{ title: `🎒 Inventory — ${charDoc.name}`, description: lines }] });
  }
};