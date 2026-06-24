import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NativeSelect as Select } from '@/components/ui/native-select'
import { cn, formatTime } from '@/lib/utils'
import { mockProfessionals } from '@/mocks/professionals'
import { mockLocations } from '@/mocks/locations'
import { mockPatients } from '@/mocks/patients'
import type { Appointment, AppointmentType } from '@/types/appointment'
import { format } from 'date-fns'

interface RescheduleDrawerProps {
  open: boolean
  appointment: Appointment | null
  onClose: () => void
  onConfirm: (appointmentId: string, newDate: string, newTime: string, providerId: string, newType: AppointmentType) => void
}

export function RescheduleDrawer({ open, appointment, onClose, onConfirm }: RescheduleDrawerProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [providerId, setProviderId] = useState('')
  const [visitType, setVisitType] = useState<AppointmentType | ''>('')
  const [isLoading, setIsLoading] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  // Pre-fill from appointment when it opens
  useEffect(() => {
    if (appointment) {
      setDate(appointment.date)
      setTime(appointment.startTime)
      setProviderId(appointment.providerId)
      setVisitType(appointment.type)
    }
  }, [appointment])

  const providerOptions = mockProfessionals.map((p) => ({ value: p.id, label: `${p.fullName} (${p.specialty})` }))
  const locationOptions = mockLocations.map((l) => ({ value: l.id, label: l.name }))
  const patient = mockPatients.find((p) => p.id === appointment?.patientId)

  const canConfirm = date && time && providerId && visitType

  function handleConfirm() {
    if (!appointment || !canConfirm) return
    setIsLoading(true)
    setTimeout(() => {
      onConfirm(appointment.id, date, time, providerId, visitType as AppointmentType)
      setIsLoading(false)
      handleClose()
    }, 700)
  }

  function handleClose() {
    setDate('')
    setTime('')
    setProviderId('')
    setVisitType('')
    onClose()
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !isLoading) handleClose() }}>
      <DialogContent width="md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-blue-600" />
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4">

          {/* Patient — disabled */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient</label>
            <input
              disabled
              value={patient ? `${patient.fullName} — MRN: ${patient.mrn}` : ''}
              className="w-full h-9 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* Professional — editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Professional <span className="text-red-500">*</span>
            </label>
            <Select
              value={providerId}
              onValueChange={setProviderId}
              options={providerOptions}
              placeholder="Select professional..."
              className="w-full"
            />
          </div>

          {/* Date + Time — editable */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                step="1800"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Visit Mode — editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['in_person', 'online'] as AppointmentType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setVisitType(t)}
                  className={cn(
                    'rounded-lg border-2 p-3 text-left transition-colors cursor-pointer',
                    visitType === t ? 'border-primary bg-primary-bg' : 'border-gray-200 hover:border-gray-300 bg-white'
                  )}
                >
                  <p className={cn('text-sm font-medium', visitType === t ? 'text-primary' : 'text-gray-700')}>
                    {t === 'in_person' ? 'In-Person' : 'Online / Telehealth'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t === 'in_person' ? 'At a practice location' : 'Via video conference'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Location — disabled (shown for context if in-person) */}
          {appointment.locationName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Practice Location</label>
              <input
                disabled
                value={appointment.locationName}
                className="w-full h-9 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed"
                readOnly
              />
            </div>
          )}

          {/* Notes — disabled */}
          {appointment.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Appointment</label>
              <textarea
                disabled
                value={appointment.notes}
                rows={2}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 cursor-not-allowed resize-none"
                readOnly
              />
            </div>
          )}

        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={!canConfirm || isLoading} loading={isLoading}>
            <RefreshCw className="h-3.5 w-3.5" />
            Confirm Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
