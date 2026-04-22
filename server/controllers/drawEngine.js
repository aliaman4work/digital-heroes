import Score from '../models/Score.js';
import User from '../models/User.js';
import Draw from '../models/Draw.js';

// Generate 5 winning numbers (random or algorithmic)
export const generateWinningNumbers = async (type = 'random') => {
  if (type === 'random') {
    const nums = new Set();
    while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1);
    return [...nums];
  }

  // Algorithmic: pick 5 least frequent scores among active users
  const activeUsers = await User.find({ 'subscription.status': 'active' });
  const userIds = activeUsers.map(u => u._id);
  const scores = await Score.find({ userId: { $in: userIds } });

  const freq = {};
  scores.forEach(s => { freq[s.score] = (freq[s.score] || 0) + 1; });

  const all = Array.from({ length: 45 }, (_, i) => i + 1);
  all.sort((a, b) => (freq[a] || 0) - (freq[b] || 0));
  return all.slice(0, 5);
};

// Find winners by comparing user scores to winning numbers
export const findWinners = async (winningNumbers) => {
  const activeUsers = await User.find({ 'subscription.status': 'active' });
  const winners = { '5-match': [], '4-match': [], '3-match': [] };

  for (const user of activeUsers) {
    const scores = await Score.find({ userId: user._id });
    const userNums = scores.map(s => s.score);
    const matches = userNums.filter(n => winningNumbers.includes(n)).length;

    if (matches === 5) winners['5-match'].push(user._id);
    else if (matches === 4) winners['4-match'].push(user._id);
    else if (matches === 3) winners['3-match'].push(user._id);
  }

  return winners;
};

// Calculate prize pools from subscriber count
export const calculatePrizePool = async (rollover = 0) => {
  const MONTHLY_PRICE = 10; // £10/month example
  const POOL_CONTRIBUTION = 0.5; // 50% goes to prize pool
  const activeCount = await User.countDocuments({ 'subscription.status': 'active' });
  const total = (activeCount * MONTHLY_PRICE * POOL_CONTRIBUTION) + rollover;

  return {
    total,
    fiveMatch: total * 0.4,
    fourMatch: total * 0.35,
    threeMatch: total * 0.25,
  };
};