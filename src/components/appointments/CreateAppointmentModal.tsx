import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NativeSelect as Select } from '@/components/ui/native-select'
import { cn, formatTime } from '@/lib/utils'
import { mockPatients } from '@/mocks/patients'
import { mockProfessionals } from '@/mocks/professionals'
import { mockLocations } from '@/mocks/locations'
import type { Appointment, AppointmentType } from '@/types/appointment'
import { format } from 'date-fns'

interface FormData {
  patientId: string
  type: AppointmentType | ''
  locationId: string
  date: string
  startTime: string
  providerId: string
  notes: string
}

interface FormErrors {
  patientId?: string
  type?: string
  locationId?: string
  date?: string
  startTime?: string
  providerId?: string
}

interface CreateAppointmentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (appt: Appointment) => void
}

export function CreateAppointmentModal({ open, onClose, onSuccess }: CreateAppointmentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [form, setForm] = useState<FormData>({
    patientId: '', type: '', locationId: '',
    date: '', startTime: '', providerId: '', notes: '',
  })

  const today = format(new Date(), 'yyyy-MM-dd')

  const patientOptions = mockPatients.map((p) => ({ value: p.id, label: `${p.fullName} — MRN: ${p.mrn}` }))
  const providerOptions = mockProfessionals.map((p) => ({ value: p.id, label: `${p.fullName} (${p.specialty})` }))
  const locationOptions = mockLocations.map((l) => ({ value: l.id, label: l.name }))

  const selectedPatient = mockPatients.find((p) => p.id === form.patientId)
  const selectedProvider = mockProfessionals.find((p) => p.id === form.providerId)
  const selectedLocation = mockLocations.find((l) => l.id === form.locationId)

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.patientId) e.patientId = 'Please select a patient'
    if (!form.type) e.type = 'Please select a visit mode'
    if (form.type === 'in_person' && !form.locationId) e.locationId = 'Please select a practice location'
    if (!form.date) e.date = 'Please select a date'
    if (!form.startTime) e.startTime = 'Please select a time'
    if (!form.providerId) e.providerId = 'Please select a professional'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setIsLoading(true)
    setTimeout(() => {
      const newAppt: Appointment = {
        id: `appt-new-${Date.now()}`,
        status: 'scheduled',
        type: form.type as AppointmentType,
        patientId: form.patientId,
        patientName: selectedPatient!.fullName,
        mrn: selectedPatient!.mrn,
        providerId: form.providerId,
        providerName: selectedProvider!.fullName,
        providerTitle: selectedProvider!.title,
        locationId: form.locationId || null,
        locationName: selectedLocation?.name ?? null,
        appointmentTypeLabel: form.type === 'online' ? 'Telehealth Consultation' : 'Appointment',
        date: form.date,
        startTime: form.startTime,
        endTime: form.startTime,
        meetingPlatform: form.type === 'online' ? 'zoom' : null,
        meetingUrl: null,
        notes: form.notes || null,
        cancellation: null,
        rescheduleHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      onSuccess(newAppt)
      setIsLoading(false)
      handleClose()
    }, 700)
  }

  function handleClose() {
    setForm({ patientId: '', type: '', locationId: '', date: '', startTime: '', providerId: '', notes: '' })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !isLoading) handleClose() }}>
      <DialogContent width="md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-4">

          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Patient <span className="text-red-500">*</span>
            </label>
            <Select
              value={form.patientId}
              onValueChange={(v) => set('patientId', v)}
              options={patientOptions}
              placeholder="Search by patient name or MRN..."
              className="w-full"
            />
            {errors.patientId && <p className="text-xs text-red-500 mt-1">{errors.patientId}</p>}
          </div>

          {/* Professional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Professional <span className="text-red-500">*</span>
            </label>
            <Select
              value={form.providerId}
              onValueChange={(v) => set('providerId', v)}
              options={providerOptions}
              placeholder="Select professional..."
              className="w-full"
            />
            {errors.providerId && <p className="text-xs text-red-500 mt-1">{errors.providerId}</p>}
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={cn(
                  'w-full h-9 rounded-md border px-3 py-1.5 text-sm text-gray-900 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  'cursor-pointer',
                  errors.date ? 'border-red-400' : 'border-gray-300'
                )}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                step="1800"
                value={form.startTime}
                onChange={(e) => set('startTime', e.target.value)}
                className={cn(
                  'w-full h-9 rounded-md border px-3 py-1.5 text-sm text-gray-900 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  'cursor-pointer',
                  errors.startTime ? 'border-red-400' : 'border-gray-300'
                )}
              />
              {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>}
            </div>
          </div>

          {/* Visit Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['in_person', 'online'] as AppointmentType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    set('type', t)
                    set('locationId', '')
                  }}
                  className={cn(
                    'rounded-lg border-2 p-3 text-left transition-colors cursor-pointer',
                    form.type === t
                      ? 'border-primary bg-primary-bg'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  )}
                >
                  <p className={cn('text-sm font-medium', form.type === t ? 'text-primary' : 'text-gray-700')}>
                    {t === 'in_person' ? 'In-Person' : 'Online / Telehealth'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t === 'in_person' ? 'At a practice location' : 'Via video conference'}
                  </p>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
          </div>

          {/* Conditional — Practice Location (In-Person only) */}
          {form.type === 'in_person' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Practice Location <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.locationId}
                onValueChange={(v) => set('locationId', v)}
                options={locationOptions}
                placeholder="Select location..."
                className="w-full"
              />
              {errors.locationId && <p className="text-xs text-red-500 mt-1">{errors.locationId}</p>}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reason for Appointment
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value.slice(0, 250))}
              rows={3}
              placeholder="Brief reason for this appointment..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.notes.length}/250</p>
          </div>

        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={isLoading}>
            <Plus className="h-3.5 w-3.5" />
            Create New Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
