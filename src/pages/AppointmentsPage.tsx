import { useState, useMemo } from 'react'
import { Plus, CalendarX } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { FilterBar } from '@/components/appointments/FilterBar'
import { AppointmentGroup } from '@/components/appointments/AppointmentGroup'
import { CancelModal } from '@/components/appointments/CancelModal'
import { RescheduleDrawer } from '@/components/appointments/RescheduleDrawer'
import { CreateAppointmentModal } from '@/components/appointments/CreateAppointmentModal'
import { EmptyState } from '@/components/ui/empty-state'
import { SuccessPopup } from '@/components/ui/success-popup'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { mockAppointments } from '@/mocks/appointments'
import { mockProfessionals } from '@/mocks/professionals'
import { groupAppointmentsByDate, formatTime, formatFullDate } from '@/lib/utils'
import type { Appointment } from '@/types/appointment'

type TabKey = 'upcoming' | 'completed' | 'cancelled'

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming')
  const [search, setSearch] = useState('')
  const [professionalId, setProfessionalId] = useState('')
  const [locationId, setLocationId] = useState('')

  // Modal state
  const [createOpen, setCreateOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null)

  // ── Derived counts ───────────────────────────────────────────
  const upcoming = useMemo(() => appointments.filter((a) => a.status === 'scheduled' || a.status === 'rescheduled'), [appointments])
  const completed = useMemo(() => appointments.filter((a) => a.status === 'completed'), [appointments])
  const cancelled = useMemo(() => appointments.filter((a) => a.status === 'cancelled'), [appointments])

  // ── Filtering ────────────────────────────────────────────────
  function applyFilters(list: Appointment[]) {
    return list.filter((a) => {
      const q = search.toLowerCase()
      const matchesSearch = !q || a.patientName.toLowerCase().includes(q) || a.mrn.includes(q)
      const matchesPro = !professionalId || a.providerId === professionalId
      const matchesLoc = !locationId || a.locationId === locationId
      return matchesSearch && matchesPro && matchesLoc
    })
  }

  const filteredUpcoming = useMemo(() => applyFilters(upcoming), [upcoming, search, professionalId, locationId])
  const filteredCompleted = useMemo(() => applyFilters(completed), [completed, search, professionalId, locationId])
  const filteredCancelled = useMemo(() => applyFilters(cancelled), [cancelled, search, professionalId, locationId])

  const hasActiveFilters = !!search || !!professionalId || !!locationId

  function clearFilters() {
    setSearch('')
    setProfessionalId('')
    setLocationId('')
  }

  // ── Mutation handlers (UI-only state updates) ────────────────
  function handleCancel(appointmentId: string, _reason: 'other', reasonText: string) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? {
              ...a,
              status: 'cancelled' as const,
              cancellation: {
                cancelledBy: 'Sarah Johnson',
                cancelledByRole: 'Coordinator',
                reason: 'other' as const,
                reasonText,
                cancelledAt: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    )
  }

  function handleReschedule(appointmentId: string, newDate: string, newTime: string, providerId: string, newType: import('@/types/appointment').AppointmentType) {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== appointmentId) return a
        return {
          ...a,
          status: 'rescheduled' as const,
          type: newType,
          date: newDate,
          startTime: newTime,
          providerId,
          providerName: mockProfessionals.find((p) => p.id === providerId)?.fullName ?? a.providerName,
          rescheduleHistory: [
            ...a.rescheduleHistory,
            {
              rescheduledBy: 'Sarah Johnson',
              originalDate: a.date,
              originalTime: a.startTime,
              newDate,
              newTime,
              rescheduledAt: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }

  function handleCreateSuccess(newAppt: Appointment) {
    setAppointments((prev) => [...prev, newAppt])
    setActiveTab('upcoming')
    setShowSuccess(true)
  }

  function handleAddToCalendar(id: string) {
    const appt = appointments.find((a) => a.id === id)
    if (!appt) return
    alert(`Added to calendar:\n${appt.patientName} — ${formatFullDate(appt.date)} at ${formatTime(appt.startTime)}`)
  }

  // ── Grouped data ─────────────────────────────────────────────
  const upcomingGroups = useMemo(() => groupAppointmentsByDate(filteredUpcoming), [filteredUpcoming])
  const completedGroups = useMemo(() => groupAppointmentsByDate(filteredCompleted), [filteredCompleted])
  const cancelledGroups = useMemo(() => groupAppointmentsByDate(filteredCancelled), [filteredCancelled])

  return (
    <div className="px-6 py-6">
      {/* Page Header */}
      <PageHeader
        title="Appointments"
        subtitle="Manage and schedule patient appointments."
        action={{
          label: 'Create New Appointment',
          icon: Plus,
          onClick: () => setCreateOpen(true),
        }}
      />

      {/* Filter Bar */}
      <div className="mt-5">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          professionalId={professionalId}
          onProfessionalChange={setProfessionalId}
          locationId={locationId}
          onLocationChange={setLocationId}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Tabs */}
      <div className="mt-5">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completed.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelled.length})
            </TabsTrigger>
          </TabsList>

          {/* ── Upcoming Tab ── */}
          <TabsContent value="upcoming">
            {upcomingGroups.length === 0 ? (
              <EmptyState
                icon={CalendarX}
                heading={hasActiveFilters ? 'No results found' : 'No upcoming appointments'}
                subheading={hasActiveFilters ? 'Try adjusting your search or filters.' : 'Appointments scheduled for patients will appear here.'}
                action={hasActiveFilters
                  ? { label: 'Clear filters', onClick: clearFilters }
                  : { label: 'Create Appointment', onClick: () => setCreateOpen(true) }
                }
              />
            ) : (
              <div className="space-y-7">
                {upcomingGroups.map((group) => (
                  <AppointmentGroup
                    key={group.dateStr}
                    dateLabel={group.dateLabel}
                    appointments={group.appointments}
                    onReschedule={(id) => setRescheduleTarget(appointments.find((a) => a.id === id) ?? null)}
                    onCancel={(id) => setCancelTarget(appointments.find((a) => a.id === id) ?? null)}
                    onAddToCalendar={handleAddToCalendar}
                    variant="upcoming"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Completed Tab ── */}
          <TabsContent value="completed">
            {completedGroups.length === 0 ? (
              <EmptyState
                icon={CalendarX}
                heading={hasActiveFilters ? 'No results found' : 'No completed appointments'}
                subheading={hasActiveFilters ? 'Try adjusting your search or filters.' : 'Appointments that have been marked complete will appear here.'}
                action={hasActiveFilters ? { label: 'Clear filters', onClick: clearFilters } : undefined}
              />
            ) : (
              <div className="space-y-7">
                {completedGroups.map((group) => (
                  <AppointmentGroup
                    key={group.dateStr}
                    dateLabel={group.dateLabel}
                    appointments={group.appointments}
                    onReschedule={() => {}}
                    onCancel={() => {}}
                    onAddToCalendar={() => {}}
                    onViewDetails={(id) => alert(`View details for appointment ${id}`)}
                    variant="completed"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Cancelled Tab ── */}
          <TabsContent value="cancelled">
            {cancelledGroups.length === 0 ? (
              <EmptyState
                icon={CalendarX}
                heading={hasActiveFilters ? 'No results found' : 'No cancelled appointments'}
                subheading={hasActiveFilters ? 'Try adjusting your search or filters.' : 'Cancelled appointments will appear here for your records.'}
                action={hasActiveFilters ? { label: 'Clear filters', onClick: clearFilters } : undefined}
              />
            ) : (
              <div className="space-y-7">
                {cancelledGroups.map((group) => (
                  <AppointmentGroup
                    key={group.dateStr}
                    dateLabel={group.dateLabel}
                    appointments={group.appointments}
                    onReschedule={() => {}}
                    onCancel={() => {}}
                    onAddToCalendar={() => {}}
                    variant="cancelled"
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals & Drawers */}
      <CancelModal
        open={!!cancelTarget}
        appointment={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />

      <RescheduleDrawer
        open={!!rescheduleTarget}
        appointment={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onConfirm={handleReschedule}
      />

      <CreateAppointmentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <SuccessPopup
        open={showSuccess}
        heading="Appointment Created Successfully"
        subheading="The appointment has been added to the schedule and is now visible in the Upcoming tab."
        duration={3000}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  )
}
