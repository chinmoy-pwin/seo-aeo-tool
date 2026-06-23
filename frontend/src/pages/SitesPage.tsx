import { useState } from 'react'

const DEMO_SITES = [
  { id: 's1', domain: 'example.com', sitemap: 'https://example.com/sitemap.xml', gsc: true, created: '2024-01-10' },
  { id: 's2', domain: 'shop.example.com', sitemap: 'https://shop.example.com/sitemap.xml', gsc: false, created: '2024-02-05' },
  { id: 's3', domain: 'blog.example.com', sitemap: '', gsc: true, created: '2024-03-01' },
]

export default function SitesPage() {
  const [search, setSearch] = useState('')
  const filtered = DEMO_SITES.filter(s => s.domain.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Add Site</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search domains..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <div className="grid gap-4">
        {filtered.map(site => (
          <div key={site.id} className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900">{site.domain}</h3>
              <p className="text-sm text-gray-500 mt-1 truncate">{site.sitemap || 'No sitemap configured'}</p>
            </div>
            <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (site.gsc ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>{site.gsc ? 'GSC connected' : 'GSC off'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}