import { Phone, Shield, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockPatientDetails } from '@/mocks/patientDetails'
import type { Patient } from '@/types/patient'

interface OverviewTabProps {
  patient: Patient
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-words">{value ?? '—'}</p>
    </div>
  )
}

const INSURANCE_STATUS = {
  active:  { bg: 'bg-green-50', text: 'text-green-700', label: 'Active'   },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending'  },
  expired: { bg: 'bg-red-50',   text: 'text-red-700',   label: 'Expired'  },
}

export function OverviewTab({ patient }: OverviewTabProps) {
  const detail = mockPatientDetails.find(d => d.patientId === patient.id) ?? mockPatientDetails[0]

  return (
    <div className="space-y-6">

      {/* ── Personal Information ───────────────────────────────────────── */}
      <SectionCard title="Personal Information">
        <div className="grid grid-cols-3 gap-x-8 gap-y-5">
          <InfoField label="Email Address"    value={detail.email} />
          <InfoField label="Contact Number"   value={detail.contactNumber} />
          <InfoField label="Parish"           value={detail.parish} />
          <InfoField label="Post Code"        value={detail.postCode} />
          <InfoField label="Address Line 1"   value={detail.address1} />
          <InfoField label="Address Line 2"   value={detail.address2} />
          <InfoField label="Gender"           value={detail.gender} />
          <InfoField label="Date of Birth"    value={detail.dob} />
          <InfoField label="Profile Status"   value={
            <span className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              detail.profileStatus === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
            )}>
              {detail.profileStatus}
            </span>
          } />
          <InfoField label="Created By"       value={detail.createdBy} />
          <InfoField label="Request Sent By"  value={detail.requestSentBy} />
          <InfoField label="Request Sent On"  value={detail.requestSentOn} />
        </div>
      </SectionCard>

      {/* ── Emergency Contact ─────────────────────────────────────────── */}
      <SectionCard title="Emergency Contact">
        {detail.emergencyContacts.length === 0 ? (
          <div className="flex items-center gap-3 py-4 text-sm text-gray-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            No emergency contacts on file.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {detail.emergencyContacts.map((contact, idx) => (
              <div key={contact.id} className={cn('flex items-center justify-between gap-4', idx > 0 ? 'pt-4 mt-0' : '', idx < detail.emergencyContacts.length - 1 ? 'pb-4' : '')}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {contact.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{contact.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Relationship: {contact.relationship}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  {contact.phone}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Insurance Details ─────────────────────────────────────────── */}
      <SectionCard title="Insurance Details">
        {(() => {
          const ins = detail.insurance
          const statusCfg = INSURANCE_STATUS[ins.status]
          return (
            <>
              {/* Status badge row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{ins.provider}</span>
                </div>
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', statusCfg.bg, statusCfg.text)}>
                  {statusCfg.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                <InfoField label="Primary Holder"          value={ins.primaryHolder} />
                <InfoField label="Primary Holder Name"     value={ins.primaryHolderName} />
                <InfoField label="Insurance Provider"      value={ins.provider} />
                <InfoField label="Policy Number"           value={ins.policyNumber} />
                <InfoField label="Insurance Type"          value={ins.insuranceType} />
                <InfoField label="Group Number"            value={ins.groupNumber} />
                <InfoField label="Insurance Phone Number"  value={ins.phone} />
                <InfoField label="Coverage Start Date"     value={ins.coverageStart} />
                <InfoField label="Coverage End Date"       value={ins.coverageEnd} />
                <InfoField label="Insurance Status"        value={
                  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', statusCfg.bg, statusCfg.text)}>
                    {statusCfg.label}
                  </span>
                } />
              </div>
            </>
          )
        })()}
      </SectionCard>

    </div>
  )
}
