// Business rules copied from the MTP. The mock API enforces them; the UI only mirrors them for feedback.

export const BUFFER_MIN = 10; // REQ-01
export const SYNC_LIMIT_SEC = 5; // REQ-03
export const REMINDER_LEADS_H = [24, 1]; // REQ-04
export const REMINDER_TOLERANCE_MIN = 2; // REQ-04
export const REJOIN_WINDOW_MIN = 2; // REQ-07
export const VIDEO_START_LIMIT_SEC = 10; // REQ-08
export const SESSION_LENGTH_MIN = 10; // REQ-08

// Valid status transitions only (REQ-06). Anything not listed here is rejected by the API.
export const STATUS_FLOW = {
  requested: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
  no_show: [],
};

export const ACTIVE_STATUSES = ['requested', 'confirmed', 'in_progress'];

// A demo-only clock offset, so the prototype can show reminders without waiting a day.
let offsetMs = 0;
export const now = () => new Date(Date.now() + offsetMs);
export const clockOffsetMin = () => Math.round(offsetMs / 60000);
export const jumpClock = (minutes) => {
  offsetMs += minutes * 60000;
  return now();
};
export const resetClock = () => {
  offsetMs = 0;
};

export const isExpired = (start) => new Date(start).getTime() <= now().getTime();

export const violatesBuffer = (newStart, newEnd, existing) => {
  const buf = BUFFER_MIN * 60000;
  const s = new Date(newStart).getTime();
  const e = new Date(newEnd).getTime();
  return existing.some((a) => {
    const aStart = new Date(a.start).getTime();
    const aEnd = new Date(a.end).getTime();
    return s < aEnd + buf && e + buf > aStart;
  });
};

export const canTransition = (from, to) => (STATUS_FLOW[from] || []).includes(to);

// Display helpers shared by the screens.
export const fmtDateTime = (value) =>
  new Date(value).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
export const fmtDate = (value) => new Date(value).toLocaleDateString('en-PH', { dateStyle: 'medium' });
export const fmtTime = (value) =>
  new Date(value).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
export const toDateInput = (value = now()) => {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};
