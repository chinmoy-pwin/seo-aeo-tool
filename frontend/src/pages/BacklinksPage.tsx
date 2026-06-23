import { useState } from 'react'

const DEMO_BACKLINKS = [
  { id: 'b1', source: 'techcrunch.com/article', target: 'example.com', anchor: 'best SEO tool', da: 92 },
  { id: 'b2', source: 'searchengineland.com/post', target: 'example.com/pricing', anchor: 'indexing platform', da: 84 },
  { id: 'b3', source: 'reddit.com/r/SEO', target: 'example.com', anchor: 'try this', da: 61 },
  { id: 'b4', source: 'medium.com/@author', target: 'example.com/blog', anchor: 'read more', da: 73 },
]

function daClass(v) {
  if (v >= 80) return 'bg-green-100 text-green-700'
  if (v >= 50) return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-600'
}

export default function BacklinksPage() {
  const [search, setSearch] = useState('')
  const filtered = DEMO_BACKLINKS.filter(b => b.source.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Backlinks</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search source domains..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden divide-y">
        {filtered.map(b => (
          <div key={b.id} className="px-5 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{b.source}</p>
              <p className="text-xs text-gray-500 truncate">→ {b.target} · "{b.anchor}"</p>
            </div>
            <span className={'px-2 py-1 rounded-full text-xs font-medium shrink-0 ' + daClass(b.da)}>DA {b.da}</span>
          </div>
        ))}
      </div>
    </div>
  )
}