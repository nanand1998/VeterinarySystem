import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Users, Activity, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, appointments: 0 });
  
  useEffect(() => {
    // Quick mock stats for now
    setStats({ users: 12, appointments: 45 });
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Admin Overview</h1>
        <p className="text-slate-500 mt-2 font-medium">Monitor clinic operations and users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-white shadow-sm flex items-center gap-6">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl"><Users size={32} /></div>
          <div><p className="text-slate-500 font-medium">Total Users</p><p className="text-3xl font-bold text-slate-800">{stats.users}</p></div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white shadow-sm flex items-center gap-6">
          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl"><Calendar size={32} /></div>
          <div><p className="text-slate-500 font-medium">Appointments</p><p className="text-3xl font-bold text-slate-800">{stats.appointments}</p></div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white shadow-sm flex items-center gap-6">
          <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl"><Activity size={32} /></div>
          <div><p className="text-slate-500 font-medium">System Status</p><p className="text-xl font-bold text-emerald-600 mt-1">Operational</p></div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
