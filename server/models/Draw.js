import mongoose from 'mongoose';

const drawSchema = new mongoose.Schema({
  month: { type: String, required: true }, // e.g. "2026-04"
  winningNumbers: [Number],
  status: { type: String, enum: ['pending', 'simulated', 'published'], default: 'pending' },
  drawType: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
  prizePool: {
    total: Number,
    fiveMatch: Number,
    fourMatch: Number,
    threeMatch: Number,
  },
  jackpotRollover: { type: Number, default: 0 },
  winners: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchType: { type: String, enum: ['5-match', '4-match', '3-match'] },
    prize: Number,
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    proofUrl: String,
  }],
}, { timestamps: true });

export default mongoose.model('Draw', drawSchema);