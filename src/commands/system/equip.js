import { SlashCommandBuilder } from 'discord.js';
import Character from '../../database/models/Character.js';
import Item from '../../database/models/Item.js';
import { EQUIP_SLOTS } from '../../utils/constants.js';

export default {
  data: new SlashCommandBuilder()
    .setName('equip')
    .setDescription('Equip an item by name into a slot.')
    .addStringOption(o => o.setName('item').setDescription('Item name').setRequired(true))
    .addStringOption(o => o.setName('slot').setDescription('Slot').setRequired(true)
      .addChoices(...EQUIP_SLOTS.map(s=>({ name: s, value: s })))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const itemName = interaction.options.getString('item');
    const slot = interaction.options.getString('slot');

    const charDoc = await Character.findOne({ userId: interaction.user.id }).populate('inventory');
    if (!charDoc) return interaction.editReply({ content: 'Create a character first.' });

    const item = charDoc.inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (!item) return interaction.editReply({ content: 'Item not found in your inventory.' });
    if (item.slot !== slot && item.slot !== 'none') {
      return interaction.editReply({ content: `That item is not compatible with **${slot}** (item slot: ${item.slot}).` });
    }

    charDoc.equipped[slot] = item._id;
    await charDoc.save();
    return interaction.editReply({ content: `✅ Equipped **${item.name}** to **${slot}**.` });
  }
};