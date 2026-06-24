# CLAUDE.md — Healthcare SaaS Appointment Management Platform
> Single source of truth for Claude Code. Every UI screen, component, form, table, modal, and drawer generated in this project must conform to this document.
> **SCOPE: UI ONLY.** This project is a frontend-only build. No backend, no real API calls, no authentication logic. All data is mocked. Every component renders with hardcoded or locally-defined mock data.

---

## Project Overview

**Product Name:** Appointment Management Platform  
**Version:** PRD V2  
**Type:** Healthcare SaaS — Reusable UI Template  
**Scope:** Frontend UI only — no backend, no API integration, no authentication logic  
**Data Strategy:** All data is mocked using local mock files (`src/mocks/`). No real HTTP calls.  
**Primary Users:** Healthcare coordinators, front-desk staff, clinic administrators  
**Deployment Targets:** EHR Systems, Telehealth Platforms, Recovery Programs, Mental Health Clinics, Dental Clinics, Physical Therapy Practices, Multi-location Healthcare Organizations

---

## Product Vision

Build a reusable, HIPAA-conscious Appointment Management template that plugs into any healthcare vertical. The system is built once and deployed across clinic types with minimal configuration changes. Every component must be designed as a reusable building block — not a one-off screen.

---

## Business Goals

1. Allow a staff member to book an appointment in **under 30 seconds**
2. Support **hundreds of concurrent appointments** visible to a single coordinator without performance degradation
3. Eliminate scheduling errors through a **mandatory review step** before appointment creation
4. Provide **full audit trails** for cancellations and reschedules (HIPAA requirement)
5. Support **multi-location** practice management from a single interface
6. Enable **telehealth and in-person** appointment types from the same scheduling flow
7. Be **pluggable** — settings-driven configuration for locations, appointment types, providers, and availability

---

## User Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| `admin` | Practice administrator | Full access — all modules, settings, user management |
| `coordinator` | Front-desk / scheduling staff | Create, reschedule, cancel appointments; view patients |
| `provider` | Doctor / therapist / clinician | View own appointments; view patient details |
| `viewer` | Read-only staff | View appointments only, no create/edit |

> **ASSUMPTION (Enterprise Healthcare):** Role-based access control (RBAC) is enforced at the API layer. The frontend must conditionally render actions (Create, Edit, Deactivate) based on the authenticated user's role stored in global auth state.

---

## Information Architecture

```
AppShell
├── Dashboard                          (summary stats — ASSUMPTION: future phase)
├── Appointments
│   ├── Upcoming                       (default tab)
│   ├── Completed
│   └── Cancelled
├── Patient Management
│   └── Patient List (table)
│       └── Patient Detail (drawer)
├── User Management
│   └── User List (table)
│       └── User Detail (drawer)
└── Settings
    ├── Locations
    ├── Appointment Types
    ├── Calendar Integrations
    └── Availability Rules
```

**Route Structure:**
```
/appointments                → Appointment List (Upcoming tab default)
/appointments?tab=completed  → Completed tab
/appointments?tab=cancelled  → Cancelled tab
/patients                    → Patient Management
/patients/:id                → Patient Detail
/users                       → User Management
/users/:id                   → User Detail
/settings                    → Settings landing
/settings/locations          → Locations management
/settings/appointment-types  → Appointment Types management
/settings/calendar           → Calendar Integrations
/settings/availability       → Availability Rules
```

---

## Design Principles

### 1. Fast Scheduling
- Appointment creation flow must complete in **≤ 5 user interactions**
- Patient search must return results within **300ms** of input (debounced)
- The "+ New Appointment" button must be visible at all times on the Appointments page
- Default tab must be Upcoming — the most-used view

### 2. High Information Density
- **Do not add excessive whitespace** between appointment cards
- Use compact card layouts — show maximum information per viewport
- Use grouped date sections (Today / Tomorrow / June 18 / June 19) instead of paginated flat card lists
- Tables must display at minimum 15 rows before pagination triggers

### 3. HIPAA-Conscious UI
- Never display SSN, Insurance ID, or full medical records on appointment cards
- Display only: Patient Name, MRN, Appointment Details, Provider, Location, Time
- PHI fields in tables must be **non-copyable on hover** (CSS `user-select: none`) unless in edit mode
- Audit every status-changing action (cancel, reschedule) with timestamp and actor
- Session timeout warning must be shown at **13 minutes** of inactivity (ASSUMPTION: 15-minute HIPAA session rule)

### 4. Error Prevention
- All destructive actions (Cancel Appointment) require a **confirmation modal with mandatory reason**
- Appointment creation has a **5-step flow with review summary** before final submission
- Date/time conflicts must surface inline before the user reaches the review step

### 5. Reusability First
- Every component is built as a standalone, props-driven module
- No hardcoded clinic names, provider names, or location strings anywhere in components
- All data is injected via props or React Query hooks

---

## UX Principles

1. **Progressive Disclosure** — Show only what the user needs for the current step. The Create Appointment modal uses a 5-step wizard, not a single long form.
2. **Contextual Side Drawers** — Use right-side drawers (500px) for reschedule flows so staff can compare the main schedule list while the drawer is open.
3. **Meaningful Success States** — Never show "Success!" alone. Always show what was created/changed and offer logical next actions.
4. **Status Clarity** — Every appointment card displays a color-coded status badge. Status must be scannable at a glance.
5. **Grouped Temporal Views** — Appointments are always grouped by date label (Today, Tomorrow, specific dates). Never render a flat unsorted list.
6. **Keyboard Navigation** — All modals, drawers, and tables must be fully keyboard navigable (Tab, Enter, Escape).
7. **Inline Validation** — Form errors appear on field blur, not on submit. This prevents the user from reaching the review step with invalid data.

---

## HIPAA Design Rules

| Rule | Implementation |
|------|---------------|
| Minimum Necessary PHI | Appointment cards show: Name, MRN, Time, Provider, Location, Appointment Type only |
| No SSN on any screen | SSN field must never be rendered — not even hidden |
| No Insurance ID on appointment cards | Insurance data lives in patient profile only — not surfaced in scheduling flow |
| Audit trail for cancellations | Every cancellation records: `cancelledBy`, `cancellationReason`, `cancelledAt` |
| Audit trail for reschedules | Every reschedule records: `rescheduledBy`, `originalDate`, `originalTime`, `newDate`, `newTime`, `rescheduledAt` |
| PHI masking in URLs | Never include patient name or MRN in URL query params. Use IDs only (`/patients/uuid`) |
| Role-gated PHI | DOB and Phone visible in Patient Management table only to `admin` and `coordinator` roles |
| Session security | Display session timeout warning at 13 minutes; auto-logout at 15 minutes (ASSUMPTION) |
| Telehealth links | Meeting URLs for online appointments must not be pre-populated in shared calendar invites without consent (ASSUMPTION) |

