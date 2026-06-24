import { useState, useRef, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import {
  Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Send, X,
  UserCog, Mail, MapPin, Phone, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogBody, DialogFooter,
} from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'
import {
  mockActiveUsers, mockInvitedUsers, mockSuspendedUsers, ROLE_BADGE,
  type ActiveUser, type InvitedUser, type SuspendedUser,
} from '@/mocks/users'
import { InviteUserModal } from '@/components/users/InviteUserModal'
import { EditUserModal } from '@/components/users/EditUserModal'

type TabId = 'active' | 'invite_sent' | 'suspended'

// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-teal-100 text-teal-700']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={cn('rounded-full flex items-center justify-center font-semibold flex-shrink-0', color, size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm')}>
      {initials}
    </div>
  )
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: ActiveUser['role'] }) {
  const b = ROLE_BADGE[role]
  return <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', b.bg, b.text)}>{b.label}</span>
}

// ─── Location chips ───────────────────────────────────────────────────────────
function LocationChips({ locs }: { locs: { id: string; name: string }[] }) {
  if (locs.length === 0) return <span className="text-gray-400 text-xs">—</span>
  const first = locs.slice(0, 1)
  const rest = locs.length - 1
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {first.map(l => (
        <span key={l.id} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 whitespace-nowrap">{l.name}</span>
      ))}
      {rest > 0 && <span className="text-xs text-gray-400">+{rest}</span>}
    </div>
  )
}

