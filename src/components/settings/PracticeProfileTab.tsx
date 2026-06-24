import { useState, useRef } from 'react'
import {
  Globe, Mail, Phone, MapPin, Calendar, Edit, Upload, X, Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface PracticeProfile {
  name: string
  bio: string
  website: string
  adminEmail: string
  adminPhone: string
  address: string
  createdDate: string
  status: 'active' | 'inactive'
  logoUrl: string | null
}

const MOCK_PROFILE: PracticeProfile = {
  name: 'HealthFirst Medical Group',
  bio: 'A leading multi-specialty healthcare practice serving the Chicago metropolitan area since 2008. We are committed to providing compassionate, evidence-based care across internal medicine, cardiology, pediatrics, and mental health.',
  website: 'https://healthfirstmedical.com',
  adminEmail: 'admin@healthfirstmedical.com',
  adminPhone: '(312) 555-0100',
  address: '123 North Michigan Avenue, Suite 400\nChicago, IL 60601\nUnited States',
  createdDate: 'January 12, 2008',
  status: 'active',
  logoUrl: null,
}

function LogoPlaceholder({ name, size = 96 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div
      className="flex items-center justify-center rounded-xl bg-primary-light border-2 border-primary-border flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="text-primary font-bold" style={{ fontSize: size * 0.28 }}>{initials}</span>
    </div>
  )
}

interface FieldProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}
function Field({ icon, label, value }: FieldProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-sm font-medium text-gray-800">{value}</div>
      </div>
    </div>
  )
}

export function PracticeProfileTab() {
  const [profile, setProfile] = useState<PracticeProfile>(MOCK_PROFILE)
  const [editOpen, setEditOpen] = useState(false)
  const [draft, setDraft] = useState<PracticeProfile>(MOCK_PROFILE)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function openEdit() {
    setDraft({ ...profile })
    setPreviewUrl(profile.logoUrl)
    setEditOpen(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setDraft(d => ({ ...d, logoUrl: url }))
  }

  function handleSave() {
    setIsLoading(true)
    setTimeout(() => {
      setProfile({ ...draft, logoUrl: previewUrl })
      setIsLoading(false)
      setEditOpen(false)
    }, 500)
  }

  function handleClose() {
    setEditOpen(false)
    setPreviewUrl(null)
  }

  const inputCls = 'w-full h-9 rounded-lg border border-gray-300 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Practice Profile</h2>
          <p className="text-sm text-gray-500 mt-0.5">View and manage your practice information.</p>
        </div>
        <Button size="sm" onClick={openEdit}>
          <Edit className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top banner */}
        <div className="h-20 bg-gradient-to-r from-primary-bg to-primary-light" />

        {/* Logo + name */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="rounded-xl border-4 border-white shadow-md">
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="logo" className="h-20 w-20 rounded-xl object-cover" />
              ) : (
                <LogoPlaceholder name={profile.name} size={80} />
              )}
            </div>
            <span className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
              profile.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
            )}>
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
              {profile.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">{profile.bio}</p>

          {/* Fields */}
          <div className="mt-5 divide-y divide-gray-100">
            <Field
              icon={<Globe className="h-4 w-4" />}
              label="Website"
              value={
                <a href={profile.website} target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline">
                  {profile.website}
                </a>
              }
            />
            <Field icon={<Mail className="h-4 w-4" />} label="Admin Email" value={profile.adminEmail} />
            <Field icon={<Phone className="h-4 w-4" />} label="Admin Contact" value={profile.adminPhone} />
            <Field
              icon={<MapPin className="h-4 w-4" />}
              label="Practice Address"
              value={<span className="whitespace-pre-line">{profile.address}</span>}
            />
            <Field icon={<Calendar className="h-4 w-4" />} label="Member Since" value={profile.createdDate} />
          </div>
        </div>
      </div>

      {/* ── Edit Modal ─────────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={(o) => !o && !isLoading && handleClose()}>
        <DialogContent
          width="lg"
          className="max-h-[90vh] flex flex-col p-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <DialogTitle>Edit Practice Profile</DialogTitle>
                <DialogDescription>Update your practice information below.</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Logo upload */}
            <div>
              <label className={labelCls}>Practice Logo</label>
              <div className="flex items-center gap-4">
                <div className="rounded-xl border-2 border-gray-200 overflow-hidden flex-shrink-0">
                  {previewUrl ? (
                    <img src={previewUrl} alt="logo" className="h-16 w-16 object-cover" />
                  ) : (
                    <LogoPlaceholder name={draft.name || 'P'} size={64} />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5" />
                    Upload Logo
                  </Button>
                  {previewUrl && (
                    <Button
                      variant="outline" size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => { setPreviewUrl(null); setDraft(d => ({ ...d, logoUrl: null })) }}
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">PNG, JPG or SVG. Recommended 256×256px.</p>
            </div>

            {/* Practice Name */}
            <div>
              <label className={labelCls}>Practice Name <span className="text-red-500">*</span></label>
              <input
                value={draft.name}
                onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))}
                className={inputCls}
                placeholder="Practice name"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Admin Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={draft.adminEmail}
                  onChange={(e) => setDraft(d => ({ ...d, adminEmail: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Contact Number <span className="text-red-500">*</span></label>
                <input
                  value={draft.adminPhone}
                  onChange={(e) => setDraft(d => ({ ...d, adminPhone: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className={labelCls}>Bio</label>
              <textarea
                rows={4}
                value={draft.bio}
                onChange={(e) => setDraft(d => ({ ...d, bio: e.target.value.slice(0, 500) }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{draft.bio.length}/500</p>
            </div>

            {/* Website */}
            <div>
              <label className={labelCls}>Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  value={draft.website}
                  onChange={(e) => setDraft(d => ({ ...d, website: e.target.value }))}
                  className={cn(inputCls, 'pl-9')}
                  placeholder="https://"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelCls}>Practice Address</label>
              <textarea
                rows={3}
                value={draft.address}
                onChange={(e) => setDraft(d => ({ ...d, address: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="Street, City, State, ZIP"
              />
            </div>
          </div>

          {/* Sticky footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
            <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} loading={isLoading}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
