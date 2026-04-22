import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 45 },
  date: { type: Date, required: true },
}, { timestamps: true });

// Compound unique index — one score per user per date
scoreSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('Score', scoreSchema);