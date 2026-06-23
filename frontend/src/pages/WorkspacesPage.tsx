import { useState } from 'react'

const DEMO_WORKSPACES = [
  { id: 'w1', name: 'Demo Workspace', slug: 'demo', plan: 'pro', sites: 3, created: '2024-01-10' },
  { id: 'w2', name: 'Acme B2B', slug: 'acme-b2b', plan: 'agency', sites: 12, created: '2024-02-02' },
  { id: 'w3', name: 'Starter Co', slug: 'starter-co', plan: 'free', sites: 1, created: '2024-03-15' },
]

const PLAN_CLASS = {
  free: 'bg-gray-100 text-gray-600',
  pro: 'bg-blue-100 text-blue-700',
  agency: 'bg-purple-100 text-purple-700',
}

export default function WorkspacesPage() {
  const [search, setSearch] = useState('')
  const filtered = DEMO_WORKSPACES.filter(w => w.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Create Workspace</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workspaces..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No workspaces match your search.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map(ws => (
            <div key={ws.id} className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                <p className="text-sm text-gray-500 mt-1">/{ws.slug} · {ws.sites} sites · created {ws.created}</p>
              </div>
              <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (PLAN_CLASS[ws.plan] || 'bg-gray-100 text-gray-600')}>{ws.plan}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}