import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Trash2, Search } from 'lucide-react';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-white mb-10 tracking-tight">
          User Management
        </h1>

        {/* Search */}
        <div className="relative max-w-sm mb-8">
          <Search size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 
            rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 
            focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 
            transition-all text-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg">

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/5">
                <tr className="text-slate-400">
                  <th className="text-left px-6 py-4 font-medium">Name</th>
                  <th className="text-left px-6 py-4 font-medium">Email</th>
                  <th className="text-left px-6 py-4 font-medium">Role</th>
                  <th className="text-left px-6 py-4 font-medium">Subscription</th>
                  <th className="text-left px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(user => (
                  <tr
                    key={user._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-6 py-4 text-white font-medium">
                      {user.name}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-slate-400">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${user.role === 'admin'
                          ? 'bg-indigo-400/20 text-indigo-300'
                          : 'bg-slate-700/50 text-slate-300'}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Subscription */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${user.subscription.status === 'active'
                          ? 'bg-sky-400/20 text-sky-300'
                          : 'bg-red-400/20 text-red-400'}`}>
                        {user.subscription.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 rounded-lg hover:bg-red-400/10 text-red-400 hover:text-red-300 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}