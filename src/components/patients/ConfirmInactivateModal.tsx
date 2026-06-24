import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogBody, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Patient } from '@/types/patient'

interface ConfirmInactivateModalProps {
  open: boolean
  patient: Patient | null
  onClose: () => void
  onConfirm: (patientId: string) => void
}

export function ConfirmInactivateModal({ open, patient, onClose, onConfirm }: ConfirmInactivateModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  function handleConfirm() {
    if (!patient) return
    setIsLoading(true)
    setTimeout(() => {
      onConfirm(patient.id)
      setIsLoading(false)
      onClose()
    }, 500)
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !isLoading && onClose()}>
      <DialogContent width="sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <DialogTitle>Mark Patient Inactive</DialogTitle>
              <DialogDescription>This will restrict the patient's active status.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-1">
            <p className="text-sm font-semibold text-gray-900">{patient.fullName}</p>
            <p className="text-xs text-gray-500 font-mono">MRN: {patient.mrn}</p>
          </div>
          <p className="text-sm text-gray-600">
            Are you sure you want to mark <span className="font-semibold">{patient.fullName}</span> as inactive?
            This will hide them from active patient lists but their records will be preserved.
          </p>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            loading={isLoading}
          >
            Mark Inactive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
