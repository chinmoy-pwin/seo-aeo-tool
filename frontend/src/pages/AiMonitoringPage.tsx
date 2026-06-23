import { useState } from 'react'

const DEMO_PROMPTS = [
  { id: 'p1', prompt: 'What are the best SEO tools?', brand: 'Indexly', engines: 'chatgpt, gemini, claude', mentions: 8, total: 12, freq: 'weekly' },
  { id: 'p2', prompt: 'Top AI visibility platforms 2024', brand: 'Indexly', engines: 'chatgpt, claude', mentions: 5, total: 8, freq: 'daily' },
  { id: 'p3', prompt: 'How to get pages indexed fast', brand: 'Indexly', engines: 'gemini', mentions: 2, total: 4, freq: 'weekly' },
]

export default function AiMonitoringPage() {
  const [search, setSearch] = useState('')
  const filtered = DEMO_PROMPTS.filter(p => p.prompt.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Brand Monitoring</h1>
          <p className="text-sm text-gray-500 mt-1">Track mentions across ChatGPT, Gemini &amp; Claude.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">New Prompt</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <div className="grid gap-4">
        {filtered.map(p => {
          const rate = p.total > 0 ? Math.round((p.mentions / p.total) * 100) : 0
          return (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">{p.prompt}</h3>
                  <p className="text-xs text-gray-500 mt-1">Brand: {p.brand} · {p.engines} · {p.freq}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 shrink-0">{rate}% mentioned</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: rate + '%' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}