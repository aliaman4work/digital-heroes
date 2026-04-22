import express from "express";
import User from "../models/User.js";
import Score from "../models/Score.js";
import Draw from "../models/Draw.js";
import Charity from "../models/Charity.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sendWinnerEmail, sendDrawResultsEmail } from "../utils/sendEmail.js";
import {
  generateWinningNumbers,
  findWinners,
  calculatePrizePool,
} from "../controllers/drawEngine.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ── USER MANAGEMENT ──────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("charity.charityId");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Score.deleteMany({ userId: req.params.id });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── CHARITY MANAGEMENT ───────────────────────────
router.post("/charities", async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/charities/:id", async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/charities/:id", async (req, res) => {
  try {
    await Charity.findByIdAndDelete(req.params.id);
    res.json({ message: "Charity deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DRAW MANAGEMENT ──────────────────────────────

// Simulate a draw (preview before publishing)
router.post("/draws/simulate", async (req, res) => {
  try {
    const { drawType = "random" } = req.body;
    const month = new Date().toISOString().slice(0, 7); // "2026-04"

    const winningNumbers = await generateWinningNumbers(drawType);
    const winners = await findWinners(winningNumbers);
    const prizePool = await calculatePrizePool();

    // Build winner entries
    const winnerEntries = [];
    const perWinner5 = winners["5-match"].length
      ? prizePool.fiveMatch / winners["5-match"].length
      : 0;
    const perWinner4 = winners["4-match"].length
      ? prizePool.fourMatch / winners["4-match"].length
      : 0;
    const perWinner3 = winners["3-match"].length
      ? prizePool.threeMatch / winners["3-match"].length
      : 0;

    winners["5-match"].forEach((uid) =>
      winnerEntries.push({
        userId: uid,
        matchType: "5-match",
        prize: perWinner5,
      }),
    );
    winners["4-match"].forEach((uid) =>
      winnerEntries.push({
        userId: uid,
        matchType: "4-match",
        prize: perWinner4,
      }),
    );
    winners["3-match"].forEach((uid) =>
      winnerEntries.push({
        userId: uid,
        matchType: "3-match",
        prize: perWinner3,
      }),
    );

    // Save or update draw as simulated
    let draw = await Draw.findOne({ month });
    if (!draw) {
      draw = new Draw({ month });
    }

    draw.winningNumbers = winningNumbers;
    draw.drawType = drawType;
    draw.prizePool = prizePool;
    draw.winners = winnerEntries;
    draw.status = "simulated";
    await draw.save();

    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Publish a draw
router.post("/draws/:id/publish", async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ message: "Draw not found" });
    if (draw.status === "published")
      return res.status(400).json({ message: "Draw already published" });

    draw.status = "published";

    // Handle jackpot rollover if no 5-match winner
    const fiveMatchWinners = draw.winners.filter(
      (w) => w.matchType === "5-match",
    );
    if (fiveMatchWinners.length === 0) {
      draw.jackpotRollover = draw.prizePool.fiveMatch;
    }

    // Update totalWon for each winner
    for (const winner of draw.winners) {
      await User.findByIdAndUpdate(winner.userId, {
        $inc: { totalWon: winner.prize },
      });
    }

    await draw.save();
    res.json(draw);
    // Send emails to all active users
    const allUsers = await User.find({ "subscription.status": "active" });
    for (const u of allUsers) {
      await sendDrawResultsEmail(
        u.email,
        u.name,
        draw.month,
        draw.winningNumbers,
      );
    }

    // Send winner emails
    for (const winner of draw.winners) {
      const winnerUser = await User.findById(winner.userId);
      if (winnerUser) {
        await sendWinnerEmail(
          winnerUser.email,
          winnerUser.name,
          winner.matchType,
          winner.prize,
          draw.month,
        );
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all draws (admin)
router.get("/draws", async (req, res) => {
  try {
    const draws = await Draw.find()
      .sort({ createdAt: -1 })
      .populate("winners.userId", "name email");
    res.json(draws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── WINNER VERIFICATION ──────────────────────────
router.put("/draws/:drawId/winners/:userId/verify", async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const draw = await Draw.findById(req.params.drawId);
    if (!draw) return res.status(404).json({ message: "Draw not found" });

    const winner = draw.winners.find(
      (w) => w.userId.toString() === req.params.userId,
    );
    if (!winner) return res.status(404).json({ message: "Winner not found" });

    winner.verificationStatus = status;
    await draw.save();
    res.json({ message: `Winner ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/draws/:drawId/winners/:userId/payout", async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.drawId);
    const winner = draw.winners.find(
      (w) => w.userId.toString() === req.params.userId,
    );
    if (!winner) return res.status(404).json({ message: "Winner not found" });

    winner.paymentStatus = "paid";
    await draw.save();
    res.json({ message: "Marked as paid" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ANALYTICS ────────────────────────────────────
router.get("/analytics", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeSubscribers = await User.countDocuments({
      "subscription.status": "active",
    });
    const totalDraws = await Draw.countDocuments({ status: "published" });
    const charities = await Charity.find().select("name totalReceived");

    const prizePool = await calculatePrizePool();

    res.json({
      totalUsers,
      activeSubscribers,
      totalDraws,
      estimatedPrizePool: prizePool.total,
      charities,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Temporary test route — force a win for testing
// router.post("/draws/force-test-win", async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const userScores = await Score.find({ userId }).sort({ date: -1 }).limit(5);
//     if (userScores.length < 3)
//       return res.status(400).json({ message: "User needs at least 3 scores" });

//     const winningNumbers = userScores.map((s) => s.score);
//     const month = new Date().toISOString().slice(0, 7);
//     const prizePool = await calculatePrizePool();

//     await Draw.deleteOne({ month });

//     const draw = await Draw.create({
//       month,
//       winningNumbers,
//       drawType: "random",
//       status: "published",
//       prizePool,
//       winners: [
//         {
//           userId,
//           matchType: "5-match",
//           prize: prizePool.fiveMatch || 100,
//           verificationStatus: "pending",
//           paymentStatus: "pending",
//         },
//       ],
//     });

//     await User.findByIdAndUpdate(userId, {
//       $inc: { totalWon: prizePool.fiveMatch || 100 },
//     });

//     res.json({ message: "Test win created!", draw });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

export default router;
