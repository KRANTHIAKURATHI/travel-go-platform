import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { packageAPI, packageBookingAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { MapPin, Clock, Users, CheckCircle, X, ArrowLeft, Star, Calendar } from 'lucide-react'
import { LoadingScreen, Alert, Button, Input, Badge } from '../components/common/UI'

export default function PackageDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingForm, setBookingForm] = useState({ num_participants: 1, travel_date: '', special_requests: '', passenger_name: user?.name || '', passenger_phone: '', passenger_email: user?.email || '' })
  const [booking, setBooking] = useState(false)
  const [success, setSuccess] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    packageAPI.getById(id).then(res => { setPkg(res.data.package); setLoading(false) }).catch(() => { setError('Package not found'); setLoading(false) })
  }, [id])

  const total = pkg ? parseFloat(pkg.price_per_person) * bookingForm.num_participants : 0

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setBooking(true); setError('')
    try {
      const res = await packageBookingAPI.create({ package_id: id, ...bookingForm, total_amount: total })
      setSuccess(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed')
    } finally { setBooking(false) }
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) return <LoadingScreen />
  if (!pkg) return <div className="p-8 text-center text-gray-500">Package not found</div>

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Tour Booked!</h2>
          <p className="text-gray-500 mb-6">Your tour package has been confirmed</p>
          <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 mb-6 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Booking Ref</span><span className="font-bold text-purple-600">{success.booking?.booking_ref}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Package</span><span className="font-semibold">{pkg.title}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Participants</span><span>{bookingForm.num_participants}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount Paid</span><span className="font-bold text-green-600">₹{total.toLocaleString()}</span></div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/bookings')}>My Bookings</Button>
            <Button className="flex-1" onClick={() => navigate('/packages')}>More Packages</Button>
          </div>
        </div>
      </div>
    )
  }

  const img = pkg.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={img} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button onClick={() => navigate('/packages')} className="absolute top-4 left-4 bg-white/20 backdrop-blur text-white px-3 py-2 rounded-xl flex items-center gap-1.5 text-sm hover:bg-white/30 transition-colors">
          <ArrowLeft size={15} /> Back
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Badge color="saffron">{pkg.category}</Badge>
              {pkg.is_featured && <Badge color="ocean">⭐ Featured</Badge>}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">{pkg.title}</h1>
            <p className="text-white/80 flex items-center gap-1"><MapPin size={14}/> {pkg.destination}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              [Clock, `${pkg.duration_days} Days`, 'Duration'],
              [Users, `${pkg.available_slots}`, 'Slots Left'],
              [Star, pkg.difficulty, 'Difficulty'],
              [Calendar, pkg.start_date || 'Flexible', 'Start Date'],
            ].map(([Icon, val, label]) => (
              <div key={label}>
                <Icon size={20} className="mx-auto text-purple-600 mb-1" />
                <div className="font-semibold text-gray-900 text-sm capitalize">{val}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">About This Package</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{pkg.description}</p>
          </div>

          {/* Inclusions/Exclusions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-green-500" />Inclusions</h3>
              <ul className="space-y-2">
                {(pkg.inclusions || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><X size={16} className="text-red-400" />Exclusions</h3>
              <ul className="space-y-2">
                {(pkg.exclusions || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <X size={14} className="text-red-300 mt-0.5 shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Booking */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-purple-600">₹{parseFloat(pkg.price_per_person).toLocaleString()}</div>
              <div className="text-sm text-gray-400">per person</div>
            </div>

            {!showForm ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between"><span>Duration:</span><span className="font-medium">{pkg.duration_days} days</span></div>
                  <div className="flex justify-between"><span>Available slots:</span><span className="font-medium text-green-600">{pkg.available_slots}</span></div>
                  <div className="flex justify-between"><span>Max group:</span><span className="font-medium">{pkg.max_participants}</span></div>
                </div>
                <Button className="w-full" size="lg" onClick={() => { if (!user) navigate('/login'); else setShowForm(true) }}>
                  Book Now
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-3">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">No. of Participants</label>
                  <select value={bookingForm.num_participants} onChange={e => setBookingForm(p => ({...p, num_participants: parseInt(e.target.value)}))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                    {Array.from({length: Math.min(pkg.available_slots, 10)}, (_,i) => i+1).map(n => <option key={n} value={n}>{n} Person{n>1?'s':''}</option>)}
                  </select>
                </div>
                <Input label="Travel Date" type="date" min={today} value={bookingForm.travel_date} onChange={e => setBookingForm(p => ({...p, travel_date: e.target.value}))} required />
                <Input label="Your Name" value={bookingForm.passenger_name} onChange={e => setBookingForm(p => ({...p, passenger_name: e.target.value}))} required />
                <Input label="Email" type="email" value={bookingForm.passenger_email} onChange={e => setBookingForm(p => ({...p, passenger_email: e.target.value}))} required />
                <Input label="Phone" type="tel" value={bookingForm.passenger_phone} onChange={e => setBookingForm(p => ({...p, passenger_phone: e.target.value}))} />
                <textarea value={bookingForm.special_requests} onChange={e => setBookingForm(p => ({...p, special_requests: e.target.value}))} placeholder="Special requests (optional)" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total ({bookingForm.num_participants} × ₹{parseFloat(pkg.price_per_person).toLocaleString()})</span>
                    <span className="text-purple-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <Button type="submit" loading={booking} className="w-full">Confirm & Pay</Button>
                <button type="button" onClick={() => setShowForm(false)} className="w-full text-sm text-gray-400 hover:text-gray-600">Cancel</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
