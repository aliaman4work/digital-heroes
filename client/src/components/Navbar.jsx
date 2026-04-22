import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Trophy, LogOut, LayoutDashboard, Heart } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Trophy size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">Digital Heroes</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/charities" className="text-slate-400 hover:text-primary transition-colors text-sm">
              Charities
            </Link>
            <Link to="/how-it-works" className="text-slate-400 hover:text-primary transition-colors text-sm">
              How It Works
            </Link>
            {!user ? (
              <>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Login
                </Link>
                <Link to="/register"
                  className="bg-primary hover:bg-emerald-400 text-slate-400 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-1">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-slate-400 hover:text-secondary transition-colors text-sm">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors text-sm">
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-slate-400" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-4">
          <Link to="/charities" onClick={() => setOpen(false)} className="text-slate-400 hover:text-primary">Charities</Link>
          <Link to="/how-it-works" onClick={() => setOpen(false)} className="text-slate-400 hover:text-primary">How It Works</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)}
                className="bg-emerald-500 text-gray-800 font-semibold px-4 py-2 rounded-lg text-center">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="text-slate-400 hover:text-primary">Dashboard</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setOpen(false)} className="text-slate-400 hover:text-secondary">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-left text-red-400">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}