import { format, parseISO } from 'date-fns'
import { User, Clock } from 'lucide-react'
import { VitalStatusBadge } from '@/components/ui/vital-status-badge'
import { cn, formatTime } from '@/lib/utils'
import {
  BLOOD_SUGAR_CONTEXT_LABELS,
  type VitalReading,
  type VitalType,
} from '@/types/vital'

interface ReadingHistoryProps {
  readings: VitalReading[]
  type: VitalType
}

function formatValue(r: VitalReading): string {
  if (typeof r.value === 'object') {
    const bp = r.value as { systolic: number; diastolic: number }
    return `${bp.systolic}/${bp.diastolic}`
  }
  return String(r.value)
}

function groupByDate(readings: VitalReading[]): Array<{ dateStr: string; label: string; readings: VitalReading[] }> {
  const map = new Map<string, VitalReading[]>()
  const sorted = [...readings].sort((a, b) => {
    const dc = b.date.localeCompare(a.date)
    if (dc !== 0) return dc
    return b.time.localeCompare(a.time)
  })
  for (const r of sorted) {
    if (!map.has(r.date)) map.set(r.date, [])
    map.get(r.date)!.push(r)
  }
  return Array.from(map.entries()).map(([dateStr, rs]) => ({
    dateStr,
    label: format(parseISO(dateStr), 'MMMM d, yyyy'),
    readings: rs,
  }))
}

export function ReadingHistory({ readings, type }: ReadingHistoryProps) {
  const groups = groupByDate(readings)

  if (groups.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-400">
        No readings recorded yet.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.dateStr}>
          {/* Date header */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {group.label}
            </span>
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">{group.readings.length} reading{group.readings.length > 1 ? 's' : ''}</span>
          </div>

          {/* Reading cards */}
          <div className="space-y-2">
            {group.readings.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-4 hover:border-gray-300 hover:shadow-sm transition-shadow"
              >
                {/* Value */}
                <div className="min-w-[90px]">
                  <span className="text-xl font-bold text-gray-900 tabular-nums leading-none">
                    {formatValue(r)}
                  </span>
                  <span className="ml-1 text-xs text-gray-400">{r.unit}</span>
                </div>

                {/* Status */}
                <div className="pt-0.5">
                  <VitalStatusBadge status={r.status} />
                  {r.context && (
                    <span className="ml-1.5 text-xs text-gray-400">
                      · {BLOOD_SUGAR_CONTEXT_LABELS[r.context]}
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="ml-auto flex items-center gap-5 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    {formatTime(r.time)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-gray-400" />
                    {r.addedBy}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {r.source}
                  </span>
                </div>

                {/* Notes */}
                {r.notes && (
                  <p className="hidden md:block text-xs text-gray-400 italic max-w-[200px] truncate pt-0.5">
                    {r.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
