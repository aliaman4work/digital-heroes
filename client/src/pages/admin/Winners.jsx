import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, DollarSign } from 'lucide-react';

export default function Winners() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    api.get('/admin/draws')
      .then(res =>
        setDraws(res.data.filter(d => d.status === 'published' && d.winners.length > 0))
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const verify = async (drawId, userId, status) => {
    try {
      await api.put(`/admin/draws/${drawId}/winners/${userId}/verify`, { status });
      toast.success(`Winner ${status}`);
      fetch();
    } catch {
      toast.error('Failed to update');
    }
  };

  const payout = async (drawId, userId) => {
    try {
      await api.put(`/admin/draws/${drawId}/winners/${userId}/payout`);
      toast.success('Marked as paid');
      fetch();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto 
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] relative overflow-hidden">

      {/* Emerald Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-emerald-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-10 tracking-tight">
          Winners & Verification
        </h1>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : draws.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No published draws with winners yet.
          </div>
        ) : (

          <div className="space-y-6">

            {draws.map(draw => (
              <div
                key={draw._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 
                rounded-3xl p-6 shadow-lg transition-all hover:border-emerald-400/30"
              >

                {/* Draw Title */}
                <h2 className="text-white font-bold text-lg mb-5">
                  Draw — {draw.month}
                </h2>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">

                    <thead className="border-b border-white/10">
                      <tr className="text-slate-400">
                        <th className="text-left py-3 pr-4">Winner</th>
                        <th className="text-left py-3 pr-4">Match</th>
                        <th className="text-left py-3 pr-4">Prize</th>
                        <th className="text-left py-3 pr-4">Verification</th>
                        <th className="text-left py-3 pr-4">Payment</th>
                        <th className="text-left py-3">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {draw.winners.map(w => (
                        <tr
                          key={w._id}
                          className="border-b border-white/5 hover:bg-white/5 transition-all"
                        >

                          <td className="py-3 pr-4 text-white">
                            {w.userId?.name || 'Unknown'}
                          </td>

                          <td className="py-3 pr-4">
                            <span className="text-yellow-400 font-medium">
                              {w.matchType}
                            </span>
                          </td>

                          <td className="py-3 pr-4 text-emerald-400 font-bold">
                            £{w.prize?.toFixed(2)}
                          </td>

                          {/* Verification */}
                          <td className="py-3 pr-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                              ${w.verificationStatus === 'approved'
                                ? 'bg-emerald-400/20 text-emerald-400'
                                : w.verificationStatus === 'rejected'
                                ? 'bg-red-400/20 text-red-400'
                                : 'bg-yellow-400/20 text-yellow-400'}`}>
                              {w.verificationStatus}
                            </span>
                          </td>

                          {/* Payment */}
                          <td className="py-3 pr-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                              ${w.paymentStatus === 'paid'
                                ? 'bg-emerald-400/20 text-emerald-400'
                                : 'bg-slate-700/50 text-slate-400'}`}>
                              {w.paymentStatus}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3">
                            <div className="flex items-center gap-3">

                              {w.verificationStatus === 'pending' && (
                                <>
                                  <button
                                    onClick={() => verify(draw._id, w.userId?._id, 'approved')}
                                    className="text-emerald-400 hover:text-emerald-300 transition-all"
                                    title="Approve"
                                  >
                                    <CheckCircle size={18} />
                                  </button>

                                  <button
                                    onClick={() => verify(draw._id, w.userId?._id, 'rejected')}
                                    className="text-red-400 hover:text-red-300 transition-all"
                                    title="Reject"
                                  >
                                    <XCircle size={18} />
                                  </button>
                                </>
                              )}

                              {w.verificationStatus === 'approved' && w.paymentStatus === 'pending' && (
                                <button
                                  onClick={() => payout(draw._id, w.userId?._id)}
                                  className="text-yellow-400 hover:text-yellow-300 transition-all"
                                  title="Mark Paid"
                                >
                                  <DollarSign size={18} />
                                </button>
                              )}

                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}