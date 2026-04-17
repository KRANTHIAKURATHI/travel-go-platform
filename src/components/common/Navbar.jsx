import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bus, MapPin, User, LogOut, Menu, X, LayoutDashboard, ChevronDown, Ticket } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false) }
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <nav className="bg-white border-b border-purple-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shadow-purple group-hover:scale-105 transition-transform">
              <Ticket size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">Travel<span className="text-purple-600">Go</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/buses" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${isActive('/buses') ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}>
              <Bus size={15} /> Bus Tickets
            </Link>
            <Link to="/packages" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${isActive('/packages') ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}>
              <MapPin size={15} /> Tour Packages
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-purple">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 animate-fade-up" onMouseLeave={() => setDropOpen(false)}>
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>
                    <Link to="/bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors" onClick={() => setDropOpen(false)}>
                      <Ticket size={15} /> My Bookings
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors" onClick={() => setDropOpen(false)}>
                      <User size={15} /> Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 font-semibold transition-colors" onClick={() => setDropOpen(false)}>
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-purple-600 px-4 py-2 transition-colors">Login</Link>
                <Link to="/register" className="text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-colors shadow-purple">Sign Up</Link>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-purple-50">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white px-4 py-3 space-y-1">
          <Link to="/buses" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600" onClick={() => setMenuOpen(false)}><Bus size={15}/> Bus Tickets</Link>
          <Link to="/packages" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600" onClick={() => setMenuOpen(false)}><MapPin size={15}/> Tour Packages</Link>
          {user ? (
            <>
              <Link to="/bookings" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-purple-50" onClick={() => setMenuOpen(false)}><Ticket size={15}/> My Bookings</Link>
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-purple-50" onClick={() => setMenuOpen(false)}><User size={15}/> Profile</Link>
              {user.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50" onClick={() => setMenuOpen(false)}><LayoutDashboard size={15}/> Admin</Link>}
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500"><LogOut size={15}/> Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-gray-200 rounded-xl" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-semibold bg-purple-600 text-white rounded-xl" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
