import { SlashCommandBuilder } from 'discord.js';
import Character from '../../database/models/Character.js';
import { DEFAULT_RACES, DEFAULT_CLASSES, DEFAULT_LANGUAGES } from '../../utils/constants.js';

export default {
  data: new SlashCommandBuilder()
    .setName('createcharacter')
    .setDescription('Create your character.')
    .addStringOption(o => o.setName('name').setDescription('Character name').setRequired(true))
    .addStringOption(o => o.setName('race').setDescription('Pick a race or type "custom"').setRequired(true)
      .addChoices(...DEFAULT_RACES.map(r => ({ name: r, value: r })), { name: 'Custom…', value: 'custom' }))
    .addStringOption(o => o.setName('class').setDescription('Pick a class or type "custom"').setRequired(true)
      .addChoices(...DEFAULT_CLASSES.map(c => ({ name: c, value: c })), { name: 'Custom…', value: 'custom' }))
    .addStringOption(o => o.setName('languages').setDescription('Comma-separated languages (or "default")').setRequired(false)),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    let race = interaction.options.getString('race');
    let klass = interaction.options.getString('class');
    const langsInput = interaction.options.getString('languages');

    if (race === 'custom') {
      await interaction.reply({ content: 'Please reply with your custom race name (30s)…', ephemeral: true });
      const collected = await interaction.channel.awaitMessages({ max: 1, time: 30000, filter: m => m.author.id === interaction.user.id });
      race = collected.first()?.content?.slice(0, 50) || 'Traveler';
    }
    if (klass === 'custom') {
      await interaction.followUp({ content: 'Custom class name? (30s)…', ephemeral: true });
      const collected2 = await interaction.channel.awaitMessages({ max: 1, time: 30000, filter: m => m.author.id === interaction.user.id });
      klass = collected2.first()?.content?.slice(0, 50) || 'Adventurer';
    }

    const languages = !langsInput || langsInput.toLowerCase() === 'default'
      ? DEFAULT_LANGUAGES.slice(0, 2)
      : langsInput.split(',').map(s => s.trim()).filter(Boolean).slice(0, 6);

    const existing = await Character.findOne({ userId: interaction.user.id });
    if (existing) return interaction.reply({ content: 'You already have a character. Use /editcharacter or /deletecharacter first.', ephemeral: true });

    const charDoc = await Character.create({ userId: interaction.user.id, name, race, class: klass, languages });
    return interaction.reply({ content: `✅ Created **${name}** (${race} ${klass}). Use /viewcharacter to see your sheet.`, ephemeral: true });
  }
};