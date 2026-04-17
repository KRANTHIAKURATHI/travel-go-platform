import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import { LoadingScreen, Alert, StatusBadge, Badge } from '../../components/common/UI'
import { format } from 'date-fns'

export default function AdminBookings() {
  const [tab, setTab] = useState('bus')
  const [busBookings, setBusBookings] = useState([])
  const [pkgBookings, setPkgBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [b, p] = await Promise.all([adminAPI.getAllBookings(), adminAPI.getAllPackageBookings()])
        setBusBookings(b.data.bookings || [])
        setPkgBookings(p.data.bookings || [])
      } catch { setError('Failed to load') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <AdminLayout title="All Bookings">
      <div className="space-y-5">
        {error && <Alert type="error" message={error} />}

        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100">Booking Management</h2>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setTab('bus')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab==='bus' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-500 dark:text-gray-400'}`}>
              Bus ({busBookings.length})
            </button>
            <button onClick={() => setTab('pkg')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab==='pkg' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-500 dark:text-gray-400'}`}>
              Tours ({pkgBookings.length})
            </button>
          </div>
        </div>

        {loading ? <LoadingScreen /> : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-purple-100 dark:border-purple-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              {tab === 'bus' ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>{['Ref','User','Bus','Route','Seats','Date','Amount','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {busBookings.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:bg-gray-800 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-purple-600 font-semibold">{b.booking_ref}</td>
                        <td className="px-4 py-3"><div className="font-medium text-gray-900 dark:text-gray-100">{b.users?.name}</div><div className="text-xs text-gray-400">{b.users?.email}</div></td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{b.buses?.bus_name}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{b.buses?.routes?.source} → {b.buses?.routes?.destination}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{b.seat_numbers?.join(', ')}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{b.travel_date}</td>
                        <td className="px-4 py-3 font-semibold text-green-600">₹{parseFloat(b.total_amount||0).toLocaleString()}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.booking_status} /></td>
                      </tr>
                    ))}
                    {busBookings.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No bus bookings yet</td></tr>}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>{['Ref','User','Package','Destination','Participants','Travel Date','Amount','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pkgBookings.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:bg-gray-800 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-purple-600 font-semibold">{b.booking_ref}</td>
                        <td className="px-4 py-3"><div className="font-medium">{b.users?.name}</div><div className="text-xs text-gray-400">{b.users?.email}</div></td>
                        <td className="px-4 py-3 text-gray-700 max-w-[150px] truncate">{b.tour_packages?.title}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{b.tour_packages?.destination}</td>
                        <td className="px-4 py-3 text-center font-medium">{b.num_participants}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{b.travel_date}</td>
                        <td className="px-4 py-3 font-semibold text-green-600">₹{parseFloat(b.total_amount||0).toLocaleString()}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.booking_status} /></td>
                      </tr>
                    ))}
                    {pkgBookings.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No tour bookings yet</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
