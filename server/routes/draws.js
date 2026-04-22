import express from 'express';
import Draw from '../models/Draw.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/draws — get all published draws
router.get('/', async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .populate('winners.userId', 'name email');
    res.json(draws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/draws/my-results — logged in user's draw history
router.get('/my-results', protect, async (req, res) => {
  try {
    const draws = await Draw.find({
      status: 'published',
      'winners.userId': req.user._id
    }).sort({ createdAt: -1 });

    const myResults = draws.map(draw => {
      const myWin = draw.winners.find(
        w => w.userId.toString() === req.user._id.toString()
      );
      return {
        drawId: draw._id,
        month: draw.month,
        winningNumbers: draw.winningNumbers,
        matchType: myWin?.matchType,
        prize: myWin?.prize,
        paymentStatus: myWin?.paymentStatus,
        verificationStatus: myWin?.verificationStatus,
        proofUrl: myWin?.proofUrl,
      };
    });

    res.json(myResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/draws/:drawId/upload-proof
router.post('/:drawId/upload-proof', protect, async (req, res) => {
  try {
    const { proofUrl } = req.body;
    const draw = await Draw.findById(req.params.drawId);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });

    const winner = draw.winners.find(
      w => w.userId.toString() === req.user._id.toString()
    );
    if (!winner) return res.status(404).json({ message: 'You are not a winner in this draw' });

    winner.proofUrl = proofUrl;
    await draw.save();
    res.json({ message: 'Proof uploaded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;