import { Activity, Heart, Thermometer, Droplets, Wind, Zap } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { VitalStatusBadge } from '@/components/ui/vital-status-badge'
import { formatTime, formatFullDate } from '@/lib/utils'
import type { VitalReading, VitalType } from '@/types/vital'
import type { Patient } from '@/types/patient'

interface OverviewTabProps {
  patient: Patient
  readings: VitalReading[]
}

function latestOf(readings: VitalReading[], type: VitalType): VitalReading | null {
  const typed = readings.filter((r) => r.type === type)
  if (!typed.length) return null
  return typed.sort((a, b) => {
    const dc = b.date.localeCompare(a.date)
    return dc !== 0 ? dc : b.time.localeCompare(a.time)
  })[0]
}

function formatVal(r: VitalReading): string {
  if (typeof r.value === 'object') {
    const bp = r.value as { systolic: number; diastolic: number }
    return `${bp.systolic}/${bp.diastolic}`
  }
  return String(r.value)
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  reading: VitalReading | null
  color: string
}

function StatCard({ icon, label, reading, color }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: color + '18' }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        {reading && <VitalStatusBadge status={reading.status} />}
      </div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      {reading ? (
        <>
          <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums leading-tight">
            {formatVal(reading)}
            <span className="text-sm font-normal text-gray-400 ml-1">{reading.unit}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatFullDate(reading.date)} · {formatTime(reading.time)}
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-300 mt-1">No reading recorded</p>
      )}
    </div>
  )
}

interface TimelineEvent {
  id: string
  title: string
  detail: string
  time: string
  date: string
  color: string
  icon: React.ReactNode
}

export function OverviewTab({ patient, readings }: OverviewTabProps) {
  const latestBP    = latestOf(readings, 'blood_pressure')
  const latestHR    = latestOf(readings, 'heart_rate')
  const latestBS    = latestOf(readings, 'blood_sugar')
  const latestTemp  = latestOf(readings, 'temperature')
  const latestO2    = latestOf(readings, 'blood_oxygen')
  const latestRR    = latestOf(readings, 'respiratory_rate')

  // Last reading overall
  const lastReading = [...readings].sort((a, b) => {
    const dc = b.date.localeCompare(a.date)
    return dc !== 0 ? dc : b.time.localeCompare(a.time)
  })[0] ?? null

  // Recent activity — last 10 readings as timeline
  const recentActivity: TimelineEvent[] = readings
    .slice()
    .sort((a, b) => {
      const dc = b.date.localeCompare(a.date)
      return dc !== 0 ? dc : b.time.localeCompare(a.time)
    })
    .slice(0, 10)
    .map((r) => {
      const typeColors: Record<VitalType, string> = {
        heart_rate: '#ef4444', blood_oxygen: '#3b82f6', respiratory_rate: '#8b5cf6',
        blood_pressure: '#f97316', temperature: '#ec4899', blood_sugar: '#16a34a',
      }
      const typeIcons: Record<VitalType, React.ReactNode> = {
        heart_rate:       <Heart className="h-3 w-3" />,
        blood_oxygen:     <Droplets className="h-3 w-3" />,
        respiratory_rate: <Wind className="h-3 w-3" />,
        blood_pressure:   <Activity className="h-3 w-3" />,
        temperature:      <Thermometer className="h-3 w-3" />,
        blood_sugar:      <Zap className="h-3 w-3" />,
      }
      return {
        id: r.id,
        title: `${formatVal(r)} ${r.unit}`,
        detail: `${r.type.replace(/_/g, ' ')} · Added by ${r.addedBy}`,
        time: formatTime(r.time),
        date: r.date,
        color: typeColors[r.type],
        icon: typeIcons[r.type],
      }
    })

  return (
    <div className="space-y-6">
      {/* Summary stat — Last Reading */}
      {lastReading && (
        <div className="bg-primary-bg border border-primary-border rounded-lg px-4 py-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-primary font-medium">Last Reading</p>
            <p className="text-sm text-gray-900 font-semibold">
              {formatVal(lastReading)} {lastReading.unit}
              <span className="font-normal text-gray-500 ml-1">
                · {lastReading.type.replace(/_/g, ' ')}
              </span>
            </p>
          </div>
          <p className="ml-auto text-xs text-gray-400">
            {formatDistanceToNow(parseISO(lastReading.date), { addSuffix: true })}
          </p>
        </div>
      )}

      {/* Vital stat cards — 3 col grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Latest Readings</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Activity className="h-4 w-4" />}
            label="Blood Pressure"
            reading={latestBP}
            color="#f97316"
          />
          <StatCard
            icon={<Heart className="h-4 w-4" />}
            label="Heart Rate"
            reading={latestHR}
            color="#ef4444"
          />
          <StatCard
            icon={<Zap className="h-4 w-4" />}
            label="Blood Sugar"
            reading={latestBS}
            color="#16a34a"
          />
          <StatCard
            icon={<Thermometer className="h-4 w-4" />}
            label="Temperature"
            reading={latestTemp}
            color="#ec4899"
          />
          <StatCard
            icon={<Droplets className="h-4 w-4" />}
            label="Blood Oxygen"
            reading={latestO2}
            color="#3b82f6"
          />
          <StatCard
            icon={<Wind className="h-4 w-4" />}
            label="Respiratory Rate"
            reading={latestRR}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No activity recorded yet.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-100" />
            <div className="space-y-4">
              {recentActivity.map((evt, idx) => (
                <div key={evt.id} className="flex items-start gap-3 relative">
                  {/* Icon dot */}
                  <div
                    className="relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 border-white"
                    style={{ background: evt.color + '20', color: evt.color, boxShadow: `0 0 0 2px ${evt.color}30` }}
                  >
                    {evt.icon}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-gray-900">{evt.title}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">{evt.detail}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{evt.time}</p>
                    <p className="text-xs text-gray-400">{formatFullDate(evt.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
