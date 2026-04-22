import { useEffect, useState } from "react";
import api from "../api/axios";
import { Star, ExternalLink, Search, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(null);
  const [donateAmount, setDonateAmount] = useState(10);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/charities")
      .then((res) => setCharities(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = charities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="pt-24 pb-16 px-4 max-w-7xl mx-auto 
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] relative overflow-hidden"
    >
      {/* Glow Background (same as Home) */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Our Charities
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every subscription contributes to these amazing causes. Choose the
            one closest to your heart.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-12">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search charities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 
            rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 
            focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary 
            transition-all shadow-lg shadow-black/30"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div
              className="w-10 h-10 border-2 border-primary border-t-transparent 
              rounded-full animate-spin shadow-lg shadow-primary/30"
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((charity) => (
              <div
                key={charity._id}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 
                rounded-2xl overflow-hidden transition-all 
                hover:border-primary/40 hover:-translate-y-2 
                hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={
                      charity.imageUrl ||
                      "https://placehold.co/400x300?text=Charity"
                    }
                    alt={charity.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {charity.isFeatured && (
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium mb-2">
                      <Star size={12} /> Featured Charity
                    </div>
                  )}

                  <h3 className="text-white font-bold text-xl mb-2">
                    {charity.name}
                  </h3>

                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {charity.description}
                  </p>

                  {charity.website && (
                    <a
                      href={charity.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-sm 
                      hover:underline hover:text-emerald-300 transition"
                    >
                      Visit Website <ExternalLink size={14} />
                    </a>
                  )}

                  {/* Donate Button */}
                  {user && (
                    <div className="mt-4 pt-4 border-t border-border">
                      {donating === charity._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-sm">£</span>
                          <input
                            type="number"
                            min="1"
                            value={donateAmount}
                            onChange={(e) =>
                              setDonateAmount(Number(e.target.value))
                            }
                            className="w-20 bg-dark border border-border rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-primary"
                          />
                          <button
                            onClick={async () => {
                              try {
                                const res = await api.post(
                                  "/charities/donate",
                                  {
                                    charityId: charity._id,
                                    amount: donateAmount,
                                  },
                                );
                                toast.success(res.data.message);
                                setDonating(null);
                              } catch (err) {
                                toast.error(
                                  err.response?.data?.message ||
                                    "Donation failed",
                                );
                              }
                            }}
                            className="bg-rose-400 hover:bg-rose-300 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Donate
                          </button>
                          <button
                            onClick={() => setDonating(null)}
                            className="text-slate-500 hover:text-white text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDonating(charity._id)}
                          className="flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors"
                        >
                          <Heart size={14} /> Make a Donation
                        </button>
                      )}
                    </div>
                  )}

                  {charity.events?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-slate-400 text-xs font-medium mb-2 tracking-wide">
                        UPCOMING EVENTS
                      </p>

                      {charity.events.map((ev, i) => (
                        <div key={i} className="text-sm text-slate-300">
                          🗓 {ev.title} —{" "}
                          {new Date(ev.date).toLocaleDateString()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
