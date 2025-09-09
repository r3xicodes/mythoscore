import { SlashCommandBuilder } from 'discord.js';
import Character from '../../database/models/Character.js';
import { DEFAULT_RACES, DEFAULT_CLASSES } from '../../utils/constants.js';

export default {
  data: new SlashCommandBuilder()
    .setName('editcharacter')
    .setDescription('Edit your character.')
    .addStringOption(o => o.setName('name').setDescription('New name'))
    .addStringOption(o => o.setName('race').setDescription('New race').addChoices(...DEFAULT_RACES.map(r=>({name:r,value:r})), {name:'Custom…',value:'custom'}))
    .addStringOption(o => o.setName('class').setDescription('New class').addChoices(...DEFAULT_CLASSES.map(c=>({name:c,value:c})), {name:'Custom…',value:'custom'}))
    .addIntegerOption(o => o.setName('level').setDescription('New level (1-20)').setMinValue(1).setMaxValue(20)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const doc = await Character.findOne({ userId: interaction.user.id });
    if (!doc) return interaction.editReply({ content: 'Create a character first with /createcharacter.' });

    const name = interaction.options.getString('name');
    let race = interaction.options.getString('race');
    let klass = interaction.options.getString('class');
    const level = interaction.options.getInteger('level');

    if (race === 'custom') {
      await interaction.editReply({ content: 'Custom race name? (30s)…' });
      const collected = await interaction.channel.awaitMessages({ max: 1, time: 30000, filter: m => m.author.id === interaction.user.id });
      race = collected.first()?.content?.slice(0,50) || doc.race;
    }
    if (klass === 'custom') {
      await interaction.followUp({ content: 'Custom class name? (30s)…' });
      const collected2 = await interaction.channel.awaitMessages({ max: 1, time: 30000, filter: m => m.author.id === interaction.user.id });
      klass = collected2.first()?.content?.slice(0,50) || doc.class;
    }

    if (name) doc.name = name;
    if (race) doc.race = race;
    if (klass) doc.class = klass;
    if (typeof level === 'number') doc.level = level;

    await doc.save();
    return interaction.editReply({ content: '✅ Character updated. Use /viewcharacter to see changes.' });
  }
};