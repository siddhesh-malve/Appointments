import { useState } from 'react'
import { Building2, MapPin, Lock, CreditCard, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PracticeProfileTab }     from '@/components/settings/PracticeProfileTab'
import { LocationManagementTab }  from '@/components/settings/LocationManagementTab'
import { PasswordTab }            from '@/components/settings/PasswordTab'
import { SubscriptionBillingTab } from '@/components/settings/SubscriptionBillingTab'
import { HelpCenterTab }          from '@/components/settings/HelpCenterTab'

type TabId = 'profile' | 'locations' | 'password' | 'billing' | 'help'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',   label: 'Practice Profile',      icon: <Building2 className="h-4 w-4" /> },
  { id: 'locations', label: 'Location Management',   icon: <MapPin className="h-4 w-4" />    },
  { id: 'password',  label: 'Password',              icon: <Lock className="h-4 w-4" />      },
  { id: 'billing',   label: 'Subscription & Billing',icon: <CreditCard className="h-4 w-4" />},
  { id: 'help',      label: 'Help Center',           icon: <HelpCircle className="h-4 w-4" />},
]

export function SettingsPage() {
  const [active, setActive] = useState<TabId>('profile')

  return (
    <div className="min-h-full bg-gray-50">
      {/* Page title */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 pt-6 pb-0">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5 mb-4">Manage your practice configuration and preferences.</p>

          {/* Underline tabs */}
          <div className="flex gap-0 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                  active === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 py-6">
        {active === 'profile'   && <PracticeProfileTab />}
        {active === 'locations' && <LocationManagementTab />}
        {active === 'password'  && <PasswordTab />}
        {active === 'billing'   && <SubscriptionBillingTab />}
        {active === 'help'      && <HelpCenterTab />}
      </div>
    </div>
  )
}
