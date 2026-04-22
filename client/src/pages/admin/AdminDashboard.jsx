import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Users, Trophy, Heart, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={24} />, color: 'text-sky-400' },
    { label: 'Active Subscribers', value: stats.activeSubscribers, icon: <TrendingUp size={24} />, color: 'text-indigo-400' },
    { label: 'Total Draws', value: stats.totalDraws, icon: <Trophy size={24} />, color: 'text-yellow-400' },
    { label: 'Est. Prize Pool', value: `£${stats.estimatedPrizePool?.toFixed(2)}`, icon: <Heart size={24} />, color: 'text-rose-400' },
  ] : [];

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto 
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Manage users, draws, charities and winners
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 
                  rounded-3xl p-6 transition-all duration-300 
                  hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-400/10"
                >
                  <div className={`mb-3 ${card.color}`}>
                    {card.icon}
                  </div>

                  <div className="text-3xl font-black text-white mb-1">
                    {card.value}
                  </div>

                  <div className="text-slate-400 text-sm">
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  to: '/admin/users',
                  label: 'Manage Users',
                  desc: 'View and edit user accounts',
                  hover: 'hover:border-sky-400/40 hover:shadow-sky-400/10'
                },
                {
                  to: '/admin/draws',
                  label: 'Draw Manager',
                  desc: 'Run simulations and publish draws',
                  hover: 'hover:border-indigo-400/40 hover:shadow-indigo-400/10'
                },
                {
                  to: '/admin/charities',
                  label: 'Charities',
                  desc: 'Add and manage charities',
                  hover: 'hover:border-rose-400/40 hover:shadow-rose-400/10'
                },
                {
                  to: '/admin/winners',
                  label: 'Winners',
                  desc: 'Verify and manage payouts',
                  hover: 'hover:border-yellow-400/40 hover:shadow-yellow-400/10'
                },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  className={`group bg-white/5 backdrop-blur-xl border border-white/10 
                  rounded-3xl p-6 transition-all duration-300 
                  hover:-translate-y-1 ${link.hover}`}
                >
                  <h3 className="text-white font-bold mb-2 group-hover:text-white">
                    {link.label}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {link.desc}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}