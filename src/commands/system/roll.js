import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Blessing from '../../database/models/Blessing.js';
import { config } from '../../config.js';

function rollD20(rigged) {
  if (rigged) {
    // 15–20 inclusive
    return Math.floor(Math.random() * 6) + 15;
  }
  return Math.floor(Math.random() * 20) + 1;
}

export default {
  data: new SlashCommandBuilder().setName('roll').setDescription('Roll a d20.'),
  async execute(interaction) {
    const isOwner = interaction.user.id === config.ownerId;
    const bless = await Blessing.findOne({ userId: interaction.user.id, active: true });
    const rigged = Boolean(bless) || isOwner; // owner always enjoys blessing

    const value = rollD20(rigged);
    await interaction.reply({ content: `🎲 <@${interaction.user.id}> rolled **${value}** (d20)` });

    // Silent perk: if >=19, attempt to assign "God Ace" role
    const role = interaction.guild?.roles?.cache?.find(r => r.name.toLowerCase() === 'god ace');
    if (role && value >= 19) {
      const member = await interaction.guild.members.fetch(interaction.user.id).catch(()=>null);
      if (member && !member.roles.cache.has(role.id)) {
        await member.roles.add(role).catch(()=>{});
      }
    }
  }
};