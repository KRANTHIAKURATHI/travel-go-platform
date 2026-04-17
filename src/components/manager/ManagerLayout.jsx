import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Bus, MapPin, Users, LogOut, ChevronRight, Ticket } from 'lucide-react'

const NAV = [
  { to:'/manager',          icon:LayoutDashboard, label:'Dashboard',      exact:true },
  { to:'/manager/buses',    icon:Bus,             label:'Buses & Routes'  },
  { to:'/manager/packages', icon:MapPin,          label:'Tour Packages'   },
  { to:'/manager/users',    icon:Users,           label:'Users'           },
]

export default function ManagerLayout({ children, title }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname === to || (to !== '/manager' && location.pathname.startsWith(to))

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col" style={{ background:'linear-gradient(180deg,#0f172a 0%,#1e293b 100%)' }}>
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center border border-white/10 shadow-lg shadow-blue-500/20">
              <Ticket size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">TravelGo</div>
              <div className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">Manager Portal</div>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-bold border border-blue-500/20">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
              <div className="text-gray-400 text-[10px] truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest px-3 py-2 mb-1">Main Menu</p>
          {NAV.map(({ to, icon:Icon, label, exact }) => (
            <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(to,exact) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5">
          <button onClick={() => { logout(); navigate('/') }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 font-medium">Portal</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-bold text-gray-800 dark:text-gray-100">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">View Live Site</Link>
            <div className="w-px h-4 bg-gray-100 dark:bg-gray-800" />
            <div className="text-xs text-gray-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}</div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
