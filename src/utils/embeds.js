import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const characterSheetEmbed = (character, itemsById) => {
  const invList = (character.inventory || []).map(it => itemsById?.get(it.toString())?.name || `• ${it}`).join(', ') || '—';
  const eq = character.equipped || {};
  const eqNames = (slot) => (eq?.[slot] && itemsById?.get(eq[slot]?.toString())?.name) || '—';

  return new EmbedBuilder()
    .setTitle(`🧙 Character Sheet: ${character.name}`)
    .addFields(
      { name: 'Race', value: character.race, inline: true },
      { name: 'Class', value: character.class, inline: true },
      { name: 'Level', value: String(character.level), inline: true },
      { name: 'Stats', value: `STR ${character.stats.STR}  DEX ${character.stats.DEX}  CON ${character.stats.CON}\nINT ${character.stats.INT}  WIS ${character.stats.WIS}  CHA ${character.stats.CHA}` },
      { name: 'Equipped', value: `Head: ${eqNames('head')}\nTorso: ${eqNames('torso')}\nArms: ${eqNames('arms')}\nLegs: ${eqNames('legs')}\nMain Hand: ${eqNames('mainHand')}\nOffhand: ${eqNames('offHand')}` },
      { name: 'Inventory', value: invList }
    )
    .setFooter({ text: 'Use /equip, /unequip, /inventory to manage items' });
};

export const pagerRow = (page, max) => new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId('prev').setLabel('Prev').setStyle(ButtonStyle.Secondary).setDisabled(page<=0),
  new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Secondary).setDisabled(page>=max)
);