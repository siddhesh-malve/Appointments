import { Badge } from '@/components/ui/badge'
import type { AppointmentStatus } from '@/types/appointment'

interface StatusBadgeProps {
  status: AppointmentStatus
}

const statusConfig: Record<AppointmentStatus, { variant: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'; label: string }> = {
  scheduled: { variant: 'scheduled', label: 'Scheduled' },
  completed: { variant: 'completed', label: 'Completed' },
  cancelled: { variant: 'cancelled', label: 'Cancelled' },
  rescheduled: { variant: 'rescheduled', label: 'Rescheduled' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