---

## Branding

**Primary Color:** `#138266` (Healthcare Green)

---

## Color System

```css
/* Primary */
--color-primary:          #138266;   /* Main CTAs, active nav, primary buttons */
--color-primary-hover:    #0f6b54;   /* Button hover state */
--color-primary-active:   #0c5643;   /* Button active/pressed state */
--color-primary-light:    #e8f5f1;   /* Tag backgrounds, light chip fills */
--color-primary-border:   #92cabb;   /* Input focus rings, dividers */
--color-primary-bg:       #f0faf7;   /* Page section backgrounds, card hover bg */

/* Status Colors */
--color-status-scheduled:    #3b82f6;   /* Blue — Scheduled badge */
--color-status-scheduled-bg: #eff6ff;
--color-status-completed:    #16a34a;   /* Green — Completed badge */
--color-status-completed-bg: #f0fdf4;
--color-status-cancelled:    #dc2626;   /* Red — Cancelled badge */
--color-status-cancelled-bg: #fef2f2;
--color-status-rescheduled:  #9333ea;   /* Purple — Rescheduled badge */
--color-status-rescheduled-bg: #faf5ff;

/* Neutrals */
--color-gray-50:   #f9fafb;
--color-gray-100:  #f3f4f6;
--color-gray-200:  #e5e7eb;
--color-gray-300:  #d1d5db;
--color-gray-400:  #9ca3af;
--color-gray-500:  #6b7280;
--color-gray-600:  #4b5563;
--color-gray-700:  #374151;
--color-gray-800:  #1f2937;
--color-gray-900:  #111827;

/* Semantic */
--color-destructive:       #dc2626;
--color-destructive-hover: #b91c1c;
--color-warning:           #d97706;
--color-warning-bg:        #fffbeb;
--color-success:           #16a34a;
--color-border:            #e5e7eb;
--color-background:        #f9fafb;
--color-surface:           #ffffff;
```

**Tailwind config additions:**
```js
// tailwind.config.ts
extend: {
  colors: {
    primary: {
      DEFAULT: '#138266',
      hover: '#0f6b54',
      active: '#0c5643',
      light: '#e8f5f1',
      border: '#92cabb',
      bg: '#f0faf7',
    },
    status: {
      scheduled: '#3b82f6',
      'scheduled-bg': '#eff6ff',
      completed: '#16a34a',
      'completed-bg': '#f0fdf4',
      cancelled: '#dc2626',
      'cancelled-bg': '#fef2f2',
      rescheduled: '#9333ea',
      'rescheduled-bg': '#faf5ff',
    },
  },
}
```

---

## Typography

| Token | Class | Usage |
|-------|-------|-------|
| Page Title | `text-2xl font-semibold text-gray-900` | Page headers ("Appointments") |
| Page Subtitle | `text-sm text-gray-500` | Subheadings ("Manage and schedule patient appointments.") |
| Section Label | `text-xs font-semibold text-gray-500 uppercase tracking-wider` | Date group headers (TODAY, TOMORROW) |
| Card Primary | `text-sm font-semibold text-gray-900` | Patient name on appointment card |
| Card Secondary | `text-sm text-gray-600` | MRN, time, provider |
| Card Tertiary | `text-xs text-gray-400` | Location, appointment type |
| Table Header | `text-xs font-semibold text-gray-500 uppercase tracking-wider` | Table column headers |
| Table Cell | `text-sm text-gray-700` | Table data cells |
| Label | `text-sm font-medium text-gray-700` | Form field labels |
| Input | `text-sm text-gray-900` | Form input values |
| Helper | `text-xs text-gray-400` | Form helper text |
| Error | `text-xs text-red-600` | Form validation errors |
| Badge | `text-xs font-medium` | Status badges |

**Font Stack:** `font-family: 'Inter', system-ui, -apple-system, sans-serif;`

---

## Layout System

### AppShell
```
┌─────────────────────────────────────────────────────┐
│  Topbar (h-14, border-b)                           │
├──────────────┬──────────────────────────────────────┤
│  Sidebar     │  Main Content Area                   │
│  (w-56)      │  (flex-1, overflow-y-auto)           │
│              │  ┌────────────────────────────────┐  │
│              │  │  Page Header                   │  │
│              │  │  (pb-4 border-b mb-6)          │  │
│              │  ├────────────────────────────────┤  │
│              │  │  Filter Bar                    │  │
│              │  ├────────────────────────────────┤  │
│              │  │  Tabs                          │  │
│              │  ├────────────────────────────────┤  │
│              │  │  Content                       │  │
│              │  └────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────┘
```

### Content Area Padding
- Desktop: `px-6 py-6`
- Section gaps: `gap-4`
- Card gaps within a group: `gap-3`

### Page Header Pattern
```tsx
<div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
  <div>
    <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
    <p className="text-sm text-gray-500 mt-0.5">Manage and schedule patient appointments.</p>
  </div>
  <Button variant="default" size="sm">
    <Plus className="w-4 h-4 mr-2" />
    New Appointment
  </Button>
</div>
```

---

## Design Tokens

```ts
// src/lib/tokens.ts
export const tokens = {
  spacing: {
    pagePadding: 'px-6 py-6',
    sectionGap: 'gap-4',
    cardGap: 'gap-3',
    formGap: 'space-y-4',
  },
  radius: {
    card: 'rounded-lg',
    badge: 'rounded-full',
    button: 'rounded-md',
    modal: 'rounded-xl',
    input: 'rounded-md',
  },
  shadow: {
    card: 'shadow-sm',
    modal: 'shadow-xl',
    drawer: 'shadow-2xl',
  },
  sidebar: {
    width: 'w-56',
  },
  drawer: {
    reschedule: 'w-[500px]',
  },
  modal: {
    appointment: 'max-w-[800px]',
    confirm: 'max-w-[480px]',
  },
} as const;
```

---

## Component Library

> Every component listed here must be built as a standalone, exported component in `src/components/`. All props are typed with TypeScript interfaces.

