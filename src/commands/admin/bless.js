import { SlashCommandBuilder } from 'discord.js';
import Blessing from '../../database/models/Blessing.js';
import { config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('bless')
    .setDescription('Owner: secretly rig a user\'s dice (15–20).')
    .addUserOption(o=>o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o=>o.setName('reason').setDescription('Optional note')),
  async execute(interaction) {
  await interaction.deferReply({ ephemeral: true });
  if (interaction.user.id !== config.ownerId) return interaction.editReply({ content: 'Owner only.' });
  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason') || 'blessed by owner';
  await Blessing.findOneAndUpdate({ userId: user.id }, { userId: user.id, reason, active: true }, { upsert: true });
  return interaction.editReply({ content: `✅ Blessed <@${user.id}>.` });
  }
};