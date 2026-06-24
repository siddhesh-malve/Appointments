import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check, Edit3 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogBody, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { cn } from '@/lib/utils'
import { INVITE_LOCATIONS, ROLE_OPTIONS, type UserRole, type ActiveUser, type AssignedLocation } from '@/mocks/users'

interface EditUserModalProps {
  open: boolean
  onClose: () => void
  user: ActiveUser | null
  onSave: (updated: ActiveUser) => void
}

function LocationMultiSelect({ value, onChange }: { value: AssignedLocation[]; onChange: (v: AssignedLocation[]) => void }) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (!dropRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  function handleToggle() {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      setDropPos({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    setOpen(o => !o)
  }

  function toggle(loc: AssignedLocation) {
    onChange(value.some(l => l.id === loc.id) ? value.filter(l => l.id !== loc.id) : [...value, loc])
  }

  const label = value.length === 0 ? 'Select locations...' : value.length === 1 ? value[0].name : `${value.length} locations selected`

  return (
    <>
      <button ref={triggerRef} type="button" onClick={handleToggle}
        className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
        <span className={value.length > 0 ? 'text-gray-900 truncate' : 'text-gray-400'}>{label}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && dropPos && createPortal(
        <div ref={dropRef}
          style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-xl shadow-lg py-1">
          {INVITE_LOCATIONS.map(loc => {
            const checked = value.some(l => l.id === loc.id)
            return (
              <button key={loc.id} type="button" onClick={() => toggle(loc)}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                <span className={cn('h-4 w-4 rounded border flex items-center justify-center flex-shrink-0', checked ? 'bg-primary border-primary' : 'border-gray-300')}>
                  {checked && <Check className="h-2.5 w-2.5 text-white" />}
                </span>
                <span className="text-gray-700">{loc.name}</span>
              </button>
            )
          })}
        </div>,
        document.body
      )}
    </>
  )
}

export function EditUserModal({ open, onClose, user, onSave }: EditUserModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [contact, setContact]     = useState('')
  const [locations, setLocations] = useState<AssignedLocation[]>([])
  const [role, setRole]           = useState<UserRole | ''>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setEmail(user.email)
      setContact(user.contactNumber)
      setLocations(user.assignedLocations)
      setRole(user.role)
    }
  }, [user])

  function handleSave() {
    if (!user || !role) return
    setIsLoading(true)
    setTimeout(() => {
      onSave({
        ...user,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        contactNumber: contact.trim(),
        assignedLocations: locations,
        role: role as UserRole,
      })
      setIsLoading(false)
      onClose()
    }, 500)
  }

  const inputCls = 'w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent width="md" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light">
              <Edit3 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user details. Changes apply locally.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>First Name <span className="text-red-500">*</span></label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Last Name <span className="text-red-500">*</span></label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Email <span className="text-red-500">*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contact Number</label>
            <input value={contact} onChange={e => setContact(e.target.value)} className={inputCls} placeholder="(XXX) XXX-XXXX" />
          </div>
          <div>
            <label className={labelCls}>Assigned Locations <span className="text-red-500">*</span></label>
            <LocationMultiSelect value={locations} onChange={setLocations} />
          </div>
          <div>
            <label className={labelCls}>Role <span className="text-red-500">*</span></label>
            <NativeSelect value={role} onValueChange={v => setRole(v as UserRole)} options={ROLE_OPTIONS} placeholder="Select role..." />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button size="sm" onClick={handleSave} loading={isLoading}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
