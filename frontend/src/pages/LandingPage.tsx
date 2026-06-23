import { Link } from 'react-router-dom'

const FEATURES = [
  { id: 'idx', title: 'Instant Indexing', desc: 'Submit URLs to Google & Bing and watch them get crawled in hours, not weeks.', accent: '#6366f1' },
  { id: 'ai', title: 'AI Visibility Monitoring', desc: 'Track how ChatGPT, Gemini and Perplexity mention your brand across prompts.', accent: '#0ea5e9' },
  { id: 'aud', title: 'SEO Audits', desc: 'Automated technical audits surface crawl errors, broken links and Core Web Vitals.', accent: '#22c55e' },
  { id: 'kw', title: 'Keyword Tracking', desc: 'Daily rank tracking with trend deltas and search volume for every target term.', accent: '#f59e0b' },
  { id: 'bl', title: 'Backlink Monitor', desc: 'Discover new and lost links, with domain authority and anchor text insights.', accent: '#ec4899' },
  { id: 'cnt', title: 'AI Content Studio', desc: 'Draft human-like multilingual articles and publish straight to WordPress.', accent: '#8b5cf6' },
]

const STEPS = [
  { id: 1, title: 'Connect your site', desc: 'Verify your domain and link WordPress or Search Console in one click.' },
  { id: 2, title: 'Index & analyze', desc: 'Indexly submits URLs, runs audits and tracks rankings automatically.' },
  { id: 3, title: 'Grow visibility', desc: 'Act on alerts and AI insights to climb both search and LLM results.' },
]

const LOGOS = ['Acme Marketing', 'NorthStar Media', 'BrightPath', 'Quantum Labs', 'Vertex Group']
const STATS = [
  { id: 's1', value: '120k+', label: 'Pages indexed' },
  { id: 's2', value: '8,500', label: 'Keywords tracked' },
  { id: 's3', value: '99.9%', label: 'Uptime SLA' },
  { id: 's4', value: '4.9/5', label: 'Customer rating' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <span className="text-xl font-bold text-indigo-600">Indexly</span>
          <div className="flex items-center gap-3">
            <a href="#features" className="hidden text-sm font-medium text-gray-600 hover:text-indigo-600 sm:inline">Features</a>
            <Link to="/dashboard" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700" >Open Dashboard</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center md:px-6">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">SEO + AI Visibility Platform</span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">Get indexed faster. Stay visible everywhere.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">Indexly combines instant search indexing, SEO audits, rank tracking and AI brand monitoring in one trustworthy console built for growth teams.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/dashboard" className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700" >Open Dashboard</Link>
          <a href="#features" className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Learn more</a>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4">
          {LOGOS.map(name => (
            <span key={name} className="text-sm font-semibold uppercase tracking-wide text-gray-400">{name}</span>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <h2 className="text-center text-3xl font-bold">Everything you need to be found</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">A complete toolkit for technical SEO and the new era of AI-driven discovery.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(feat => (
            <div key={feat.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: feat.accent }} aria-hidden>
                <span className="h-3 w-3 rounded-sm bg-white" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{feat.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
          {STATS.map(stat => (
            <div key={stat.id}>
              <p className="text-3xl font-extrabold">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map(step => (
            <div key={step.id} className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">{step.id}</span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 bg-indigo-50 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to grow your visibility?</h2>
        <p className="mx-auto mt-3 max-w-xl px-4 text-gray-600">Join thousands of teams using Indexly to win in search and AI search alike.</p>
        <Link to="/dashboard" className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700" >Open Dashboard</Link>
      </section>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-gray-500 md:px-6">
          <span className="font-bold text-indigo-600">Indexly</span>
          <div className="flex flex-wrap gap-6">
            <Link to="/integrations" className="hover:text-indigo-600" >Integrations</Link>
            <Link to="/audits" className="hover:text-indigo-600" >Audits</Link>
            <Link to="/keywords" className="hover:text-indigo-600" >Keywords</Link>
            <span>© 2024 Indexly</span>
          </div>
        </div>
      </footer>
    </div>
  )
}