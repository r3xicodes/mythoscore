import mongoose from 'mongoose';

const LoreSchema = new mongoose.Schema({
  kind: { type: String, enum: ['race','language','class'], required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  stats: { type: String, default: '' },
}, { timestamps: true });

LoreSchema.index({ kind: 1, name: 1 }, { unique: true });

export default mongoose.model('Lore', LoreSchema);