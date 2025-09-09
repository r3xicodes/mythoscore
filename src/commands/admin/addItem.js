import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Item from '../../database/models/Item.js';
import Character from '../../database/models/Character.js';

export default {
  data: new SlashCommandBuilder()
    .setName('additem')
    .setDescription('Admin: add an item to a user\'s inventory')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption(o=>o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o=>o.setName('name').setDescription('Item name').setRequired(true))
    .addStringOption(o=>o.setName('slot').setDescription('Slot').setRequired(true)
      .addChoices(
        {name:'head',value:'head'},{name:'torso',value:'torso'},{name:'arms',value:'arms'},{name:'legs',value:'legs'},{name:'mainHand',value:'mainHand'},{name:'offHand',value:'offHand'},{name:'none',value:'none'}))
    .addStringOption(o=>o.setName('type').setDescription('Type').setRequired(true)
      .addChoices(
        {name:'weapon',value:'weapon'},{name:'armor',value:'armor'},{name:'trinket',value:'trinket'},{name:'consumable',value:'consumable'},{name:'misc',value:'misc'}))
    .addStringOption(o=>o.setName('rarity').setDescription('Rarity').setRequired(true)
      .addChoices(
        {name:'common',value:'common'},{name:'uncommon',value:'uncommon'},{name:'rare',value:'rare'},{name:'epic',value:'epic'},{name:'legendary',value:'legendary'}))
    .addStringOption(o=>o.setName('effects').setDescription('Effects/notes')),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const name = interaction.options.getString('name');
    const slot = interaction.options.getString('slot');
    const type = interaction.options.getString('type');
    const rarity = interaction.options.getString('rarity');
    const effects = interaction.options.getString('effects') || '';

    const charDoc = await Character.findOne({ userId: user.id });
    if (!charDoc) return interaction.reply({ content: 'Target has no character.', ephemeral: true });

    const item = await Item.create({ name, slot, type, rarity, effects, ownerUserId: user.id });
    charDoc.inventory.push(item._id);
    await charDoc.save();

    return interaction.reply({ content: `✅ Added **${name}** [${rarity}] (${slot}) to <@${user.id}>.`, ephemeral: true });
  }
};