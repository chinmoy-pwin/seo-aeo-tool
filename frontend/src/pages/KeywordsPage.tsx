import { useState } from 'react'

const DEMO_KEYWORDS = [
  { id: 'k1', term: 'seo tools', country: 'US', current: 12, previous: 18 },
  { id: 'k2', term: 'ai visibility platform', country: 'US', current: 4, previous: 4 },
  { id: 'k3', term: 'bulk url indexing', country: 'UK', current: 7, previous: 3 },
  { id: 'k4', term: 'chatgpt brand monitoring', country: 'US', current: 21, previous: 29 },
]

function trend(cur, prev) {
  if (cur < prev) return { label: '▲ ' + (prev - cur), cls: 'text-green-600' }
  if (cur > prev) return { label: '▼ ' + (cur - prev), cls: 'text-red-600' }
  return { label: '— 0', cls: 'text-gray-400' }
}

export default function KeywordsPage() {
  const [search, setSearch] = useState('')
  const filtered = DEMO_KEYWORDS.filter(k => k.term.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Keyword Tracking</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Add Keyword</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search keywords..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden divide-y">
        {filtered.map(k => {
          const t = trend(k.current, k.previous)
          return (
            <div key={k.id} className="px-5 py-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{k.term}</p>
                <p className="text-xs text-gray-400">{k.country}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-lg font-bold text-gray-900">#{k.current}</span>
                <span className={'text-sm font-medium ' + t.cls}>{t.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}