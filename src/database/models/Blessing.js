import mongoose from 'mongoose';

const BlessingSchema = new mongoose.Schema({
  userId: { type: String, index: true, unique: true, required: true },
  reason: { type: String, default: 'blessed by owner' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Blessing', BlessingSchema);