---

### AppShell

**Purpose:** Root layout wrapper. Renders Sidebar + Topbar + main content slot.

**Props:**
```ts
interface AppShellProps {
  children: React.ReactNode;
}
```

**Usage Guidelines:**
- Wrap every page inside `AppShell`
- Sidebar navigation is driven by a static nav config array (not hardcoded JSX)
- Active nav item is determined by `useLocation()` pathname match

---

### Sidebar

**Purpose:** Left navigation. Fixed width 224px. Shows module navigation icons + labels.

**Props:**
```ts
interface SidebarProps {
  navItems: NavItem[];
  currentPath: string;
}

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  children?: NavItem[];
}
```

**Variants:**
- Default (expanded, w-56)
- Collapsed icon-only (ASSUMPTION: future feature — do not build yet)

**Usage Guidelines:**
- Active item: `bg-primary-light text-primary font-medium`
- Inactive item: `text-gray-600 hover:bg-gray-100`
- The Appointments item must show sub-items (Upcoming, Completed, Cancelled) as child nav links

---

### Topbar

**Purpose:** Top navigation bar. Fixed height h-14. Shows logo and a static user avatar/name (mock).

**Props:**
```ts
interface TopbarProps {
  userName?: string; // defaults to mock name "Sarah Johnson"
}
```

**Usage Guidelines:**
- Logo on left, static mock user avatar + name on right
- No logout button, no session logic — UI only

---

### PageHeader

**Purpose:** Standardized page title block with optional CTA button.

**Props:**
```ts
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}
```

**Usage Guidelines:**
- Always use this component for page-level headers — never build custom h1 blocks in pages
- The action button renders as `variant="default"` (primary green) with an optional leading icon

---

### StatusBadge

**Purpose:** Color-coded pill badge for appointment status.

**Props:**
```ts
interface StatusBadgeProps {
  status: AppointmentStatus;
}

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
```

**Variants:**

| Status | Text Color | Background | Label |
|--------|-----------|------------|-------|
| `scheduled` | `text-blue-700` | `bg-blue-50` | Scheduled |
| `completed` | `text-green-700` | `bg-green-50` | Completed |
| `cancelled` | `text-red-700` | `bg-red-50` | Cancelled |
| `rescheduled` | `text-purple-700` | `bg-purple-50` | Rescheduled |

**Usage Guidelines:**
- Always use this component — never hardcode badge colors inline
- Size: `text-xs font-medium px-2.5 py-0.5 rounded-full`

---

### AppointmentCard

**Purpose:** Rich card displaying a single appointment within a date group.

**Props:**
```ts
interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule: (id: string) => void;
  onCancel: (id: string) => void;
  onAddToCalendar: (id: string) => void;
  showActions?: boolean; // false on Cancelled tab
}
```

**Structure:**
```
┌─────────────────────────────────────────────────┐
│  [StatusBadge]                     [Actions ···] │
│  John Smith                                      │
│  MRN: 100245                                     │
│  09:30 AM – 10:00 AM · Dr. Emily Davis          │
│  ─────────────────────────────────────────────  │
│  In-Person · Downtown Clinic · Annual Checkup    │
└─────────────────────────────────────────────────┘
```

**PHI Rules:**
- Display: Name, MRN, Time, Provider, Location, Type
- Never display: SSN, Insurance ID, DOB, full medical history

**Cancelled Card Additional Section:**
```
Cancelled By: Patient
Reason: Scheduling Conflict
Cancelled: June 18, 2026 10:42 AM
```

---

### AppointmentGroup

**Purpose:** Renders a labeled date section containing a list of `AppointmentCard` components.

**Props:**
```ts
interface AppointmentGroupProps {
  dateLabel: string; // "Today", "Tomorrow", "June 18"
  appointments: Appointment[];
  onReschedule: (id: string) => void;
  onCancel: (id: string) => void;
  onAddToCalendar: (id: string) => void;
}
```

**Usage Guidelines:**
- Date label renders as `text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2`
- Groups are always sorted chronologically
- Each group is separated by `mb-6`

---

### DataTable

**Purpose:** Reusable paginated table for Patient Management and User Management.

**Props:**
```ts
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (state: PaginationState) => void;
  emptyState?: React.ReactNode;
}
```

**Usage Guidelines:**
- Built on `@tanstack/react-table` (ASSUMPTION)
- Always show minimum 15 rows before pagination
- Table header: `bg-gray-50 border-b border-gray-200`
- Row hover: `hover:bg-gray-50`
- Row border: `border-b border-gray-100`
- Actions column is always the last column, right-aligned

---

### SearchBar

**Purpose:** Debounced text search input used in FilterBar and patient/provider lookup.

**Props:**
```ts
interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number; // default: 300
}
```

**Usage Guidelines:**
- Always debounce — never fire on every keystroke
- Include a search icon (`Search` from lucide-react) as left adornment
- Include a clear button (×) when value is non-empty

---

### FilterBar

**Purpose:** Horizontal row of filter controls placed above tabs on the Appointments page.

**Props:**
```ts
interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  professional: string | null;
  onProfessionalChange: (v: string | null) => void;
  location: string | null;
  onLocationChange: (v: string | null) => void;
  dateRange: DateRange | null;
  onDateRangeChange: (v: DateRange | null) => void;
  professionals: Professional[];
  locations: Location[];
}
```

**Layout:** `flex flex-wrap items-center gap-3`

**Controls (left to right):**
1. `SearchBar` — placeholder: "Search patient or MRN..."
2. `Select` — Professional (all providers)
3. `Select` — Location (all practice locations)
4. `DateRangePicker` — Date Range

**Usage Guidelines:**
- All filters update URL search params (persists on refresh)
- Filters apply instantly — no "Apply" button needed
- "Clear all filters" link appears when any filter is active

---

### Modal (Base)

**Purpose:** Base modal container used for Create Appointment, Cancel Appointment, and confirmation flows.

