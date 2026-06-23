import { useParams, Link } from 'react-router-dom'

const DEMO_URLS = [
  { id: 'u1', url: 'https://example.com/', status: 'indexed', submitted: '2024-03-20 09:12' },
  { id: 'u2', url: 'https://example.com/pricing', status: 'submitted', submitted: '2024-03-20 09:12' },
  { id: 'u3', url: 'https://example.com/blog/seo-guide', status: 'indexed', submitted: '2024-03-20 09:13' },
  { id: 'u4', url: 'https://example.com/features', status: 'failed', submitted: '2024-03-20 09:13' },
  { id: 'u5', url: 'https://example.com/contact', status: 'queued', submitted: '' },
]

const URL_CLASS = {
  indexed: 'bg-green-100 text-green-700',
  submitted: 'bg-blue-100 text-blue-700',
  queued: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
}

export default function IndexJobDetailPage() {
  const { jobId } = useParams()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/indexing" className="text-sm font-medium text-indigo-600 hover:text-indigo-700" >← Back to jobs</Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job {jobId}</h1>
          <p className="text-sm text-gray-500 mt-1">example.com · sitemap · both engines · live status</p>
        </div>
        <button className="bg-white border text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Retry Failed</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-5 py-3 border-b font-semibold text-gray-900">URL Submissions</div>
        <div className="divide-y">
          {DEMO_URLS.map(item => (
            <div key={item.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-gray-900 truncate">{item.url}</p>
                <p className="text-xs text-gray-400">{item.submitted || 'Not submitted yet'}</p>
              </div>
              <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (URL_CLASS[item.status] || 'bg-gray-100 text-gray-600')}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}