import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ContentDraftPage() {
  const { id } = useParams()
  const [title, setTitle] = useState('SEO Tools: A Comprehensive Guide')
  const [body, setBody] = useState('# SEO Tools: A Comprehensive Guide\n\nIn a professional tone, this article explores the modern SEO toolkit and how AI visibility is reshaping discovery for B2B brands.')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/content" className="text-sm font-medium text-indigo-600 hover:text-indigo-700" >← Back to content</Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Draft {id}</h1>
        <div className="flex gap-2">
          <button className="bg-white border text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Save</button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Publish to WordPress</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body (Markdown)</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={12}
            className="w-full border rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
    </div>
  )
}