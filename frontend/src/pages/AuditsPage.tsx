import { useState } from 'react'

const DEMO_AUDITS = [
  { id: 'a1', site: 'example.com', ai: 82, tech: 76, issues: 4, status: 'completed', date: '2024-03-20' },
  { id: 'a2', site: 'shop.example.com', ai: 68, tech: 71, issues: 6, status: 'completed', date: '2024-03-18' },
  { id: 'a3', site: 'blog.example.com', ai: 0, tech: 0, issues: 0, status: 'pending', date: '2024-03-21' },
]

function scoreColor(v) {
  if (v >= 80) return 'text-green-600'
  if (v >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export default function AuditsPage() {
  const [search, setSearch] = useState('')
  const filtered = DEMO_AUDITS.filter(a => a.site.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI &amp; Technical Audits</h1>
          <p className="text-sm text-gray-500 mt-1">AI-readiness and SEO health scores per site.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Run Audit</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sites..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <div className="grid gap-4">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900">{a.site}</h3>
              <p className="text-xs text-gray-500 mt-1">{a.issues} issues · {a.date}</p>
            </div>
            {a.status === 'pending' ? (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">pending</span>
            ) : (
              <div className="flex items-center gap-6 text-center shrink-0">
                <div>
                  <p className={'text-xl font-bold ' + scoreColor(a.ai)}>{a.ai}</p>
                  <p className="text-xs text-gray-400">AI</p>
                </div>
                <div>
                  <p className={'text-xl font-bold ' + scoreColor(a.tech)}>{a.tech}</p>
                  <p className="text-xs text-gray-400">Tech</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}