import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { PawPrint, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5005"}/api/pets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [token]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">My Pets</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your pets and their medical history.</p>
        </div>
        <button 
          onClick={() => navigate('/owner/add-pet')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <PawPrint size={20} /> Add New Pet
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div></div>
      ) : pets.length === 0 ? (
        <div className="glass bg-white/50 rounded-3xl p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="bg-blue-100 text-blue-600 p-6 rounded-full mb-6">
            <PawPrint size={48} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">No pets added yet</h3>
          <p className="text-slate-500 mt-3 max-w-sm text-lg">Register your first pet to start tracking their medical history and booking appointments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map(pet => (
            <div key={pet.pet_id} className="glass bg-white/70 hover:bg-white transition-all duration-300 rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group hover:-translate-y-1">
               <div className="flex justify-between items-start mb-6">
                 <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                   <PawPrint size={28} />
                 </div>
                 <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">{pet.species}</span>
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-1">{pet.name}</h3>
               <p className="text-slate-500 font-medium mb-6">{pet.breed || 'Unknown breed'} • {pet.age ? `${pet.age} yrs` : 'Age unknown'}</p>
               
               <div className="pt-6 border-t border-slate-100 flex gap-3">
                 <button className="flex-1 bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-700 font-semibold py-2.5 rounded-xl transition flex justify-center items-center gap-2">
                    <Activity size={16} /> Records
                 </button>
                 <button onClick={() => navigate('/owner/book')} className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold py-2.5 rounded-xl transition flex justify-center items-center gap-2">
                    <Calendar size={16} /> Book
                 </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
