import { useQuery } from '@tanstack/react-query';
import { listAppointments } from '../api/appointments.js';

// Patients and doctors only receive the rows their role allows, because the mock API filters them.
export function useAppointments(options = {}) {
  return useQuery({ queryKey: ['appointments'], queryFn: listAppointments, ...options });
}
