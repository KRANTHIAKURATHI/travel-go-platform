import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookingAPI, packageBookingAPI } from '../services/api'
import { Bus, MapPin, Calendar, XCircle, Clock } from 'lucide-react'
import { LoadingScreen, Alert, Badge, StatusBadge, Button } from '../components/common/UI'
import { format } from 'date-fns'

function BusBookingCard({ booking, onCancel }) {
  const bus = booking.buses
  const route = bus?.routes
  const dep = bus?.departure_time ? new Date(bus.departure_time) : null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <Bus size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{bus?.bus_name || 'Bus Booking'}</h3>
            <p className="text-xs text-gray-400">{route?.source} → {route?.destination}</p>
          </div>
        </div>
        <StatusBadge status={booking.booking_status} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
        <div><div className="text-xs text-gray-400">Booking Ref</div><div className="font-semibold text-purple-600">{booking.booking_ref}</div></div>
        <div><div className="text-xs text-gray-400">Travel Date</div><div className="font-medium">{booking.travel_date}</div></div>
        <div><div className="text-xs text-gray-400">Seats</div><div className="font-medium">{booking.seat_numbers?.join(', ')}</div></div>
        <div><div className="text-xs text-gray-400">Amount</div><div className="font-bold text-green-600">₹{parseFloat(booking.total_amount).toLocaleString()}</div></div>
      </div>
      {dep && <div className="text-xs text-gray-400 flex items-center gap-1 mb-3"><Clock size={11}/> Departure: {format(dep, 'dd MMM yyyy, HH:mm')}</div>}
      {booking.booking_status === 'confirmed' && (
        <button onClick={() => onCancel(booking.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition-colors">
          <XCircle size={13} /> Cancel Booking
        </button>
      )}
    </div>
  )
}

function PackageBookingCard({ booking, onCancel }) {
  const pkg = booking.tour_packages
  const img = pkg?.images?.[0]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
      {img && <img src={img} alt={pkg.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 leading-snug">{pkg?.title}</h3>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10}/>{pkg?.destination}</p>
          </div>
          <StatusBadge status={booking.booking_status} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
          <div><div className="text-xs text-gray-400">Booking Ref</div><div className="font-semibold text-purple-600">{booking.booking_ref}</div></div>
          <div><div className="text-xs text-gray-400">Travel Date</div><div className="font-medium">{booking.travel_date}</div></div>
          <div><div className="text-xs text-gray-400">Participants</div><div className="font-medium">{booking.num_participants}</div></div>
          <div><div className="text-xs text-gray-400">Amount</div><div className="font-bold text-green-600">₹{parseFloat(booking.total_amount).toLocaleString()}</div></div>
        </div>
        {booking.booking_status === 'confirmed' && (
          <button onClick={() => onCancel(booking.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium">
            <XCircle size={13}/> Cancel Booking
          </button>
        )}
      </div>
    </div>
  )
}

export default function BookingHistoryPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('bus')
  const [busBookings, setBusBookings] = useState([])
  const [pkgBookings, setPkgBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelMsg, setCancelMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [bRes, pRes] = await Promise.all([
        bookingAPI.getByUser(user.id),
        packageBookingAPI.getByUser(user.id)
      ])
      setBusBookings(bRes.data.bookings || [])
      setPkgBookings(pRes.data.bookings || [])
    } catch { setError('Failed to load bookings') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const cancelBus = async (id) => {
    if (!confirm('Cancel this booking? A refund will be processed.')) return
    try {
      await bookingAPI.cancel(id)
      setCancelMsg('Booking cancelled. Refund initiated.')
      load()
    } catch (err) { setError(err.response?.data?.error || 'Cancellation failed') }
  }

  const cancelPkg = async (id) => {
    if (!confirm('Cancel this tour booking?')) return
    try {
      await packageBookingAPI.cancel(id)
      setCancelMsg('Tour booking cancelled. Refund initiated.')
      load()
    } catch (err) { setError(err.response?.data?.error || 'Cancellation failed') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {cancelMsg && <div className="mb-4"><Alert type="success" message={cancelMsg} onClose={() => setCancelMsg('')} /></div>}
        {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 w-fit mb-6">
          <button onClick={() => setTab('bus')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'bus' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:text-gray-800'}`}>
            <Bus size={15}/> Bus Tickets
            <span className={`text-xs rounded-full px-1.5 py-0.5 ${tab === 'bus' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{busBookings.length}</span>
          </button>
          <button onClick={() => setTab('pkg')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'pkg' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:text-gray-800'}`}>
            <MapPin size={15}/> Tour Packages
            <span className={`text-xs rounded-full px-1.5 py-0.5 ${tab === 'pkg' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{pkgBookings.length}</span>
          </button>
        </div>

        {loading ? <LoadingScreen /> : (
          <>
            {tab === 'bus' && (
              busBookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <Bus size={48} className="mx-auto text-gray-200 mb-3" />
                  <h3 className="font-semibold text-gray-600">No bus bookings yet</h3>
                  <p className="text-gray-400 text-sm mt-1 mb-4">Book a bus ticket to see it here</p>
                  <Button onClick={() => window.location.href='/buses'}>Search Buses</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {busBookings.map(b => <BusBookingCard key={b.id} booking={b} onCancel={cancelBus} />)}
                </div>
              )
            )}
            {tab === 'pkg' && (
              pkgBookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <MapPin size={48} className="mx-auto text-gray-200 mb-3" />
                  <h3 className="font-semibold text-gray-600">No tour bookings yet</h3>
                  <p className="text-gray-400 text-sm mt-1 mb-4">Explore amazing tour packages</p>
                  <Button variant="ocean" onClick={() => window.location.href='/packages'}>Browse Packages</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {pkgBookings.map(b => <PackageBookingCard key={b.id} booking={b} onCancel={cancelPkg} />)}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}
