import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import { EmptyState } from './components/ui.jsx';
import { homeRoute } from './utils/roles.js';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import Landing from './pages/public/Landing.jsx';
import Dashboard from './pages/patient/Dashboard.jsx';
import BookAppointment from './pages/patient/BookAppointment.jsx';
import MyAppointments from './pages/patient/MyAppointments.jsx';
import SymptomForm from './pages/patient/SymptomForm.jsx';
import History from './pages/patient/History.jsx';
import DoctorSchedule from './pages/doctor/Schedule.jsx';
import Consultations from './pages/doctor/Consultations.jsx';
import ConsultationRoom from './pages/doctor/ConsultationRoom.jsx';
import RecordNotes from './pages/doctor/RecordNotes.jsx';
import StaffAppointments from './pages/staff/Appointments.jsx';
import ConflictResolver from './pages/staff/ConflictResolver.jsx';
import AdminUsers from './pages/admin/Users.jsx';

function LandingGate() {
  const { user, loading } = useAuth();
  if (loading) return <div className="splash" role="status">Loading…</div>;
  return user ? <Navigate to={homeRoute(user.role)} replace /> : <Landing />;
}

function NotFound() {
  const { user } = useAuth();
  return (
    <div className="card card-pad narrow" data-testid="not-found">
      <EmptyState icon={Compass} title="We can’t find that page">The link may be old or mistyped.</EmptyState>
      <div className="center-row"><Link to={user ? homeRoute(user.role) : '/'} className="btn btn-primary">Go home</Link></div>
    </div>
  );
}

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingGate />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route path="/patient" element={<ProtectedRoute roles={['patient']}><Dashboard /></ProtectedRoute>} />
      <Route path="/patient/book" element={<ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute roles={['patient']}><MyAppointments /></ProtectedRoute>} />
      <Route path="/patient/symptoms" element={<ProtectedRoute roles={['patient']}><SymptomForm /></ProtectedRoute>} />
      <Route path="/patient/history" element={<ProtectedRoute roles={['patient']}><History /></ProtectedRoute>} />
      <Route path="/patient/room/:id" element={<ProtectedRoute roles={['patient']}><ConsultationRoom /></ProtectedRoute>} />
      <Route path="/doctor" element={<ProtectedRoute roles={['doctor']}><DoctorSchedule /></ProtectedRoute>} />
      <Route path="/doctor/consultations" element={<ProtectedRoute roles={['doctor']}><Consultations /></ProtectedRoute>} />
      <Route path="/doctor/room/:id" element={<ProtectedRoute roles={['doctor']}><ConsultationRoom /></ProtectedRoute>} />
      <Route path="/doctor/notes/:id" element={<ProtectedRoute roles={['doctor']}><RecordNotes /></ProtectedRoute>} />
      <Route path="/staff/appointments" element={<ProtectedRoute roles={['staff']}><StaffAppointments /></ProtectedRoute>} />
      <Route path="/staff/conflicts" element={<ProtectedRoute roles={['staff']}><ConflictResolver /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>;
}
