import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, parseISO } from 'date-fns'
import type { Appointment } from '@/types/appointment'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function formatDateLabel(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'MMMM d')
}

export function formatFullDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMMM d, yyyy')
}

export function formatDateTime(dateStr: string, time: string): string {
  return `${formatFullDate(dateStr)} at ${formatTime(time)}`
}

export function groupAppointmentsByDate(appointments: Appointment[]): Array<{
  dateLabel: string
  dateStr: string
  appointments: Appointment[]
}> {
  const map = new Map<string, Appointment[]>()
  const sorted = [...appointments].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.startTime.localeCompare(b.startTime)
  })

  for (const appt of sorted) {
    if (!map.has(appt.date)) map.set(appt.date, [])
    map.get(appt.date)!.push(appt)
  }

  return Array.from(map.entries()).map(([dateStr, appts]) => ({
    dateLabel: formatDateLabel(dateStr),
    dateStr,
    appointments: appts,
  }))
}
