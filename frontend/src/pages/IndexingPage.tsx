import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../lib/api'

const DEMO_SITES = [
  { id: 'a1000001-0000-0000-0000-000000000001', domain: 'acmecorp.com' },
  { id: 'a1000001-0000-0000-0000-000000000002', domain: 'blog.acmecorp.com' },
  { id: 'b2000002-0000-0000-0000-000000000001', domain: 'northstarmedia.io' },
  { id: 'c3000003-0000-0000-0000-000000000001', domain: 'brightlineseo.com' },
]

const DEMO_JOBS = [
  { id: 'aaaa0001-0000-0000-0000-000000000001', site: 'acmecorp.com', source: 'sitemap', engine: 'both', status: 'completed', total: 240, ok: 232, failed: 8, created: '2024-09-01' },
  { id: 'aaaa0001-0000-0000-0000-000000000007', site: 'events.acmecorp.com', source: 'sitemap', engine: 'both', status: 'running', total: 180, ok: 64, failed: 2, created: '2024-09-26' },
  { id: 'bbbb0002-0000-0000-0000-000000000007', site: 'studio.northstarmedia.io', source: 'sitemap', engine: 'both', status: 'failed', total: 140, ok: 12, failed: 128, created: '2024-09-21' },
  { id: 'cccc0003-0000-0000-0000-000000000006', site: 'brightlineseo.com', source: 'api', engine: 'google', status: 'pending', total: 8, ok: 0, failed: 0, created: '2024-09-26' },
]

const STATUS_STYLES = {
  completed: 'bg-green-100 text-green-700',
  running: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

export default function IndexingPage() {
  const [jobs, setJobs] = useState(DEMO_JOBS)
  const [open, setOpen] = useState(false)
  const [siteId, setSiteId] = useState(DEMO_SITES[0].id)
  const [source, setSource] = useState('sitemap')
  const [engine, setEngine] = useState('both')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const closeModal = () => {
    setOpen(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const site = DEMO_SITES.find(s => s.id === siteId)
    const payload = { site_id: siteId, source, engine }
    try {
      await fetch(apiUrl('/api/index-jobs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null)
    } catch (err) {
      // Preview-safe: ignore network errors, still add optimistic row
    }
    const newJob = {
      id: 'job-' + Date.now(),
      site: site ? site.domain : 'unknown',
      source,
      engine,
      status: 'pending',
      total: 0,
      ok: 0,
      failed: 0,
      created: new Date().toISOString().slice(0, 10),
    }
    setJobs(prev => [newJob, ...prev])
    setSubmitting(false)
    closeModal()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Indexing Jobs</h1>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          New Indexing Job
        </button>
      </div>

      <div className="grid gap-3">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap items-center justify-between gap-3 hover:shadow-md transition-shadow">
            <div className="min-w-0">
              <Link to={'/indexing/' + job.id} className="font-semibold text-gray-900 hover:text-blue-600 truncate" >
                {job.site}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{job.source} · {job.engine} · {job.total} URLs</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{job.created}</span>
              <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (STATUS_STYLES[job.status] || 'bg-gray-100 text-gray-600')}>{job.status}</span>
            </div>
          </div>
        ))}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">New Indexing Job</h2>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                <select value={siteId} onChange={e => setSiteId(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {DEMO_SITES.map(s => (
                    <option key={s.id} value={s.id}>{s.domain}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select value={source} onChange={e => setSource(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="sitemap">Sitemap</option>
                  <option value="manual">Manual</option>
                  <option value="api">API</option>
                  <option value="cms_plugin">CMS Plugin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engine</label>
                <select value={engine} onChange={e => setEngine(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="both">Google &amp; Bing</option>
                  <option value="google">Google</option>
                  <option value="bing">Bing</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60">
                  {submitting ? 'Creating…' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}