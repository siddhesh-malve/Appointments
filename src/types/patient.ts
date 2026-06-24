export type PatientStatus = 'active' | 'inactive'
export type PatientGender = 'male' | 'female' | 'other'

export interface Patient {
  id: string
  fullName: string
  firstName: string
  lastName: string
  mrn: string
  dob: string           // ISO date "YYYY-MM-DD"
  gender: PatientGender
  phone: string
  email: string | null
  status: PatientStatus
  addedById: string
  addedByName: string
  lastAppointmentDate: string | null
  createdAt: string
}
