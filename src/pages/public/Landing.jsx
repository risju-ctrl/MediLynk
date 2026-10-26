import { Link } from 'react-router-dom';
import { logoLockup } from '../../utils/brandAssets.js';

const STEPS = [
  ['Choose a doctor and time', 'Open slots are shown for each doctor. A slot is held once you confirm.'],
  ['Describe your symptoms', 'Add a short note or attach files so the doctor can prepare.'],
  ['Get reminders, then join', 'You receive reminders before the visit and a link to the video consultation.'],
];

export default function Landing() {
  return <main className="landing-page">
    <header className="landing-nav">
      <Link to="/" className="landing-brand"><img className="brand-lockup-img" src={logoLockup} alt="MediLynk" /></Link>
      <nav aria-label="Public navigation"><Link to="/login">Sign in</Link><Link to="/register" className="btn-primary">Create account</Link></nav>
    </header>
    <section className="landing-hero">
      <div>
        <h1>Book clinic teleconsultations and get reminders for them</h1>
        <p>Patients book an online consultation, send their symptoms ahead of time, and receive SMS, email or app reminders. Doctors and clinic staff manage schedules and consultation records in the same system.</p>
        <div className="landing-actions"><Link to="/register" className="btn-primary">Book an appointment</Link><Link to="/login" className="btn-ghost">Sign in</Link></div>
      </div>
      <aside className="landing-panel" aria-label="How booking works">
        <h2>How booking works</h2>
        <ol>{STEPS.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}</ol>
      </aside>
    </section>
    <footer className="landing-note"><span>MediLynk teleconsultation prototype. Sample accounts use synthetic data.</span><span>BSIT 3I-G2 · Group 4</span></footer>
  </main>;
}
