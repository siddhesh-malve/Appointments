import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, ChevronUp, ChevronDown, ChevronsUpDown,
  MoreHorizontal, Eye, Edit, UserX, Users,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { format, parseISO, differenceInYears } from 'date-fns'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { AddPatientModal } from '@/components/patients/AddPatientModal'
import { ConfirmInactivateModal } from '@/components/patients/ConfirmInactivateModal'
import { mockPatients } from '@/mocks/patients'
import { cn } from '@/lib/utils'
import type { Patient } from '@/types/patient'

type SortField = 'fullName' | 'mrn' | 'dob' | 'status'
type SortDir = 'asc' | 'desc'
type StatusFilter = 'all' | 'active' | 'inactive'

const PAGE_SIZE = 10

const GENDER_LABELS: Record<string, string> = {
  male: 'Male', female: 'Female', other: 'Other',
}

// Unique "added by" names for filter
const ADDED_BY_OPTIONS = Array.from(new Set(mockPatients.map((p) => p.addedByName))).sort()

export function PatientsPage() {
  const navigate = useNavigate()

  const [patients, setPatients]             = useState<Patient[]>(mockPatients)
  const [search, setSearch]                 = useState('')
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>('all')
  const [addedByFilter, setAddedByFilter]   = useState('')
  const [sortField, setSortField]           = useState<SortField | null>(null)
  const [sortDir, setSortDir]               = useState<SortDir>('asc')
  const [page, setPage]                     = useState(1)
  const [addOpen, setAddOpen]               = useState(false)
  const [inactivateTarget, setInactivateTarget] = useState<Patient | null>(null)

  // Filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return patients.filter((p) => {
      const matchSearch  = !q || p.fullName.toLowerCase().includes(q) || p.mrn.includes(q)
      const matchStatus  = statusFilter === 'all' || p.status === statusFilter
      const matchAddedBy = !addedByFilter || p.addedByName === addedByFilter
      return matchSearch && matchStatus && matchAddedBy
    })
  }, [patients, search, statusFilter, addedByFilter])

  // Sort
  const sorted = useMemo(() => {
    if (!sortField) return filtered
    return [...filtered].sort((a, b) => {
      let cmp = 0
      if (sortField === 'fullName') cmp = a.fullName.localeCompare(b.fullName)
      else if (sortField === 'mrn')  cmp = a.mrn.localeCompare(b.mrn)
      else if (sortField === 'dob')  cmp = a.dob.localeCompare(b.dob)
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field as SortField); setSortDir('asc') }
    setPage(1)
  }

  function handleAdd(patient: Patient) {
    setPatients((prev) => [patient, ...prev])
  }

  function handleInactivate(patientId: string) {
    setPatients((prev) =>
      prev.map((p) => p.id === patientId ? { ...p, status: 'inactive' as const } : p)
    )
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronsUpDown className="h-3 w-3 text-gray-300" />
    return sortDir === 'asc'
      ? <ChevronUp className="h-3 w-3 text-primary" />
      : <ChevronDown className="h-3 w-3 text-primary" />
  }

  const hasFilters = !!search || statusFilter !== 'all' || !!addedByFilter

  function clearFilters() {
    setSearch(''); setStatusFilter('all'); setAddedByFilter(''); setPage(1)
  }

  const selectCls = 'h-8 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer'

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Patient Management"
        subtitle="View and manage patient records."
        action={{ label: 'Add Patient', icon: Plus, onClick: () => setAddOpen(true) }}
      />

      {/* Filter bar */}
      <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
        {/* Search */}
        <div className="relative w-72 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search patient or MRN..."
            className="w-full h-9 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Right filters */}
        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1) }}
            className={selectCls}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={addedByFilter}
            onChange={(e) => { setAddedByFilter(e.target.value); setPage(1) }}
            className={selectCls}
          >
            <option value="">All Staff</option>
            {ADDED_BY_OPTIONS.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:underline whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {sorted.length === 0 ? (
          <div className="py-16">
            <EmptyState
              icon={Users}
              heading={hasFilters ? 'No results found' : 'No patients added'}
              subheading={hasFilters ? 'Try adjusting your search or filters.' : 'Add your first patient to start scheduling.'}
              action={hasFilters
                ? { label: 'Clear filters', onClick: clearFilters }
                : { label: 'Add Patient', onClick: () => setAddOpen(true) }
              }
            />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3">
                    <button
                      onClick={() => handleSort('fullName')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      Patient Name <SortIcon field="fullName" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3">
                    <button
                      onClick={() => handleSort('mrn')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      MRN <SortIcon field="mrn" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3">
                    <button
                      onClick={() => handleSort('dob')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      DOB / Age <SortIcon field="dob" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact No.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Added By</th>
                  <th className="text-left px-4 py-3">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      Status <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((patient) => {
                  const age = differenceInYears(new Date(), parseISO(patient.dob))
                  const initials = patient.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  return (
                    <tr
                      key={patient.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Name */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          className="flex items-center gap-2.5 group text-left"
                        >
                          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary-light flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">{initials}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                            {patient.fullName}
                          </span>
                        </button>
                      </td>

                      {/* MRN */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-gray-600">{patient.mrn}</span>
                      </td>

                      {/* DOB / Age */}
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{format(parseISO(patient.dob), 'MM/dd/yyyy')}</p>
                        <p className="text-xs text-gray-400">{age} yrs</p>
                      </td>

                      {/* Gender */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{GENDER_LABELS[patient.gender]}</span>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{patient.phone}</span>
                      </td>

                      {/* Added By */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{patient.addedByName}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          patient.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        )}>
                          {patient.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <PatientActionsMenu
                          patient={patient}
                          onView={() => navigate(`/patients/${patient.id}`)}
                          onInactivate={() => setInactivateTarget(patient)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length} patients
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={cn(
                      'h-7 w-7 rounded-md text-xs font-medium transition-colors',
                      pg === page
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    {pg}
                  </button>
                ))}
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddPatientModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleAdd}
      />

      <ConfirmInactivateModal
        open={!!inactivateTarget}
        patient={inactivateTarget}
        onClose={() => setInactivateTarget(null)}
        onConfirm={handleInactivate}
      />
    </div>
  )
}

// ── Inline actions dropdown ─────────────────────────────────────────────────
interface PatientActionsMenuProps {
  patient: Patient
  onView: () => void
  onInactivate: () => void
}

function PatientActionsMenu({ patient, onView, onInactivate }: PatientActionsMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-44 rounded-lg border border-gray-200 bg-white shadow-lg py-1">
            <button
              onClick={() => { onView(); setOpen(false) }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-3.5 w-3.5 text-gray-400" />
              View Details
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-3.5 w-3.5 text-gray-400" />
              Edit Patient
            </button>
            {patient.status === 'active' && (
              <>
                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={() => { onInactivate(); setOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-orange-600 hover:bg-orange-50"
                >
                  <UserX className="h-3.5 w-3.5" />
                  Mark Inactive
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
