import express from 'express';
import Score from '../models/Score.js';
import { protect, requireSubscription } from '../middleware/auth.js';

const router = express.Router();

// GET user's scores
router.get('/', protect, async (req, res) => {
  const scores = await Score.find({ userId: req.user._id })
    .sort({ date: -1 })
    .limit(5);
  res.json(scores);
});

// POST new score — enforces 5-score rolling limit
router.post('/', protect, async (req, res) => {
  try {
    const { score, date } = req.body;
    const scoreDate = new Date(date);
    scoreDate.setHours(0, 0, 0, 0);

    // Check duplicate date
    const existing = await Score.findOne({ userId: req.user._id, date: scoreDate });
    if (existing) return res.status(400).json({ message: 'Score for this date already exists' });

    // Validate range
    if (score < 1 || score > 45) return res.status(400).json({ message: 'Score must be between 1 and 45' });

    const scores = await Score.find({ userId: req.user._id }).sort({ date: 1 });

    // Rolling 5-score logic
    if (scores.length >= 5) {
      await Score.findByIdAndDelete(scores[0]._id); // remove oldest
    }

    const newScore = await Score.create({ userId: req.user._id, score, date: scoreDate });
    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT edit score
router.put('/:id', protect, async (req, res) => {
  const s = await Score.findOne({ _id: req.params.id, userId: req.user._id });
  if (!s) return res.status(404).json({ message: 'Score not found' });
  s.score = req.body.score ?? s.score;
  await s.save();
  res.json(s);
});

// DELETE score
router.delete('/:id', protect, async (req, res) => {
  await Score.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: 'Score deleted' });
});

export default router;