import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AppointmentsPage } from '@/pages/AppointmentsPage'
import { PatientsPage } from '@/pages/PatientsPage'
import { UsersPage } from '@/pages/UsersPage'
import { SettingsPage } from '@/pages/SettingsPage'

const PatientDetailPage = lazy(() => import('@/pages/PatientDetailPage'))

export default function App() {
  return (
    <BrowserRouter basename="/Appointments">
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/appointments" replace />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route
            path="/patients/:id"
            element={
              <Suspense fallback={<div className="px-6 py-6 text-sm text-gray-400">Loading...</div>}>
                <PatientDetailPage />
              </Suspense>
            }
          />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
