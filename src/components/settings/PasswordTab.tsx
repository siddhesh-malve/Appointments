import { useState } from 'react'
import { Eye, EyeOff, Shield, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PasswordStrength { score: number; label: string; color: string }

function getStrength(pwd: string): PasswordStrength {
  let score = 0
  if (pwd.length >= 8)                         score++
  if (/[A-Z]/.test(pwd))                       score++
  if (/[0-9]/.test(pwd))                       score++
  if (/[^A-Za-z0-9]/.test(pwd))               score++
  if (pwd.length >= 12)                        score++
  if (score <= 1) return { score, label: 'Weak',      color: 'bg-red-500'    }
  if (score <= 2) return { score, label: 'Fair',      color: 'bg-orange-400' }
  if (score <= 3) return { score, label: 'Good',      color: 'bg-yellow-400' }
  if (score <= 4) return { score, label: 'Strong',    color: 'bg-green-500'  }
  return               { score, label: 'Very Strong', color: 'bg-primary'    }
}

const REQUIREMENTS = [
  { label: 'At least 8 characters',         test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter (A–Z)',     test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number (0–9)',               test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$…)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export function PasswordTab() {
  const [current, setCurrent]       = useState('')
  const [newPwd, setNewPwd]         = useState('')
  const [confirm, setConfirm]       = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [isLoading, setIsLoading]   = useState(false)
  const [success, setSuccess]       = useState(false)

  const strength = getStrength(newPwd)

  function validate() {
    const e: Record<string, string> = {}
    if (!current)              e.current = 'Current password is required'
    if (!newPwd)               e.newPwd  = 'New password is required'
    else if (newPwd.length < 8) e.newPwd = 'Password must be at least 8 characters'
    if (!confirm)              e.confirm = 'Please confirm your new password'
    else if (confirm !== newPwd) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
      setCurrent(''); setNewPwd(''); setConfirm('')
      setTimeout(() => setSuccess(false), 4000)
    }, 700)
  }

  const inputCls = (err?: string) => cn(
    'w-full h-9 rounded-lg border pr-10 pl-3 text-sm focus:outline-none focus:ring-2 transition-colors',
    err ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-primary focus:border-primary'
  )
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

  function PwdField({ label, value, onChange, show, onToggle, error, placeholder }: {
    label: string; value: string; onChange: (v: string) => void
    show: boolean; onToggle: () => void; error?: string; placeholder?: string
  }) {
    return (
      <div>
        <label className={labelCls}>{label} <span className="text-red-500">*</span></label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={inputCls(error)}
            placeholder={placeholder}
          />
          <button type="button" onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Password</h2>
        <p className="text-sm text-gray-500 mt-0.5">Update your account password to keep it secure.</p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium text-green-700">Password updated successfully.</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Icon */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Change Password</p>
            <p className="text-xs text-gray-400">Choose a strong, unique password.</p>
          </div>
        </div>

        <PwdField label="Current Password" value={current} onChange={setCurrent}
          show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} error={errors.current} />

        <div className="border-t border-gray-100 pt-4 space-y-4">
          <PwdField label="New Password" value={newPwd} onChange={(v) => { setNewPwd(v); setErrors(e => ({...e, newPwd: ''})) }}
            show={showNew} onToggle={() => setShowNew(!showNew)} error={errors.newPwd} />

          {/* Strength meter */}
          {newPwd && (
            <div className="space-y-2">
              <div className="flex gap-1 h-1.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={cn('flex-1 rounded-full transition-colors', i <= strength.score ? strength.color : 'bg-gray-200')} />
                ))}
              </div>
              <p className="text-xs text-gray-500">Strength: <span className="font-medium text-gray-800">{strength.label}</span></p>
              {/* Requirements */}
              <div className="grid grid-cols-2 gap-1 mt-2">
                {REQUIREMENTS.map((req) => (
                  <div key={req.label} className="flex items-center gap-1.5">
                    <div className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', req.test(newPwd) ? 'bg-green-500' : 'bg-gray-300')} />
                    <span className={cn('text-xs', req.test(newPwd) ? 'text-green-700' : 'text-gray-400')}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <PwdField label="Confirm New Password" value={confirm} onChange={(v) => { setConfirm(v); setErrors(e => ({...e, confirm: ''})) }}
            show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} error={errors.confirm}
            placeholder="Re-enter new password" />
        </div>

        <div className="flex justify-end pt-2">
          <Button size="sm" onClick={handleSave} loading={isLoading}>
            Update Password
          </Button>
        </div>
      </div>
    </div>
  )
}
