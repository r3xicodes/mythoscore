import { SlashCommandBuilder } from 'discord.js';
import Character from '../../database/models/Character.js';
import Item from '../../database/models/Item.js';
import { characterSheetEmbed } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder().setName('viewcharacter').setDescription('View your character sheet.'),
  async execute(interaction) {
    const charDoc = await Character.findOne({ userId: interaction.user.id }).populate('inventory').populate('equipped.head equipped.torso equipped.arms equipped.legs equipped.mainHand equipped.offHand');
    if (!charDoc) return interaction.reply({ content: 'You have no character. Use /createcharacter.', ephemeral: true });

    const itemsById = new Map();
    [...(charDoc.inventory || [])].forEach(i => itemsById.set(i._id.toString(), i));
    const slots = charDoc.equipped || {};
    Object.values(slots).forEach(i => { if (i?._id) itemsById.set(i._id.toString(), i); });

    const embed = characterSheetEmbed(charDoc, itemsById);
    await interaction.reply({ embeds: [embed] });
  }
};