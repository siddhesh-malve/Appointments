import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCog,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', path: '/appointments', icon: CalendarDays },
  { label: 'Patients', path: '/patients', icon: Users },
  { label: 'User Management', path: '/users', icon: UserCog },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-gray-200 flex-shrink-0">
        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
          <CalendarDays className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900 leading-tight">
          HealthSchedule
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary-light text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-primary' : 'text-gray-400')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-white">SJ</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">Sarah Johnson</p>
            <p className="text-[11px] text-gray-400 truncate">Coordinator</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
