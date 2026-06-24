import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown, Check, UserPlus, MapPin } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { cn } from '@/lib/utils'
import {
  INVITE_LOCATIONS, ROLE_OPTIONS, ROLE_BADGE,
  type UserRole, type AssignedLocation, type InvitedUser,
} from '@/mocks/users'

interface PreviewUser {
  id: string; firstName: string; lastName: string; email: string
  locations: AssignedLocation[]; role: UserRole
}

interface InviteUserModalProps {
  open: boolean
  onClose: () => void
  onInvite: (users: InvitedUser[]) => void
}

const emptyForm = { firstName: '', lastName: '', email: '', locations: [] as AssignedLocation[], role: '' as UserRole | '' }

// Inline checkbox list — no portal, no z-index issues
function LocationMultiSelect({ value, onChange }: { value: AssignedLocation[]; onChange: (v: AssignedLocation[]) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  function toggle(loc: AssignedLocation) {
    onChange(value.some(l => l.id === loc.id) ? value.filter(l => l.id !== loc.id) : [...value, loc])
  }

  const label = value.length === 0
    ? 'Select locations...'
    : value.length === 1
    ? value[0].name
    : `${value.length} locations selected`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onMouseDown={e => { e.preventDefault(); setOpen(o => !o) }}
        className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
      >
        <span className={value.length > 0 ? 'text-gray-900 truncate' : 'text-gray-400'}>{label}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 flex-shrink-0 transition-transform ml-2', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-10 z-[200] bg-white border border-gray-200 rounded-xl shadow-lg py-1">
          {INVITE_LOCATIONS.map(loc => {
            const checked = value.some(l => l.id === loc.id)
            return (
              <button
                key={loc.id}
                type="button"
                onMouseDown={e => { e.preventDefault(); toggle(loc) }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <span className={cn(
                  'h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors',
                  checked ? 'bg-primary border-primary' : 'border-gray-300'
                )}>
                  {checked && <Check className="h-2.5 w-2.5 text-white" />}
                </span>
                <span className="text-gray-700">{loc.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function UserPreviewCard({ user, onRemove }: { user: PreviewUser; onRemove: () => void }) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const badge = ROLE_BADGE[user.role]
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', badge.bg, badge.text)}>{badge.label}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
        {user.locations.length > 0 && (
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-400">{user.locations.map(l => l.name).join(', ')}</span>
          </div>
        )}
      </div>
      <button
        onClick={onRemove}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function InviteUserModal({ open, onClose, onInvite }: InviteUserModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [previewUsers, setPreviewUsers] = useState<PreviewUser[]>([])
  const [isInviting, setIsInviting] = useState(false)

  const isFormComplete = !!(
    form.firstName.trim() && form.lastName.trim() &&
    form.email.trim() && form.locations.length > 0 && form.role
  )

  function handleAddUser() {
    if (!isFormComplete || !form.role) return
    setPreviewUsers(prev => [...prev, {
      id: `p-${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      locations: form.locations,
      role: form.role as UserRole,
    }])
    setForm(emptyForm)
  }

  function handleInvite() {
    if (previewUsers.length === 0) return
    setIsInviting(true)
    setTimeout(() => {
      const now = new Date().toISOString()
      onInvite(previewUsers.map(u => ({
        id: `inv-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        firstName: u.firstName, lastName: u.lastName,
        fullName: `${u.firstName} ${u.lastName}`,
        email: u.email, role: u.role,
        assignedLocations: u.locations,
        status: 'invite_sent' as const,
        invitedAt: now,
      })))
      setPreviewUsers([])
      setForm(emptyForm)
      setIsInviting(false)
      onClose()
    }, 700)
  }

  function handleClose() {
    setPreviewUsers([]); setForm(emptyForm); onClose()
  }

  const inputCls = 'w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <Dialog open={open} onOpenChange={o => !o && handleClose()}>
      <DialogContent
        className="max-w-[900px] max-h-[90vh] flex flex-col p-0 overflow-hidden"
        onInteractOutside={e => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light flex-shrink-0">
              <UserPlus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Invite Users</DialogTitle>
              <DialogDescription>Invite staff members and assign locations and roles.</DialogDescription>
            </div>
          </div>
        </div>

        {/* Form — flex-shrink-0 so the inline dropdown can expand freely */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">New User Details</p>

          {/* Row 1: First Name · Last Name · Email */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>First Name <span className="text-red-500">*</span></label>
              <input
                value={form.firstName}
                onChange={e => setForm(f => ({...f, firstName: e.target.value}))}
                className={inputCls}
                placeholder="e.g. Sarah"
              />
            </div>
            <div>
              <label className={labelCls}>Last Name <span className="text-red-500">*</span></label>
              <input
                value={form.lastName}
                onChange={e => setForm(f => ({...f, lastName: e.target.value}))}
                className={inputCls}
                placeholder="e.g. Johnson"
              />
            </div>
            <div>
              <label className={labelCls}>Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                className={inputCls}
                placeholder="e.g. sarah@clinic.com"
              />
            </div>
          </div>

          {/* Row 2: Location · Role · Add User */}
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className={labelCls}>Location <span className="text-red-500">*</span></label>
              <LocationMultiSelect value={form.locations} onChange={v => setForm(f => ({...f, locations: v}))} />
            </div>
            <div>
              <label className={labelCls}>Role <span className="text-red-500">*</span></label>
              <NativeSelect
                value={form.role}
                onValueChange={v => setForm(f => ({...f, role: v as UserRole | ''}))}
                options={ROLE_OPTIONS}
                placeholder="Select role..."
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddUser} disabled={!isFormComplete} className="w-full">
                <UserPlus className="h-3.5 w-3.5" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable preview area */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {previewUsers.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-700">Users to Invite</p>
                <span className="rounded-full bg-primary-light text-primary text-xs font-semibold px-2 py-0.5">{previewUsers.length}</span>
              </div>
              {previewUsers.map(u => (
                <UserPreviewCard
                  key={u.id}
                  user={u}
                  onRemove={() => setPreviewUsers(p => p.filter(x => x.id !== u.id))}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <UserPlus className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">No users added yet</p>
              <p className="text-xs text-gray-300 mt-0.5">Fill in the form above and click "Add User"</p>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-xs text-gray-400">
            {previewUsers.length > 0
              ? `${previewUsers.length} user${previewUsers.length !== 1 ? 's' : ''} ready to invite`
              : 'Add at least one user to send invitations'}
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleClose} disabled={isInviting}>Cancel</Button>
            <Button size="sm" onClick={handleInvite} disabled={previewUsers.length === 0} loading={isInviting}>
              {isInviting ? 'Sending...' : `Invite ${previewUsers.length > 0 ? `${previewUsers.length} User${previewUsers.length !== 1 ? 's' : ''}` : 'Users'}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
