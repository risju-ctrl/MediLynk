import { REJOIN_WINDOW_MIN } from '../utils/timeRules.js';

const mmss = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// REQ-07: Rejoin is offered first. The reschedule prompt only appears when rejoining fails
// or the 2-minute window runs out. Both roles see the same banner.
export default function RecoveryBanner({ state, secondsLeft, attempts, onRejoin, onReschedule }) {
  if (!['dropped', 'rejoining', 'failed'].includes(state)) return null;

  const showReschedule = state === 'failed';

  return (
    <div
      className={`rounded-xl border p-4 ${showReschedule ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}
      data-testid="recovery-banner"
      data-recovery-state={state}
    >
      <h3 className={`font-semibold ${showReschedule ? 'text-red-800' : 'text-amber-900'}`}>
        {showReschedule ? 'Rejoin failed — reschedule this consultation' : 'Connection lost'}
      </h3>
      <p className="mt-1 text-sm text-slate-700">
        {showReschedule
          ? `The call could not be restored within ${REJOIN_WINDOW_MIN} minutes. Rebook or reschedule so the consultation is not lost.`
          : `Press Rejoin to return to the consultation. Reschedule becomes available if rejoining fails within ${REJOIN_WINDOW_MIN} minutes.`}
      </p>
      <p className="mt-1 text-xs text-slate-500" data-testid="rejoin-countdown">
        Rejoin window: {mmss(secondsLeft)} left · attempts: {attempts}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={onRejoin}
          disabled={state === 'rejoining' || showReschedule}
          data-testid="rejoin-button"
        >
          {state === 'rejoining' ? 'Rejoining...' : 'Rejoin'}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={onReschedule}
          data-testid="reschedule-prompt-button"
        >
          {showReschedule ? 'Reschedule now' : 'Reschedule (optional)'}
        </button>
      </div>
    </div>
  );
}
