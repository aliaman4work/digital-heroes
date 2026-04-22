import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Zap, Heart, ArrowRight, RefreshCw, Shield } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto 
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] relative overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-emerald-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-emerald-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            How It Works
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about playing, winning, and giving.
          </p>
        </div>

        {/* ───── Steps ───── */}
        <div className="space-y-6 mb-20">
          {[
            {
              step: '01',
              icon: <Zap size={26} className="text-emerald-400" />,
              title: 'Subscribe to a Plan',
              desc: 'Choose monthly (£10) or yearly (£99). Your subscription funds the prize pool and supports your chosen charity.',
            },
            {
              step: '02',
              icon: <Trophy size={26} className="text-emerald-400" />,
              title: 'Log Your Golf Scores',
              desc: 'Enter your Stableford scores. Your latest 5 scores become your draw numbers.',
            },
            {
              step: '03',
              icon: <RefreshCw size={26} className="text-emerald-400" />,
              title: 'Monthly Draw',
              desc: '5 winning numbers are drawn monthly. Match 3, 4, or 5 numbers to win prizes.',
            },
            {
              step: '04',
              icon: <Shield size={26} className="text-emerald-400" />,
              title: 'Winner Verification',
              desc: 'Upload proof of your scores. Admin verifies within 48 hours.',
            },
            {
              step: '05',
              icon: <Heart size={26} className="text-emerald-400" />,
              title: 'Get Paid & Give Back',
              desc: 'Receive your prize and support your chosen charity.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 
              rounded-3xl p-6 flex gap-6 items-start 
              hover:border-emerald-400/30 transition-all"
            >
              <div className="text-4xl font-black text-white/10 w-12 flex-shrink-0">
                {item.step}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  {item.icon}
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ───── Prize Table ───── */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 
          rounded-3xl p-8 mb-16 shadow-lg">

          <h2 className="text-white font-bold text-2xl mb-6 text-center">
            Prize Pool Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="text-left py-3 pr-4">Match Type</th>
                  <th className="text-left py-3 pr-4">Pool Share</th>
                  <th className="text-left py-3 pr-4">Rollover?</th>
                  <th className="text-left py-3">Example</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="py-4 pr-4 text-yellow-400 font-bold">5-Match</td>
                  <td className="py-4 pr-4 text-white font-bold">40%</td>
                  <td className="py-4 pr-4 text-emerald-400">✓ Yes</td>
                  <td className="py-4 text-slate-300">£200</td>
                </tr>

                <tr>
                  <td className="py-4 pr-4 text-emerald-400 font-bold">4-Match</td>
                  <td className="py-4 pr-4 text-white font-bold">35%</td>
                  <td className="py-4 pr-4 text-red-400">✗ No</td>
                  <td className="py-4 text-slate-300">£175</td>
                </tr>

                <tr>
                  <td className="py-4 pr-4 text-indigo-400 font-bold">3-Match</td>
                  <td className="py-4 pr-4 text-white font-bold">25%</td>
                  <td className="py-4 pr-4 text-red-400">✗ No</td>
                  <td className="py-4 text-slate-300">£125</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-500 text-xs mt-4">
            Example based on 100 subscribers. Prize pool split equally among winners.
          </p>
        </div>

        {/* ───── FAQ ───── */}
        <div className="mb-16">
          <h2 className="text-white font-bold text-2xl mb-6 text-center">
            Common Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'How are winning numbers chosen?',
                a: 'Randomly or algorithmically based on player scores.',
              },
              {
                q: 'What if nobody wins?',
                a: 'Jackpot rolls over to the next month.',
              },
              {
                q: 'Can I change charity?',
                a: 'Yes, anytime from dashboard.',
              },
              {
                q: 'What proof is needed?',
                a: 'Score screenshot from official platform.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl border border-white/10 
                rounded-2xl p-5 hover:border-emerald-400/30 transition-all"
              >
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ───── CTA ───── */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Play?
          </h2>

          <Link
            to="/register"
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 
            hover:opacity-90 text-black font-bold px-8 py-4 
            rounded-xl text-lg transition-all inline-flex items-center gap-2 
            shadow-lg shadow-emerald-400/20"
          >
            Get Started <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </div>
  );
}