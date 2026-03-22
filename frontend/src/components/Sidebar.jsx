import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, Calendar, Users, PawPrint, LogOut, Stethoscope } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (role === 'admin') {
      return [
        { name: 'Dashboard', icon: Home, path: '/admin' },
        { name: 'Vets', icon: Stethoscope, path: '/admin/vets' },
        { name: 'Appointments', icon: Calendar, path: '/admin/appointments' }
      ];
    }
    if (role === 'owner') {
      return [
        { name: 'My Pets', icon: PawPrint, path: '/owner' },
        { name: 'Book Appointment', icon: Calendar, path: '/owner/book' },
      ];
    }
    if (role === 'vet') {
      return [
        { name: 'Schedule', icon: Calendar, path: '/vet' },
        { name: 'Appointments', icon: Users, path: '/vet/appointments' }
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-[4px_0_24px_rgb(0,0,0,0.02)] z-10">
      <div className="p-8 pb-4 flex items-center gap-4 border-b border-slate-100">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-xl text-white shadow-blue-500/30 shadow-lg">
          <Stethoscope size={24} />
        </div>
        <span className="font-extrabold text-slate-800 text-xl tracking-tight leading-tight">VetClinic<br/><span className="text-blue-600 text-sm font-semibold tracking-normal">Portal</span></span>
      </div>

      <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || (link.path !== '/admin' && link.path !== '/owner' && link.path !== '/vet' && location.pathname.startsWith(link.path));
          return (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} strokeWidth={isActive ? 2.5 : 2} />
              {link.name}
            </button>
          );
        })}
      </div>

      <div className="p-6 border-t border-slate-100">
        <div className="mb-4 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-0.5">{role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-600 font-medium hover:bg-red-50 hover:text-red-600 rounded-xl transition"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
