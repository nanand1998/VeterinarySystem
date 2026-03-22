import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Clock } from 'lucide-react';

const VetDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const res = await axios.get('http://localhost:5005/api/appointments', { headers: { Authorization: `Bearer ${token}` } });
        setAppointments(res.data);
      } catch (err) { console.error(err); }
    };
    fetchAppts();
  }, [token]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Vet Dashboard</h1>
        <p className="text-slate-500 mt-2 font-medium">Your schedule and patient appointments.</p>
      </div>
      
      <div className="glass rounded-3xl p-8 border border-white shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Clock /> Today's Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-slate-500">No appointments scheduled for today.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map(apt => (
              <div key={apt.appointment_id} className="bg-white p-5 border border-slate-100 rounded-2xl flex justify-between items-center hover:shadow-md transition">
                <div>
                  <p className="text-lg font-bold text-slate-800 mb-1">{apt.appointment_time} • {apt.pet.name}</p>
                  <p className="text-sm font-medium text-slate-500">Owner: {apt.pet_owner.name} <span className="mx-2">|</span> Status: <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{apt.status}</span></p>
                </div>
                <button className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-100 transition">View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default VetDashboard;
