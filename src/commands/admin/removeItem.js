import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Character from '../../database/models/Character.js';

export default {
  data: new SlashCommandBuilder()
    .setName('removeitem')
    .setDescription('Admin: remove an item from a user\'s inventory by name')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption(o=>o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o=>o.setName('name').setDescription('Item name').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const user = interaction.options.getUser('user');
    const name = interaction.options.getString('name');

    const charDoc = await Character.findOne({ userId: user.id }).populate('inventory');
    if (!charDoc) return interaction.editReply({ content: 'Target has no character.' });

    const idx = charDoc.inventory.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
    if (idx === -1) return interaction.editReply({ content: 'Item not found.' });

    const [removed] = charDoc.inventory.splice(idx,1);
    // Also unequip if equipped
    for (const slot of ['head','torso','arms','legs','mainHand','offHand']) {
      if (charDoc.equipped[slot]?.toString() === removed._id.toString()) {
        charDoc.equipped[slot] = null;
      }
    }
    await charDoc.save();

    return interaction.editReply({ content: `🗑️ Removed **${removed.name}** from <@${user.id}>.` });
  }
};