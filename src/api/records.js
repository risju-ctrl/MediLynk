import { api } from './mockServer.js';

export const listRecords = () => api('/records');

export const listConsultations = () => api('/consultations');

export const saveConsultationNotes = (appointmentId, notes) =>
  api(`/consultations/${appointmentId}/notes`, { method: 'POST', body: { notes } });