**Props:**
```ts
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  width?: 'sm' | 'md' | 'lg'; // sm=480px, md=640px, lg=800px
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

**Usage Guidelines:**
- Always use Shadcn `Dialog` as the base primitive
- Create Appointment modal: `width="lg"` (700–800px)
- Cancel Appointment modal: `width="sm"` (480px)
- Confirmation modals: `width="sm"`
- Never use full-screen modals
- ESC key closes all modals
- Clicking backdrop closes informational modals; does NOT close multi-step wizards (to prevent accidental data loss)

---

### SuccessModal

**Purpose:** Post-action confirmation modal with meaningful next-action CTAs.

**Props:**
```ts
interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title: string; // e.g. "Appointment Created Successfully"
  actions: Array<{
    label: string;
    variant: 'default' | 'outline' | 'ghost';
    onClick: () => void;
  }>;
}
```

**Standard actions for appointment creation:**
1. "View Appointment" (primary)
2. "Schedule Another" (outline)
3. "Close" (ghost)

**Usage Guidelines:**
- Title must be specific — never "Success!"
- Always provide at least 2 next-action buttons
- Icon: green checkmark circle at top

---

### RescheduleDrawer

**Purpose:** Right-side drawer (500px) for the reschedule flow. Keeps the appointment list visible in background.

**Props:**
```ts
interface RescheduleDrawerProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
  onConfirm: (data: RescheduleData) => void;
  providers: Professional[];
}

interface RescheduleData {
  newDate: string;
  newTime: string;
  providerId: string;
}
```

**Layout:**
```
┌────────────────────────────────┐
│  Reschedule Appointment  [×]   │
│  ─────────────────────────     │
│  Current Schedule              │
│  [readonly] Date: June 18      │
│  [readonly] Time: 09:30 AM     │
│  ──────────────────────────    │
│  New Schedule                  │
│  Date *  [DatePicker]          │
│  Time *  [TimePicker]          │
│  Professional * [Select]       │
│  ─────────────────────────     │
│  [Confirm Reschedule] [Cancel] │
└────────────────────────────────┘
```

**Usage Guidelines:**
- Width: `w-[500px]`
- Do NOT use a modal for reschedule — always use this drawer
- Current date/time fields are read-only (labeled "Current Schedule")
- New fields are required

---

### CancelModal

**Purpose:** Confirmation modal for appointment cancellation. Requires a mandatory cancellation reason.

**Props:**
```ts
interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
  onConfirm: (reason: CancellationReason) => void;
  isLoading?: boolean;
}

type CancellationReason =
  | 'patient_requested'
  | 'provider_unavailable'
  | 'scheduling_conflict'
  | 'duplicate_appointment'
  | 'other';
