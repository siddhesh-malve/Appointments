import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogBody, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { cn } from '@/lib/utils'
import {
  VITAL_LABELS,
  VITAL_UNITS,
  BLOOD_SUGAR_CONTEXT_LABELS,
  type VitalType,
  type VitalStatus,
  type BloodSugarContext,
  type TemperatureUnit,
  type VitalReading,
} from '@/types/vital'
import type { Patient } from '@/types/patient'

interface AddReadingModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (reading: VitalReading) => void
  patient: Patient
  defaultType?: VitalType
}

interface FormErrors {
  type?: string
  date?: string
  time?: string
  value?: string
  systolic?: string
  diastolic?: string
}

const VITAL_TYPE_OPTIONS = (Object.keys(VITAL_LABELS) as VitalType[]).map((v) => ({
  value: v,
  label: VITAL_LABELS[v],
}))

function computeStatus(type: VitalType, value: number): VitalStatus {
  const ranges: Record<VitalType, { criticalHigh: number; high: number; low: number; criticalLow: number }> = {
    heart_rate:       { criticalHigh: 130, high: 100, low: 60, criticalLow: 40 },
    blood_oxygen:     { criticalHigh: 101, high: 101, low: 95, criticalLow: 90 },
    respiratory_rate: { criticalHigh: 30,  high: 20,  low: 12, criticalLow: 8  },
    blood_pressure:   { criticalHigh: 160, high: 140, low: 90, criticalLow: 60 },
    temperature:      { criticalHigh: 104, high: 100.4, low: 97, criticalLow: 95 },
    blood_sugar:      { criticalHigh: 300, high: 180,  low: 70, criticalLow: 54 },
  }
  const r = ranges[type]
  if (value >= r.criticalHigh || value <= r.criticalLow) return 'critical'
  if (value >= r.high) return 'high'
  if (value <= r.low) return 'low'
  return 'normal'
}

