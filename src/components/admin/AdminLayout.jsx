import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Bus, MapPin, BookOpen, Users, LogOut, ChevronRight, Ticket } from 'lucide-react'

const NAV = [
  { to:'/admin',          icon:LayoutDashboard, label:'Dashboard',      exact:true },
  { to:'/admin/buses',    icon:Bus,             label:'Buses & Routes'  },
  { to:'/admin/packages', icon:MapPin,          label:'Tour Packages'   },
  { to:'/admin/bookings', icon:BookOpen,        label:'All Bookings'    },
  { to:'/admin/users',    icon:Users,           label:'Users'           },
]

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to))

  return (
    <div className="min-h-screen flex" style={{ background:'#f5f3ff' }}>
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col" style={{ background:'linear-gradient(180deg,#2e1065 0%,#4c1d95 50%,#6d28d9 100%)' }}>
        {/* Logo */}
        <div className="p-5 border-b border-purple-400/20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <Ticket size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">TravelGo</div>
              <div className="text-purple-300 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-purple-400/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-400/30 flex items-center justify-center text-white text-sm font-bold border border-purple-300/30">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
              <div className="text-purple-300 text-xs truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider px-3 py-2">Navigation</p>
          {NAV.map(({ to, icon:Icon, label, exact }) => (
            <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(to,exact) ? 'bg-white/20 text-white shadow-sm border border-white/10' : 'text-purple-200 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-purple-400/20">
          <button onClick={() => { logout(); navigate('/') }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-200 hover:bg-white/10 hover:text-white transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-purple-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Admin</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-semibold text-gray-800">{title}</span>
          </div>
          <Link to="/" className="text-xs text-purple-600 hover:text-purple-700 font-medium">← Back to Site</Link>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