```

**Required Fields:**
- Cancellation Reason (radio group — required, no default selection)

**Reason Options:**
1. Patient Requested
2. Provider Unavailable
3. Scheduling Conflict
4. Duplicate Appointment
5. Other

**Confirmation Message:**
> "This appointment will be moved to the Cancelled tab."

**Usage Guidelines:**
- "Confirm Cancellation" button is disabled until a reason is selected
- Destructive button: `variant="destructive"`
- Show appointment summary (patient name, date, time) at top of modal for context

---

### CreateAppointmentModal

**Purpose:** 5-step wizard modal for booking a new appointment. Width: 700–800px.

**Steps:**

| Step | Title | Fields |
|------|-------|--------|
| 1 | Patient Information | Patient Search (by Name or MRN) — required |
| 2 | Appointment Details | Appointment Type (In-Person / Online) — required; Practice Location — required if In-Person; Meeting Platform — required if Online |
| 3 | Schedule | Date — required; Time — required; Professional — required |
| 4 | Notes | Reason for Appointment (textarea, 250 char max) — optional |
| 5 | Review | Read-only summary: Patient, Provider, Location, Date, Time, Type, Notes |

**Props:**
```ts
interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
  patients: Patient[];
  professionals: Professional[];
  locations: Location[];
}
```

**Navigation:**
- "Back" / "Next" buttons at each step
- Step indicator at top (1 of 5)
- "Create Appointment" CTA only shown on Step 5 (Review)
- Clicking backdrop does NOT close this modal (prevents data loss)

**Conditional Logic:**
- `Practice Location` field: visible only when `appointmentType === 'in_person'`
- `Meeting Platform` field: visible only when `appointmentType === 'online'`

**Meeting Platform Options (Online only):**
- Google Meet
- Zoom
- Microsoft Teams

---

### PatientSearch

**Purpose:** Typeahead search input for selecting a patient by name or MRN.

**Props:**
```ts
interface PatientSearchProps {
  value: Patient | null;
  onChange: (patient: Patient | null) => void;
  placeholder?: string;
}
```

**Usage Guidelines:**
- Searches by both name and MRN simultaneously
- Dropdown shows: `[Patient Name] — MRN: [number]`
- Min 2 characters before triggering search
- Shows "No patient found" empty state with option to create new patient (ASSUMPTION)

---

### ProviderSearch

**Purpose:** Searchable select for choosing a healthcare provider/professional.

**Props:**
```ts
interface ProviderSearchProps {
  value: Professional | null;
  onChange: (provider: Professional | null) => void;
  locationId?: string; // filter providers by location
}
```

---

### DatePicker

**Purpose:** Calendar date picker. Wraps Shadcn Calendar + Popover.

**Props:**
```ts
interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
}
```

**Usage Guidelines:**
- Past dates are disabled in Create/Reschedule flows
- Display format: `MMMM d, yyyy` (e.g., "June 18, 2026")
- Always include a clear button

---

### TimePicker

**Purpose:** Time slot selector. Renders as a Select dropdown with 15-minute interval slots.

**Props:**
```ts
interface TimePickerProps {
  value: string | null; // "09:30"
  onChange: (time: string | null) => void;
  availableSlots?: string[]; // if provided, only these slots are selectable
  disabled?: boolean;
}
```

**Usage Guidelines:**
- Display format: `09:30 AM`
- Default interval: 15 minutes
- Slots that are already booked should be shown as disabled (ASSUMPTION)

---

### EmptyState

**Purpose:** Standardized empty state block for lists and tables.

**Props:**
```ts
interface EmptyStateProps {
  icon?: LucideIcon;
  heading: string;
  subheading?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage Guidelines:**
- Always center-aligned vertically and horizontally within its container
- Icon size: `w-12 h-12 text-gray-300`
- Never show an empty container — always render EmptyState

---

### Pagination

**Purpose:** Table pagination controls.

**Props:**
```ts
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
}
```

---

## Appointment Module

### Screen: Appointment List (`/appointments`)

**Page Structure:**
```
PageHeader
  title="Appointments"
  subtitle="Manage and schedule patient appointments."
  action={{ label: "New Appointment", onClick: openCreateModal }}

FilterBar
  [Search Patient/MRN] [Professional ▼] [Location ▼] [Date Range ▼]

Tabs: Upcoming | Completed | Cancelled

TabContent:
  <AppointmentGroup dateLabel="Today" appointments={todayAppts} />
  <AppointmentGroup dateLabel="Tomorrow" appointments={tomorrowAppts} />
  <AppointmentGroup dateLabel="June 18" appointments={june18Appts} />
  ...
  OR
  <EmptyState heading="No upcoming appointments" ... />
```

**Date Grouping Logic:**
- "Today" — appointments on `new Date()` (same calendar day)
- "Tomorrow" — appointments on `addDays(today, 1)`
- All other dates — formatted as `"MMMM d"` (e.g., "June 18")

**Tab Behavior:**
- Tab selection persists in URL: `?tab=upcoming|completed|cancelled`
- Switching tabs resets pagination but keeps other filters

**Completed Tab:**
- Same layout as Upcoming
- Actions on card: none (read-only)

**Cancelled Tab:**
- Same layout as Upcoming  
- Card shows additional "Cancelled By / Reason / Cancelled On" section
- Actions on card: none (read-only)

---

## Patient Management Module

### Screen: Patient List (`/patients`)

**Page Structure:**
```
PageHeader
  title="Patients"
  subtitle="Manage patient records."
  action={{ label: "Add Patient", onClick: openAddPatientDrawer }}  // ASSUMPTION

SearchBar (above table)

DataTable columns:
  Patient Name | MRN | DOB | Phone | Last Appointment | Status | Actions
```

**Column Specs:**

| Column | Type | Notes |
|--------|------|-------|
| Patient Name | `text` | Clickable → opens Patient Detail drawer |
| MRN | `text` | Monospace font |
| DOB | `date` | Format: `MM/DD/YYYY` |
| Phone | `text` | Format: `(XXX) XXX-XXXX` |
| Last Appointment | `date` | Relative: "3 days ago" on hover shows absolute |
| Status | `StatusBadge` | Active / Inactive (ASSUMPTION) |
| Actions | `dropdown` | View, Edit, Appointments |

**HIPAA Notes:**
- DOB and Phone visible to `admin` and `coordinator` roles only
- `viewer` role sees these columns as `—`

---

## User Management Module

### Screen: User List (`/users`)

**Page Structure:**
```
PageHeader
  title="Users"
  subtitle="Manage staff access and roles."
  action={{ label: "Invite User", onClick: openInviteModal }}  // ASSUMPTION

DataTable columns:
  Name | Role | Location | Email | Status | Actions
```

**Column Specs:**

| Column | Type | Notes |
|--------|------|-------|
| Name | `text` | Avatar + full name |
| Role | `badge` | admin / coordinator / provider / viewer |
| Location | `text` | Primary practice location |
| Email | `text` | — |
| Status | `StatusBadge` | Active / Inactive |
| Actions | `dropdown` | View, Edit, Deactivate |

**Deactivate Action:**
- Opens confirmation modal: "Deactivate [Name]? This will revoke their access."
- Destructive variant button

---

## Settings Module

> Settings cards are built as reusable `SettingsCard` components — not custom layouts.

### SettingsCard Component

```ts
interface SettingsCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action: {
    label: string;
    onClick: () => void;
  };
  status?: 'connected' | 'disconnected' | 'configured';
}
```

### Settings Sections

**Locations** — `Manage Practice Locations`
- CRUD table of clinic locations
- Fields: Name, Address, Phone, Status (ASSUMPTION)

**Appointment Types** — `Manage Appointment Types`
- CRUD list of appointment type labels (e.g., Annual Checkup, Follow-up, Initial Consultation)
- Fields: Name, Duration (minutes), Color (ASSUMPTION), Active/Inactive (ASSUMPTION)

**Calendar Integrations** — `Google Calendar`, `Outlook Calendar`
- Connect/disconnect OAuth flows
- Show connected status badge

**Availability Rules**
- Business Hours: per-day time ranges (ASSUMPTION: Mon–Sun)
- Provider Availability: per-provider overrides (ASSUMPTION)

---

## Forms Standards

### Form Layout
- All forms use `React Hook Form` + `Zod` for validation
- Field gap: `space-y-4`
- Two-column layout for related fields: `grid grid-cols-2 gap-4`
- Labels always above inputs — never placeholder-only
- Required fields: label ends with `*` (red asterisk)

### Input Variants
- Default: `border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary`
- Error: `border-red-500 focus:border-red-500 focus:ring-red-500`
- Disabled: `bg-gray-50 text-gray-400 cursor-not-allowed`

### Validation Timing
- Validate on **blur** (not onChange, not onSubmit alone)
- Show error message immediately below the field
- Error message: `text-xs text-red-600 mt-1`

### Form Buttons
- Primary submit: `variant="default"` (primary green), full width on mobile
- Secondary/cancel: `variant="outline"`, right-aligned on desktop
- Destructive: `variant="destructive"`
- Loading state: replace button label with spinner + "Saving..."

### Character Counters
- Textarea fields with limits show: `{current}/{max}` right-aligned below field
- Textarea: Reason for Appointment — max 250 characters

---

## Tables Standards

- Built with `@tanstack/react-table` (ASSUMPTION)
- Always include: loading skeleton, empty state, pagination
- Sortable columns show sort icon in header
- Default page size: 20 rows
- Row actions in last column, rendered as `DropdownMenu`
- Sticky header on scroll (ASSUMPTION)
- Column header: `text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4`
- Cell: `text-sm text-gray-700 py-3 px-4`
- Row border: `border-b border-gray-100`

---

## Modal Standards

- Base primitive: Shadcn `Dialog`
- Overlay: `bg-black/50`
- Animation: fade + scale in
- Widths:
  - `sm`: `max-w-[480px]` — confirmations, cancel flow
  - `md`: `max-w-[640px]` — standard modals
  - `lg`: `max-w-[800px]` — Create Appointment wizard
- Never full-screen on desktop
- Always include a visible close button (top-right ×)
- Multi-step wizard: clicking backdrop does NOT close
- Single-step informational: clicking backdrop closes

---

## Drawer Standards

- Base primitive: Shadcn `Sheet` (side="right")
- Reschedule drawer width: `w-[500px]`
- Patient Detail drawer width: `w-[600px]` (ASSUMPTION)
- Always includes a header with title + close button
- Footer with CTAs is sticky at bottom
- Backdrop click closes drawer
- ESC closes drawer
- Animation: slide in from right

---

## Search Patterns

### Global Appointment Search (FilterBar)
- Searches across: patient name, MRN
- Debounce: 300ms
- Min characters: 1
- Clears with × button

### Patient Lookup (Create Appointment — Step 1)
- Searches across: patient name, MRN
- Typeahead dropdown
- Min characters: 2
- Shows: `[Full Name] — MRN: [number]`
- "No results" state with suggestion to check spelling

### Provider Search (Reschedule Drawer / Create Step 3)
- Searchable select
- Optional: filter by location

---

## Filtering Patterns

### Appointment Filters (FilterBar)
All filters are URL-persisted via query params:
- `?search=` — patient name / MRN text search
- `?professional=` — provider ID
- `?location=` — location ID
- `?from=&to=` — date range (ISO format)
- `?tab=` — upcoming | completed | cancelled

### Filter Reset
- "Clear all" link appears when any filter is non-default
- Clicking "Clear all" resets all params to defaults

---

## Empty States

| Context | Heading | Subheading | CTA |
|---------|---------|------------|-----|
| No Upcoming Appointments | "No upcoming appointments" | "Appointments scheduled for patients will appear here." | "Create Appointment" |
| No Completed Appointments | "No completed appointments" | "Appointments that have been marked complete will appear here." | — |
| No Cancelled Appointments | "No cancelled appointments" | "Cancelled appointments will appear here for your records." | — |
| No Search Results | "No results found" | "Try adjusting your search or filters." | "Clear filters" |
| No Patients | "No patients added" | "Add your first patient to start scheduling." | "Add Patient" |
| No Users | "No team members" | "Invite your first team member to get started." | "Invite User" |

---

## Loading States

> Since this is a UI-only project with mock data, loading states are simulated. Use a brief `setTimeout` (300–500ms) inside form submit handlers to show the loading state before transitioning to success — this makes the UI feel realistic without real API calls.

### Form Submit Loading
- Replace CTA button label with `<Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving...`
- Disable all form fields and the submit button during the simulated loading period
- After 400ms, dismiss the modal/drawer and show the SuccessModal or update local state

### Skeleton States (optional — for visual polish)
- Appointment List: render 6 skeleton cards on first mount before mock data loads (use `useEffect` + 200ms delay to set `isLoaded = true`)
- Tables: render 8 skeleton rows on first mount

### Patient/Provider Search Dropdown
- Simulate search delay with 200ms debounce before showing filtered results from mock array

---

## Error States

### Form Validation Error
- Inline below each field: `text-xs text-red-600 mt-1`
- On multi-step forms: block progression to next step until current step is valid via Zod `safeParse`
- Show a summary banner at the top of the step if more than one field is invalid

### No Results / Filter Error
- When search + filters produce 0 results, show `EmptyState` with heading "No results found" and a "Clear filters" CTA

### Conflict Error (UI simulation)
- Inline error below the Time field in Create/Reschedule: "This time slot is already booked. Please select another time."
- Simulate by checking the mock appointments array for the same date + time + provider combination before allowing progression to Step 5

---

## Accessibility Requirements

**Standard:** WCAG 2.2 AA

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | All text meets 4.5:1 ratio against background |
| Focus indicators | Visible focus ring on all interactive elements (`focus-visible:ring-2 focus-visible:ring-primary`) |
| Keyboard navigation | All modals, drawers, tables, dropdowns navigable via Tab / Enter / Escape / Arrow keys |
| ARIA labels | All icon-only buttons have `aria-label` |
| Form labels | Every input has an associated `<label>` — never label-less |
| Error messages | Linked to inputs via `aria-describedby` |
| Status badges | Include `role="status"` and `aria-label` |
| Modal trapping | Focus trapped inside open modals and drawers |
| Loading states | `aria-busy="true"` on loading containers |
| Screen reader | Appointment status changes announced via `aria-live="polite"` |

---

## Responsive Design Rules

**Strategy:** Desktop First

### Breakpoints

| Name | Min Width | Target Device |
|------|-----------|---------------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Standard desktop (primary design target) |
| `2xl` | 1536px | Large monitors |

### Desktop (xl — primary target)
- Sidebar: visible, w-56
- Content: full layout with FilterBar, tabs, grouped appointment sections
- Modals: centered with defined max-width
- Drawers: 500px from right

### Tablet (md–lg)
- Sidebar: collapsible (icon-only mode — ASSUMPTION: future feature)
- FilterBar: wraps to 2 rows
- Cards: full width

### Mobile (< md)
- Sidebar: hidden, replaced by bottom nav bar (ASSUMPTION: future feature)
- FilterBar: collapsible panel
- Modals: full-screen bottom sheet
- Tables: card-based view instead of rows

> **ASSUMPTION:** Mobile is a future phase. Build for desktop-first. Do not spend time optimizing for mobile in initial development. Use responsive Tailwind classes to ensure nothing breaks below lg, but don't build dedicated mobile layouts.

---

## Frontend Architecture

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI rendering |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool, dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| Shadcn UI | latest | Component primitives |
| React Hook Form | 7.x | Form state management |
| Zod | 3.x | Schema validation (frontend form validation only) |
| React Router | 6.x | Client-side routing |
| date-fns | 3.x | Date formatting and arithmetic |
| lucide-react | latest | Icon library |
| @tanstack/react-table | 8.x | Table primitives |

> **NOT included:** No Axios, no React Query, no authentication libraries, no HTTP clients. This is UI-only.

### Mock Data Strategy

- All mock data lives in `src/mocks/`
- Mock files export typed arrays matching the TypeScript interfaces
- Components receive data via props or import directly from mocks during development
- State changes (cancel, reschedule, create) update local React state — they do NOT persist on refresh
- Use `useState` to simulate mutations (e.g., adding an appointment to the list, moving it to Cancelled tab)

---

## Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── PageHeader.tsx
│   ├── appointments/
│   │   ├── AppointmentCard.tsx
│   │   ├── AppointmentGroup.tsx
│   │   ├── AppointmentStatusBadge.tsx
│   │   ├── FilterBar.tsx
│   │   ├── CreateAppointmentModal/
│   │   │   ├── index.tsx
│   │   │   ├── Step1PatientInfo.tsx
│   │   │   ├── Step2AppointmentDetails.tsx
│   │   │   ├── Step3Schedule.tsx
│   │   │   ├── Step4Notes.tsx
│   │   │   ├── Step5Review.tsx
│   │   │   └── StepIndicator.tsx
│   │   ├── RescheduleDrawer.tsx
│   │   └── CancelModal.tsx
│   ├── patients/
│   │   ├── PatientTable.tsx
│   │   └── PatientDetailDrawer.tsx
│   ├── users/
│   │   ├── UserTable.tsx
│   │   └── UserDetailDrawer.tsx
│   ├── settings/
│   │   ├── SettingsCard.tsx
│   │   ├── LocationsTable.tsx
│   │   └── AppointmentTypesTable.tsx
│   └── ui/
│       ├── StatusBadge.tsx
│       ├── DataTable.tsx
│       ├── SearchBar.tsx
│       ├── EmptyState.tsx
│       ├── Pagination.tsx
│       ├── DatePicker.tsx
│       ├── TimePicker.tsx
│       ├── PatientSearch.tsx
│       ├── ProviderSearch.tsx
│       ├── SuccessModal.tsx
│       └── ConfirmModal.tsx
├── pages/
│   ├── AppointmentsPage.tsx
│   ├── PatientsPage.tsx
│   ├── UsersPage.tsx
│   └── settings/
│       ├── SettingsPage.tsx
│       ├── LocationsPage.tsx
│       ├── AppointmentTypesPage.tsx
│       ├── CalendarIntegrationsPage.tsx
│       └── AvailabilityPage.tsx
├── mocks/                        # ALL mock data lives here — no API calls anywhere
│   ├── appointments.ts           # mockAppointments: Appointment[]
│   ├── patients.ts               # mockPatients: Patient[]
│   ├── users.ts                  # mockUsers: User[]
│   ├── locations.ts              # mockLocations: Location[]
│   ├── providers.ts              # mockProviders: Professional[]
│   └── appointmentTypes.ts       # mockAppointmentTypes: AppointmentType[]
├── lib/
│   ├── tokens.ts           # Design tokens
│   ├── utils.ts            # cn(), formatDate(), groupByDate()
│   └── constants.ts        # Routes, enums, static options, cancellation reasons
├── types/
│   ├── appointment.ts
│   ├── patient.ts
│   ├── user.ts
│   ├── location.ts
│   └── professional.ts
├── schemas/
│   ├── createAppointment.schema.ts
│   ├── reschedule.schema.ts
│   └── cancel.schema.ts
├── router/
│   └── index.tsx
├── App.tsx
└── main.tsx
```

---

## TypeScript Models

```ts
// src/types/appointment.ts

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type AppointmentType = 'in_person' | 'online';
export type MeetingPlatform = 'google_meet' | 'zoom' | 'microsoft_teams';
export type CancellationReason =
  | 'patient_requested'
  | 'provider_unavailable'
  | 'scheduling_conflict'
  | 'duplicate_appointment'
  | 'other';

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  type: AppointmentType;
  patientId: string;
  patientName: string;
  mrn: string;
  providerId: string;
  providerName: string;
  locationId: string | null;
  locationName: string | null;
  appointmentTypeLabel: string;
  date: string;          // ISO date: "2026-06-18"
  startTime: string;     // "09:30"
  endTime: string;       // "10:00"
  meetingPlatform: MeetingPlatform | null;
  meetingUrl: string | null;
  notes: string | null;
  cancellation: AppointmentCancellation | null;
  rescheduleHistory: RescheduleRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCancellation {
  cancelledBy: string;        // user display name
  cancelledByRole: string;
  reason: CancellationReason;
  cancelledAt: string;        // ISO datetime
}

export interface RescheduleRecord {
  rescheduledBy: string;
  originalDate: string;
  originalTime: string;
  newDate: string;
  newTime: string;
  rescheduledAt: string;
}

export interface CreateAppointmentPayload {
  patientId: string;
  type: AppointmentType;
  locationId: string | null;
  date: string;
  startTime: string;
  providerId: string;
  meetingPlatform: MeetingPlatform | null;
  notes: string | null;
}

export interface ReschedulePayload {
  appointmentId: string;
  newDate: string;
  newTime: string;
  providerId: string;
}

export interface CancelPayload {
  appointmentId: string;
  reason: CancellationReason;
}
```

```ts
// src/types/patient.ts

export type PatientStatus = 'active' | 'inactive';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mrn: string;
  dob: string;           // ISO date
  phone: string;
  email: string | null;
  status: PatientStatus;
  lastAppointmentDate: string | null;
  createdAt: string;
}
```

```ts
// src/types/user.ts

