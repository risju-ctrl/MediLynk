import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  TriangleAlert,
  Users,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { ROLE_LABELS } from '../utils/roles.js';
import { now } from '../utils/timeRules.js';
import BrandMark from './BrandMark.jsx';
import DemoPanel from './DemoPanel.jsx';
import { Avatar } from './ui.jsx';

// [path, label, short label for the phone tab bar, icon]
const NAV = {
  patient: [
    ['/patient', 'Home', 'Home', LayoutDashboard],
    ['/patient/book', 'Book a visit', 'Book', CalendarPlus],
    ['/patient/appointments', 'Appointments', 'Visits', CalendarCheck],
    ['/patient/symptoms', 'Symptoms', 'Symptoms', ClipboardList],
    ['/patient/history', 'Records', 'Records', FileText],
  ],
  doctor: [
    ['/doctor', 'Schedule', 'Schedule', CalendarDays],
    ['/doctor/consultations', 'Consultations', 'Visits', Stethoscope],
  ],
  staff: [
    ['/staff/appointments', 'Appointments', 'Visits', CalendarCheck],
    ['/staff/conflicts', 'Sync desk', 'Sync', TriangleAlert],
  ],
  admin: [['/admin/users', 'Users', 'Users', Users]],
};

function AccountMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <div className="account-menu" ref={ref}>
      <button type="button" className="icon-btn account-trigger" aria-label="Account" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <Avatar name={user?.name} size="sm" />
      </button>
      {open && (
        <div className="popover" role="menu">
          <div className="popover-head">
            <strong>{user?.name}</strong>
            <span>{ROLE_LABELS[user?.role]}</span>
          </div>
          <button type="button" className="popover-item" role="menuitem" data-testid="logout-button-mobile" onClick={onSignOut}>
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const links = NAV[user?.role] || [];
  const signOut = () => { logout(); navigate('/login'); };
  const today = now().toLocaleDateString('en-PH', { weekday: 'long', day: 'numeric', month: 'long' });

  // Move focus to the page when the route changes so keyboard and screen-reader users start at the top.
  const mainRef = useRef(null);
  useEffect(() => { mainRef.current?.scrollTo?.({ top: 0 }); }, [pathname]);

  return (
    <div className="desktop">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="window">
        <aside className="sidebar">
          <div className="brand-lockup" aria-label="MediLynk">
            <BrandMark size={30} />
            <span>MediLynk</span>
          </div>
          <nav className="side-nav" aria-label="Main navigation">
            {links.map(([to, label, , Icon]) => (
              <NavLink
                key={to}
                to={to}
                end={to.split('/').length === 2}
                data-testid={`nav-${to.replace(/\//g, '-').replace(/^-/, '')}`}
                className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-spacer" />
          <div className="profile-card">
            <Avatar name={user?.name} />
            <div className="profile-copy">
              <strong>{user?.name}</strong>
              <small>{ROLE_LABELS[user?.role]}</small>
            </div>
            <button type="button" className="icon-btn" aria-label="Sign out" title="Sign out" data-testid="logout-button" onClick={signOut}>
              <LogOut size={17} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </aside>

        <div className="main-column">
          <header className="toolbar">
            <div className="toolbar-brand"><BrandMark size={26} /><span>MediLynk</span></div>
            <time className="toolbar-date">{today}</time>
            <div className="toolbar-actions">
              {user && <DemoPanel />}
              <AccountMenu user={user} onSignOut={signOut} />
            </div>
          </header>
          <main id="main-content" className="content" ref={mainRef} tabIndex={-1}>
            <Outlet />
          </main>
        </div>

        <nav className="tabbar" aria-label="Main navigation">
          {links.map(([to, , short, Icon]) => (
            <NavLink key={to} to={to} end={to.split('/').length === 2} className={({ isActive }) => `tab-link${isActive ? ' active' : ''}`}>
              <Icon size={21} strokeWidth={1.75} aria-hidden="true" />
              <span>{short}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
