import { api } from './mockServer.js';

export const listDoctors = () => api('/doctors');

export const getAvailability = (doctorId, date) =>
  api(`/availability?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}`);

export const listAppointments = () => api('/appointments');

export const bookAppointment = (body) => api('/appointments', { method: 'POST', body });

export const setAppointmentStatus = (id, status) =>
  api(`/appointments/${id}/status`, { method: 'PATCH', body: { status } });

export const saveSymptoms = (id, symptoms) =>
  api(`/appointments/${id}/symptoms`, { method: 'PATCH', body: { symptoms } });

export const rescheduleAppointment = (id, start) =>
  api(`/appointments/${id}/reschedule`, { method: 'POST', body: { start } });

export const cancelAppointment = (id) => api(`/appointments/${id}/cancel`, { method: 'POST' });

export const retryCalendarSync = (id) => api(`/appointments/${id}/sync`, { method: 'POST' });

export const listReminders = (id) => api(`/appointments/${id}/reminders`);