export type UserRole = 'admin' | 'coordinator' | 'provider' | 'viewer';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: UserRole;
  primaryLocationId: string | null;
  primaryLocationName: string | null;
  status: UserStatus;
  createdAt: string;
}

// AuthUser not used — UI-only project has no auth flow
```

```ts
// src/types/location.ts

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}
```

```ts
// src/types/professional.ts

export interface Professional {
  id: string;
  fullName: string;
  title: string;         // "Dr.", "PT", "LCSW"
  specialty: string;
  locationId: string | null;
  locationName: string | null;
  isActive: boolean;
}
```

> **No auth types needed** — this is a UI-only project. The `AuthUser` concept from the PRD is noted but not implemented. Role-based UI gating can use a simple hardcoded `currentUserRole` constant in `src/lib/constants.ts` for demo purposes.

```ts
// src/schemas/createAppointment.schema.ts

import { z } from 'zod';

export const step1Schema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
});

export const step2Schema = z.object({
  type: z.enum(['in_person', 'online']),
  locationId: z.string().nullable(),
  meetingPlatform: z.enum(['google_meet', 'zoom', 'microsoft_teams']).nullable(),
}).superRefine((data, ctx) => {
  if (data.type === 'in_person' && !data.locationId) {
    ctx.addIssue({ code: 'custom', path: ['locationId'], message: 'Practice location is required for in-person appointments' });
  }
  if (data.type === 'online' && !data.meetingPlatform) {
    ctx.addIssue({ code: 'custom', path: ['meetingPlatform'], message: 'Meeting platform is required for online appointments' });
  }
});

