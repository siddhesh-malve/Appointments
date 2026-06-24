import { useState } from 'react'
import {
  Search, ChevronDown, ChevronUp, BookOpen, MessageCircle,
  FileText, ExternalLink, Phone, Mail, Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'How do I add a new appointment?',
    a: 'Navigate to the Appointments page and click the green "Create New Appointment" button in the top right. Fill in the patient details, select a professional and time slot, then review and confirm.',
  },
  {
    q: 'How do I reschedule an existing appointment?',
    a: 'From the Appointments list, locate the appointment card and click "Reschedule Appointment". A dialog will open with pre-filled details — update the date, time, or provider as needed and click Confirm.',
  },
  {
    q: 'How do I add a patient to the system?',
    a: 'Go to Patient Management and click "Add Patient". Complete the form with the patient\'s name, MRN, date of birth, gender, and contact details, then save.',
  },
  {
    q: 'How do I record vital signs for a patient?',
    a: 'Open the Patient Detail page, switch to the "Readings & Vitals" tab, and click "Add New Reading". Select the reading type and enter the measured values.',
  },
  {
    q: 'How do I manage practice locations?',
    a: 'Go to Settings → Location Management. You can add new locations, edit existing ones, toggle their active status, and remove locations that are no longer in use.',
  },
  {
    q: 'How do I change my password?',
    a: 'Navigate to Settings → Password. Enter your current password, then your new password twice. Your new password must be at least 8 characters and include an uppercase letter, a number, and a special character.',
  },
  {
    q: 'What browsers are supported?',
    a: 'HealthSchedule is optimised for Google Chrome (latest), Microsoft Edge, Firefox, and Safari. We recommend Chrome for the best experience.',
  },
  {
    q: 'How do I export billing invoices?',
    a: 'Go to Settings → Subscription & Billing. In the Billing History section you can download individual invoices as PDF or export all invoices at once.',
  },
]

const RESOURCES = [
  { icon: <BookOpen className="h-5 w-5" />, title: 'User Guide',         desc: 'Step-by-step documentation for all modules.', color: 'bg-blue-50 text-blue-600'    },
  { icon: <Video className="h-5 w-5" />,    title: 'Video Tutorials',    desc: 'Watch walkthroughs of key workflows.',          color: 'bg-purple-50 text-purple-600' },
  { icon: <FileText className="h-5 w-5" />, title: 'Release Notes',      desc: 'What\'s new in the latest version.',           color: 'bg-amber-50 text-amber-600'   },
  { icon: <FileText className="h-5 w-5" />, title: 'HIPAA Compliance',   desc: 'Security & compliance documentation.',          color: 'bg-green-50 text-green-600'   },
]

const CONTACT = [
  { icon: <MessageCircle className="h-4 w-4" />, label: 'Live Chat',      value: 'Available Mon–Fri, 9 AM–6 PM CST', action: 'Start Chat'   },
  { icon: <Mail className="h-4 w-4" />,          label: 'Email Support',  value: 'support@healthschedule.io',         action: 'Send Email'  },
  { icon: <Phone className="h-4 w-4" />,         label: 'Phone Support',  value: '1-800-555-0199 (Enterprise only)',   action: 'Call Now'    },
]

export function HelpCenterTab() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredFaqs = FAQS.filter(f =>
    !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Help Center</h2>
        <p className="text-sm text-gray-500 mt-0.5">Find answers, guides, and contact support.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search help articles..."
          className="w-full h-11 rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Resources</h3>
        <div className="grid grid-cols-2 gap-3">
          {RESOURCES.map(r => (
            <button key={r.title} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-gray-300 hover:shadow-sm transition-all group">
              <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg', r.color)}>
                {r.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                  <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Frequently Asked Questions</h3>
          {search && (
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}
        </div>
        <div className="divide-y divide-gray-100">
          {filteredFaqs.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              No articles found. Try a different search term.
            </div>
          ) : filteredFaqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors gap-4"
              >
                <span className="text-sm font-medium text-gray-800">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Support</h3>
        <div className="space-y-3">
          {CONTACT.map(c => (
            <div key={c.label} className="flex items-center justify-between rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500">
                  {c.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.label}</p>
                  <p className="text-xs text-gray-500">{c.value}</p>
                </div>
              </div>
              <button className="text-xs font-medium text-primary hover:underline">{c.action}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
