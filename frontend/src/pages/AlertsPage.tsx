import { useState } from 'react'

const DEMO_ALERTS = [
  { id: 'al1', type: 'indexing_failure', message: '44 URLs failed indexing on example.com', time: '2h ago', read: false },
  { id: 'al2', type: 'rank_drop', message: '"chatgpt brand monitoring" dropped 8 positions', time: '6h ago', read: false },
  { id: 'al3', type: 'mention_change', message: 'Indexly mention rate up 5% on Claude', time: '1d ago', read: true },
]

const TYPE_CLASS = {
  indexing_failure: 'bg-red-100 text-red-700',
  rank_drop: 'bg-orange-100 text-orange-700',
  mention_change: 'bg-blue-100 text-blue-700',
}

export default function AlertsPage() {
  const [filter, setFilter] = useState('all')
  const filtered = DEMO_ALERTS.filter(a => filter === 'all' || (filter === 'unread' ? !a.read : a.read))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Alerts</h1>
      <div className="flex gap-2 mb-4">
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={'px-3 py-1.5 rounded-md text-sm font-medium ' + (filter === f ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50')}>{f}</button>
        ))}
      </div>
      <div className="grid gap-3">
        {filtered.map(a => (
          <div key={a.id} className={'bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between gap-3 ' + (a.read ? 'opacity-70' : '')}>
            <div className="min-w-0">
              <p className="font-medium text-gray-900">{a.message}</p>
              <p className="text-xs text-gray-400 mt-1">{a.time}</p>
            </div>
            <span className={'px-2 py-1 rounded-full text-xs font-medium shrink-0 ' + (TYPE_CLASS[a.type] || 'bg-gray-100 text-gray-600')}>{a.type.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}