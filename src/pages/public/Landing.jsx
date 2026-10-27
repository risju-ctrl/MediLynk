import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  CalendarCheck,
  Check,
  ClipboardList,
  LockKeyhole,
  Menu,
  RefreshCw,
  Video,
  X,
} from 'lucide-react';
import { logoLockup } from '../../utils/brandAssets.js';
import ProductPreview from '../../components/ProductPreview.jsx';
import BrandMark from '../../components/BrandMark.jsx';
import { Segmented } from '../../components/ui.jsx';

const FACTS = [
  ['24 h + 1 h', 'reminders before every visit'],
  ['3 channels', 'email, SMS and push'],
  ['2 minutes', 'to rejoin if a call drops'],
  ['10 seconds', 'target to connect to video'],
];

const STEPS = [
  { icon: CalendarCheck, tone: 'blue', title: 'Pick a doctor and a time', text: 'See open times for each doctor. The moment you confirm, the slot is yours and nobody else can book it.' },
  { icon: ClipboardList, tone: 'amber', title: 'Tell them what’s wrong', text: 'Write a few lines about your symptoms so your doctor arrives prepared. You can edit them until the visit.' },
  { icon: Video, tone: 'teal', title: 'Get reminded, then join', text: 'We remind you a day ahead and again an hour before. Open the video room from your phone or laptop.' },
];

const ROLES = {
  patients: {
    label: 'Patients',
    title: 'See a doctor without leaving home',
    points: ['Book, reschedule or cancel in a few taps', 'Reminders by email, SMS and push', 'Rejoin quickly if your connection drops', 'Your records in one private place'],
    cta: 'Create a patient account',
    to: '/register',
  },
  doctors: {
    label: 'Doctors',
    title: 'A calendar that fills itself',
    points: ['New bookings appear on your calendar within seconds', 'Accept requests and start consultations from one list', 'Read the patient’s symptoms before the call', 'Write notes straight into the medical record'],
    cta: 'Try the doctor demo',
    to: '/login',
  },
  staff: {
    label: 'Clinic staff',
    title: 'Fewer surprises at the front desk',
    points: ['See every appointment in the clinic at a glance', 'Failed calendar syncs are flagged for you to retry', 'Cancel or move visits without phone tag', 'Clinical details stay hidden unless your role allows them'],
    cta: 'Try the staff demo',
    to: '/login',
  },
};

const FAQ = [
  ['Is MediLynk a real clinic?', 'No. MediLynk is a student project built to show how a teleconsultation booking system can work. The data is sample data, nothing is sent to real people, and it shouldn’t be used for medical advice.'],
  ['How do reminders work?', 'Every visit gets six reminders: 24 hours and 1 hour before, on email, SMS and push. You can see the exact time each one is scheduled for. In this demo they’re simulated, so nothing is actually sent.'],
  ['What happens if my video call drops?', 'You’ll see a Rejoin button right away. If you can’t get back in within two minutes, you can reschedule the consultation so the visit isn’t lost.'],
  ['Who can see my medical records?', 'You and the doctor treating you. Diagnoses, prescriptions and notes are hidden from roles that don’t need them, such as front-desk staff.'],
  ['Can I change or cancel a booking?', 'Yes. Open Appointments, then choose Reschedule or Cancel while the visit is still requested or confirmed.'],
];

function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="lp-nav">
      <Link to="/" className="lp-brand" aria-label="MediLynk home" onClick={close}><img src={logoLockup} alt="MediLynk" height="34" /></Link>
      <nav className={`lp-links${open ? ' is-open' : ''}`} aria-label="Public navigation">
        <a href="#how" onClick={close}>How it works</a>
        <a href="#features" onClick={close}>Features</a>
        <a href="#roles" onClick={close}>Who it’s for</a>
        <a href="#faq" onClick={close}>FAQ</a>
        <Link to="/login" className="lp-signin" onClick={close}>Sign in</Link>
      </nav>
      <Link to="/register" className="btn btn-primary btn-sm lp-cta">Book a visit</Link>
      <button type="button" className="icon-btn lp-menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>
    </header>
  );
}

