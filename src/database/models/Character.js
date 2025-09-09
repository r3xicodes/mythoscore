import mongoose from 'mongoose';

const SlotEnum = ['head','torso','arms','legs','mainHand','offHand'];

const EquippedSchema = new mongoose.Schema({
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  torso: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  arms: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  legs: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  mainHand: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
  offHand: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null }
}, { _id: false });

const StatSchema = new mongoose.Schema({
  STR: { type: Number, default: 10 },
  DEX: { type: Number, default: 10 },
  CON: { type: Number, default: 10 },
  INT: { type: Number, default: 10 },
  WIS: { type: Number, default: 10 },
  CHA: { type: Number, default: 10 },
}, { _id: false });

const CharacterSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true, unique: true },
  name: { type: String, required: true },
  race: { type: String, required: true },
  class: { type: String, required: true },
  level: { type: Number, default: 1, min: 1 },
  languages: { type: [String], default: [] },
  gold: { type: Number, default: 0 },
  inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  equipped: { type: EquippedSchema, default: () => ({}) },
  stats: { type: StatSchema, default: () => ({}) },
}, { timestamps: true });

export default mongoose.model('Character', CharacterSchema);