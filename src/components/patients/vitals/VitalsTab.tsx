import { useState, useMemo } from 'react'
import { Plus, Calendar } from 'lucide-react'
import { subDays, format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { VitalChart } from './VitalChart'
import { ReadingHistory } from './ReadingHistory'
import { AddReadingModal } from './AddReadingModal'
import { VITAL_LABELS, VITAL_UNITS, type VitalType, type VitalReading } from '@/types/vital'
import type { Patient } from '@/types/patient'

interface VitalsTabProps {
  patient: Patient
  readings: VitalReading[]
  onAddReading: (reading: VitalReading) => void
}

type TimeRange = 'daily' | 'weekly' | 'monthly'

const VITAL_TABS: { type: VitalType; short: string }[] = [
  { type: 'heart_rate',       short: 'Heart Rate'   },
  { type: 'blood_oxygen',     short: 'Blood Oxygen' },
  { type: 'respiratory_rate', short: 'Resp. Rate'   },
  { type: 'blood_pressure',   short: 'Blood Pressure' },
  { type: 'temperature',      short: 'Temperature'  },
  { type: 'blood_sugar',      short: 'Blood Sugar'  },
]

export function VitalsTab({ patient, readings, onAddReading }: VitalsTabProps) {
  const [activeVital, setActiveVital]     = useState<VitalType>('heart_rate')
  const [timeRange, setTimeRange]         = useState<TimeRange>('weekly')
  const [fromDate, setFromDate]           = useState('')
  const [toDate, setToDate]               = useState('')
  const [addReadingOpen, setAddReadingOpen] = useState(false)

  const today = new Date()

  const filteredReadings = useMemo(() => {
    const typed = readings.filter((r) => r.type === activeVital)

    // Date range filter
    if (fromDate && toDate) {
      return typed.filter((r) => r.date >= fromDate && r.date <= toDate)
    }

    // Time range filter
    let cutoff: Date
    if (timeRange === 'daily')   cutoff = subDays(today, 1)
    else if (timeRange === 'weekly')  cutoff = subDays(today, 7)
    else                              cutoff = subDays(today, 30)

    const cutoffStr = format(cutoff, 'yyyy-MM-dd')
    return typed.filter((r) => r.date >= cutoffStr)
  }, [readings, activeVital, timeRange, fromDate, toDate])

  const unit = VITAL_UNITS[activeVital]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Readings & Vitals</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Track and monitor patient vital signs over time.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddReadingOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add New Reading
        </Button>
      </div>

      {/* Vital type tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5 overflow-x-auto no-scrollbar">
        {VITAL_TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveVital(tab.type)}
            className={cn(
              'flex-1 min-w-fit whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              activeVital === tab.type
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.short}
          </button>
        ))}
      </div>

      {/* Chart card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5">
        {/* Chart controls */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{VITAL_LABELS[activeVital]}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{unit}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Time range */}
            <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs">
              {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { setTimeRange(r); setFromDate(''); setToDate('') }}
                  className={cn(
                    'px-3 py-1.5 font-medium transition-colors capitalize',
                    timeRange === r && !fromDate
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {/* Date range picker */}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-7 rounded border border-gray-200 px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-gray-400">–</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-7 rounded border border-gray-200 px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {(fromDate || toDate) && (
                <button
                  onClick={() => { setFromDate(''); setToDate('') }}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <VitalChart readings={filteredReadings} type={activeVital} unit={unit} />
      </div>

      {/* Reading History */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Reading History</h4>
        <ReadingHistory readings={filteredReadings} type={activeVital} />
      </div>

      <AddReadingModal
        open={addReadingOpen}
        onClose={() => setAddReadingOpen(false)}
        onSuccess={onAddReading}
        patient={patient}
        defaultType={activeVital}
      />
    </div>
  )
}
