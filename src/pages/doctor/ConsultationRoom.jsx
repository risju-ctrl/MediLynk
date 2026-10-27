import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, FileText, LoaderCircle, PhoneOff, RotateCcw, Video } from 'lucide-react';
import { rescheduleAppointment, setAppointmentStatus } from '../../api/appointments.js';
import { api } from '../../api/mockServer.js';
import { usePermission } from '../../auth/usePermission.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import { useVideoSession } from '../../hooks/useVideoSession.js';
import RecoveryBanner from '../../components/RecoveryBanner.jsx';
import ReschedulePanel from '../../components/ReschedulePanel.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { Avatar, PageHeader } from '../../components/ui.jsx';
import { SESSION_LENGTH_MIN, VIDEO_START_LIMIT_SEC, fmtDate, fmtTime } from '../../utils/timeRules.js';

const mmss = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

const STATE_LABEL = {
  idle: 'Not started',
  connecting: 'Connecting…',
  live: 'Live',
  dropped: 'Connection lost',
  rejoining: 'Rejoining…',
  failed: 'Call ended',
};

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

  // The demo tools' "rejoin attempts fail" switch lives in the mock API, so read it from there.
  const { data: demo } = useQuery({ queryKey: ['demo-state'], queryFn: () => api('/demo/state'), refetchInterval: 2000 });

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

  if (!appointment) return <div className="page"><p className="muted" role="status">Loading consultation room…</p></div>;

  const other = role === 'patient' ? appointment.doctorName : appointment.patientName;
  const sessionLeft = Math.max(SESSION_LENGTH_MIN * 60 - elapsed, 0);
  const progress = Math.min(100, (elapsed / (SESSION_LENGTH_MIN * 60)) * 100);
  const live = video.state === 'live';
  const troubled = ['dropped', 'rejoining', 'failed'].includes(video.state);

  return (
    <div className="page">
      <PageHeader title="Consultation room" subtitle={`${other} · ${fmtDate(appointment.start)} at ${fmtTime(appointment.start)}`}>
        {is('doctor') && (
          <Link to={`/doctor/notes/${appointment.id}`} className="btn btn-secondary" data-testid="room-notes-link"><FileText size={16} aria-hidden="true" />Write consultation notes</Link>
        )}
      </PageHeader>

      <div className="split split-rail">
        <div className="stack">
          <section className={`stage stage-${video.state}`} data-testid="video-simulator" data-video-state={video.state} aria-label="Video call">
            <span className={`stage-pill${live ? ' is-live' : ''}${troubled ? ' is-bad' : ''}`}>
              <i aria-hidden="true" />{STATE_LABEL[video.state]}
            </span>

            <div className="stage-center">
              {video.state === 'idle' && (<><Avatar name={other} size="xl" /><h2>Ready when you are</h2><p>Your video starts as soon as you join.</p></>)}
              {['connecting', 'rejoining'].includes(video.state) && (<><LoaderCircle className="spin" size={36} aria-hidden="true" /><h2>{STATE_LABEL[video.state]}</h2></>)}
              {live && (<><Avatar name={other} size="xl" /><h2>{other}</h2><p>Placeholder video. No camera or microphone is used.</p></>)}
              {troubled && (<><PhoneOff size={36} aria-hidden="true" /><h2>{STATE_LABEL[video.state]}</h2></>)}
            </div>

            {live && <span className="stage-self"><Avatar name="You" size="md" tone="teal" /></span>}

            <div className="stage-controls">
              {video.state === 'idle' && (
                <button type="button" className="btn btn-light btn-lg" onClick={video.start} data-testid="video-start"><Video size={18} aria-hidden="true" />Join video</button>
              )}
              {['live', 'connecting'].includes(video.state) && (
                <button type="button" className="btn btn-danger-solid" onClick={video.drop} data-testid="video-drop"><PhoneOff size={16} aria-hidden="true" />Simulate dropped call</button>
              )}
              {video.state === 'failed' && (
                <button type="button" className="btn btn-light" onClick={video.reset} data-testid="video-reset"><RotateCcw size={16} aria-hidden="true" />Reset session</button>
              )}
              {appointment.status === 'in_progress' && is('doctor', 'staff', 'admin') && (
                <button type="button" className="btn btn-primary-on-dark" onClick={complete} data-testid="end-consultation"><CheckCircle2 size={16} aria-hidden="true" />End consultation</button>
              )}
            </div>
          </section>

          <RecoveryBanner state={video.state} secondsLeft={video.rejoinSecondsLeft} attempts={video.attempts} onRejoin={video.rejoin} onReschedule={() => setShowReschedule(true)} />

          {showReschedule && (
            <section className="card card-pad">
              <div className="card-head"><h2>Move this consultation to a new time</h2></div>
              <ReschedulePanel
                appointment={appointment}
                onDone={async (start) => {
                  await rescheduleAppointment(appointment.id, start);
                  setShowReschedule(false);
                  setNotice('Consultation rescheduled. Reminders were regenerated for the new time.');
                  queryClient.invalidateQueries();
                }}
              />
            </section>
          )}

          {notice && <p className="form-success" role="status" data-testid="room-notice"><CheckCircle2 size={16} aria-hidden="true" />{notice}</p>}
        </div>

        <aside className="stack" aria-label="Session details">
          <section className="card card-pad">
            <div className="card-head"><h2>Session</h2><StatusBadge status={appointment.status} /></div>
            <p className="timer" data-testid="session-timer" aria-live="off">
              <strong>{mmss(elapsed)}</strong>
              <span>elapsed · {mmss(sessionLeft)} left of {SESSION_LENGTH_MIN} min</span>
            </p>
            <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: `${progress}%` }} /></div>
            {video.startSeconds !== null && (
              <p className="metric-line">
                Connected in {video.startSeconds.toFixed(1)} s{' '}
                <span className={video.startWithinLimit ? 'text-positive' : 'text-negative'} data-testid="video-start-time">(target {VIDEO_START_LIMIT_SEC} s)</span>
              </p>
            )}
          </section>
          <section className="card card-pad">
            <div className="card-head"><h2>{role === 'patient' ? 'Your doctor' : 'Patient'}</h2></div>
            <div className="record-head"><Avatar name={other} /><div><h3>{other}</h3><small className="muted-sm">{role === 'patient' ? appointment.specialty : 'Teleconsultation'}</small></div></div>
            {appointment.symptoms && <p className="appt-note"><strong>Reason:</strong> {appointment.symptoms}</p>}
          </section>
        </aside>
      </div>
    </div>
  );
}