export function AddReadingModal({ open, onClose, onSuccess, patient, defaultType }: AddReadingModalProps) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const nowTime = format(new Date(), 'HH:mm')

  const [vitalType, setVitalType]   = useState<VitalType | ''>(defaultType ?? '')
  const [date, setDate]             = useState(today)
  const [time, setTime]             = useState(nowTime)
  const [value, setValue]           = useState('')
  const [systolic, setSystolic]     = useState('')
  const [diastolic, setDiastolic]   = useState('')
  const [tempUnit, setTempUnit]     = useState<TemperatureUnit>('F')
  const [bsContext, setBsContext]   = useState<BloodSugarContext | ''>('')
  const [notes, setNotes]           = useState('')
  const [errors, setErrors]         = useState<FormErrors>({})
  const [isLoading, setIsLoading]   = useState(false)

  useEffect(() => {
    if (defaultType) setVitalType(defaultType)
  }, [defaultType])

  const isBP   = vitalType === 'blood_pressure'
  const isBS   = vitalType === 'blood_sugar'
  const isTemp = vitalType === 'temperature'

  function validate(): boolean {
    const e: FormErrors = {}
    if (!vitalType) e.type = 'Please select a reading type'
    if (!date)      e.date = 'Date is required'
    if (!time)      e.time = 'Time is required'
    if (isBP) {
      if (!systolic  || isNaN(+systolic))  e.systolic  = 'Systolic value required'
      if (!diastolic || isNaN(+diastolic)) e.diastolic = 'Diastolic value required'
    } else {
      if (!value || isNaN(+value)) e.value = 'Valid reading value required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate() || !vitalType) return
    setIsLoading(true)
    setTimeout(() => {
      let finalValue: number | { systolic: number; diastolic: number }
      let unit = VITAL_UNITS[vitalType]
      let status: VitalStatus

      if (isBP) {
        finalValue = { systolic: Number(systolic), diastolic: Number(diastolic) }
        status = computeStatus('blood_pressure', Number(systolic))
      } else {
        finalValue = Number(value)
        if (isTemp && tempUnit === 'C') {
          unit = '°C'
        }
        status = computeStatus(vitalType, finalValue)
      }

      const reading: VitalReading = {
        id: `v-${Date.now()}`,
        patientId: patient.id,
        type: vitalType,
        date,
        time,
        value: finalValue,
        unit,
        status,
        addedBy: 'Sarah Johnson',
        source: 'Manual Entry',
        notes: notes.trim() || null,
        context: isBS ? (bsContext || undefined) : undefined,
        tempUnit: isTemp ? tempUnit : undefined,
        createdAt: new Date().toISOString(),
      }

      onSuccess(reading)
      setIsLoading(false)
      handleClose()
    }, 500)
  }

  function handleClose() {
    if (isLoading) return
    setVitalType(defaultType ?? '')
    setDate(today); setTime(nowTime); setValue('')
    setSystolic(''); setDiastolic(''); setBsContext('')
    setNotes(''); setErrors({})
    onClose()
  }

  const inputCls = (err?: string) =>
    cn(
      'w-full h-9 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 transition-colors',
      err ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-primary focus:border-primary'
    )

  const bsContextOptions: { value: BloodSugarContext; label: string }[] = [
    { value: 'fasting',     label: BLOOD_SUGAR_CONTEXT_LABELS.fasting },
    { value: 'before_meal', label: BLOOD_SUGAR_CONTEXT_LABELS.before_meal },
    { value: 'after_meal',  label: BLOOD_SUGAR_CONTEXT_LABELS.after_meal },
    { value: 'random',      label: BLOOD_SUGAR_CONTEXT_LABELS.random },
  ]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent width="md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-light">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Add New Reading</DialogTitle>
              <DialogDescription>
                {patient.fullName} — MRN: {patient.mrn}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Reading Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reading Type <span className="text-red-500">*</span>
            </label>
            <NativeSelect
              value={vitalType}
              onValueChange={(v) => { setVitalType(v as VitalType); setErrors({}) }}
              options={VITAL_TYPE_OPTIONS}
              placeholder="Select reading type..."
              className="w-full"
            />
            {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reading Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls(errors.date)}
              />
              {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reading Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputCls(errors.time)}
              />
              {errors.time && <p className="text-xs text-red-600 mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Dynamic value fields */}
          {vitalType && (
            <>
              {/* Heart Rate */}
              {vitalType === 'heart_rate' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Heart Rate (bpm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" min="20" max="300"
                    value={value} onChange={(e) => setValue(e.target.value)}
                    className={inputCls(errors.value)} placeholder="e.g. 78"
                  />
                  {errors.value && <p className="text-xs text-red-600 mt-1">{errors.value}</p>}
                </div>
              )}

              {/* Blood Oxygen */}
              {vitalType === 'blood_oxygen' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    SpO₂ (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" min="50" max="100" step="0.1"
                    value={value} onChange={(e) => setValue(e.target.value)}
                    className={inputCls(errors.value)} placeholder="e.g. 98"
                  />
                  {errors.value && <p className="text-xs text-red-600 mt-1">{errors.value}</p>}
                </div>
              )}

              {/* Respiratory Rate */}
              {vitalType === 'respiratory_rate' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Respiratory Rate (breaths/min) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" min="4" max="60"
                    value={value} onChange={(e) => setValue(e.target.value)}
                    className={inputCls(errors.value)} placeholder="e.g. 16"
                  />
                  {errors.value && <p className="text-xs text-red-600 mt-1">{errors.value}</p>}
                </div>
              )}

              {/* Blood Pressure */}
              {isBP && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Systolic (mmHg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number" min="60" max="250"
                      value={systolic} onChange={(e) => setSystolic(e.target.value)}
                      className={inputCls(errors.systolic)} placeholder="e.g. 120"
                    />
                    {errors.systolic && <p className="text-xs text-red-600 mt-1">{errors.systolic}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Diastolic (mmHg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number" min="30" max="150"
                      value={diastolic} onChange={(e) => setDiastolic(e.target.value)}
                      className={inputCls(errors.diastolic)} placeholder="e.g. 80"
                    />
                    {errors.diastolic && <p className="text-xs text-red-600 mt-1">{errors.diastolic}</p>}
                  </div>
                </div>
              )}

              {/* Temperature */}
              {isTemp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Temperature <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number" min="80" max="115" step="0.1"
                      value={value} onChange={(e) => setValue(e.target.value)}
                      className={cn(inputCls(errors.value), 'flex-1')} placeholder="e.g. 98.6"
                    />
                    <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm">
                      {(['F', 'C'] as TemperatureUnit[]).map((u) => (
                        <button
                          key={u} type="button"
                          onClick={() => setTempUnit(u)}
                          className={cn(
                            'px-3 h-9 font-medium transition-colors',
                            tempUnit === u ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          °{u}
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.value && <p className="text-xs text-red-600 mt-1">{errors.value}</p>}
                </div>
              )}

              {/* Blood Sugar */}
              {isBS && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Blood Sugar (mg/dL) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number" min="20" max="600"
                      value={value} onChange={(e) => setValue(e.target.value)}
                      className={inputCls(errors.value)} placeholder="e.g. 110"
                    />
                    {errors.value && <p className="text-xs text-red-600 mt-1">{errors.value}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reading Context</label>
                    <div className="grid grid-cols-2 gap-2">
                      {bsContextOptions.map((opt) => (
                        <button
                          key={opt.value} type="button"
                          onClick={() => setBsContext(opt.value)}
                          className={cn(
                            'rounded-lg border-2 py-2 text-xs font-medium transition-colors',
                            bsContext === opt.value
                              ? 'border-primary bg-primary-bg text-primary'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 300))}
              rows={2}
              placeholder="Optional notes about this reading..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{notes.length}/300</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} loading={isLoading}>
            <Activity className="h-3.5 w-3.5" />
            Save Reading
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
