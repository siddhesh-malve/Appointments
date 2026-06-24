import type { Professional } from '@/types/professional'

export const mockProfessionals: Professional[] = [
  { id: 'pro-1', fullName: 'Dr. Emily Davis', title: 'MD', specialty: 'Internal Medicine', locationId: 'loc-1', locationName: 'Downtown Clinic', isActive: true },
  { id: 'pro-2', fullName: 'Dr. Michael Chen', title: 'MD', specialty: 'Family Medicine', locationId: 'loc-2', locationName: 'North Shore Medical Center', isActive: true },
  { id: 'pro-3', fullName: 'Dr. Sarah Patel', title: 'DO', specialty: 'Pediatrics', locationId: 'loc-1', locationName: 'Downtown Clinic', isActive: true },
  { id: 'pro-4', fullName: 'Dr. James Okafor', title: 'MD', specialty: 'Cardiology', locationId: 'loc-3', locationName: 'Westside Family Practice', isActive: true },
  { id: 'pro-5', fullName: 'Dr. Lisa Thompson', title: 'PhD, LCSW', specialty: 'Mental Health', locationId: 'loc-4', locationName: 'South Loop Health Hub', isActive: true },
  { id: 'pro-6', fullName: 'Dr. Robert Kim', title: 'DPT', specialty: 'Physical Therapy', locationId: 'loc-2', locationName: 'North Shore Medical Center', isActive: true },
]
