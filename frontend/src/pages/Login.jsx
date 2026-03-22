import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Stethoscope } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [error, setError] = useState(null);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5005"}/api/auth/login`, { email, password, role });
      setAuth(res.data.user, res.data.token, res.data.role);
      navigate(`/${res.data.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full text-white mb-4">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Veterinary System Portal</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Login As</label>
            <select 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="owner">Pet Owner</option>
              <option value="vet">Veterinarian</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-blue-500/30">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have a pet owner account? <span onClick={() => navigate('/signup')} className="text-blue-600 cursor-pointer hover:underline font-medium">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
