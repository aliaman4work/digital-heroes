import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

export default function CharityManager() {
  const [charities, setCharities] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    website: '',
    isFeatured: false
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    api.get('/charities')
      .then(res => setCharities(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/charities', form);
      toast.success('Charity added!');
      setForm({
        name: '',
        description: '',
        imageUrl: '',
        website: '',
        isFeatured: false
      });
      setShowForm(false);
      fetch();
    } catch {
      toast.error('Failed to add charity');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this charity?')) return;
    try {
      await api.delete(`/admin/charities/${id}`);
      toast.success('Charity deleted');
      fetch();
    } catch {
      toast.error('Failed to delete');
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
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Charity Manager
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create and manage supported charities
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 
            text-black font-semibold px-5 py-2.5 rounded-xl 
            transition-all shadow-lg shadow-emerald-400/20"
          >
            <Plus size={18} /> Add Charity
          </button>
        </div>

        {/* ───── Form Panel ───── */}
        {showForm && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 
            rounded-3xl p-6 mb-10 shadow-lg">

            <h2 className="text-white font-bold mb-5 text-lg">
              New Charity
            </h2>

            <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">

              {[
                { label: 'Name', key: 'name', required: true },
                { label: 'Website', key: 'website' },
                { label: 'Image URL', key: 'imageUrl' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-slate-400 text-sm mb-1">
                    {f.label}
                  </label>

                  <input
                    required={f.required}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 
                    text-white placeholder-slate-500
                    focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-sm"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-1">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 
                  text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                  text-sm h-24 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                  className="accent-emerald-400"
                />
                <span className="text-slate-300 text-sm">
                  Featured charity
                </span>
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-emerald-400 hover:bg-emerald-300 
                  text-black font-semibold px-6 py-2.5 rounded-xl 
                  shadow-lg shadow-emerald-400/20"
                >
                  Save Charity
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-white/10 text-slate-400 px-6 py-2.5 
                  rounded-xl hover:border-emerald-400/40 hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ───── Charity Cards ───── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {charities.map(c => (
            <div
              key={c._id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 
              rounded-3xl overflow-hidden transition-all 
              hover:border-emerald-400/40 hover:-translate-y-1"
            >

              <div className="relative">
                <img
                  src={c.imageUrl || 'https://placehold.co/400x300?text=Charity'}
                  alt={c.name}
                  className="w-full h-44 object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-5">
                <h3 className="text-white font-bold mb-1">
                  {c.name}
                </h3>

                <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                  {c.description}
                </p>

                <button
                  onClick={() => remove(c._id)}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 
                  text-sm transition-all"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}