// ─── Row Actions Dropdown ─────────────────────────────────────────────────────
function RowActions({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    function h(e: MouseEvent) { if (!ref.current?.contains(e.target as Node)) setClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  function setClose() { setOpen(false) }
  return (
    <div ref={ref} className="relative flex justify-end">
      <button onClick={() => setOpen(o => !o)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={setClose} />
          <div className="absolute right-0 top-8 z-20 w-36 rounded-xl border border-gray-200 bg-white shadow-lg py-1">
            <button onClick={() => { onView(); setClose() }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Eye className="h-3.5 w-3.5 text-gray-400" /> View
            </button>
            <button onClick={() => { onEdit(); setClose() }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Edit className="h-3.5 w-3.5 text-gray-400" /> Edit
            </button>
            <button onClick={() => { onDelete(); setClose() }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Resend Button ────────────────────────────────────────────────────────────
function ResendButton() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  function handle() {
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true); setTimeout(() => setSent(false), 2500) }, 1500)
  }
  return (
    <Button variant="outline" size="sm" onClick={handle} loading={loading} disabled={sent}>
      {sent ? '✓ Sent' : <><Send className="h-3 w-3" />Resend</>}
    </Button>
  )
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ open, name, onClose, onConfirm }: { open: boolean; name: string; onClose: () => void; onConfirm: () => void }) {
  const [loading, setLoading] = useState(false)
  function handle() {
    setLoading(true)
    setTimeout(() => { onConfirm(); setLoading(false) }, 400)
  }
  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent width="sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete User?</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{name}</span>? Their account and all associated data will be permanently removed.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handle} loading={loading}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── View User Modal ──────────────────────────────────────────────────────────
function ViewUserModal({ open, user, onClose }: { open: boolean; user: ActiveUser | null; onClose: () => void }) {
  if (!user) return null
  const badge = ROLE_BADGE[user.role]
  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent width="sm">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View-only information for this user.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={user.fullName} size="md" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.designation}</p>
              <RoleBadge role={user.role} />
            </div>
          </div>
          <div className="space-y-3 pt-2 border-t border-gray-100">
            {[
              { icon: <Mail className="h-3.5 w-3.5" />, label: 'Email', value: user.email },
              { icon: <Phone className="h-3.5 w-3.5" />, label: 'Contact', value: user.contactNumber },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3">
                <div className="text-gray-400 mt-0.5">{row.icon}</div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{row.label}</p>
                  <p className="text-sm text-gray-700">{row.value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-3">
              <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Locations</p>
                <p className="text-sm text-gray-700">{user.assignedLocations.map(l => l.name).join(', ') || '—'}</p>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Table header cell ────────────────────────────────────────────────────────
function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn('px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap', className)}>
      {children}
    </th>
  )
}

// ─── Active Tab ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 8

function ActiveTab({
  users, onEdit, onDelete, onView,
}: {
  users: ActiveUser[]
  onEdit: (u: ActiveUser) => void
  onDelete: (u: ActiveUser) => void
  onView: (u: ActiveUser) => void
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = users.filter(u =>
    !search || u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [search])

  return (
    <div>
      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-9 rounded-lg border border-gray-300 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <Th>Name</Th>
                <Th>Role</Th>
                <Th>Designation</Th>
                <Th>Email</Th>
                <Th>Contact Number</Th>
                <Th>Assigned Locations</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="py-12">
                      <EmptyState icon={UserCog} heading={search ? 'No results found' : 'No active users'}
                        subheading={search ? 'Try a different search term.' : 'Invite team members to get started.'} />
                    </div>
                  </td>
                </tr>
              ) : paginated.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.fullName} />
                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{u.designation}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{u.contactNumber}</td>
                  <td className="px-4 py-3"><LocationChips locs={u.assignedLocations} /></td>
                  <td className="px-4 py-3">
                    <RowActions onView={() => onView(u)} onEdit={() => onEdit(u)} onDelete={() => onDelete(u)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 disabled:opacity-40 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={cn('h-7 w-7 rounded-md text-xs font-medium transition-colors', p === page ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200')}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 disabled:opacity-40 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Invite Sent Tab ──────────────────────────────────────────────────────────
function InviteSentTab({ users, onRemove }: { users: InvitedUser[]; onRemove: (id: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Email</Th>
              <Th>Assigned Locations</Th>
              <Th>Request Sent On</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="py-12">
                    <EmptyState icon={Mail} heading="No pending invitations" subheading="Invited users will appear here." />
                  </div>
                </td>
              </tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.fullName} />
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{u.fullName}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{u.email}</td>
                <td className="px-4 py-3"><LocationChips locs={u.assignedLocations} /></td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {format(parseISO(u.invitedAt), 'MM-dd-yyyy • hh:mm aa')}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-amber-50 text-amber-700 px-2.5 py-0.5 text-xs font-medium">Pending</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <ResendButton />
                    <button onClick={() => onRemove(u.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Suspended Tab ────────────────────────────────────────────────────────────
function SuspendedTab({ users }: { users: SuspendedUser[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Designation</Th>
              <Th>Email</Th>
              <Th>Contact Number</Th>
              <Th>Assigned Locations</Th>
              <Th>Suspended On</Th>
              <Th>Reason</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="py-12">
                    <EmptyState icon={UserCog} heading="No suspended users" subheading="Suspended accounts will appear here." />
                  </div>
                </td>
              </tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.fullName} />
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{u.fullName}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{u.designation}</td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{u.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{u.contactNumber}</td>
                <td className="px-4 py-3"><LocationChips locs={u.assignedLocations} /></td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {format(parseISO(u.suspendedOn), 'MM-dd-yyyy')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{u.reason}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-red-50 text-red-700 px-2.5 py-0.5 text-xs font-medium">Suspended</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function UsersPage() {
  const [tab, setTab] = useState<TabId>('active')
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>(mockActiveUsers)
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>(mockInvitedUsers)
  const suspendedUsers = mockSuspendedUsers

  const [inviteOpen, setInviteOpen] = useState(false)
  const [editUser, setEditUser]     = useState<ActiveUser | null>(null)
  const [viewUser, setViewUser]     = useState<ActiveUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ActiveUser | null>(null)

  const TABS: { id: TabId; label: string; count: number }[] = [
    { id: 'active',      label: 'Active',      count: activeUsers.length  },
    { id: 'invite_sent', label: 'Invite Sent', count: invitedUsers.length },
    { id: 'suspended',   label: 'Suspended',   count: suspendedUsers.length },
  ]

  function handleInvite(newUsers: InvitedUser[]) {
    setInvitedUsers(prev => [...newUsers, ...prev])
    setTab('invite_sent')
  }

  function handleSaveEdit(updated: ActiveUser) {
    setActiveUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
  }

  function handleDelete() {
    if (!deleteTarget) return
    setActiveUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="px-6 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage practice users and invitations.</p>
        </div>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <Plus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-gray-200 mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}>
            {t.label}
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', tab === t.id ? 'bg-primary-light text-primary' : 'bg-gray-100 text-gray-500')}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'active' && (
        <ActiveTab users={activeUsers} onView={setViewUser} onEdit={setEditUser} onDelete={setDeleteTarget} />
      )}
      {tab === 'invite_sent' && (
        <InviteSentTab users={invitedUsers} onRemove={id => setInvitedUsers(p => p.filter(u => u.id !== id))} />
      )}
      {tab === 'suspended' && <SuspendedTab users={suspendedUsers} />}

      {/* Modals */}
      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={handleInvite} />
      <EditUserModal open={!!editUser} user={editUser} onClose={() => setEditUser(null)} onSave={handleSaveEdit} />
      <ViewUserModal open={!!viewUser} user={viewUser} onClose={() => setViewUser(null)} />
      <DeleteModal
        open={!!deleteTarget}
        name={deleteTarget?.fullName ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