export const step3Schema = z.object({
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Time is required'),
  providerId: z.string().min(1, 'Professional is required'),
});

export const step4Schema = z.object({
  notes: z.string().max(250, 'Notes cannot exceed 250 characters').nullable(),
});

export const cancelSchema = z.object({
  reason: z.enum([
    'patient_requested',
    'provider_unavailable',
    'scheduling_conflict',
    'duplicate_appointment',
    'other',
  ], { required_error: 'Please select a cancellation reason' }),
});

export const rescheduleSchema = z.object({
  newDate: z.string().min(1, 'New date is required'),
  newTime: z.string().min(1, 'New time is required'),
  providerId: z.string().min(1, 'Professional is required'),
});
```

---

## Development Rules

### UI-Only Rules (Most Important)
1. **No API calls** — never write `fetch()`, `axios`, or any HTTP call. All data comes from `src/mocks/`
2. **No authentication logic** — no login screens, no token handling, no auth guards. Assume user is already logged in.
3. **No backend services** — no environment variables for API URLs, no `.env` files for endpoints
4. **Simulate mutations with `useState`** — when the user creates/cancels/reschedules, update local state arrays. Do NOT persist to any server.
5. **Mock data must be realistic** — use real-looking names, MRNs, dates, and clinic names. No "Test User" or "Lorem ipsum".

### General Rules
6. **Never hardcode clinic or patient data inside components** — always import from `src/mocks/` or receive via props
7. **Never use inline styles** — use Tailwind utility classes exclusively
8. **Never build a custom color or spacing value** — use only the design tokens defined in this document
9. **Never render PHI in URL query params** — use IDs only
10. **Never show SSN, Insurance ID, or full medical records** in any component
11. **Always use `StatusBadge` for appointment status** — never build custom colored text inline
12. **Always use `EmptyState`** for empty lists — never render a blank container
13. **Always use `PageHeader`** for page-level titles — never build custom h1 blocks in pages
14. **Always validate on blur** — not on every keystroke
15. **Always use `React Hook Form` + `Zod`** for all forms
16. **Always type all props** — no `any` types
17. **Use `cn()` from `lib/utils.ts`** for all conditional className merging (wraps `clsx` + `tailwind-merge`)
18. **The Create Appointment modal backdrop must NOT close the modal** — use `onInteractOutside={(e) => e.preventDefault()}`
19. **Reschedule flow must use a right-side Drawer** — never a modal
20. **All date displays use `date-fns`** — never `new Date().toLocaleDateString()` or manual string manipulation
21. **Date format in UI:** `MMMM d, yyyy` (e.g., "June 18, 2026")
22. **Time format in UI:** `hh:mm aa` (e.g., "09:30 AM")

---

## Code Generation Rules

When Claude Code generates a component, it must:

1. **Import** from `@/components/ui` for all Shadcn primitives
2. **Use** `cn()` from `@/lib/utils` for className construction
3. **Export** a named export, not default (except for pages)
4. **Define** all props as a TypeScript interface above the component
5. **Derive** all status colors from `StatusBadge` component — never inline color
6. **Handle** empty states in every list/table component
7. **Never** import directly from `lucide-react` without tree-shaking (use named imports only)
8. **Import mock data** from `@/mocks/` — never define data inline inside a page or component
9. **Simulate state changes** with `useState` — e.g., cancelling an appointment filters it out of the Upcoming list and adds it to Cancelled list in local state
10. **Never** write `useEffect` + `fetch` or any async data loading

### Mock Data Pattern

```tsx
// src/mocks/appointments.ts
import { Appointment } from '@/types/appointment';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    status: 'scheduled',
    type: 'in_person',
    patientName: 'John Smith',
    mrn: '100245',
    providerName: 'Dr. Emily Davis',
    locationName: 'Downtown Clinic',
    appointmentTypeLabel: 'Annual Checkup',
    date: '2026-06-08',
    startTime: '09:30',
    endTime: '10:00',
    meetingPlatform: null,
    meetingUrl: null,
    notes: null,
    cancellation: null,
    rescheduleHistory: [],
    // ...
  },
  // add 8–12 realistic entries spanning Today, Tomorrow, and future dates
];
```

### Page-level State Pattern (UI-only mutations)

```tsx
// AppointmentsPage.tsx
const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

