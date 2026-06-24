import { Bell } from 'lucide-react'

export function Topbar() {
  return (
    <header className="h-14 flex-shrink-0 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-3">
        <button className="relative h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-semibold text-white">SJ</span>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-gray-900 leading-none">Sarah Johnson</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Downtown Clinic</p>
          </div>
        </div>
      </div>
    </header>
  )
}
