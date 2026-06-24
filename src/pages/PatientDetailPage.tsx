import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Mail, Phone, Edit, UserX, Activity,
} from 'lucide-react'
import { format, parseISO, differenceInYears } from 'date-fns'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { OverviewTab } from '@/components/patients/OverviewTab'
import { VitalsTab } from '@/components/patients/vitals/VitalsTab'
import { ConfirmInactivateModal } from '@/components/patients/ConfirmInactivateModal'
import { mockPatients } from '@/mocks/patients'
import { mockVitals } from '@/mocks/vitals'
import type { Patient } from '@/types/patient'
import type { VitalReading } from '@/types/vital'

type Tab = 'overview' | 'vitals'

const GENDER_LABELS: Record<string, string> = {
  male: 'Male', female: 'Female', other: 'Other',
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  )
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
  const [activeTab, setActiveTab] = useState<Tab>('overview')

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
  const initials = patient.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  function handleInactivate() {
    setPatient((p) => p ? { ...p, status: 'inactive' } : p)
  }

  function handleAddReading(reading: VitalReading) {
    setReadings((prev) => [reading, ...prev])
  }

  const tabs: { key: Tab; label: string; icon?: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview' },
    {
      key: 'vitals',
      label: 'Readings & Vitals',
      icon: <Activity className="h-3.5 w-3.5" />,
    },
  ]

  return (
    <div className="px-6 py-6">
      {/* ── Back nav ─────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate('/patients')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 group transition-colors"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Patient Management
      </button>

      {/* ── Patient Header Card ───────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
        {/* Green accent stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary-hover" />

        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-6 flex-wrap">

            {/* Left: Avatar + Identity */}
            <div className="flex items-start gap-4">
              {/* Avatar with online-status dot */}
              <div className="relative flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-primary-light border-2 border-primary-border flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{initials}</span>
                </div>
                <span className={cn(
                  'absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white',
                  patient.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                )} />
              </div>

              {/* Name + chips */}
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">{patient.fullName}</h1>
                  <span className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    patient.status === 'active'
                      ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                      : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
                  )}>
                    {patient.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* MRN pill */}
                <div className="mt-1 mb-3">
                  <span className="text-xs font-mono text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5">
                    MRN: {patient.mrn}
                  </span>
                </div>

                {/* Info chips */}
                <div className="flex items-start gap-6 flex-wrap">
                  <InfoChip label="Date of Birth" value={format(parseISO(patient.dob), 'MM/dd/yyyy')} />
                  <InfoChip label="Age" value={`${age} years`} />
                  <InfoChip label="Gender" value={GENDER_LABELS[patient.gender] ?? patient.gender} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Contact</span>
                    <span className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-gray-400" />
                      {patient.phone}
                    </span>
                  </div>
                  {patient.email && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Email</span>
                      <span className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {patient.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
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
                  Inactive Patient
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Underline Tabs ────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative flex items-center gap-1.5 px-4 pb-3 pt-1 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.icon}
              {tab.label}
              <span className={cn(
                'absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200',
                activeTab === tab.key ? 'bg-primary' : 'bg-transparent'
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <OverviewTab patient={patient} />
      )}
      {activeTab === 'vitals' && (
        <VitalsTab patient={patient} readings={readings} onAddReading={handleAddReading} />
      )}

      <ConfirmInactivateModal
        open={inactivateOpen}
        patient={patient}
        onClose={() => setInactivateOpen(false)}
        onConfirm={handleInactivate}
      />
    </div>
  )
}
