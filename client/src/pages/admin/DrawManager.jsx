import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Play, Send, RefreshCw } from 'lucide-react';

export default function DrawManager() {
  const [draws, setDraws] = useState([]);
  const [drawType, setDrawType] = useState('random');
  const [simulating, setSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDraws = () => {
    api.get('/admin/draws')
      .then(res => setDraws(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDraws(); }, []);

  const simulate = async () => {
    setSimulating(true);
    try {
      await api.post('/admin/draws/simulate', { drawType });
      toast.success('Draw simulated!');
      fetchDraws();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  const publish = async (id) => {
    try {
      await api.post(`/admin/draws/${id}/publish`);
      toast.success('Draw published!');
      fetchDraws();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Publish failed');
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto 
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] relative overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-10 tracking-tight">
          Draw Manager
        </h1>

        {/* ───── Controls Panel ───── */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-10 shadow-lg">
          <h2 className="text-white font-bold mb-5 text-lg">
            Run Monthly Draw
          </h2>

          <div className="flex flex-wrap items-center gap-4">

            {/* Select */}
            <select
              value={drawType}
              onChange={e => setDrawType(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-00 
              focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 text-sm"
            >
              <option value="random">Random Draw</option>
              <option value="algorithmic">Algorithmic Draw</option>
            </select>

            {/* Simulate */}
            <button
              onClick={simulate}
              disabled={simulating}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-400 to-blue-500 
              hover:opacity-90 disabled:opacity-50 text-black font-semibold px-5 py-2.5 
              rounded-xl transition-all shadow-lg shadow-sky-400/20"
            >
              <Play size={16} />
              {simulating ? 'Simulating...' : 'Simulate Draw'}
            </button>

            {/* Refresh */}
            <button
              onClick={fetchDraws}
              className="flex items-center gap-2 border border-white/10 hover:border-sky-400/40 
              text-slate-400 hover:text-white px-5 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          <p className="text-slate-500 text-sm mt-4">
            Simulate first to preview results, then publish to make it official.
          </p>
        </div>

        {/* ───── Draw Cards ───── */}
        <div className="space-y-5">

          {draws.map(draw => (
            <div
              key={draw._id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 
              rounded-3xl p-6 transition-all hover:border-sky-400/30"
            >

              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Draw — {draw.month}
                  </h3>

                  <span className={`text-xs font-medium px-3 py-1 rounded-full mt-1 inline-block
                    ${draw.status === 'published'
                      ? 'bg-sky-400/20 text-sky-300'
                      : draw.status === 'simulated'
                      ? 'bg-yellow-400/20 text-yellow-400'
                      : 'bg-slate-700/50 text-slate-400'}`}>
                    {draw.status.toUpperCase()}
                  </span>
                </div>

                {draw.status === 'simulated' && (
                  <button
                    onClick={() => publish(draw._id)}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-blue-500 
                    text-black font-semibold px-5 py-2 rounded-xl transition-all shadow-lg"
                  >
                    <Send size={16} /> Publish Draw
                  </button>
                )}
              </div>

              {/* Winning Numbers */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-slate-400 text-sm mr-2">
                  Winning Numbers:
                </span>

                {draw.winningNumbers.map(n => (
                  <span
                    key={n}
                    className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-500 
                    text-black rounded-full flex items-center justify-center 
                    text-sm font-bold shadow-md"
                  >
                    {n}
                  </span>
                ))}
              </div>

              {/* Prize Pools */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                  <div className="text-yellow-400 font-bold">
                    £{draw.prizePool?.fiveMatch?.toFixed(2)}
                  </div>
                  <div className="text-slate-500 text-xs">5-Match Pool</div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                  <div className="text-sky-400 font-bold">
                    £{draw.prizePool?.fourMatch?.toFixed(2)}
                  </div>
                  <div className="text-slate-500 text-xs">4-Match Pool</div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                  <div className="text-indigo-400 font-bold">
                    £{draw.prizePool?.threeMatch?.toFixed(2)}
                  </div>
                  <div className="text-slate-500 text-xs">3-Match Pool</div>
                </div>
              </div>

              {/* Winners */}
              {draw.winners.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-slate-400 text-sm">
                    Winners: <span className="text-white font-medium">{draw.winners.length}</span>
                  </p>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}