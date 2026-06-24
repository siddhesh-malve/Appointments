import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        scheduled: 'bg-status-scheduled-bg text-status-scheduled-text',
        completed: 'bg-status-completed-bg text-status-completed-text',
        cancelled: 'bg-status-cancelled-bg text-status-cancelled-text',
        rescheduled: 'bg-blue-50 text-blue-700',
        default: 'bg-gray-100 text-gray-700',
        outline: 'border border-gray-300 text-gray-600',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
