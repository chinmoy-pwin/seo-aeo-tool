import { NavLink, Link } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Dashboard' },
  { to: '/indexing', label: 'Indexing' },
  { to: '/ai-monitoring', label: 'AI Monitoring' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/audits', label: 'Audits' },
  { to: '/backlinks', label: 'Backlinks' },
  { to: '/content', label: 'Content' },
  { to: '/integrations', label: 'Integrations' },
  { to: '/keywords', label: 'Keywords' },
  { to: '/reports', label: 'Reports' },
  { to: '/sites', label: 'Sites' },
  { to: '/workspaces', label: 'Workspaces' },
  { to: '/settings', label: 'Settings' },
]

export default function Header() {
  return (
    <header className="w-full shrink-0 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 md:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <Link to="/" className="text-lg font-bold text-indigo-600 hover:text-indigo-700" >
            Indexly
          </Link>
        </div>
        <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3" aria-label="Main">
          {NAV.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                'rounded-md px-3 py-2 text-sm font-bold transition-colors ' +
                (isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}