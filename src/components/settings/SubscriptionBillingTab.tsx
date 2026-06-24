import { useState } from 'react'
import {
  CreditCard, CheckCircle2, Zap, Calendar, Download,
  ArrowUpRight, Star, Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MOCK_PLAN = {
  name: 'Professional',
  price: '$149',
  cycle: '/month',
  nextBilling: 'July 23, 2026',
  status: 'active' as const,
  features: [
    'Up to 20 providers',
    'Unlimited appointments',
    'All 5 practice locations',
    'Telehealth integration',
    'Priority email support',
    'Audit logs (90 days)',
    'Custom appointment types',
    'Patient portal access',
  ],
}

const MOCK_PAYMENT = {
  last4: '4242',
  brand: 'Visa',
  expiry: '08 / 28',
  name: 'Sarah Johnson',
}

const MOCK_INVOICES = [
  { id: 'INV-2026-006', date: 'June 1, 2026',   amount: '$149.00', status: 'paid' },
  { id: 'INV-2026-005', date: 'May 1, 2026',    amount: '$149.00', status: 'paid' },
  { id: 'INV-2026-004', date: 'April 1, 2026',  amount: '$149.00', status: 'paid' },
  { id: 'INV-2026-003', date: 'March 1, 2026',  amount: '$149.00', status: 'paid' },
  { id: 'INV-2026-002', date: 'February 1, 2026', amount: '$149.00', status: 'paid' },
]

export function SubscriptionBillingTab() {
  const [cancelConfirm, setCancelConfirm] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Subscription & Billing</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your subscription plan and billing details.</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-hover px-6 py-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-white/80" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Current Plan</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{MOCK_PLAN.name}</h3>
            <p className="text-white/70 text-sm mt-0.5">Renews on {MOCK_PLAN.nextBilling}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{MOCK_PLAN.price}<span className="text-base font-normal text-white/70">{MOCK_PLAN.cycle}</span></p>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
              Active
            </span>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Plan Includes</p>
          <div className="grid grid-cols-2 gap-2">
            {MOCK_PLAN.features.map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-sm text-gray-700">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
            <Button size="sm">
              <Zap className="h-3.5 w-3.5" />
              Upgrade Plan
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCancelConfirm(!cancelConfirm)}>
              Cancel Subscription
            </Button>
          </div>
          {cancelConfirm && (
            <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              To cancel your subscription, please contact support at{' '}
              <span className="font-semibold">billing@healthfirst.com</span>.
              Your plan remains active until the end of the current billing period.
            </div>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Payment Method</h3>
          <Button variant="outline" size="sm">
            <CreditCard className="h-3.5 w-3.5" />
            Update Card
          </Button>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
          {/* Card art */}
          <div className="h-10 w-16 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-5 w-5 text-white/70" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{MOCK_PAYMENT.brand} •••• {MOCK_PAYMENT.last4}</p>
            <p className="text-xs text-gray-500">Expires {MOCK_PAYMENT.expiry} · {MOCK_PAYMENT.name}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-green-600" />
            <span className="text-xs text-green-700 font-medium">Secure</span>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Billing History</h3>
          <Button variant="ghost" size="sm" className="text-xs text-gray-500">
            <Download className="h-3 w-3" />
            Export All
          </Button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Invoice', 'Date', 'Amount', 'Status', ''].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_INVOICES.map(inv => (
              <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm font-mono text-gray-700">{inv.id}</td>
                <td className="px-6 py-3 text-sm text-gray-700 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />{inv.date}
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">{inv.amount}</td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <Download className="h-3 w-3" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
