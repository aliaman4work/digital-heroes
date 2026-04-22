import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Charities from './pages/Charities';
import Subscribe from './pages/Subscribe';
import HowItWorks from './pages/HowItWorks';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DrawManager from './pages/admin/DrawManager';
import UserManager from './pages/admin/UserManager';
import CharityManager from './pages/admin/CharityManager';
import Winners from './pages/admin/Winners';

export default function App() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/charities" element={<Charities />} />
        <Route path="/how-it-works" element={<HowItWorks />} />


        {/* Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/subscribe" element={
          <ProtectedRoute><Subscribe /></ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/draws" element={
          <AdminRoute><DrawManager /></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><UserManager /></AdminRoute>
        } />
        <Route path="/admin/charities" element={
          <AdminRoute><CharityManager /></AdminRoute>
        } />
        <Route path="/admin/winners" element={
          <AdminRoute><Winners /></AdminRoute>
        } />
      </Routes>
    </div>
  );
}