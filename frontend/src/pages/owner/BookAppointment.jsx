import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Stethoscope } from 'lucide-react';

const BookAppointment = () => {
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [formData, setFormData] = useState({ pet_id: '', vet_id: '', schedule_id: '', appointment_date: '', appointment_time: '', reason_for_visit: '' });
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, vetsRes] = await Promise.all([
          axios.get('http://localhost:5005/api/pets', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5005/api/vets')
        ]);
        setPets(petsRes.data);
        setVets(vetsRes.data);
        
        if (petsRes.data.length > 0) {
          setFormData(f => ({ ...f, pet_id: petsRes.data[0].pet_id }));
        }
        if (vetsRes.data.length > 0) {
          handleVetSelect(vetsRes.data[0].vet_id, vetsRes.data);
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleVetSelect = (vid, vetList = vets) => {
    const vet = vetList.find(v => v.vet_id === parseInt(vid));
    const sched = vet?.schedules?.[0]; // Default to first available schedule slot
    setFormData(f => ({ 
      ...f, 
      vet_id: parseInt(vid), 
      schedule_id: sched ? sched.schedule_id : '',
      appointment_time: sched ? sched.start_time : '09:00'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5005/api/appointments', formData, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/owner');
    } catch (err) { 
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-3"><CalendarIcon className="text-blue-600" /> Book an Appointment</h1>
      <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-7 border border-white shadow-sm">
        
        {/* Pet Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Pet to be seen</label>
          <select className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" 
            value={formData.pet_id} onChange={e => setFormData({...formData, pet_id: parseInt(e.target.value)})}>
            {pets.map(p => <option key={p.pet_id} value={p.pet_id}>{p.name} ({p.species})</option>)}
          </select>
        </div>

        {/* Vet Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Choose Veterinarian</label>
          <div className="relative">
            <Stethoscope className="absolute left-4 top-4 text-slate-400" size={18} />
            <select className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" 
              value={formData.vet_id} onChange={e => handleVetSelect(e.target.value)}>
              {vets.map(v => <option key={v.vet_id} value={v.vet_id}>Dr. {v.name} • {v.clinic_address}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
            <input type="date" required className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
              onChange={e => setFormData({...formData, appointment_date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Time Slot</label>
            <div className="relative">
              <Clock className="absolute left-4 top-4 text-slate-400" size={18} />
              <input type="time" required className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                value={formData.appointment_time} onChange={e => setFormData({...formData, appointment_time: e.target.value})} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Visit</label>
          <textarea rows="3" required className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm placeholder:text-slate-400" 
            placeholder="Briefly describe your pet's symptoms or the reason for this visit..."
            onChange={e => setFormData({...formData, reason_for_visit: e.target.value})} />
        </div>

        <div className="pt-4 flex gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-4 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition">Go Back</button>
          <button type="submit" className="flex-1 px-4 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgb(37,99,235,0.25)] hover:bg-blue-700 transition hover:-translate-y-0.5">Confirm Booking</button>
        </div>
      </form>
    </div>
  );
};
export default BookAppointment;
