import { SlashCommandBuilder } from 'discord.js';
import Character from '../../database/models/Character.js';

export default {
  data: new SlashCommandBuilder().setName('deletecharacter').setDescription('Delete your character.'),
  async execute(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const doc = await Character.findOne({ userId: interaction.user.id });
  if (!doc) return interaction.editReply({ content: 'No character to delete.' });
  await Character.deleteOne({ userId: interaction.user.id });
  return interaction.editReply({ content: '🗑️ Character deleted.' });
  }
};