import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import ProofUpload from "../components/ProofUpload";
import {
  Trophy,
  Heart,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  Crown,
  X,
} from "lucide-react";

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [scores, setScores] = useState([]);
  const [charities, setCharities] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showScoreForm, setShowScoreForm] = useState(false);
  const [scoreForm, setScoreForm] = useState({ score: "", date: "" });
  const [editingScore, setEditingScore] = useState(null);

  const [showCharityForm, setShowCharityForm] = useState(false);
  const [charityForm, setCharityForm] = useState({
    charityId: user?.charity?.charityId?._id || "",
    percentage: user?.charity?.percentage || 10,
  });

  useEffect(() => {
    if (searchParams.get("subscribed") === "true") {
      toast.success("Subscription activated! Welcome aboard! 🎉");
      api.get("/auth/me").then((res) => updateUser(res.data));
    }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [scoresRes, charitiesRes] = await Promise.all([
        api.get("/scores").catch(() => ({ data: [] })),
        api.get("/charities"),
      ]);
      setScores(scoresRes.data);
      setCharities(charitiesRes.data);

      if (user?.subscription?.status === "active") {
        const resultsRes = await api
          .get("/draws/my-results")
          .catch(() => ({ data: [] }));
        setMyResults(resultsRes.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed =
    user?.subscription?.status === "active" || user?.role === "admin";

  const submitScore = async (e) => {
    e.preventDefault();
    try {
      if (editingScore) {
        const res = await api.put(`/scores/${editingScore._id}`, {
          score: Number(scoreForm.score),
        });
        setScores(
          scores.map((s) => (s._id === editingScore._id ? res.data : s)),
        );
        toast.success("Score updated!");
      } else {
        const res = await api.post("/scores", {
          score: Number(scoreForm.score),
          date: scoreForm.date,
        });
        setScores((prev) => [res.data, ...prev].slice(0, 5));
        toast.success("Score added!");
      }
      setScoreForm({ score: "", date: "" });
      setEditingScore(null);
      setShowScoreForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save score");
    }
  };

  const startEdit = (score) => {
    setEditingScore(score);
    setScoreForm({ score: score.score, date: score.date.slice(0, 10) });
    setShowScoreForm(true);
  };

  const deleteScore = async (id) => {
    if (!confirm("Delete this score?")) return;
    try {
      await api.delete(`/scores/${id}`);
      setScores((prev) => prev.filter((s) => s._id !== id));
      toast.success("Score deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const saveCharity = async (e) => {
    e.preventDefault();
    try {
      await api.post("/charities/select", charityForm);
      toast.success("Charity preference saved!");
      setShowCharityForm(false);
      const res = await api.get("/auth/me");
      updateUser(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save charity");
    }
  };

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]"
      >
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-emerald-400/30" />
      </div>
    );

  return (
    <div
      className="pt-24 pb-16 px-4 max-w-7xl mx-auto 
      bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-emerald-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here's your Digital Heroes overview
          </p>
        </div>

        {/* Banner */}
        {!isSubscribed && (
          <div
            className="bg-white/5 backdrop-blur-xl border border-emerald-400/30 
            rounded-2xl p-6 mb-8 flex justify-between items-center"
          >
            <div>
              <h3 className="text-white font-bold text-lg">
                Activate Your Subscription
              </h3>
              <p className="text-slate-400 text-sm">
                Subscribe to enter draws, log scores, and support charities.
              </p>
            </div>
            <button
              onClick={() => navigate("/subscribe")}
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 
              text-black font-semibold md:px-6 md:py-3 px-3 py-1 mt-23 md:mt-0 rounded-xl shadow-lg"
            >
              Subscribe Now
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Subscription",
              value: user?.subscription?.status || "inactive",
              icon: <Crown size={20} />,
              color: isSubscribed ? "text-emerald-400" : "text-red-400",
              sub: user?.subscription?.plan || "No plan",
            },
            {
              label: "Scores Logged",
              value: scores.length + "/5",
              icon: <TrendingUp size={20} />,
              color: "text-primary",
              sub: "Rolling 5 scores",
            },
            {
              label: "Total Won",
              value: `£${user?.totalWon?.toFixed(2) || "0.00"}`,
              icon: <Trophy size={20} />,
              color: "text-yellow-400",
              sub: "All time winnings",
            },
            {
              label: "Charity %",
              value: `${user?.charity?.percentage || 10}%`,
              icon: <Heart size={20} />,
              color: "text-rose-400",
              sub: "Of subscription",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-xl border border-white/10 
              rounded-2xl p-5 hover:border-emerald-400/40 transition"
            >
              <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
              <div className={`text-2xl font-black ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-white text-sm">{stat.label}</div>
              <div className="text-slate-500 text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scores Card */}
          {/* ── Score Entry ── */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-xl">Golf Scores</h2>
                <p className="text-slate-400 text-sm">
                  Last 5 Stableford scores
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingScore(null);
                  setScoreForm({ score: "", date: "" });
                  setShowScoreForm(!showScoreForm);
                }}
                className="flex items-center gap-2 bg-primary bg-emerald-400 text-dark font-semibold px-4 py-2 rounded-xl text-sm transition-colors hover:shadow-lg hover:shadow-emerald-400/90 hover:px-6 hover:py-3"
              >
                <Plus size={16} />
                Add Score
              </button>
            </div>

            {/* Score Form */}
            {showScoreForm && (
              <div className="bg-dark border border-border rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium text-sm">
                    {editingScore ? "Edit Score" : "New Score"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowScoreForm(false);
                      setEditingScore(null);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={submitScore} className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">
                      Stableford Score (1–45)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="45"
                      required
                      value={scoreForm.score}
                      onChange={(e) =>
                        setScoreForm({ ...scoreForm, score: e.target.value })
                      }
                      className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm"
                      placeholder="e.g. 32"
                    />
                  </div>
                  {!editingScore && (
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">
                        Date Played
                      </label>
                      <input
                        type="date"
                        required
                        max={new Date().toISOString().slice(0, 10)}
                        value={scoreForm.date}
                        onChange={(e) =>
                          setScoreForm({ ...scoreForm, date: e.target.value })
                        }
                        className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary bg-emerald-400 text-dark font-semibold py-2 rounded-xl text-sm transition-colors hover:shadow-lg hover:shadow-emerald-400/90 hover:px-6 hover:py-3"
                    >
                      {editingScore ? "Update" : "Save Score"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowScoreForm(false);
                        setEditingScore(null);
                      }}
                      className="px-4 border border-border text-slate-400 rounded-xl hover:border-slate-400 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Scores List */}
            {scores.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                No scores yet. Add your first score!
              </div>
            ) : (
              <div className="space-y-3">
                {scores.map((score, i) => (
                  <div
                    key={score._id}
                    className="flex items-center justify-between bg-dark rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/20 text-white rounded-xl flex items-center justify-center font-black text-lg">
                        {score.score}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {new Date(score.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {i === 0 ? "Most recent" : `${i + 1} scores ago`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(score)}
                        className="text-slate-400 hover:text-primary transition-colors p-1"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => deleteScore(score._id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Score progress bar */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Score slots used</span>
                <span>{scores.length}/5</span>
              </div>
              <div className="w-full bg-dark rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${(scores.length / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Charity Selection ── */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-xl">
                  Charity Support
                </h2>
                <p className="text-slate-400 text-sm">
                  Your subscription impact
                </p>
              </div>
              <button
                onClick={() => setShowCharityForm(!showCharityForm)}
                className="flex items-center gap-2 border border-border hover:border-primary text-slate-400 hover:text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors"
              >
                <Edit2 size={14} /> Change
              </button>
            </div>

            {/* Current Charity */}
            {user?.charity?.charityId ? (
              <div className="bg-dark rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-400/20 rounded-xl flex items-center justify-center">
                    <Heart size={18} className="text-rose-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {user.charity.charityId?.name || "Selected Charity"}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {user.charity.percentage}% of your subscription
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-dark rounded-xl p-4 mb-4 text-center text-slate-500 text-sm">
                No charity selected yet — click Change to pick one
              </div>
            )}

            {/* Charity Form */}
            {showCharityForm && (
              <form
                onSubmit={saveCharity}
                className="space-y-4 bg-dark rounded-xl p-4"
              >
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">
                    Select Charity
                  </label>
                  <select
                    required
                    value={charityForm.charityId}
                    onChange={(e) =>
                      setCharityForm({
                        ...charityForm,
                        charityId: e.target.value,
                      })
                    }
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm"
                  >
                    <option value="">Choose a charity...</option>
                    {charities.map((c) => (
                      <option key={c._id} value={c._id} style={{color: "black"}}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">
                    Donation % — {charityForm.percentage}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={charityForm.percentage}
                    onChange={(e) =>
                      setCharityForm({
                        ...charityForm,
                        percentage: Number(e.target.value),
                      })
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>10% (min)</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-rose-400 hover:bg-rose-300 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
                  >
                    Save Preference
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCharityForm(false)}
                    className="px-4 border border-border text-slate-400 rounded-xl hover:border-slate-400 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Results */}
        {isSubscribed && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-8">
            <h2 className="text-white font-bold text-xl mb-4">My Results</h2>

            {myResults.map((r, i) => (
              <div
                key={i}
                className="flex justify-between bg-black/30 p-4 rounded-xl mb-2"
              >
                <div>
                  <div className="text-white">{r.month}</div>
                  <div className="text-slate-400 text-sm">{r.matchType}</div>
                </div>
                <div className="text-emerald-400 font-bold">
                  £{r.prize?.toFixed(2)}
                </div>
              </div>
            ))}
            {myResults.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                <p>No draw results yet. Keep logging your scores!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myResults.map((result, i) => (
                  <div key={i} className="bg-dark rounded-xl px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-white font-medium">
                          {result.month}
                        </div>
                        <div className="text-slate-400 text-sm mt-1">
                          Match:{" "}
                          <span className="text-yellow-400 font-bold">
                            {result.matchType}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary font-black text-xl">
                          £{result.prize?.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1 text-xs mt-1 justify-end">
                          {result.paymentStatus === "paid" ? (
                            <>
                              <CheckCircle size={12} className="text-primary" />
                              <span className="text-primary">Paid</span>
                            </>
                          ) : (
                            <>
                              <Clock size={12} className="text-yellow-400" />
                              <span className="text-yellow-400">
                                Pending Payment
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Proof Upload */}
                    {result.verificationStatus !== "approved" &&
                      result.matchType && (
                        <ProofUpload drawId={result.drawId} />
                      )}

                    {result.verificationStatus === "approved" && (
                      <div className="mt-3 flex items-center gap-2 text-primary text-sm">
                        <CheckCircle size={14} /> Proof approved
                      </div>
                    )}
                    {result.verificationStatus === "rejected" && (
                      <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                        <X size={14} /> Proof rejected — please re-upload
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
