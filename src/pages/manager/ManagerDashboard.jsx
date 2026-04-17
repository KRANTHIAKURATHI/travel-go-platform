import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import ManagerLayout from '../../components/manager/ManagerLayout'
import { Users, Bus, MapPin, ArrowRight, Activity, ShieldCheck, Plus } from 'lucide-react'
import { LoadingScreen, Alert } from '../../components/common/UI'

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Sharing same stats API but UI will hide sensitive info
    adminAPI.getStats()
      .then(r => { setStats(r.data); setLoading(false) })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load dashboard data.')
        setLoading(false)
      })
  }, [])

  if (loading) return <ManagerLayout title="Dashboard"><LoadingScreen /></ManagerLayout>

  const statCards = [
    { label:'System Users',      value: stats?.totalUsers ?? 0,          icon:Users,     color:'blue' },
    { label:'Available Buses',   value: stats?.totalBuses ?? 0,          icon:Bus,       color:'indigo' },
    { label:'Tour Packages',     value: stats?.totalPackages ?? 0,       icon:MapPin,    color:'sky' },
    { label:'Total Bookings',    value: (stats?.totalBusBookings ?? 0) + (stats?.totalPackageBookings ?? 0), icon:Activity, color:'blue' },
  ]

  return (
    <ManagerLayout title="Dashboard">
      <div className="space-y-8 max-w-6xl">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/60">Manager Command Center</span>
            </div>
            <h1 className="font-playfair text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Welcome back, <span className="text-blue-600 italic underline decoration-blue-500/20">{localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Manager'}</span> ✨
            </h1>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 ml-1">Optimizing fleet operations and travel experiences</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => navigate('/manager/buses')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25">
               <Plus size={18} /> Add Bus
             </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(({ label, value, icon:Icon, color }) => (
            <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-${color}-50 dark:bg-${color}-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <Icon size={24} className={`text-${color}-600 dark:text-${color}-400`} />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-1">{value.toLocaleString()}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick access cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" /> 
              Quick Management
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['/manager/buses',    Bus,      'Buses & Routes', 'Configure your travel fleet'],
                ['/manager/packages', MapPin,   'Tour Packages',  'Create and edit tour offers'],
                ['/manager/users',    Users,    'User Database',  'Monitor registered customers'],
              ].map(([to, Icon, label, sub]) => (
                <button key={to} onClick={() => navigate(to)} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all group text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
                      <Icon size={18} className="text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{label}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{sub}</div>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors translate-x-0 group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Manager Resources</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Access tools to expand the TravelGo network. Stay updated with the latest service status.
                  </p>
                </div>
                <div className="mt-8 space-y-4">
                   <div className="flex items-center justify-between text-xs font-semibold py-3 border-b border-white/10">
                      <span className="text-blue-200 uppercase tracking-wider">API Status</span>
                      <span className="bg-green-400 text-green-900 px-2 py-0.5 rounded-full text-[10px]">OPERATIONAL</span>
                   </div>
                   <div className="flex items-center justify-between text-xs font-semibold py-3 border-b border-white/10">
                      <span className="text-blue-200 uppercase tracking-wider">Last Sync</span>
                      <span className="text-white">2 mins ago</span>
                   </div>
                   <div className="flex items-center justify-between text-xs font-semibold py-3">
                      <span className="text-blue-200 uppercase tracking-wider">Server Region</span>
                      <span className="text-white">Mumbai, IN</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  )
}
