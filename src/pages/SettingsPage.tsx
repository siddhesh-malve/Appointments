import { PageHeader } from '@/components/layout/PageHeader'
import { Settings } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export function SettingsPage() {
  return (
    <div className="px-6 py-6 max-w-5xl">
      <PageHeader title="Settings" subtitle="Configure your practice settings." />
      <div className="mt-6">
        <EmptyState icon={Settings} heading="Settings coming soon" subheading="This module is under construction." />
      </div>
    </div>
  )
}
