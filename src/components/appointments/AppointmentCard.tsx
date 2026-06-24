import {
  Clock,
  MapPin,
  User,
  Video,
  CalendarPlus,
  RefreshCw,
  X,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { cn, formatTime, formatFullDate, formatDateTime } from '@/lib/utils'
import { CANCELLATION_REASON_LABELS, type Appointment } from '@/types/appointment'

const PLATFORM_LABELS: Record<string, string> = {
  google_meet: 'Google Meet',
  zoom: 'Zoom',
  microsoft_teams: 'Microsoft Teams',
}

interface InfoRowProps {
  label: string
  value: React.ReactNode
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-xs text-gray-700">{value}</span>
    </div>
  )
}

interface AppointmentCardProps {
  appointment: Appointment
  onReschedule: (id: string) => void
  onCancel: (id: string) => void
  onAddToCalendar: (id: string) => void
  onViewDetails?: (id: string) => void
  variant?: 'upcoming' | 'completed' | 'cancelled'
}

export function AppointmentCard({
  appointment: appt,
  onReschedule,
  onCancel,
  onAddToCalendar,
  onViewDetails,
  variant = 'upcoming',
}: AppointmentCardProps) {
  const isOnline = appt.type === 'online'
  const isCancelled = variant === 'cancelled'
  const isCompleted = variant === 'completed'

  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 transition-shadow',
      !isCancelled && 'hover:border-gray-300 hover:shadow-sm'
    )}>
      <div className="p-4">

        {/* ── Info ── */}
        <div className="min-w-0">

          {/* Patient + status */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {appt.patientName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-gray-900">{appt.patientName}</span>
              <span className="ml-2 text-xs text-gray-400 font-mono">MRN: {appt.mrn}</span>
            </div>
            {appt.status === 'rescheduled' && appt.rescheduleHistory.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                <RefreshCw className="h-3 w-3" />
                Rescheduled from {formatFullDate(appt.rescheduleHistory[appt.rescheduleHistory.length - 1].originalDate)}
              </span>
            )}
          </div>

          {/* Detail grid — label / value */}
          <div className="mt-3 grid grid-cols-3 gap-x-6 gap-y-2.5">
            <InfoRow
              label="Time"
              value={`${formatTime(appt.startTime)} – ${formatTime(appt.endTime)}`}
            />
            <InfoRow label="Professional" value={appt.providerName} />
            <InfoRow
              label="Visit Type"
              value={
                <span className="text-gray-700">
                  {isOnline ? 'Online / Telehealth' : 'In-Person'}
                </span>
              }
            />
            {appt.locationName && (
              <InfoRow
                label="Location"
                value={<span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />{appt.locationName}</span>}
              />
            )}
            {appt.notes && !isCancelled && (
              <InfoRow label="Reason for Appointment" value={<span className="line-clamp-1">{appt.notes}</span>} />
            )}
          </div>


          {/* Cancellation detail rows */}
          {isCancelled && appt.cancellation && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-3">
              <InfoRow label="Cancelled By" value={appt.cancellation.cancelledBy} />
              <InfoRow label="Reason" value={CANCELLATION_REASON_LABELS[appt.cancellation.reason]} />
              <InfoRow
                label="Cancelled On"
                value={formatDateTime(
                  appt.cancellation.cancelledAt.split('T')[0],
                  appt.cancellation.cancelledAt.split('T')[1].slice(0, 5)
                )}
              />
            </div>
          )}
        </div>

        {/* ── Actions row — right-aligned ── */}
        {!isCancelled && !isCompleted && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(appt.id)}
              className="text-xs h-8 px-3 whitespace-nowrap text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
            >
              <X className="h-3 w-3" />
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddToCalendar(appt.id)}
              className="text-xs h-8 px-3 whitespace-nowrap"
            >
              <CalendarPlus className="h-3 w-3" />
              Add to Calendar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReschedule(appt.id)}
              className="text-xs h-8 px-3 whitespace-nowrap"
            >
              <RefreshCw className="h-3 w-3" />
              Reschedule Appointment
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(appt.id)}
              className="text-xs h-8 whitespace-nowrap text-gray-500"
            >
              <ChevronDown className="h-3 w-3" />
              View Details
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
