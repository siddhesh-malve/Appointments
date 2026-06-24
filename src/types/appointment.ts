export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
export type AppointmentType = 'in_person' | 'online'
export type MeetingPlatform = 'google_meet' | 'zoom' | 'microsoft_teams'
export type CancellationReason =
  | 'patient_requested'
  | 'provider_unavailable'
  | 'scheduling_conflict'
  | 'duplicate_appointment'
  | 'other'

export const CANCELLATION_REASON_LABELS: Record<CancellationReason, string> = {
  patient_requested: 'Patient Requested',
  provider_unavailable: 'Provider Unavailable',
  scheduling_conflict: 'Scheduling Conflict',
  duplicate_appointment: 'Duplicate Appointment',
  other: 'Other',
}

export interface AppointmentCancellation {
  cancelledBy: string
  cancelledByRole: string
  reason: CancellationReason
  cancelledAt: string
}

export interface RescheduleRecord {
  rescheduledBy: string
  originalDate: string
  originalTime: string
  newDate: string
  newTime: string
  rescheduledAt: string
}

export interface Appointment {
  id: string
  status: AppointmentStatus
  type: AppointmentType
  patientId: string
  patientName: string
  mrn: string
  providerId: string
  providerName: string
  providerTitle: string
  locationId: string | null
  locationName: string | null
  appointmentTypeLabel: string
  date: string
  startTime: string
  endTime: string
  meetingPlatform: MeetingPlatform | null
  meetingUrl: string | null
  notes: string | null
  cancellation: AppointmentCancellation | null
  rescheduleHistory: RescheduleRecord[]
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentFormData {
  patientId: string
  type: AppointmentType
  locationId: string | null
  date: string
  startTime: string
  providerId: string
  appointmentTypeLabel: string
  meetingPlatform: MeetingPlatform | null
  notes: string | null
}

export interface RescheduleFormData {
  newDate: string
  newTime: string
  providerId: string
}
