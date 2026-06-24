import { format, subDays } from 'date-fns'
import type { VitalReading } from '@/types/vital'

const today = new Date()
const d = (daysAgo: number) => format(subDays(today, daysAgo), 'yyyy-MM-dd')

// Helper to create a reading
function r(
  id: string,
  patientId: string,
  type: VitalReading['type'],
  daysAgo: number,
  time: string,
  value: number | { systolic: number; diastolic: number },
  unit: string,
  status: VitalReading['status'],
  addedBy: string,
  source: string,
  notes: string | null = null,
  extra?: Partial<VitalReading>
): VitalReading {
  return {
    id,
    patientId,
    type,
    date: d(daysAgo),
    time,
    value,
    unit,
    status,
    addedBy,
    source,
    notes,
    createdAt: subDays(today, daysAgo).toISOString(),
    ...extra,
  }
}

const STAFF = ['Sarah Johnson', 'Michael Reed', 'James Carter']
const SOURCES = ['Manual Entry', 'Device Sync', 'Pulse Oximeter', 'BP Cuff Device', 'Glucometer']

export const mockVitals: VitalReading[] = [

  // ════════════════════════════════════════════════════════════
  // HEART RATE — pat-1 — 30 days, 2 readings/day on busy days
  // Normal resting: 60–100 bpm
  // ════════════════════════════════════════════════════════════
  r('hr-01',  'pat-1', 'heart_rate', 0,  '08:30', 78,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-02',  'pat-1', 'heart_rate', 0,  '14:00', 85,  'bpm', 'normal',   STAFF[0], SOURCES[1]),
  r('hr-03',  'pat-1', 'heart_rate', 1,  '09:00', 92,  'bpm', 'normal',   STAFF[1], SOURCES[1], 'Post-exercise reading'),
  r('hr-04',  'pat-1', 'heart_rate', 2,  '08:15', 74,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-05',  'pat-1', 'heart_rate', 3,  '08:45', 110, 'bpm', 'high',     STAFF[1], SOURCES[1], 'Patient reported palpitations'),
  r('hr-06',  'pat-1', 'heart_rate', 3,  '16:30', 96,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-07',  'pat-1', 'heart_rate', 4,  '09:30', 68,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-08',  'pat-1', 'heart_rate', 5,  '08:00', 55,  'bpm', 'low',      STAFF[2], SOURCES[0], 'Morning resting HR'),
  r('hr-09',  'pat-1', 'heart_rate', 5,  '11:00', 72,  'bpm', 'normal',   STAFF[0], SOURCES[1]),
  r('hr-10',  'pat-1', 'heart_rate', 6,  '10:00', 80,  'bpm', 'normal',   STAFF[0], SOURCES[1]),
  r('hr-11',  'pat-1', 'heart_rate', 7,  '08:30', 76,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-12',  'pat-1', 'heart_rate', 8,  '09:00', 88,  'bpm', 'normal',   STAFF[1], SOURCES[1]),
  r('hr-13',  'pat-1', 'heart_rate', 9,  '08:45', 72,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-14',  'pat-1', 'heart_rate', 10, '09:15', 135, 'bpm', 'high',     STAFF[1], SOURCES[1], 'Tachycardia episode'),
  r('hr-15',  'pat-1', 'heart_rate', 10, '17:00', 88,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-16',  'pat-1', 'heart_rate', 11, '08:30', 65,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-17',  'pat-1', 'heart_rate', 12, '09:00', 79,  'bpm', 'normal',   STAFF[2], SOURCES[1]),
  r('hr-18',  'pat-1', 'heart_rate', 13, '08:15', 71,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-19',  'pat-1', 'heart_rate', 14, '08:45', 82,  'bpm', 'normal',   STAFF[0], SOURCES[1]),
  r('hr-20',  'pat-1', 'heart_rate', 15, '09:30', 58,  'bpm', 'low',      STAFF[1], SOURCES[0], 'Bradycardia noted'),
  r('hr-21',  'pat-1', 'heart_rate', 16, '08:00', 75,  'bpm', 'normal',   STAFF[0], SOURCES[1]),
  r('hr-22',  'pat-1', 'heart_rate', 17, '10:00', 83,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-23',  'pat-1', 'heart_rate', 18, '08:30', 69,  'bpm', 'normal',   STAFF[2], SOURCES[1]),
  r('hr-24',  'pat-1', 'heart_rate', 19, '09:00', 91,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-25',  'pat-1', 'heart_rate', 20, '08:45', 77,  'bpm', 'normal',   STAFF[1], SOURCES[1]),
  r('hr-26',  'pat-1', 'heart_rate', 21, '09:15', 140, 'bpm', 'high',     STAFF[0], SOURCES[1], 'Post vigorous activity'),
  r('hr-27',  'pat-1', 'heart_rate', 22, '08:30', 73,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-28',  'pat-1', 'heart_rate', 23, '09:00', 80,  'bpm', 'normal',   STAFF[2], SOURCES[1]),
  r('hr-29',  'pat-1', 'heart_rate', 25, '08:15', 66,  'bpm', 'normal',   STAFF[0], SOURCES[0]),
  r('hr-30',  'pat-1', 'heart_rate', 27, '09:30', 84,  'bpm', 'normal',   STAFF[1], SOURCES[1]),
  r('hr-31',  'pat-1', 'heart_rate', 29, '08:00', 78,  'bpm', 'normal',   STAFF[0], SOURCES[0]),

  // ════════════════════════════════════════════════════════════
  // BLOOD OXYGEN — pat-1 — 30 days
  // Normal: 95–100 %, Low: <95 %, Critical: <90 %
  // ════════════════════════════════════════════════════════════
  r('o2-01',  'pat-1', 'blood_oxygen', 0,  '08:30', 98,  '%', 'normal',   STAFF[0], SOURCES[2]),
  r('o2-02',  'pat-1', 'blood_oxygen', 0,  '14:00', 97,  '%', 'normal',   STAFF[0], SOURCES[1]),
  r('o2-03',  'pat-1', 'blood_oxygen', 1,  '09:00', 95,  '%', 'normal',   STAFF[1], SOURCES[1]),
  r('o2-04',  'pat-1', 'blood_oxygen', 2,  '08:15', 93,  '%', 'low',      STAFF[0], SOURCES[0], 'Slight shortness of breath'),
  r('o2-05',  'pat-1', 'blood_oxygen', 3,  '08:45', 99,  '%', 'normal',   STAFF[2], SOURCES[2]),
  r('o2-06',  'pat-1', 'blood_oxygen', 4,  '09:30', 97,  '%', 'normal',   STAFF[0], SOURCES[1]),
  r('o2-07',  'pat-1', 'blood_oxygen', 5,  '08:00', 91,  '%', 'low',      STAFF[1], SOURCES[0], 'Patient reported fatigue'),
  r('o2-08',  'pat-1', 'blood_oxygen', 5,  '15:00', 94,  '%', 'low',      STAFF[0], SOURCES[2]),
  r('o2-09',  'pat-1', 'blood_oxygen', 6,  '10:00', 98,  '%', 'normal',   STAFF[0], SOURCES[2]),
  r('o2-10',  'pat-1', 'blood_oxygen', 7,  '08:30', 96,  '%', 'normal',   STAFF[0], SOURCES[0]),
  r('o2-11',  'pat-1', 'blood_oxygen', 8,  '09:00', 99,  '%', 'normal',   STAFF[1], SOURCES[2]),
  r('o2-12',  'pat-1', 'blood_oxygen', 9,  '08:45', 88,  '%', 'critical', STAFF[0], SOURCES[2], 'Emergency check — oxygen therapy initiated'),
  r('o2-13',  'pat-1', 'blood_oxygen', 9,  '12:00', 93,  '%', 'low',      STAFF[2], SOURCES[2], 'Post O2 therapy improvement'),
  r('o2-14',  'pat-1', 'blood_oxygen', 10, '09:15', 97,  '%', 'normal',   STAFF[0], SOURCES[1]),
  r('o2-15',  'pat-1', 'blood_oxygen', 11, '08:30', 98,  '%', 'normal',   STAFF[0], SOURCES[2]),
  r('o2-16',  'pat-1', 'blood_oxygen', 12, '09:00', 96,  '%', 'normal',   STAFF[1], SOURCES[1]),
  r('o2-17',  'pat-1', 'blood_oxygen', 14, '08:15', 99,  '%', 'normal',   STAFF[0], SOURCES[2]),
  r('o2-18',  'pat-1', 'blood_oxygen', 16, '09:30', 95,  '%', 'normal',   STAFF[0], SOURCES[1]),
  r('o2-19',  'pat-1', 'blood_oxygen', 18, '08:00', 97,  '%', 'normal',   STAFF[2], SOURCES[2]),
  r('o2-20',  'pat-1', 'blood_oxygen', 20, '10:00', 92,  '%', 'low',      STAFF[0], SOURCES[0], 'Mild hypoxemia'),
  r('o2-21',  'pat-1', 'blood_oxygen', 22, '08:30', 98,  '%', 'normal',   STAFF[1], SOURCES[2]),
  r('o2-22',  'pat-1', 'blood_oxygen', 24, '09:00', 99,  '%', 'normal',   STAFF[0], SOURCES[2]),
  r('o2-23',  'pat-1', 'blood_oxygen', 26, '08:45', 96,  '%', 'normal',   STAFF[0], SOURCES[1]),
  r('o2-24',  'pat-1', 'blood_oxygen', 28, '09:15', 98,  '%', 'normal',   STAFF[2], SOURCES[2]),

  // ════════════════════════════════════════════════════════════
  // RESPIRATORY RATE — pat-1 — 30 days
  // Normal: 12–20 breaths/min
  // ════════════════════════════════════════════════════════════
  r('rr-01',  'pat-1', 'respiratory_rate', 0,  '08:30', 16, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-02',  'pat-1', 'respiratory_rate', 1,  '09:00', 20, 'breaths/min', 'normal',   STAFF[1], SOURCES[0]),
  r('rr-03',  'pat-1', 'respiratory_rate', 2,  '08:15', 14, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-04',  'pat-1', 'respiratory_rate', 3,  '08:45', 24, 'breaths/min', 'high',     STAFF[2], SOURCES[0], 'Tachypnea episode'),
  r('rr-05',  'pat-1', 'respiratory_rate', 4,  '09:30', 15, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-06',  'pat-1', 'respiratory_rate', 5,  '08:00', 10, 'breaths/min', 'low',      STAFF[1], SOURCES[0], 'Bradypnea noted'),
  r('rr-07',  'pat-1', 'respiratory_rate', 6,  '10:00', 17, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-08',  'pat-1', 'respiratory_rate', 7,  '08:30', 16, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-09',  'pat-1', 'respiratory_rate', 8,  '09:00', 22, 'breaths/min', 'high',     STAFF[1], SOURCES[0], 'Elevated after exertion'),
  r('rr-10',  'pat-1', 'respiratory_rate', 9,  '08:45', 32, 'breaths/min', 'critical', STAFF[0], SOURCES[0], 'Respiratory distress — emergency response'),
  r('rr-11',  'pat-1', 'respiratory_rate', 9,  '14:00', 18, 'breaths/min', 'normal',   STAFF[2], SOURCES[0], 'Post treatment — normalised'),
  r('rr-12',  'pat-1', 'respiratory_rate', 10, '09:15', 15, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-13',  'pat-1', 'respiratory_rate', 11, '08:30', 13, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-14',  'pat-1', 'respiratory_rate', 12, '09:00', 18, 'breaths/min', 'normal',   STAFF[1], SOURCES[0]),
  r('rr-15',  'pat-1', 'respiratory_rate', 14, '08:15', 16, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-16',  'pat-1', 'respiratory_rate', 16, '09:30', 19, 'breaths/min', 'normal',   STAFF[2], SOURCES[0]),
  r('rr-17',  'pat-1', 'respiratory_rate', 18, '08:00', 14, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-18',  'pat-1', 'respiratory_rate', 20, '10:00', 21, 'breaths/min', 'high',     STAFF[1], SOURCES[0]),
  r('rr-19',  'pat-1', 'respiratory_rate', 22, '08:30', 15, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-20',  'pat-1', 'respiratory_rate', 24, '09:00', 17, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),
  r('rr-21',  'pat-1', 'respiratory_rate', 26, '08:45', 16, 'breaths/min', 'normal',   STAFF[2], SOURCES[0]),
  r('rr-22',  'pat-1', 'respiratory_rate', 28, '09:15', 13, 'breaths/min', 'normal',   STAFF[0], SOURCES[0]),

  // ════════════════════════════════════════════════════════════
  // BLOOD PRESSURE — pat-1 — 30 days
  // Normal: <120/<80, High: ≥140/≥90, Critical: ≥160
  // ════════════════════════════════════════════════════════════
  r('bp-01',  'pat-1', 'blood_pressure', 0,  '08:30', { systolic: 120, diastolic: 80  }, 'mmHg', 'normal',   STAFF[0], SOURCES[3]),
  r('bp-02',  'pat-1', 'blood_pressure', 0,  '14:00', { systolic: 128, diastolic: 84  }, 'mmHg', 'normal',   STAFF[0], SOURCES[0]),
  r('bp-03',  'pat-1', 'blood_pressure', 1,  '09:00', { systolic: 145, diastolic: 95  }, 'mmHg', 'high',     STAFF[1], SOURCES[3], 'Coffee before reading'),
  r('bp-04',  'pat-1', 'blood_pressure', 2,  '08:15', { systolic: 118, diastolic: 76  }, 'mmHg', 'normal',   STAFF[0], SOURCES[0]),
  r('bp-05',  'pat-1', 'blood_pressure', 3,  '08:45', { systolic: 168, diastolic: 108 }, 'mmHg', 'critical', STAFF[2], SOURCES[3], 'Hypertensive crisis — cardiologist referral'),
  r('bp-06',  'pat-1', 'blood_pressure', 3,  '16:00', { systolic: 148, diastolic: 94  }, 'mmHg', 'high',     STAFF[0], SOURCES[3], 'Post medication — improving'),
  r('bp-07',  'pat-1', 'blood_pressure', 4,  '09:30', { systolic: 122, diastolic: 82  }, 'mmHg', 'normal',   STAFF[0], SOURCES[0]),
  r('bp-08',  'pat-1', 'blood_pressure', 5,  '08:00', { systolic: 108, diastolic: 68  }, 'mmHg', 'low',      STAFF[1], SOURCES[0], 'Patient felt dizzy'),
  r('bp-09',  'pat-1', 'blood_pressure', 5,  '12:00', { systolic: 116, diastolic: 74  }, 'mmHg', 'normal',   STAFF[0], SOURCES[3]),
  r('bp-10',  'pat-1', 'blood_pressure', 6,  '10:00', { systolic: 125, diastolic: 82  }, 'mmHg', 'normal',   STAFF[0], SOURCES[3]),
  r('bp-11',  'pat-1', 'blood_pressure', 7,  '08:30', { systolic: 132, diastolic: 87  }, 'mmHg', 'normal',   STAFF[0], SOURCES[0]),
  r('bp-12',  'pat-1', 'blood_pressure', 8,  '09:00', { systolic: 119, diastolic: 79  }, 'mmHg', 'normal',   STAFF[1], SOURCES[3]),
  r('bp-13',  'pat-1', 'blood_pressure', 9,  '08:45', { systolic: 141, diastolic: 91  }, 'mmHg', 'high',     STAFF[0], SOURCES[3]),
  r('bp-14',  'pat-1', 'blood_pressure', 10, '09:15', { systolic: 155, diastolic: 98  }, 'mmHg', 'high',     STAFF[0], SOURCES[3], 'Stress-related elevation'),
  r('bp-15',  'pat-1', 'blood_pressure', 11, '08:30', { systolic: 124, diastolic: 81  }, 'mmHg', 'normal',   STAFF[0], SOURCES[0]),
  r('bp-16',  'pat-1', 'blood_pressure', 12, '09:00', { systolic: 117, diastolic: 77  }, 'mmHg', 'normal',   STAFF[2], SOURCES[3]),
  r('bp-17',  'pat-1', 'blood_pressure', 14, '08:15', { systolic: 122, diastolic: 80  }, 'mmHg', 'normal',   STAFF[0], SOURCES[0]),
  r('bp-18',  'pat-1', 'blood_pressure', 16, '09:30', { systolic: 136, diastolic: 88  }, 'mmHg', 'normal',   STAFF[1], SOURCES[3]),
  r('bp-19',  'pat-1', 'blood_pressure', 18, '08:00', { systolic: 119, diastolic: 78  }, 'mmHg', 'normal',   STAFF[0], SOURCES[0]),
  r('bp-20',  'pat-1', 'blood_pressure', 20, '10:00', { systolic: 148, diastolic: 96  }, 'mmHg', 'high',     STAFF[0], SOURCES[3]),
  r('bp-21',  'pat-1', 'blood_pressure', 22, '08:30', { systolic: 121, diastolic: 80  }, 'mmHg', 'normal',   STAFF[2], SOURCES[0]),
  r('bp-22',  'pat-1', 'blood_pressure', 24, '09:00', { systolic: 115, diastolic: 74  }, 'mmHg', 'low',      STAFF[0], SOURCES[3]),
  r('bp-23',  'pat-1', 'blood_pressure', 26, '08:45', { systolic: 128, diastolic: 83  }, 'mmHg', 'normal',   STAFF[1], SOURCES[3]),
  r('bp-24',  'pat-1', 'blood_pressure', 28, '09:15', { systolic: 172, diastolic: 110 }, 'mmHg', 'critical', STAFF[0], SOURCES[3], 'Emergency — hypertensive urgency'),
  r('bp-25',  'pat-1', 'blood_pressure', 29, '08:30', { systolic: 133, diastolic: 86  }, 'mmHg', 'normal',   STAFF[0], SOURCES[0]),

  // ════════════════════════════════════════════════════════════
  // TEMPERATURE — pat-1 — 30 days
  // Normal: 97–99 °F, Low: <97, High: >100.4, Critical: >103
  // ════════════════════════════════════════════════════════════
  r('tp-01',  'pat-1', 'temperature', 0,  '08:30', 98.6,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-02',  'pat-1', 'temperature', 1,  '09:00', 100.4, '°F', 'high',     STAFF[1], SOURCES[0], 'Low-grade fever', { tempUnit: 'F' }),
  r('tp-03',  'pat-1', 'temperature', 2,  '08:15', 98.2,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-04',  'pat-1', 'temperature', 3,  '08:45', 103.1, '°F', 'critical', STAFF[2], SOURCES[0], 'High fever — rest and fluids advised', { tempUnit: 'F' }),
  r('tp-05',  'pat-1', 'temperature', 3,  '20:00', 101.8, '°F', 'high',     STAFF[0], SOURCES[0], 'Evening — fever reducing', { tempUnit: 'F' }),
  r('tp-06',  'pat-1', 'temperature', 4,  '09:30', 99.1,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-07',  'pat-1', 'temperature', 5,  '08:00', 97.2,  '°F', 'low',      STAFF[1], SOURCES[0], 'Hypothermia check', { tempUnit: 'F' }),
  r('tp-08',  'pat-1', 'temperature', 5,  '12:00', 98.0,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-09',  'pat-1', 'temperature', 6,  '10:00', 98.7,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-10',  'pat-1', 'temperature', 7,  '08:30', 98.4,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-11',  'pat-1', 'temperature', 8,  '09:00', 101.2, '°F', 'high',     STAFF[1], SOURCES[0], 'Fever returning', { tempUnit: 'F' }),
  r('tp-12',  'pat-1', 'temperature', 9,  '08:45', 98.9,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-13',  'pat-1', 'temperature', 10, '09:15', 97.8,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-14',  'pat-1', 'temperature', 11, '08:30', 98.5,  '°F', 'normal',   STAFF[2], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-15',  'pat-1', 'temperature', 12, '09:00', 99.8,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-16',  'pat-1', 'temperature', 14, '08:15', 98.3,  '°F', 'normal',   STAFF[1], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-17',  'pat-1', 'temperature', 16, '09:30', 100.8, '°F', 'high',     STAFF[0], SOURCES[0], 'Mild fever', { tempUnit: 'F' }),
  r('tp-18',  'pat-1', 'temperature', 18, '08:00', 98.6,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-19',  'pat-1', 'temperature', 20, '10:00', 96.8,  '°F', 'low',      STAFF[2], SOURCES[0], 'Sub-normal temperature', { tempUnit: 'F' }),
  r('tp-20',  'pat-1', 'temperature', 22, '08:30', 98.7,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-21',  'pat-1', 'temperature', 24, '09:00', 98.9,  '°F', 'normal',   STAFF[1], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-22',  'pat-1', 'temperature', 26, '08:45', 99.2,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),
  r('tp-23',  'pat-1', 'temperature', 28, '09:15', 98.4,  '°F', 'normal',   STAFF[0], SOURCES[0], null, { tempUnit: 'F' }),

  // ════════════════════════════════════════════════════════════
  // BLOOD SUGAR — pat-1 — 30 days
  // Normal fasting: 70–100, High: >126, Critical: >200 or <54
  // ════════════════════════════════════════════════════════════
  r('bs-01',  'pat-1', 'blood_sugar', 0,  '07:00', 95,  'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-02',  'pat-1', 'blood_sugar', 0,  '13:00', 145, 'mg/dL', 'high',     STAFF[0], SOURCES[4], 'Post-lunch spike',             { context: 'after_meal'  }),
  r('bs-03',  'pat-1', 'blood_sugar', 1,  '07:00', 110, 'mg/dL', 'normal',   STAFF[1], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-04',  'pat-1', 'blood_sugar', 1,  '12:30', 182, 'mg/dL', 'high',     STAFF[0], SOURCES[4], 'High after lunch',             { context: 'after_meal'  }),
  r('bs-05',  'pat-1', 'blood_sugar', 2,  '07:00', 88,  'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-06',  'pat-1', 'blood_sugar', 3,  '07:00', 242, 'mg/dL', 'critical', STAFF[2], SOURCES[4], 'Emergency check — urgent care', { context: 'random'      }),
  r('bs-07',  'pat-1', 'blood_sugar', 3,  '17:00', 165, 'mg/dL', 'high',     STAFF[0], SOURCES[4], 'Improving post insulin',       { context: 'random'      }),
  r('bs-08',  'pat-1', 'blood_sugar', 4,  '07:00', 102, 'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-09',  'pat-1', 'blood_sugar', 4,  '11:30', 128, 'mg/dL', 'high',     STAFF[0], SOURCES[4], 'Pre-lunch elevated',           { context: 'before_meal' }),
  r('bs-10',  'pat-1', 'blood_sugar', 5,  '07:00', 65,  'mg/dL', 'low',      STAFF[1], SOURCES[4], 'Patient reported shakiness',   { context: 'fasting'     }),
  r('bs-11',  'pat-1', 'blood_sugar', 5,  '10:00', 89,  'mg/dL', 'normal',   STAFF[0], SOURCES[4], 'Post snack — recovered',       { context: 'random'      }),
  r('bs-12',  'pat-1', 'blood_sugar', 6,  '07:00', 118, 'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-13',  'pat-1', 'blood_sugar', 7,  '07:00', 97,  'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-14',  'pat-1', 'blood_sugar', 8,  '07:00', 134, 'mg/dL', 'high',     STAFF[1], SOURCES[4], 'Elevated fasting',             { context: 'fasting'     }),
  r('bs-15',  'pat-1', 'blood_sugar', 9,  '07:00', 91,  'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-16',  'pat-1', 'blood_sugar', 10, '07:00', 78,  'mg/dL', 'normal',   STAFF[2], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-17',  'pat-1', 'blood_sugar', 11, '07:00', 105, 'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-18',  'pat-1', 'blood_sugar', 12, '07:00', 156, 'mg/dL', 'high',     STAFF[1], SOURCES[4], 'Elevated AM glucose',          { context: 'fasting'     }),
  r('bs-19',  'pat-1', 'blood_sugar', 14, '07:00', 93,  'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-20',  'pat-1', 'blood_sugar', 14, '13:00', 198, 'mg/dL', 'high',     STAFF[0], SOURCES[4], 'Post-meal spike',              { context: 'after_meal'  }),
  r('bs-21',  'pat-1', 'blood_sugar', 16, '07:00', 87,  'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-22',  'pat-1', 'blood_sugar', 18, '07:00', 112, 'mg/dL', 'normal',   STAFF[2], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-23',  'pat-1', 'blood_sugar', 20, '07:00', 58,  'mg/dL', 'low',      STAFF[0], SOURCES[4], 'Hypoglycaemia episode',        { context: 'fasting'     }),
  r('bs-24',  'pat-1', 'blood_sugar', 22, '07:00', 99,  'mg/dL', 'normal',   STAFF[1], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-25',  'pat-1', 'blood_sugar', 24, '07:00', 143, 'mg/dL', 'high',     STAFF[0], SOURCES[4], 'Elevated fasting',             { context: 'fasting'     }),
  r('bs-26',  'pat-1', 'blood_sugar', 26, '07:00', 82,  'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
  r('bs-27',  'pat-1', 'blood_sugar', 28, '07:00', 308, 'mg/dL', 'critical', STAFF[2], SOURCES[4], 'Critical — emergency response', { context: 'random'     }),
  r('bs-28',  'pat-1', 'blood_sugar', 29, '07:00', 107, 'mg/dL', 'normal',   STAFF[0], SOURCES[4], null,                           { context: 'fasting'     }),
]
