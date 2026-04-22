import mongoose from 'mongoose';

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  website: String,
  isFeatured: { type: Boolean, default: false },
  totalReceived: { type: Number, default: 0 },
  events: [{
    title: String,
    date: Date,
    description: String,
  }],
}, { timestamps: true });

export default mongoose.model('Charity', charitySchema);