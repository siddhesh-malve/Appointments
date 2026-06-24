import { useState } from 'react'
import { Plus, MapPin, Phone, Edit, Trash2, MoreHorizontal, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogBody, DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface Location {
  id: string
  name: string
  address: string
  phone: string
  type: 'clinic' | 'hospital' | 'telehealth'
  isActive: boolean
  providersCount: number
}

const MOCK_LOCATIONS: Location[] = [
  { id: 'loc-1', name: 'Downtown Clinic',         address: '123 N Michigan Ave, Suite 400, Chicago, IL 60601', phone: '(312) 555-0101', type: 'clinic',    isActive: true,  providersCount: 4 },
  { id: 'loc-2', name: 'North Shore Medical Center', address: '800 W Diversey Pkwy, Chicago, IL 60614',           phone: '(773) 555-0202', type: 'hospital',  isActive: true,  providersCount: 6 },
  { id: 'loc-3', name: 'Westside Family Practice', address: '4500 W Cermak Rd, Cicero, IL 60804',                phone: '(708) 555-0303', type: 'clinic',    isActive: true,  providersCount: 3 },
  { id: 'loc-4', name: 'South Loop Health Hub',    address: '1200 S Michigan Ave, Chicago, IL 60605',             phone: '(312) 555-0404', type: 'clinic',    isActive: false, providersCount: 2 },
  { id: 'loc-5', name: 'Telehealth Services',      address: 'Virtual — No physical address',                     phone: '(312) 555-0505', type: 'telehealth', isActive: true,  providersCount: 5 },
]

const TYPE_CONFIG = {
  clinic:    { label: 'Clinic',     bg: 'bg-blue-50',   text: 'text-blue-700'  },
  hospital:  { label: 'Hospital',   bg: 'bg-purple-50', text: 'text-purple-700'},
  telehealth:{ label: 'Telehealth', bg: 'bg-teal-50',   text: 'text-teal-700'  },
}

type LocationType = 'clinic' | 'hospital' | 'telehealth'

interface FormState {
  name: string; address: string; phone: string; type: LocationType; isActive: boolean
}

const emptyForm: FormState = { name: '', address: '', phone: '', type: 'clinic', isActive: true }

export function LocationManagementTab() {
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [editTarget, setEditTarget] = useState<Location | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  function openAdd() {
    setForm(emptyForm); setErrors({}); setModalMode('add')
  }
  function openEdit(loc: Location) {
    setEditTarget(loc)
    setForm({ name: loc.name, address: loc.address, phone: loc.phone, type: loc.type, isActive: loc.isActive })
    setErrors({}); setModalMode('edit')
  }
  function closeModal() { setModalMode(null); setEditTarget(null) }

  function validate() {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Location name is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.address.trim()) e.address = 'Address is required'
    setErrors(e); return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    setIsLoading(true)
    setTimeout(() => {
      if (modalMode === 'add') {
        const newLoc: Location = { id: `loc-${Date.now()}`, ...form, providersCount: 0 }
        setLocations(prev => [...prev, newLoc])
      } else if (modalMode === 'edit' && editTarget) {
        setLocations(prev => prev.map(l => l.id === editTarget.id ? { ...l, ...form } : l))
      }
      setIsLoading(false); closeModal()
    }, 500)
  }

  function handleDelete() {
    if (!deleteTarget) return
    setLocations(prev => prev.filter(l => l.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const inputCls = (err?: string) => cn(
    'w-full h-9 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 transition-colors',
    err ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-primary focus:border-primary'
  )
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Location Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your practice locations and clinics.</p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add Location
        </Button>
      </div>

      {/* Location cards */}
      <div className="space-y-3">
        {locations.map((loc) => {
          const tc = TYPE_CONFIG[loc.type]
          return (
            <div key={loc.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-900">{loc.name}</h3>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', tc.bg, tc.text)}>{tc.label}</span>
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        loc.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
                      )}>
                        {loc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{loc.address}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{loc.phone}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{loc.providersCount} provider{loc.providersCount !== 1 ? 's' : ''} assigned</p>
                  </div>
                </div>
                <LocationActionsMenu onEdit={() => openEdit(loc)} onDelete={() => setDeleteTarget(loc)} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={!!modalMode} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent width="md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <DialogTitle>{modalMode === 'add' ? 'Add Location' : 'Edit Location'}</DialogTitle>
                <DialogDescription>{modalMode === 'add' ? 'Add a new practice location.' : 'Update location details.'}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div>
              <label className={labelCls}>Location Name <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className={inputCls(errors.name)} placeholder="e.g. Downtown Clinic" />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
              <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className={inputCls(errors.phone)} placeholder="(XXX) XXX-XXXX" />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className={labelCls}>Address <span className="text-red-500">*</span></label>
              <textarea rows={2} value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} className={cn('w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2', errors.address ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-primary')} placeholder="Street, City, State, ZIP" />
              {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className={labelCls}>Location Type</label>
              <div className="flex gap-2">
                {(['clinic', 'hospital', 'telehealth'] as LocationType[]).map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({...f, type: t}))}
                    className={cn('flex-1 rounded-lg border-2 py-2 text-xs font-medium capitalize transition-colors', form.type === t ? 'border-primary bg-primary-bg text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm(f => ({...f, isActive: !f.isActive}))}
                className={cn('relative h-5 w-9 rounded-full transition-colors flex-shrink-0', form.isActive ? 'bg-primary' : 'bg-gray-300')}>
                <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', form.isActive ? 'translate-x-4' : 'translate-x-0.5')} />
              </button>
              <span className="text-sm text-gray-700">Active location</span>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={closeModal} disabled={isLoading}>Cancel</Button>
            <Button size="sm" onClick={handleSave} loading={isLoading}>{modalMode === 'add' ? 'Add Location' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent width="sm">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <DialogTitle>Remove Location</DialogTitle>
                <DialogDescription>This cannot be undone.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-gray-600">Are you sure you want to remove <span className="font-semibold">{deleteTarget?.name}</span>? All provider assignments for this location will be cleared.</p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Remove Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LocationActionsMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative flex-shrink-0">
      <button onClick={() => setOpen(!open)} className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-gray-200 bg-white shadow-lg py-1">
            <button onClick={() => { onEdit(); setOpen(false) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Edit className="h-3.5 w-3.5 text-gray-400" /> Edit
            </button>
            <button onClick={() => { onDelete(); setOpen(false) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </>
      )}
    </div>
  )
}
