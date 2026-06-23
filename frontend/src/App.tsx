import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import IndexingPage from './pages/IndexingPage'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import AiMonitoringPage from './pages/AiMonitoringPage'
import AlertsPage from './pages/AlertsPage'
import AuditsPage from './pages/AuditsPage'
import BacklinksPage from './pages/BacklinksPage'
import ContentDraftPage from './pages/ContentDraftPage'
import ContentPage from './pages/ContentPage'
import IndexJobDetailPage from './pages/IndexJobDetailPage'
import IntegrationsPage from './pages/IntegrationsPage'
import KeywordsPage from './pages/KeywordsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import SitesPage from './pages/SitesPage'
import WorkspacesPage from './pages/WorkspacesPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6">
          <Routes>
        <Route path="/indexing" element={<IndexingPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/ai-monitoring" element={<AiMonitoringPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/audits" element={<AuditsPage />} />
        <Route path="/backlinks" element={<BacklinksPage />} />
        <Route path="/content" element={<ContentDraftPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/index-job-detail" element={<IndexJobDetailPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/keywords" element={<KeywordsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/sites" element={<SitesPage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}