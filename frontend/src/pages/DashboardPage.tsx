import { Link } from 'react-router-dom'

const KPIS = [
  { id: 'idx', label: 'URLs Indexed', value: '8,420', delta: '+12% this month', accent: '#0ea5e9' },
  { id: 'ai', label: 'AI Mention Rate', value: '63%', delta: '+5pts vs last week', accent: '#6366f1' },
  { id: 'aud', label: 'Avg AI Readiness', value: '78/100', delta: '3 sites audited', accent: '#22c55e' },
  { id: 'kw', label: 'Keywords Tracked', value: '142', delta: 'Avg rank 14', accent: '#f59e0b' },
]

const RECENT_JOBS = [
  { id: 'j1', site: 'example.com', source: 'sitemap', engine: 'both', status: 'completed', urls: 248 },
  { id: 'j2', site: 'shop.example.com', source: 'manual', engine: 'google', status: 'running', urls: 32 },
  { id: 'j3', site: 'blog.example.com', source: 'api', engine: 'bing', status: 'pending', urls: 14 },
]

const STATUS_CLASS = {
  completed: 'bg-green-100 text-green-700',
  running: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspace Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Indexing, AI visibility, audits & keywords at a glance.</p>
        </div>
        <Link to="/indexing" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700" >New Index Job</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {KPIS.map(kpi => (
          <div key={kpi.id} className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-2">
              <span className="h-8 w-1 rounded-full" style={{ backgroundColor: kpi.accent }} aria-hidden />
              <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-1">{kpi.delta}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Indexing Jobs</h2>
          <Link to="/indexing" className="text-sm font-medium text-indigo-600 hover:text-indigo-700" >View all</Link>
        </div>
        <div className="divide-y">
          {RECENT_JOBS.map(job => (
            <div key={job.id} className="px-5 py-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{job.site}</p>
                <p className="text-xs text-gray-500">{job.source} · {job.engine} · {job.urls} URLs</p>
              </div>
              <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (STATUS_CLASS[job.status] || 'bg-gray-100 text-gray-600')}>{job.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Upgrade to Agency</h3>
          <p className="text-sm text-indigo-100 mt-1">White-label reports, 100k URL quota, and unlimited workspaces.</p>
        </div>
        <Link to="/settings" className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50" >See plans</Link>
      </div>
    </div>
  )
}