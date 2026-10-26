import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarCheck, CalendarDays, CalendarPlus, ClipboardList, FileText, LayoutDashboard, Stethoscope, TriangleAlert, Users } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { ROLE_LABELS } from '../utils/roles.js';
import BrandMark from './BrandMark.jsx';
import DemoPanel from './DemoPanel.jsx';

const NAV = {
  patient: [['/patient', 'Overview', LayoutDashboard], ['/patient/book', 'Book', CalendarPlus], ['/patient/appointments', 'Appointments', CalendarCheck], ['/patient/symptoms', 'Symptoms', ClipboardList], ['/patient/history', 'Records', FileText]],
  doctor: [['/doctor', 'Schedule', CalendarDays], ['/doctor/consultations', 'Consultations', Stethoscope]],
  staff: [['/staff/appointments', 'Appointments', CalendarCheck], ['/staff/conflicts', 'Conflict desk', TriangleAlert]],
  admin: [['/admin/users', 'Users', Users]],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV[user?.role] || [];
  const current = links.find(([to]) => window.location.pathname === to || (to !== '/patient' && window.location.pathname.startsWith(to)))?.[1] || links[0]?.[1];
  return <div className="app-shell">
    <aside className="sidebar">
      <a href="#main-content" className="brand-lockup" aria-label="MediLynk home"><BrandMark /><span>MediLynk</span></a>
      <div className="sidebar-caption">YOUR CARE</div>
      <nav className="side-nav" aria-label="Main navigation">{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to.split('/').length === 2} data-testid={`nav-${to.replace(/\//g, '-').replace(/^-/, '')}`} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Icon size={16} strokeWidth={1.5} aria-hidden="true" /><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-spacer" />
      
      <div className="profile-card"><span className="avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'M'}</span><div className="profile-copy"><strong>{user?.name}</strong><small>{ROLE_LABELS[user?.role]}</small></div><button type="button" className="signout-button" aria-label="Sign out" data-testid="logout-button" onClick={() => { logout(); navigate('/login'); }}>Sign out</button></div>
    </aside>
    <div className="main-column"><header className="topbar"><div className="breadcrumb"><span className="breadcrumb-root">MediLynk</span><span className="breadcrumb-separator">/</span><strong>{current}</strong></div><div className="topbar-actions"><span className="topbar-avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'M'}</span></div></header><main id="main-content" className="page-content"><Outlet /></main><footer className="page-footer">MediLynk · Care that fits your day</footer></div>
    {user && <DemoPanel />}
  </div>;
}
