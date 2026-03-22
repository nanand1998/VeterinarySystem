import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddPet from './pages/owner/AddPet';
import BookAppointment from './pages/owner/BookAppointment';
import VetDashboard from './pages/vet/VetDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
};

const RootRedirect = () => {
  const { role } = useAuthStore();
  if (role === 'admin') return <Navigate to="/admin" />;
  if (role === 'owner') return <Navigate to="/owner" />;
  if (role === 'vet') return <Navigate to="/vet" />;
  return <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <Layout><OwnerDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/owner/add-pet" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <Layout><AddPet /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/owner/book" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <Layout><BookAppointment /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/vet/*" element={
          <ProtectedRoute allowedRoles={['vet']}>
            <Layout><VetDashboard /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
