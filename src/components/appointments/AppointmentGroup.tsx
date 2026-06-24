import { AppointmentCard } from './AppointmentCard'
import type { Appointment } from '@/types/appointment'

interface AppointmentGroupProps {
  dateLabel: string
  appointments: Appointment[]
  onReschedule: (id: string) => void
  onCancel: (id: string) => void
  onAddToCalendar: (id: string) => void
  onViewDetails?: (id: string) => void
  variant?: 'upcoming' | 'completed' | 'cancelled'
}

export function AppointmentGroup({
  dateLabel,
  appointments,
  onReschedule,
  onCancel,
  onAddToCalendar,
  onViewDetails,
  variant = 'upcoming',
}: AppointmentGroupProps) {
  return (
    <div>
      {/* Date header */}
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
          {dateLabel}
        </span>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          · {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Cards */}
      <div className="space-y-2.5">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            onReschedule={onReschedule}
            onCancel={onCancel}
            onAddToCalendar={onAddToCalendar}
            onViewDetails={onViewDetails}
            variant={variant}
          />
        ))}
      </div>
    </div>
  )
}
