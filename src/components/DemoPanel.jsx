import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FlaskConical } from 'lucide-react';
import { api } from '../api/mockServer.js';
import { clockOffsetMin, jumpClock, resetClock } from '../utils/timeRules.js';

// Demo tools: the four simulations the test plan needs. It lives in the toolbar so it never covers content.
// "Simulate two simultaneous requests" lives on the booking screen; "Simulate dropped call" in the room.
export default function DemoPanel() {
  const queryClient = useQueryClient();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [failSync, setFailSync] = useState(false);
  const [rejoinFails, setRejoinFails] = useState(false);
  const [clock, setClock] = useState(clockOffsetMin());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); };
    const esc = (event) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  const refresh = () => queryClient.invalidateQueries();

  const saveFlags = async (next) => {
    setBusy(true);
    await api('/demo/flags', { method: 'POST', body: next });
    setBusy(false);
    refresh();
  };

  const jump = (minutes) => {
    jumpClock(minutes);
    setClock(clockOffsetMin());
    refresh();
  };

  return (
    <div className="demo-tools" ref={ref}>
      <button type="button" className="btn btn-secondary btn-sm" aria-expanded={open} onClick={() => setOpen((value) => !value)} data-testid="demo-panel-toggle">
        <FlaskConical size={15} aria-hidden="true" />
        <span>Demo tools</span>
      </button>
      {open && (
        <div className="popover demo-popover" data-testid="demo-panel">
          <div className="popover-head">
            <strong>Demo tools</strong>
            <span>For testing only. Clock offset: {clock} min</span>
          </div>

          <label className="check">
            <input type="checkbox" checked={failSync} data-testid="demo-toggle-sync-failure" onChange={(event) => { setFailSync(event.target.checked); saveFlags({ failSync: event.target.checked }); }} />
            <span>Next calendar sync fails<small>Resets after each booking, so set it again per test.</small></span>
          </label>

          <label className="check">
            <input type="checkbox" checked={rejoinFails} data-testid="demo-toggle-rejoin-failure" onChange={(event) => { setRejoinFails(event.target.checked); saveFlags({ rejoinFails: event.target.checked }); }} />
            <span>Rejoin attempts fail</span>
          </label>

          <div className="demo-group">
            <span className="demo-label">Move the clock forward</span>
            <div className="demo-row">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => jump(60)} data-testid="demo-jump-1h">+1 h</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => jump(1440)} data-testid="demo-jump-24h">+24 h</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => jump(1500)} data-testid="demo-jump-25h">+25 h</button>
            </div>
            <button type="button" className="btn btn-secondary btn-sm btn-block" onClick={() => { resetClock(); setClock(0); refresh(); }} data-testid="demo-reset-clock">Reset clock</button>
          </div>

          <button
            type="button"
            className="btn btn-danger btn-sm btn-block"
            disabled={busy}
            data-testid="demo-reset-data"
            onClick={async () => {
              setBusy(true);
              await api('/demo/reset', { method: 'POST' });
              resetClock();
              setClock(0);
              setFailSync(false);
              setRejoinFails(false);
              setBusy(false);
              refresh();
            }}
          >
            Reset demo data
          </button>
        </div>
      )}
    </div>
  );
}
