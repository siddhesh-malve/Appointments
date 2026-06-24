export type VitalType =
  | 'heart_rate'
  | 'blood_oxygen'
  | 'respiratory_rate'
  | 'blood_pressure'
  | 'temperature'
  | 'blood_sugar'

export type VitalStatus = 'low' | 'normal' | 'high' | 'critical'

export type BloodSugarContext = 'fasting' | 'before_meal' | 'after_meal' | 'random'

export type TemperatureUnit = 'F' | 'C'

export interface BloodPressureValue {
  systolic: number
  diastolic: number
}

export interface VitalReading {
  id: string
  patientId: string
  type: VitalType
  date: string       // "YYYY-MM-DD"
  time: string       // "HH:MM"
  value: number | BloodPressureValue
  unit: string
  status: VitalStatus
  addedBy: string
  source: string
  notes: string | null
  context?: BloodSugarContext
  tempUnit?: TemperatureUnit
  createdAt: string
}

export const VITAL_LABELS: Record<VitalType, string> = {
  heart_rate: 'Heart Rate',
  blood_oxygen: 'Blood Oxygen',
  respiratory_rate: 'Respiratory Rate',
  blood_pressure: 'Blood Pressure',
  temperature: 'Temperature',
  blood_sugar: 'Blood Sugar',
}

export const VITAL_UNITS: Record<VitalType, string> = {
  heart_rate: 'bpm',
  blood_oxygen: '%',
  respiratory_rate: 'breaths/min',
  blood_pressure: 'mmHg',
  temperature: '°F',
  blood_sugar: 'mg/dL',
}

export const VITAL_STATUS_CONFIG: Record<VitalStatus, { label: string; color: string; bg: string }> = {
  low:      { label: 'Low',      color: 'text-blue-700',   bg: 'bg-blue-50' },
  normal:   { label: 'Normal',   color: 'text-green-700',  bg: 'bg-green-50' },
  high:     { label: 'High',     color: 'text-orange-700', bg: 'bg-orange-50' },
  critical: { label: 'Critical', color: 'text-red-700',    bg: 'bg-red-50' },
}

export const BLOOD_SUGAR_CONTEXT_LABELS: Record<BloodSugarContext, string> = {
  fasting:     'Fasting',
  before_meal: 'Before Meal',
  after_meal:  'After Meal',
  random:      'Random',
}
