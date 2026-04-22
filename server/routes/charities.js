import express from 'express';
import Charity from '../models/Charity.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/charities — public
router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find().sort({ isFeatured: -1, name: 1 });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/charities/:id — public
router.get('/:id', async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/charities/select — user selects a charity
router.post('/select', protect, async (req, res) => {
  try {
    const { charityId, percentage } = req.body;

    if (percentage < 10 || percentage > 100)
      return res.status(400).json({ message: 'Percentage must be between 10 and 100' });

    const charity = await Charity.findById(charityId);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });

    await User.findByIdAndUpdate(req.user._id, {
      'charity.charityId': charityId,
      'charity.percentage': percentage,
    });

    res.json({ message: 'Charity updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/charities/donate — standalone donation not tied to subscription
router.post('/donate', protect, async (req, res) => {
  try {
    const { charityId, amount } = req.body;

    if (!amount || amount < 1)
      return res.status(400).json({ message: 'Minimum donation is £1' });

    const charity = await Charity.findById(charityId);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });

    charity.totalReceived += Number(amount);
    await charity.save();

    res.json({ message: `Thank you! £${amount} donated to ${charity.name}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;