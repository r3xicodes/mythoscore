import { SlashCommandBuilder } from 'discord.js';
import Blessing from '../../database/models/Blessing.js';
import { config } from '../../config.js';

export default {
  data: new SlashCommandBuilder().setName('removeblessing').setDescription('Owner: remove a user\'s rigging.')
    .addUserOption(o=>o.setName('user').setDescription('Target user').setRequired(true)),
  async execute(interaction) {
  await interaction.deferReply({ ephemeral: true });
  if (interaction.user.id !== config.ownerId) return interaction.editReply({ content: 'Owner only.' });
  const user = interaction.options.getUser('user');
  await Blessing.findOneAndUpdate({ userId: user.id }, { active: false });
  return interaction.editReply({ content: `🚫 Removed blessing from <@${user.id}>.` });
  }
};