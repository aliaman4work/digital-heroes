import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscription: {
    status: { type: String, enum: ['active', 'inactive', 'cancelled', 'lapsed'], default: 'inactive' },
    plan: { type: String, enum: ['monthly', 'yearly'] },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date,
  },
  charity: {
    charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
    percentage: { type: Number, default: 10, min: 10, max: 100 },
  },
  totalWon: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);