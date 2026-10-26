import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { rescheduleAppointment, setAppointmentStatus } from '../../api/appointments.js';
import { api } from '../../api/mockServer.js';
import { usePermission } from '../../auth/usePermission.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import { useVideoSession } from '../../hooks/useVideoSession.js';
import RecoveryBanner from '../../components/RecoveryBanner.jsx';
import ReschedulePanel from '../../components/ReschedulePanel.jsx';
import { SESSION_LENGTH_MIN, VIDEO_START_LIMIT_SEC, fmtTime } from '../../utils/timeRules.js';

const mmss = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export default function ConsultationRoom() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { is, role } = usePermission();
  const { data } = useAppointments();
  const appointment = (data?.appointments || []).find((row) => row.id === id);
  const video = useVideoSession();
  const [elapsed, setElapsed] = useState(0);
  const [showReschedule, setShowReschedule] = useState(false);
  const [notice, setNotice] = useState('');

  // The test panel's "rejoin attempts fail" switch lives in the mock API, so read it from there.
  const { data: demo } = useQuery({
    queryKey: ['demo-state'],
    queryFn: () => api('/demo/state'),
    refetchInterval: 2000,
  });

  useEffect(() => {
    video.setRejoinWillFail(Boolean(demo?.demo?.rejoinFails));
  }, [demo?.demo?.rejoinFails, video.setRejoinWillFail]);

  useEffect(() => {
    if (video.state !== 'live') return undefined;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [video.state]);

  const complete = async () => {
    await setAppointmentStatus(id, 'completed');
    setNotice('Consultation marked completed.');
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  };

  if (!appointment) return <p className="text-sm text-slate-500">Loading consultation room...</p>;

  const sessionLeft = SESSION_LENGTH_MIN * 60 - elapsed;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Consultation room</h1>
        <p className="text-sm text-slate-600">
          {role === 'patient' ? `${appointment.doctorName} · ${appointment.specialty}` : appointment.patientName} ·{' '}
          {fmtTime(appointment.start)} · placeholder video (no real SDK)
        </p>
      </div>

      <div className="card" data-testid="video-simulator" data-video-state={video.state}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-600">
              Session state: <span className="font-medium">{video.state}</span>
              {video.startSeconds !== null && (
                <>
                  {' '}
                  · connected in {video.startSeconds.toFixed(1)} s{' '}
                  <span
                    className={video.startWithinLimit ? 'text-emerald-700' : 'text-red-600'}
                    data-testid="video-start-time"
                  >
                    (limit {VIDEO_START_LIMIT_SEC} s)
                  </span>
                </>
              )}
            </p>
            <p className="text-sm text-slate-600" data-testid="session-timer">
              Session: {mmss(Math.max(elapsed, 0))} elapsed · {mmss(Math.max(sessionLeft, 0))} left of the{' '}
              {SESSION_LENGTH_MIN}-minute target
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {video.state === 'idle' && (
              <button type="button" className="btn-primary" onClick={video.start} data-testid="video-start">
                Join video
              </button>
            )}
            {['live', 'connecting'].includes(video.state) && (
              <button type="button" className="btn-danger" onClick={video.drop} data-testid="video-drop">
                Simulate dropped call
              </button>
            )}
            {video.state === 'failed' && (
              <button type="button" className="btn-ghost" onClick={video.reset} data-testid="video-reset">
                Reset session
              </button>
            )}
            {appointment.status === 'in_progress' && is('doctor', 'staff', 'admin') && (
              <button type="button" className="btn-primary" onClick={complete} data-testid="end-consultation">
                End consultation
              </button>
            )}
          </div>
        </div>
      </div>

      <RecoveryBanner
        state={video.state}
        secondsLeft={video.rejoinSecondsLeft}
        attempts={video.attempts}
        onRejoin={video.rejoin}
        onReschedule={() => setShowReschedule(true)}
      />

      {showReschedule && (
        <div className="card">
          <h2 className="font-semibold text-slate-900">Move this consultation to a new slot</h2>
          <ReschedulePanel
            appointment={appointment}
            onDone={async (start) => {
              await rescheduleAppointment(appointment.id, start);
              setShowReschedule(false);
              setNotice('Consultation rescheduled. Reminders were regenerated for the new slot.');
              queryClient.invalidateQueries();
            }}
          />
        </div>
      )}

      {notice && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" data-testid="room-notice">
          {notice}
        </p>
      )}

      {is('doctor') && (
        <p className="text-sm text-slate-600">
          <Link to={`/doctor/notes/${appointment.id}`} className="text-brand-700 underline" data-testid="room-notes-link">
            Write consultation notes
          </Link>
        </p>
      )}
    </div>
  );
}
