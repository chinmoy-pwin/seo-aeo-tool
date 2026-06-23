import { useState } from 'react'

const DEMO_REPORTS = [
  { id: 'r1', recipients: 'team@acme.com', frequency: 'weekly', sections: 'indexing, ai, keywords', lastSent: '2024-03-18' },
  { id: 'r2', recipients: 'client@brand.com', frequency: 'monthly', sections: 'audits, backlinks', lastSent: '2024-03-01' },
]

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const filtered = DEMO_REPORTS.filter(r => r.recipients.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Automated email reports for stakeholders &amp; clients.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">New Report</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recipients..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <div className="grid gap-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{r.recipients}</h3>
              <p className="text-xs text-gray-500 mt-1">{r.sections} · last sent {r.lastSent}</p>
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 shrink-0">{r.frequency}</span>
          </div>
        ))}
      </div>
    </div>
  )
}