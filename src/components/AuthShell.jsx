import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BrandMark from './BrandMark.jsx';
import ProductPreview from './ProductPreview.jsx';

// Shared frame for sign in and create account: a brand panel beside the form, inside the same rounded window as the app.
export default function AuthShell({ headline, text, wide, children }) {
  return (
    <main className="auth">
      <div className="auth-window">
        <section className="auth-showcase">
          <Link to="/" className="auth-brand" aria-label="MediLynk home"><BrandMark size={34} /><span>MediLynk</span></Link>
          <div className="auth-pitch">
            <h1>{headline}</h1>
            <p>{text}</p>
          </div>
          <ProductPreview />
        </section>
        <section className="auth-panel">
          <Link to="/" className="auth-back"><ArrowLeft size={16} aria-hidden="true" />Back to home</Link>
          <div className={`auth-form-wrap${wide ? ' is-wide' : ''}`}>{children}</div>
        </section>
      </div>
    </main>
  );
}