export default function Landing() {
  const [role, setRole] = useState('patients');
  const active = ROLES[role];

  return (
    <div className="lp">
      <div className="lp-shell">
        <Nav />

        <main>
          <section className="lp-hero">
            <div className="lp-hero-copy">
              <h1>Clinic visits, without the waiting room.</h1>
              <p>Book a video consultation in under a minute, send your symptoms ahead of time, and get reminders by email, SMS and push so you never miss a visit.</p>
              <div className="lp-actions">
                <Link to="/register" className="btn btn-primary btn-lg">Book an appointment <ArrowRight size={18} aria-hidden="true" /></Link>
                <Link to="/login" className="btn btn-secondary btn-lg">Try the demo</Link>
              </div>
              <ul className="lp-checks">
                <li><Check size={16} aria-hidden="true" />Demo accounts ready to explore</li>
                <li><Check size={16} aria-hidden="true" />Private by design</li>
              </ul>
            </div>
            <ProductPreview />
          </section>

          <section className="lp-facts" aria-label="At a glance">
            {FACTS.map(([big, small]) => (
              <div key={big}><strong>{big}</strong><span>{small}</span></div>
            ))}
          </section>

          <section id="how" className="lp-section">
            <div className="lp-head"><h2>Three steps from “I don’t feel well” to “see you at 10”.</h2></div>
            <div className="lp-steps">
              {STEPS.map(({ icon: Icon, tone, title, text }, index) => (
                <article key={title} className={`lp-step tone-${tone}-soft`}>
                  <span className="lp-step-top"><span className={`stat-icon tone-${tone}`}><Icon size={20} aria-hidden="true" /></span><span className="lp-step-n">Step {index + 1}</span></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="features" className="lp-section">
            <div className="lp-head"><h2>Built so nothing falls through the cracks.</h2><p>The small details that make a remote visit feel as reliable as walking in.</p></div>
            <div className="lp-bento">
              <article className="bento b-wide tone-blue-soft">
                <CalendarCheck size={22} aria-hidden="true" />
                <h3>Bookings that can’t collide</h3>
                <p>A time is held the moment you confirm. Two people can’t book the same slot, and visits keep a 10-minute buffer so doctors aren’t double-booked.</p>
              </article>
              <article className="bento tone-amber-soft">
                <Bell size={22} aria-hidden="true" />
                <h3>Reminders you’ll see</h3>
                <p>One a day ahead, one an hour before, on email, SMS and push.</p>
              </article>
              <article className="bento tone-teal-soft">
                <Video size={22} aria-hidden="true" />
                <h3>Video that recovers</h3>
                <p>Dropped call? Rejoin first. Still stuck after two minutes? Reschedule in one tap.</p>
              </article>
              <article className="bento tone-rose-soft">
                <LockKeyhole size={22} aria-hidden="true" />
                <h3>Private by default</h3>
                <p>Diagnoses, prescriptions and notes are only visible to the roles that need them.</p>
              </article>
              <article className="bento tone-sky-soft">
                <RefreshCw size={22} aria-hidden="true" />
                <h3>A doctor’s calendar that stays in sync</h3>
                <p>Bookings land on the doctor’s calendar within seconds. If a sync fails it’s retried once, then flagged for clinic staff to fix, so a visit never goes missing.</p>
              </article>
            </div>
          </section>

          <section id="roles" className="lp-section">
            <div className="lp-head"><h2>One system for the whole clinic.</h2></div>
            <div className="lp-roles">
              <Segmented label="Choose a role" value={role} onChange={setRole} options={Object.entries(ROLES).map(([value, r]) => ({ value, label: r.label }))} />
              <div className="lp-role-card">
                <div>
                  <h3>{active.title}</h3>
                  <ul>{active.points.map((point) => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}</ul>
                  <Link to={active.to} className="btn btn-primary">{active.cta} <ArrowRight size={16} aria-hidden="true" /></Link>
                </div>
                <div className="lp-role-art" aria-hidden="true"><BrandMark size={120} /></div>
              </div>
            </div>
          </section>

          <section className="lp-cta-band">
            <h2>Ready to see a doctor from where you are?</h2>
            <p>Create a free patient account, or explore the demo as a doctor or clinic staff member.</p>
            <div className="lp-actions center">
              <Link to="/register" className="btn btn-light btn-lg">Create an account</Link>
              <Link to="/login" className="btn btn-ghost-light btn-lg">Explore the demo</Link>
            </div>
          </section>

          <section id="faq" className="lp-section lp-faq">
            <div className="lp-head"><h2>Questions, answered.</h2></div>
            <div className="faq-list">
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>

        <footer className="lp-footer">
          <div className="lp-footer-top">
            <div className="lp-footer-brand"><BrandMark size={30} /><strong>MediLynk</strong><p>Clinic teleconsultation booking and reminders.</p></div>
            <nav aria-label="Footer">
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#faq">FAQ</a>
              <Link to="/login">Sign in</Link>
              <Link to="/register">Create account</Link>
            </nav>
          </div>
          <p className="lp-footer-note">Demo environment: all accounts and appointments are sample data and reset on reload. Not for real medical use. Built by BSIT 3IG2 · Group 4.</p>
        </footer>
      </div>
    </div>
  );
}