function handleCancel(id: string, reason: CancellationReason) {
  setAppointments(prev =>
    prev.map(a =>
      a.id === id
        ? { ...a, status: 'cancelled', cancellation: { cancelledBy: 'Staff', reason, cancelledAt: new Date().toISOString() } }
        : a
    )
  );
}
```

### Example Component Shell

```tsx
import { cn } from '@/lib/utils';

interface ExampleProps {
  className?: string;
}

export function Example({ className }: ExampleProps) {
  return (
    <div className={cn('base-classes', className)}>
      {/* content */}
    </div>
  );
}
```

---

## Future Roadmap

> These features are architecturally planned but must NOT be built in the current phase. Components should be designed to accommodate them without requiring structural rewrites.

### Do Not Build Yet

| Feature | Notes |
|---------|-------|
| **Zoom / Google Meet / Teams Integration** | `meetingPlatform` field is already wired in the data model. The integration logic (OAuth, link generation) is deferred. |
| **Google Calendar / Outlook Sync** | Settings UI card is built; OAuth connection flow is deferred |
| **Patient Portal (self-scheduling)** | Separate product surface — different auth flow |
| **SMS / Email Appointment Reminders** | Notification preferences UI deferred |
| **Provider Schedule Calendar View** | Week-view calendar for providers — deferred |
| **Recurring Appointments** | Repeat/recurrence rules deferred |
| **Waitlist Management** | Waitlist queue per provider/slot deferred |
| **Insurance Verification** | Never shown in appointment cards; insurance data model is separate concern |
| **Billing / Claims** | Out of scope for scheduling module |
| **Mobile App / PWA** | Desktop-first only in this phase |
| **Collapsed Sidebar (icon mode)** | Sidebar collapse toggle deferred |
| **Multi-timezone Support** | Single timezone per organization in v1 (ASSUMPTION) |
| **Dashboard Analytics** | Summary stats, charts, KPIs — deferred |
| **Bulk Actions** | Bulk cancel, bulk reschedule — deferred |
| **Audit Log Screen** | Backend audit trail exists; dedicated UI screen deferred |
| **Dark Mode** | Not in scope for v1 |

---

*This CLAUDE.md was generated from PRD V2 — Appointment Management Template (Healthcare SaaS). All sections marked ASSUMPTION represent enterprise Healthcare SaaS best-practice decisions made where the PRD did not specify explicit requirements.*
