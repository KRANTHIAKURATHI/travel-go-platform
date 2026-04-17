import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import { Users, Bus, MapPin, BookOpen, TrendingUp, ArrowRight, Activity, DollarSign } from 'lucide-react'
import { LoadingScreen, Alert } from '../../components/common/UI'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    adminAPI.getStats()
      .then(r => { setStats(r.data); setLoading(false) })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load stats. Please check your admin credentials.')
        setLoading(false)
      })
  }, [])

  if (loading) return <AdminLayout title="Dashboard"><LoadingScreen /></AdminLayout>

  const statCards = [
    { label:'Total Users',       value: stats?.totalUsers ?? 0,          icon:Users,     bg:'bg-purple-50',  text:'text-purple-600',  border:'border-purple-100 dark:border-purple-900/40' },
    { label:'Bus Bookings',      value: stats?.totalBusBookings ?? 0,    icon:Bus,       bg:'bg-violet-50',  text:'text-violet-600',  border:'border-violet-100' },
    { label:'Tour Bookings',     value: stats?.totalPackageBookings ?? 0,icon:MapPin,    bg:'bg-purple-50',  text:'text-purple-600',  border:'border-purple-100 dark:border-purple-900/40' },
    { label:'Active Packages',   value: stats?.totalPackages ?? 0,       icon:BookOpen,  bg:'bg-violet-50',  text:'text-violet-600',  border:'border-violet-100' },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 max-w-6xl">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back, Admin 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Here's what's happening with TravelGo today.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map(({ label, value, icon:Icon, bg, text, border }) => (
            <div key={label} className={`bg-white dark:bg-gray-900 rounded-2xl border ${border} p-5 shadow-card hover:shadow-purple-md transition-shadow`}>
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={22} className={text} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-0.5">{value.toLocaleString()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Revenue banner */}
        <div className="rounded-2xl p-6 text-white overflow-hidden relative" style={{ background:'linear-gradient(135deg,#6d28d9,#7c3aed,#9333ea)' }}>
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10" style={{ background:'radial-gradient(circle,white,transparent)', transform:'translate(30%,-30%)' }} />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-purple-200 text-sm font-medium">
                <TrendingUp size={16} /> Total Revenue
              </div>
              <div className="text-4xl font-display font-bold">
                ₹{((stats?.totalRevenue ?? 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-purple-200 text-sm mt-1">All time combined revenue</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-xl font-bold">₹{((stats?.busRevenue ?? 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                <div className="text-purple-200 text-xs mt-0.5">Bus Revenue</div>
              </div>
              <div className="w-px bg-white dark:bg-gray-900/20" />
              <div className="text-center">
                <div className="text-xl font-bold">₹{((stats?.pkgRevenue ?? 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                <div className="text-purple-200 text-xs mt-0.5">Tour Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick access + system status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-purple-100 dark:border-purple-900/40 p-5 shadow-card">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><Activity size={16} className="text-purple-500" /> Quick Actions</h3>
            <div className="space-y-2">
              {[
                ['/admin/buses',    Bus,      'Manage Buses & Routes',  `${stats?.totalBuses ?? 0} active buses`],
                ['/admin/packages', MapPin,   'Manage Tour Packages',   `${stats?.totalPackages ?? 0} packages`],
                ['/admin/bookings', BookOpen, 'View All Bookings',      `${(stats?.totalBusBookings ?? 0) + (stats?.totalPackageBookings ?? 0)} total`],
                ['/admin/users',    Users,    'Manage Users',           `${stats?.totalUsers ?? 0} registered`],
              ].map(([to, Icon, label, sub]) => (
                <button key={to} onClick={() => navigate(to)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 transition-colors group text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                      <Icon size={15} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</div>
                      <div className="text-xs text-gray-400">{sub}</div>
                    </div>
                  </div>
                  <ArrowRight size={15} className="text-purple-400 group-hover:text-purple-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-purple-100 dark:border-purple-900/40 p-5 shadow-card">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><Activity size={16} className="text-purple-500" /> System Status</h3>
            <div className="space-y-3">
              {[
                ['Backend API',    '✅ Live — Supabase Edge Function'],
                ['Database',       '✅ PostgreSQL — Supabase'],
                ['Authentication', '✅ JWT Active'],
                ['Bus Bookings',   '✅ Operational'],
                ['Tour Packages',  '✅ Operational'],
                ['Payments',       '🔵 Simulated Mode'],
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                  <span className="text-xs font-medium text-gray-700">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
