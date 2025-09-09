import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['weapon','armor','trinket','consumable','misc'], default: 'misc' },
  slot: { type: String, enum: ['head','torso','arms','legs','mainHand','offHand','none'], default: 'none' },
  rarity: { type: String, enum: ['common','uncommon','rare','epic','legendary'], default: 'common' },
  effects: { type: String, default: '' },
  ownerUserId: { type: String, index: true }, // for player-bound items if desired
}, { timestamps: true });

export default mongoose.model('Item', ItemSchema);