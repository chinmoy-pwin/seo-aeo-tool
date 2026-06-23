import { useState } from 'react'
import { Link } from 'react-router-dom'

const DEMO_DRAFTS = [
  { id: 'c1', title: 'SEO Tools: A Comprehensive Guide', lang: 'en', status: 'draft', score: 12, date: '2024-03-20' },
  { id: 'c2', title: 'Guía de Indexación Rápida', lang: 'es', status: 'published', score: 8, date: '2024-03-18' },
  { id: 'c3', title: 'AI-Sichtbarkeit für B2B-Marken', lang: 'de', status: 'draft', score: 19, date: '2024-03-21' },
]

export default function ContentPage() {
  const [search, setSearch] = useState('')
  const filtered = DEMO_DRAFTS.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Studio</h1>
          <p className="text-sm text-gray-500 mt-1">Generate human-like multilingual content &amp; publish to WordPress.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Generate Content</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drafts..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <div className="grid gap-4">
        {filtered.map(d => (
          <Link key={d.id} to={'/content/' + d.id} className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between hover:shadow-md transition-shadow" >
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{d.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{d.lang.toUpperCase()} · AI detection {d.score}% · {d.date}</p>
            </div>
            <span className={'px-2 py-1 rounded-full text-xs font-medium shrink-0 ' + (d.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>{d.status}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}