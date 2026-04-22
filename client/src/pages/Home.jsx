import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trophy, Zap, Users, ArrowRight, Star } from 'lucide-react';
import api from '../api/axios';

export default function Home() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    api.get('/charities').then(res => setCharities(res.data.slice(0, 3)));
  }, []);

  return (
    <div className="pt-16 bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        
        {/* Glow Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-6 shadow-md">
              <Heart size={16} className="text-white" />
              <span className="text-gray-400 text-sm font-medium">
                Play Golf. Win Prizes. Change Lives.
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
              Your Game.<br />
              <span className="bg-gradient-to-r from-gray-800 to-emerald-400 bg-clip-text text-transparent">
                Their Future.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Subscribe, enter your golf scores, and compete in monthly prize draws —
              while every subscription powers real charity impact.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register"
                className="group bg-gradient-to-r from-primary to-emerald-400 
                hover:scale-[1.03] active:scale-[0.98]
                text-dark font-bold px-8 py-4 rounded-xl text-lg transition-all 
                flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-primary/30">
                Start Making Impact
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link to="/charities"
                className="border border-white/10 bg-white/5 backdrop-blur-md 
                hover:border-primary hover:bg-white/10 text-slate-300 hover:text-white 
                font-medium px-8 py-4 rounded-xl text-lg transition-all 
                w-full sm:w-auto text-center">
                View Charities
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white/5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Three simple steps to play, win, and give</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={32} className="text-primary" />,
                step: '01',
                title: 'Subscribe',
                desc: 'Choose a monthly or yearly plan. A portion goes straight to your chosen charity.',
              },
              {
                icon: <Trophy size={32} className="text-secondary" />,
                step: '02',
                title: 'Enter Scores',
                desc: 'Log your last 5 Stableford golf scores. Your numbers become your draw entries.',
              },
              {
                icon: <Heart size={32} className="text-rose-400" />,
                step: '03',
                title: 'Win & Give',
                desc: 'Monthly draws pay out real prizes while charities receive guaranteed contributions.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 
                hover:border-primary/40 rounded-2xl p-8 relative overflow-hidden 
                transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="absolute top-4 right-4 text-6xl font-black text-white/5">
                  {item.step}
                </div>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Pool */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Monthly Prize Pool</h2>
          <p className="text-slate-400 text-lg">Match numbers, win big</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { match: '5 Number Match', share: '40%', label: 'Jackpot', color: 'text-yellow-400' },
            { match: '4 Number Match', share: '35%', label: 'Major Prize', color: 'text-primary' },
            { match: '3 Number Match', share: '25%', label: 'Prize', color: 'text-secondary' },
          ].map((item, i) => (
            <div key={i}
              className="bg-white/5 backdrop-blur-lg border border-white/10 
              hover:border-primary/40 rounded-2xl p-8 text-center transition-all hover:scale-[1.03]">
              <div className={`text-5xl font-black mb-2 ${item.color}`}>{item.share}</div>
              <div className="text-white font-bold text-lg mb-1">{item.match}</div>
              <div className="text-slate-400 text-sm">{item.label}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 mt-8 text-sm">
          🔄 Jackpot rolls over to next month if unclaimed
        </p>
      </section>

      {/* Featured Charities */}
      {charities.length > 0 && (
        <section className="py-24 px-4 bg-white/5 backdrop-blur-md">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Charities We Support</h2>
              <p className="text-slate-400 text-lg">Your subscription makes a real difference</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {charities.map(charity => (
                <div key={charity._id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 
                  hover:border-primary/40 rounded-2xl overflow-hidden 
                  transition-all hover:-translate-y-1 hover:shadow-lg">
                  
                  <img src={charity.imageUrl} alt={charity.name}
                    className="w-full h-48 object-cover" />

                  <div className="p-6">
                    {charity.isFeatured && (
                      <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium mb-2">
                        <Star size={12} /> Featured
                      </div>
                    )}
                    <h3 className="text-white font-bold text-lg mb-2">{charity.name}</h3>
                    <p className="text-slate-400 text-sm">{charity.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/charities"
                className="border border-white/10 bg-white/5 backdrop-blur-md 
                hover:border-primary hover:bg-white/10 text-slate-300 hover:text-white 
                px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2">
                View All Charities <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '£10', label: 'Monthly Plan' },
            { value: '10%+', label: 'Goes to Charity' },
            { value: '3', label: 'Prize Tiers' },
            { value: '∞', label: 'Impact' },
          ].map((stat, i) => (
            <div key={i}
              className="bg-white/5 backdrop-blur-md border border-white/10 
              rounded-xl py-6 hover:border-primary/40 transition">
              <div className="text-4xl font-black text-primary mb-2">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary/10 to-emerald-400/10 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to be a Digital Hero?</h2>
          <p className="text-slate-400 text-lg mb-8">
            Join hundreds of golfers making a difference with every score they submit.
          </p>

          <Link to="/register"
            className="bg-gradient-to-r from-primary to-emerald-400 
            hover:scale-[1.03] text-dark font-bold px-10 py-4 rounded-xl 
            text-lg transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/30">
            <Users size={20} /> Join Now — It's Easy
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-slate-500 text-sm">
        © 2026 Digital Heroes · Built with purpose · digitalheroes.co.in
      </footer>
    </div>
  );
}