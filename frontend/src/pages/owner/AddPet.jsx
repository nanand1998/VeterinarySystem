import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const AddPet = () => {
  const [formData, setFormData] = useState({ name: '', species: 'Dog', breed: '', age: '' });
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5005"}/api/pets`, {
        ...formData,
        age: parseInt(formData.age) || null
      }, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/owner');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Add New Pet</h1>
      <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-5 border border-white shadow-sm">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" required onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Species</label>
          <select className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition bg-white" onChange={e => setFormData({...formData, species: e.target.value})}>
            <option>Dog</option><option>Cat</option><option>Bird</option><option>Other</option>
          </select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Breed</label>
          <input className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" onChange={e => setFormData({...formData, breed: e.target.value})} /></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Age (years)</label>
        <input type="number" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" onChange={e => setFormData({...formData, age: e.target.value})} /></div>
        <div className="pt-6 flex gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-4 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">Cancel</button>
          <button type="submit" className="flex-1 px-4 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-[0_8px_20px_rgb(37,99,235,0.25)] hover:bg-blue-700 transition hover:-translate-y-0.5">Save Pet</button>
        </div>
      </form>
    </div>
  );
};
export default AddPet;
