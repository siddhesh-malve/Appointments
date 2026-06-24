import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { mockProfessionals } from '@/mocks/professionals'
import { mockLocations } from '@/mocks/locations'

interface FilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  professionalId: string
  onProfessionalChange: (v: string) => void
  locationId: string
  onLocationChange: (v: string) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

const ALL_VALUE = 'all'

export function FilterBar({
  search,
  onSearchChange,
  professionalId,
  onProfessionalChange,
  locationId,
  onLocationChange,
  hasActiveFilters,
  onClearFilters,
}: FilterBarProps) {
  const professionalOptions = [
    { value: ALL_VALUE, label: 'All Professionals' },
    ...mockProfessionals.map((p) => ({ value: p.id, label: p.fullName })),
  ]

  const locationOptions = [
    { value: ALL_VALUE, label: 'All Locations' },
    ...mockLocations.map((l) => ({ value: l.id, label: l.name })),
  ]

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Search — left */}
      <div className="relative w-72 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by patient name or MRN..."
          className="pl-8 h-9 text-sm"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filters — right */}
      <div className="flex items-center gap-2.5">
        <Select
          value={professionalId || ALL_VALUE}
          onValueChange={(v) => onProfessionalChange(v === ALL_VALUE ? '' : v)}
          options={professionalOptions}
          placeholder="All Professionals"
          className="min-w-[168px]"
        />

        <Select
          value={locationId || ALL_VALUE}
          onValueChange={(v) => onLocationChange(v === ALL_VALUE ? '' : v)}
          options={locationOptions}
          placeholder="All Locations"
          className="min-w-[152px]"
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-gray-500 h-9"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
