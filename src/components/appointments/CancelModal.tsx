import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatTime, formatFullDate } from '@/lib/utils'
import type { Appointment } from '@/types/appointment'

interface CancelModalProps {
  open: boolean
  appointment: Appointment | null
  onClose: () => void
  onConfirm: (appointmentId: string, reason: 'other', reasonText: string) => void
}

export function CancelModal({ open, appointment, onClose, onConfirm }: CancelModalProps) {
  const [reasonText, setReasonText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const canConfirm = reasonText.trim().length > 0

  function handleConfirm() {
    if (!appointment || !canConfirm) return
    setIsLoading(true)
    setTimeout(() => {
      onConfirm(appointment.id, 'other', reasonText.trim())
      setIsLoading(false)
      setReasonText('')
      onClose()
    }, 600)
  }

  function handleClose() {
    if (isLoading) return
    setReasonText('')
    onClose()
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent width="sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <DialogTitle>Cancel Appointment</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Appointment summary */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-1.5">
            <p className="text-sm font-semibold text-gray-900">{appointment.patientName}</p>
            <p className="text-xs text-gray-500">MRN: {appointment.mrn}</p>
            <p className="text-xs text-gray-600">
              {formatFullDate(appointment.date)} · {formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}
            </p>
            <p className="text-xs text-gray-600">{appointment.providerName}</p>
          </div>

          {/* Reason — free text only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cancellation reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value.slice(0, 300))}
              rows={4}
              placeholder="Enter the reason for cancellation..."
              autoFocus
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{reasonText.length}/300</p>
          </div>

          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-300" />
            This appointment will be moved to the Cancelled tab.
          </p>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
            Keep Appointment
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            loading={isLoading}
          >
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
