import { useState, useEffect } from 'react'
import { apiUrl } from '../lib/api'

const WORKSPACE_ID = '11111111-1111-1111-1111-111111111111'

export default function IntegrationsPage() {
  const [search, setSearch] = useState('')
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [siteUrl, setSiteUrl] = useState('')
  const [username, setUsername] = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const loadConnections = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(apiUrl('/api/wordpress-connections'), {
        headers: { 'x-workspace-id': WORKSPACE_ID },
      })
      if (!res.ok) throw new Error('Failed to load connections')
      const data = await res.json()
      setConnections(Array.isArray(data.connections) ? data.connections : [])
    } catch (err) {
      setError('Could not load connections.')
      setConnections([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConnections()
  }, [])

  const openModal = () => {
    setSiteUrl('')
    setUsername('')
    setAppPassword('')
    setError('')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(apiUrl('/api/wordpress-connections'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-workspace-id': WORKSPACE_ID },
        body: JSON.stringify({ siteUrl, username, appPassword }),
      })
      if (!res.ok) throw new Error('Failed to save connection')
      setModalOpen(false)
      await loadConnections()
    } catch (err) {
      setError('Could not save connection. Check the fields and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      const res = await fetch(apiUrl('/api/wordpress-connections/' + id), {
        method: 'DELETE',
        headers: { 'x-workspace-id': WORKSPACE_ID },
      })
      if (!res.ok && res.status !== 204) throw new Error('Failed to remove')
      await loadConnections()
    } catch (err) {
      setError('Could not remove connection.')
    }
  }

  const filtered = connections.filter(c => (c.siteUrl || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500 mt-1">WordPress publishing &amp; Google Search Console connections.</p>
        </div>
        <button onClick={openModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Add Connection</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search connections..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-xl shadow-sm border p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No connections yet. Click "Add Connection" to link a WordPress site.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{c.siteUrl}</h3>
                <p className="text-xs text-gray-500 mt-1">WordPress · {c.username}</p>
              </div>
              <button onClick={() => handleRemove(c.id)} className="text-sm font-medium text-red-600 hover:text-red-700 shrink-0">Remove</button>
            </div>
          ))}
        </div>
      )}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add WordPress Connection</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input value={siteUrl} onChange={e => setSiteUrl(e.target.value)} placeholder="Site URL (https://example.com)" required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input value={appPassword} onChange={e => setAppPassword(e.target.value)} type="password" placeholder="Application Password" required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-white border text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}