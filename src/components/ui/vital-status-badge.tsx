import { cn } from '@/lib/utils'
import { VITAL_STATUS_CONFIG, type VitalStatus } from '@/types/vital'

interface VitalStatusBadgeProps {
  status: VitalStatus
  className?: string
}

export function VitalStatusBadge({ status, className }: VitalStatusBadgeProps) {
  const cfg = VITAL_STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        cfg.bg,
        cfg.color,
        className
      )}
    >
      {cfg.label}
    </span>
  )
}
