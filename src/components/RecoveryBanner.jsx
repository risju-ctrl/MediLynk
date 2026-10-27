import { WifiOff } from 'lucide-react';
import { REJOIN_WINDOW_MIN } from '../utils/timeRules.js';

const mmss = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// Rejoin is offered first. The reschedule prompt only appears when rejoining fails
// or the 2-minute window runs out. Both roles see the same banner.
export default function RecoveryBanner({ state, secondsLeft, attempts, onRejoin, onReschedule }) {
  if (!['dropped', 'rejoining', 'failed'].includes(state)) return null;

  const showReschedule = state === 'failed';

  return (
    <div className={`banner ${showReschedule ? 'banner-negative' : 'banner-warning'}`} data-testid="recovery-banner" data-recovery-state={state} role="alert">
      <span className="banner-icon"><WifiOff size={18} aria-hidden="true" /></span>
      <div className="banner-body">
        <h3>{showReschedule ? 'We couldn’t restore the call' : 'Connection lost'}</h3>
        <p>
          {showReschedule
            ? `The call wasn’t restored within ${REJOIN_WINDOW_MIN} minutes. Reschedule so the consultation isn’t lost.`
            : `Press Rejoin to get back in. If it doesn’t work within ${REJOIN_WINDOW_MIN} minutes you’ll be able to reschedule.`}
        </p>
        <p className="banner-meta" data-testid="rejoin-countdown">Rejoin window: {mmss(secondsLeft)} left · attempts: {attempts}</p>
      </div>
      <div className="banner-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={onRejoin} disabled={state === 'rejoining' || showReschedule} data-testid="rejoin-button">
          {state === 'rejoining' ? 'Rejoining…' : 'Rejoin'}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onReschedule} data-testid="reschedule-prompt-button">
          {showReschedule ? 'Reschedule now' : 'Reschedule instead'}
        </button>
      </div>
    </div>
  );
}
