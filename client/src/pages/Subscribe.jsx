import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Check, Zap, Crown } from 'lucide-react';

export default function Subscribe() {
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const handleSubscribe = async (plan) => {
    setLoading(plan);
    try {
      const res = await api.post('/subscriptions/create-checkout', { plan });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start checkout');
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '£10',
      period: '/month',
      icon: <Zap size={24} className="text-emerald-400" />,
      features: [
        'Enter monthly prize draws',
        'Track your golf scores',
        'Support your chosen charity',
        'Cancel anytime',
      ],
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '£99',
      period: '/year',
      icon: <Crown size={24} className="text-yellow-400" />,
      badge: 'Save 17%',
      features: [
        'Everything in Monthly',
        '2 months free',
        'Priority support',
        'Exclusive yearly badge',
      ],
      featured: true,
    },
  ];

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto 
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-emerald-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-slate-400 text-lg">
            Start competing and making an impact today
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 
              rounded-3xl p-8 transition-all duration-300 
              hover:-translate-y-2 hover:shadow-xl 
              ${plan.featured ? 'hover:shadow-yellow-400/20 border-yellow-400/30' : 'hover:shadow-emerald-400/10 hover:border-emerald-400/40'}`}
            >

              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 
                  bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-black/30">
                  {plan.icon}
                </div>
                <h2 className="text-white font-bold text-xl">
                  {plan.name}
                </h2>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-black text-white">
                  {plan.price}
                </span>
                <span className="text-slate-400 ml-1">
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i}
                    className="flex items-center gap-3 text-slate-300 text-sm">
                    <Check size={16} className="text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-semibold transition-all 
                ${plan.featured
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg'
                  : 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-black shadow-lg shadow-emerald-400/30'
                }
                hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50`}
              >
                {loading === plan.id ? 'Redirecting...' : `Subscribe ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-10">
          Payments are processed securely via Stripe. Cancel anytime from your dashboard.
        </p>

        {/* Skip */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-600 hover:text-slate-400 text-sm underline transition">
            Skip for now (testing only)
          </button>
        </div>
      </div>
    </div>
  );
}