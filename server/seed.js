import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Charity from './models/Charity.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB...');

// Clear existing seed data
await User.deleteMany({ email: 'admin@digitalheroes.co.in' });
await Charity.deleteMany({});

// Create admin
await User.create({
  name: 'Admin',
  email: 'admin@digitalheroes.co.in',
  password: await bcrypt.hash('Admin@1234', 10),
  role: 'admin',
  subscription: { status: 'active', plan: 'yearly' },
});

// Create charities
await Charity.insertMany([
  {
    name: 'Golf Foundation',
    description: 'Helping underprivileged kids discover the game of golf.',
    imageUrl: 'https://placehold.co/400x300?text=Golf+Foundation',
    isFeatured: true,
    website: 'https://www.golffoundation.org',
  },
  {
    name: 'Green Future',
    description: 'Environmental charity focused on reforestation and sustainability.',
    imageUrl: 'https://placehold.co/400x300?text=Green+Future',
    isFeatured: false,
  },
  {
    name: 'Hearts & Holes',
    description: 'Supporting cardiac patients through golf therapy programmes.',
    imageUrl: 'https://placehold.co/400x300?text=Hearts+%26+Holes',
    isFeatured: false,
  },
]);

console.log('✅ Seed complete!');
console.log('Admin email: admin@digitalheroes.co.in');
console.log('Admin password: Admin@1234');
process.exit();