export type UserRole = 'secondary_admin' | 'staff' | 'professional'

export interface AssignedLocation { id: string; name: string }

export interface ActiveUser {
  id: string; firstName: string; lastName: string; fullName: string
  email: string; contactNumber: string; role: UserRole; designation: string
  assignedLocations: AssignedLocation[]; status: 'active'; createdAt: string
}

export interface InvitedUser {
  id: string; firstName: string; lastName: string; fullName: string
  email: string; role: UserRole; assignedLocations: AssignedLocation[]
  status: 'invite_sent'; invitedAt: string
}

export interface SuspendedUser {
  id: string; firstName: string; lastName: string; fullName: string
  email: string; contactNumber: string; role: UserRole; designation: string
  assignedLocations: AssignedLocation[]; status: 'suspended'
  suspendedOn: string; reason: string
}

export const INVITE_LOCATIONS: AssignedLocation[] = [
  { id: 'loc-1', name: 'Downtown Clinic' },
  { id: 'loc-2', name: 'North Shore Medical Center' },
  { id: 'loc-3', name: 'Westside Family Practice' },
  { id: 'loc-4', name: 'South Loop Health Hub' },
]

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'secondary_admin', label: 'Secondary Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'professional', label: 'Professional' },
]

export const ROLE_BADGE: Record<UserRole, { bg: string; text: string; label: string }> = {
  secondary_admin: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Secondary Admin' },
  staff:           { bg: 'bg-blue-50',   text: 'text-blue-700',   label: 'Staff'           },
  professional:    { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Professional'    },
}

const L = INVITE_LOCATIONS
const [loc1, loc2, loc3, loc4] = L

export const mockActiveUsers: ActiveUser[] = [
  {
    id: 'u-1', firstName: 'Sarah', lastName: 'Johnson', fullName: 'Sarah Johnson',
    email: 'sarah.johnson@healthfirst.com', contactNumber: '(312) 555-0101',
    role: 'secondary_admin', designation: 'Clinic Manager',
    assignedLocations: [loc1, loc2], status: 'active', createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'u-2', firstName: 'Marcus', lastName: 'Rivera', fullName: 'Marcus Rivera',
    email: 'marcus.rivera@healthfirst.com', contactNumber: '(312) 555-0202',
    role: 'professional', designation: 'Cardiologist',
    assignedLocations: [loc1], status: 'active', createdAt: '2025-02-01T09:00:00Z',
  },
  {
    id: 'u-3', firstName: 'Priya', lastName: 'Patel', fullName: 'Priya Patel',
    email: 'priya.patel@healthfirst.com', contactNumber: '(847) 555-0303',
    role: 'staff', designation: 'Front Desk Coordinator',
    assignedLocations: [loc2, loc3], status: 'active', createdAt: '2025-02-10T10:00:00Z',
  },
  {
    id: 'u-4', firstName: 'David', lastName: 'Chen', fullName: 'David Chen',
    email: 'david.chen@healthfirst.com', contactNumber: '(773) 555-0404',
    role: 'professional', designation: 'Pediatrician',
    assignedLocations: [loc3], status: 'active', createdAt: '2025-03-01T08:30:00Z',
  },
  {
    id: 'u-5', firstName: 'Aisha', lastName: 'Thompson', fullName: 'Aisha Thompson',
    email: 'aisha.thompson@healthfirst.com', contactNumber: '(312) 555-0505',
    role: 'staff', designation: 'Billing Specialist',
    assignedLocations: [loc4], status: 'active', createdAt: '2025-03-15T11:00:00Z',
  },
  {
    id: 'u-6', firstName: 'James', lastName: "O'Brien", fullName: "James O'Brien",
    email: 'james.obrien@healthfirst.com', contactNumber: '(312) 555-0606',
    role: 'secondary_admin', designation: 'Operations Manager',
    assignedLocations: [loc1, loc2, loc3, loc4], status: 'active', createdAt: '2025-01-20T09:00:00Z',
  },
  {
    id: 'u-7', firstName: 'Elena', lastName: 'Vasquez', fullName: 'Elena Vasquez',
    email: 'elena.vasquez@healthfirst.com', contactNumber: '(847) 555-0707',
    role: 'professional', designation: 'Licensed Therapist',
    assignedLocations: [loc2], status: 'active', createdAt: '2025-04-01T09:00:00Z',
  },
  {
    id: 'u-8', firstName: 'Kevin', lastName: 'Park', fullName: 'Kevin Park',
    email: 'kevin.park@healthfirst.com', contactNumber: '(773) 555-0808',
    role: 'staff', designation: 'Medical Assistant',
    assignedLocations: [loc3, loc4], status: 'active', createdAt: '2025-04-10T10:30:00Z',
  },
  {
    id: 'u-9', firstName: 'Hannah', lastName: 'Brooks', fullName: 'Hannah Brooks',
    email: 'hannah.brooks@healthfirst.com', contactNumber: '(312) 555-0909',
    role: 'staff', designation: 'Triage Nurse',
    assignedLocations: [loc1], status: 'active', createdAt: '2025-05-01T08:00:00Z',
  },
  {
    id: 'u-10', firstName: 'Raj', lastName: 'Mehta', fullName: 'Raj Mehta',
    email: 'raj.mehta@healthfirst.com', contactNumber: '(773) 555-1010',
    role: 'professional', designation: 'Neurologist',
    assignedLocations: [loc1, loc3], status: 'active', createdAt: '2025-05-20T09:00:00Z',
  },
]

export const mockInvitedUsers: InvitedUser[] = [
  {
    id: 'inv-1', firstName: 'Rachel', lastName: 'Kim', fullName: 'Rachel Kim',
    email: 'rachel.kim@healthfirst.com', role: 'staff',
    assignedLocations: [loc1], status: 'invite_sent', invitedAt: '2026-06-20T09:45:00Z',
  },
  {
    id: 'inv-2', firstName: 'Tyler', lastName: 'Brooks', fullName: 'Tyler Brooks',
    email: 'tyler.brooks@healthfirst.com', role: 'professional',
    assignedLocations: [loc2, loc3], status: 'invite_sent', invitedAt: '2026-06-21T14:30:00Z',
  },
  {
    id: 'inv-3', firstName: 'Nadia', lastName: 'Okonkwo', fullName: 'Nadia Okonkwo',
    email: 'nadia.okonkwo@healthfirst.com', role: 'secondary_admin',
    assignedLocations: [loc1, loc4], status: 'invite_sent', invitedAt: '2026-06-22T11:00:00Z',
  },
]

export const mockSuspendedUsers: SuspendedUser[] = [
  {
    id: 'sus-1', firstName: 'Robert', lastName: 'Nguyen', fullName: 'Robert Nguyen',
    email: 'robert.nguyen@healthfirst.com', contactNumber: '(312) 555-0901',
    role: 'staff', designation: 'Receptionist',
    assignedLocations: [loc1], status: 'suspended',
    suspendedOn: '2026-05-10T10:00:00Z', reason: 'Inactive account',
  },
  {
    id: 'sus-2', firstName: 'Carla', lastName: 'Mendez', fullName: 'Carla Mendez',
    email: 'carla.mendez@healthfirst.com', contactNumber: '(847) 555-0902',
    role: 'professional', designation: 'Physical Therapist',
    assignedLocations: [loc2, loc3], status: 'suspended',
    suspendedOn: '2026-04-22T14:15:00Z', reason: 'Left organization',
  },
  {
    id: 'sus-3', firstName: 'Derek', lastName: 'Walsh', fullName: 'Derek Walsh',
    email: 'derek.walsh@healthfirst.com', contactNumber: '(773) 555-0903',
    role: 'secondary_admin', designation: 'Supervisor',
    assignedLocations: [loc4], status: 'suspended',
    suspendedOn: '2026-06-01T09:30:00Z', reason: 'Policy violation',
  },
]
