import { SlashCommandBuilder } from 'discord.js';
import Blessing from '../../database/models/Blessing.js';
import { config } from '../../config.js';

export default {
  data: new SlashCommandBuilder().setName('removeblessing').setDescription('Owner: remove a user\'s rigging.')
    .addUserOption(o=>o.setName('user').setDescription('Target user').setRequired(true)),
  async execute(interaction) {
    if (interaction.user.id !== config.ownerId) return interaction.reply({ content: 'Owner only.', ephemeral: true });
    const user = interaction.options.getUser('user');
    await Blessing.findOneAndUpdate({ userId: user.id }, { active: false });
    return interaction.reply({ content: `🚫 Removed blessing from <@${user.id}>.`, ephemeral: true });
  }
};