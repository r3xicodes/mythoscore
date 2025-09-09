import { SlashCommandBuilder } from 'discord.js';
import Character from '../../database/models/Character.js';

export default {
  data: new SlashCommandBuilder().setName('deletecharacter').setDescription('Delete your character.'),
  async execute(interaction) {
    const doc = await Character.findOne({ userId: interaction.user.id });
    if (!doc) return interaction.reply({ content: 'No character to delete.', ephemeral: true });
    await Character.deleteOne({ userId: interaction.user.id });
    return interaction.reply({ content: '🗑️ Character deleted.', ephemeral: true });
  }
};