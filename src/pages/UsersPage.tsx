import { PageHeader } from '@/components/layout/PageHeader'
import { UserCog, Plus } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export function UsersPage() {
  return (
    <div className="px-6 py-6 max-w-5xl">
      <PageHeader
        title="User Management"
        subtitle="Manage staff roles and access."
        action={{ label: 'Invite User', icon: Plus, onClick: () => {} }}
      />
      <div className="mt-6">
        <EmptyState icon={UserCog} heading="User management coming soon" subheading="This module is under construction." />
      </div>
    </div>
  )
}
