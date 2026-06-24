import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Mail, Phone, User, CalendarDays,
  Edit, UserX, Activity,
} from 'lucide-react'
import { format, parseISO, differenceInYears } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { OverviewTab } from '@/components/patients/OverviewTab'
import { VitalsTab } from '@/components/patients/vitals/VitalsTab'
import { ConfirmInactivateModal } from '@/components/patients/ConfirmInactivateModal'
import { mockPatients } from '@/mocks/patients'
import { mockVitals } from '@/mocks/vitals'
import type { Patient } from '@/types/patient'
import type { VitalReading } from '@/types/vital'

const GENDER_LABELS: Record<string, string> = {
  male: 'Male', female: 'Female', other: 'Other',
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [patient, setPatient] = useState<Patient | undefined>(
    mockPatients.find((p) => p.id === id)
  )
  const [readings, setReadings] = useState<VitalReading[]>(
    mockVitals.filter((v) => v.patientId === id)
  )
  const [inactivateOpen, setInactivateOpen] = useState(false)

  if (!patient) {
    return (
      <div className="px-6 py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/patients')} className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>
        <p className="text-sm text-gray-500">Patient not found.</p>
      </div>
    )
  }

  const age = differenceInYears(new Date(), parseISO(patient.dob))
  const initials = patient.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)

  function handleInactivate(patientId: string) {
    setPatient((p) => p ? { ...p, status: 'inactive' } : p)
  }

  function handleAddReading(reading: VitalReading) {
    setReadings((prev) => [reading, ...prev])
  }

  return (
    <div className="px-6 py-6">
      {/* Back nav */}
      <button
        onClick={() => navigate('/patients')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Patient Management
      </button>

      {/* Patient Summary Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: Identity */}
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 flex-shrink-0 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-base font-bold text-primary">{initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900">{patient.fullName}</h1>
                <span className={[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  patient.status === 'active'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                ].join(' ')}>
                  {patient.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs font-mono text-gray-500 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                  MRN: {patient.mrn}
                </span>
                <span className="text-xs text-gray-500">
                  {GENDER_LABELS[patient.gender]}
                </span>
                <span className="text-xs text-gray-500">
                  DOB: {format(parseISO(patient.dob), 'MM/dd/yyyy')}
                </span>
                <span className="text-xs text-gray-500">Age: {age} yrs</span>
              </div>
            </div>
          </div>

          {/* Right: Contact + actions */}
          <div className="flex flex-col items-end gap-3">
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-3.5 w-3.5" />
                Edit Patient
              </Button>
              {patient.status === 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInactivateOpen(true)}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                >
                  <UserX className="h-3.5 w-3.5" />
                  Mark Inactive
                </Button>
              )}
            </div>
            {/* Contact info */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                {patient.phone}
              </span>
              {patient.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  {patient.email}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" />
                Added by {patient.addedByName}
              </span>
              {patient.lastAppointmentDate && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                  Last visit: {format(parseISO(patient.lastAppointmentDate), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">
            <Activity className="h-3.5 w-3.5" />
            Readings & Vitals
            {readings.length > 0 && (
              <span className="ml-1 text-gray-400">({readings.length})</span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab patient={patient} readings={readings} />
        </TabsContent>

        <TabsContent value="vitals">
          <VitalsTab patient={patient} readings={readings} onAddReading={handleAddReading} />
        </TabsContent>
      </Tabs>

      <ConfirmInactivateModal
        open={inactivateOpen}
        patient={patient}
        onClose={() => setInactivateOpen(false)}
        onConfirm={handleInactivate}
      />
    </div>
  )
}
