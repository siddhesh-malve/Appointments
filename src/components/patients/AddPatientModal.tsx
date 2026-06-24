import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogBody, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Patient, PatientGender } from '@/types/patient'

interface AddPatientModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (patient: Patient) => void
}

interface FormErrors {
  firstName?: string
  lastName?: string
  mrn?: string
  dob?: string
  gender?: string
  phone?: string
}

export function AddPatientModal({ open, onClose, onSuccess }: AddPatientModalProps) {
  const [firstName, setFirstName]   = useState('')
  const [lastName, setLastName]     = useState('')
  const [mrn, setMrn]               = useState('')
  const [dob, setDob]               = useState('')
  const [gender, setGender]         = useState<PatientGender | ''>('')
  const [phone, setPhone]           = useState('')
  const [email, setEmail]           = useState('')
  const [errors, setErrors]         = useState<FormErrors>({})
  const [isLoading, setIsLoading]   = useState(false)

  function validate(): boolean {
    const e: FormErrors = {}
    if (!firstName.trim()) e.firstName = 'First name is required'
    if (!lastName.trim())  e.lastName  = 'Last name is required'
    if (!mrn.trim())       e.mrn       = 'MRN is required'
    if (!dob)              e.dob       = 'Date of birth is required'
    if (!gender)           e.gender    = 'Gender is required'
    if (!phone.trim())     e.phone     = 'Contact number is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setIsLoading(true)
    setTimeout(() => {
      const newPatient: Patient = {
        id: `pat-${Date.now()}`,
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mrn: mrn.trim(),
        dob,
        gender: gender as PatientGender,
        phone: phone.trim(),
        email: email.trim() || null,
        status: 'active',
        addedById: 'usr-1',
        addedByName: 'Sarah Johnson',
        lastAppointmentDate: null,
        createdAt: new Date().toISOString(),
      }
      onSuccess(newPatient)
      setIsLoading(false)
      handleClose()
    }, 500)
  }

  function handleClose() {
    if (isLoading) return
    setFirstName(''); setLastName(''); setMrn(''); setDob('')
    setGender(''); setPhone(''); setEmail(''); setErrors({})
    onClose()
  }

  const inputCls = (err?: string) =>
    cn(
      'w-full h-9 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 transition-colors',
      err
        ? 'border-red-400 focus:ring-red-400'
        : 'border-gray-300 focus:ring-primary focus:border-primary'
    )

  const genderOptions: { value: PatientGender; label: string }[] = [
    { value: 'male',   label: 'Male'   },
    { value: 'female', label: 'Female' },
    { value: 'other',  label: 'Other'  },
  ]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent width="md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-light">
              <UserPlus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>Fill in the patient's details below.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => !firstName.trim() && setErrors(p => ({ ...p, firstName: 'First name is required' }))}
                className={inputCls(errors.firstName)}
                placeholder="John"
              />
              {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => !lastName.trim() && setErrors(p => ({ ...p, lastName: 'Last name is required' }))}
                className={inputCls(errors.lastName)}
                placeholder="Smith"
              />
              {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* MRN + DOB */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                MRN <span className="text-red-500">*</span>
              </label>
              <input
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                className={inputCls(errors.mrn)}
                placeholder="100XXX"
              />
              {errors.mrn && <p className="text-xs text-red-600 mt-1">{errors.mrn}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={inputCls(errors.dob)}
              />
              {errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob}</p>}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {genderOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGender(opt.value)}
                  className={cn(
                    'flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors',
                    gender === opt.value
                      ? 'border-primary bg-primary-bg text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact No. <span className="text-red-500">*</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls(errors.phone)}
                placeholder="(XXX) XXX-XXXX"
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls()}
                placeholder="patient@email.com"
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={isLoading}>
            <UserPlus className="h-3.5 w-3.5" />
            Add Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
