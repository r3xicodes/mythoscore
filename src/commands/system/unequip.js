import { SlashCommandBuilder } from 'discord.js';
import Character from '../../database/models/Character.js';
import { EQUIP_SLOTS } from '../../utils/constants.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unequip')
    .setDescription('Unequip an item from a slot.')
    .addStringOption(o => o.setName('slot').setDescription('Slot').setRequired(true)
      .addChoices(...EQUIP_SLOTS.map(s=>({ name: s, value: s })))),
  async execute(interaction) {
    const slot = interaction.options.getString('slot');
    const charDoc = await Character.findOne({ userId: interaction.user.id });
    if (!charDoc) return interaction.reply({ content: 'Create a character first.', ephemeral: true });
    charDoc.equipped[slot] = null;
    await charDoc.save();
    return interaction.reply({ content: `✅ Unequipped **${slot}**.`, ephemeral: true });
  }
};