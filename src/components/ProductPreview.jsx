import { Bell, Video } from 'lucide-react';
import { Avatar } from './ui.jsx';

// A static illustration of the booking flow, built from the real UI pieces. Used on the landing and sign-in pages.
const DAYS = [['Mon', 26], ['Tue', 27], ['Wed', 28], ['Thu', 29], ['Fri', 30]];
const SLOTS = [['9:00', 'open'], ['9:30', 'open'], ['10:00', 'selected'], ['10:30', 'closed'], ['11:00', 'open'], ['2:00', 'open']];

export default function ProductPreview() {
  return (
    <div className="preview" aria-hidden="true">
      <div className="pv-card">
        <div className="pv-head">
          <Avatar name="Dr. Ana Cruz" size="lg" />
          <div><strong>Dr. Ana Cruz</strong><small>Internal Medicine</small></div>
          <span className="badge badge-positive">Accepting visits</span>
        </div>
        <div className="pv-days">
          {DAYS.map(([d, n]) => (
            <span key={n} className={n === 27 ? 'is-selected' : ''}><small>{d}</small><strong>{n}</strong></span>
          ))}
        </div>
        <div className="pv-slots">
          {SLOTS.map(([t, s]) => <span key={t} className={s === 'selected' ? 'is-selected' : s === 'closed' ? 'is-closed' : ''}>{t}</span>)}
        </div>
        <span className="pv-cta">Confirm appointment</span>
      </div>
      <div className="pv-float pv-reminder">
        <span className="pv-icon tone-amber"><Bell size={16} /></span>
        <div><strong>Reminder</strong><small>Your visit starts in 1 hour</small></div>
      </div>
      <div className="pv-float pv-video">
        <span className="pv-icon tone-teal"><Video size={16} /></span>
        <div><strong>Video room ready</strong><small>Join in one tap</small></div>
      </div>
    </div>
  );
}
