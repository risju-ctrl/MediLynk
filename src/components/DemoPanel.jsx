import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import { api } from '../api/mockServer.js';
import { clockOffsetMin, jumpClock, resetClock } from '../utils/timeRules.js';

// Clearly labelled test panel: the four simulations the MTP test conditions need.
// Simultaneous booking lives on the booking screen; dropped call lives in the consultation room.
export default function DemoPanel() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [failSync, setFailSync] = useState(false);
  const [rejoinFails, setRejoinFails] = useState(false);
  const [clock, setClock] = useState(clockOffsetMin());
  const [busy, setBusy] = useState(false);

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
    <div className="fixed bottom-4 right-4 z-50 text-sm">
      {open && (
        <div className="mb-2 w-72 rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-lg" data-testid="demo-panel">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Prototype only · demo/test panel</p>
          <p className="mt-1 text-xs text-amber-900">Clock offset: {clock} minutes</p>

          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={failSync}
                data-testid="demo-toggle-sync-failure"
                onChange={(event) => {
                  setFailSync(event.target.checked);
                  saveFlags({ failSync: event.target.checked });
                }}
              />
              Next calendar sync fails
            </label>
            <p className="text-[11px] text-amber-800">Each booking still resumes the normal path, so set it again per test.</p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1">
            <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => jump(60)} data-testid="demo-jump-1h">
              +1 h
            </button>
            <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => jump(1440)} data-testid="demo-jump-24h">
              +24 h
            </button>
            <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => jump(1500)} data-testid="demo-jump-25h">
              +25 h
            </button>
          </div>
          <button
            type="button"
            className="btn-ghost mt-1 w-full px-2 py-1 text-xs"
            onClick={() => {
              resetClock();
              setClock(0);
              refresh();
            }}
            data-testid="demo-reset-clock"
          >
            Reset clock
          </button>

          <label className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={rejoinFails}
              data-testid="demo-toggle-rejoin-failure"
              onChange={(event) => {
                setRejoinFails(event.target.checked);
                saveFlags({ rejoinFails: event.target.checked });
              }}
            />
            Rejoin attempts fail
          </label>

          <button
            type="button"
            className="btn-danger mt-3 w-full px-2 py-1 text-xs"
            disabled={busy}
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
            data-testid="demo-reset-data"
          >
            Reset demo data
          </button>
        </div>
      )}

      <button
        type="button"
        className="btn-ghost shadow-md"
        onClick={() => setOpen((value) => !value)}
        data-testid="demo-panel-toggle"
      >
        <SlidersHorizontal size={16} aria-hidden="true" />
        {open ? 'Hide test panel' : 'Test panel'}
      </button>
    </div>
  );
}
