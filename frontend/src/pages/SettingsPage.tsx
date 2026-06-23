import { useState } from 'react'

const QUOTA = [
  { id: 'q1', label: 'URLs Indexed', used: 8420, limit: 10000, accent: '#0ea5e9' },
  { id: 'q2', label: 'Prompts Run', used: 312, limit: 1000, accent: '#6366f1' },
  { id: 'q3', label: 'Content Generated', used: 47, limit: 200, accent: '#22c55e' },
]

export default function SettingsPage() {
  const [whiteLabel, setWhiteLabel] = useState(false)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <section className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Plan &amp; Quota Usage</h2>
        <p className="text-sm text-gray-500 mb-4">Current plan: <span className="font-medium text-indigo-600">Pro</span></p>
        <div className="space-y-4">
          {QUOTA.map(q => {
            const pct = Math.round((q.used / q.limit) * 100)
            return (
              <div key={q.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{q.label}</span>
                  <span className="text-gray-500">{q.used.toLocaleString()} / {q.limit.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: pct + '%', backgroundColor: q.accent }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <section className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">White-Label</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Enable branded reports for agency clients.</p>
          <button onClick={() => setWhiteLabel(!whiteLabel)}
            className={'px-4 py-2 rounded-lg text-sm font-medium ' + (whiteLabel ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600')}>{whiteLabel ? 'Enabled' : 'Disabled'}</button>
        </div>
      </section>
      <section className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="font-semibold text-gray-900 mb-2">API Access</h2>
        <p className="text-sm text-gray-500 mb-3">Use this key for programmatic indexing &amp; the public REST API.</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-gray-50 border rounded-lg px-3 py-2 text-sm font-mono text-gray-700 truncate">wsk_demo_pro_3f9a2b8c4d1e6f7a</code>
          <button className="bg-white border text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Rotate</button>
        </div>
      </section>
    </div>
  )
}