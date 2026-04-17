import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { busAPI, bookingAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Bus, Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import { LoadingScreen, Alert, Button, Input, Badge } from '../components/common/UI'
import { format } from 'date-fns'

export default function SeatSelectionPage() {
  const { busId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [bus, setBus] = useState(null)
  const [seats, setSeats] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [passenger, setPassenger] = useState({ name: user?.name || '', phone: '', email: user?.email || '' })
  const [step, setStep] = useState(1) // 1=seats, 2=passenger, 3=payment

  useEffect(() => {
    const load = async () => {
      try {
        const [busRes, seatsRes] = await Promise.all([busAPI.getById(busId), busAPI.getSeats(busId)])
        setBus(busRes.data.bus)
        setSeats(seatsRes.data.seats || [])
      } catch { setError('Failed to load bus details') }
      finally { setLoading(false) }
    }
    load()
  }, [busId])

  const toggleSeat = (seat) => {
    if (!seat.is_available) return
    setSelected(prev =>
      prev.find(s => s.id === seat.id) ? prev.filter(s => s.id !== seat.id) : [...prev, seat]
    )
  }

  const total = selected.length * (bus ? parseFloat(bus.price_per_seat) : 0)

  const handleBook = async () => {
    if (!passenger.name || !passenger.email) { setError('Please fill in passenger details'); return }
    setBooking(true); setError('')
    try {
      const res = await bookingAPI.create({
        bus_id: busId,
        seat_ids: selected.map(s => s.id),
        seat_numbers: selected.map(s => s.seat_number),
        total_amount: total,
        passenger_name: passenger.name,
        passenger_phone: passenger.phone,
        passenger_email: passenger.email,
        travel_date: params.get('date'),
      })
      setSuccess(res.data)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.')
    } finally { setBooking(false) }
  }

  if (loading) return <LoadingScreen />

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 text-center animate-fade-up">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Booking Confirmed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Your bus ticket has been booked successfully</p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-left space-y-2 mb-6 text-sm">
            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Booking Ref</span><span className="font-bold text-purple-600">{success.booking?.booking_ref}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Seats</span><span className="font-semibold">{success.booking?.seat_numbers?.join(', ')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Amount Paid</span><span className="font-bold text-green-600">₹{parseFloat(success.booking?.total_amount).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Transaction ID</span><span className="font-mono text-xs">{success.transaction_id}</span></div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/bookings')}>My Bookings</Button>
            <Button className="flex-1" onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    )
  }

  const dep = bus ? new Date(bus.departure_time) : null
  const arr = bus ? new Date(bus.arrival_time) : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 mb-2">
            <ArrowLeft size={15} /> Back
          </button>
          {bus && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-purple">
                <Bus size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-gray-900 dark:text-gray-100">{bus.bus_name} — {bus.routes?.source} → {bus.routes?.destination}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{dep && format(dep,'HH:mm')} → {arr && format(arr,'HH:mm')} · {bus.bus_type}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seat map */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Your Seats</h2>

              {/* Legend */}
              <div className="flex items-center gap-4 mb-5 text-xs">
                {[
                  ['bg-purple-50 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800', 'Available'],
                  ['bg-purple-600 border-purple-800', 'Selected'],
                  ['bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700', 'Booked']
                ].map(([cls, label]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-md border-2 ${cls}`} />
                    <span className="text-gray-500 dark:text-gray-400">{label}</span>
                  </div>
                ))}
              </div>

              {/* Seat grid */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="text-center text-xs text-gray-400 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  🚌 Driver's Side (Front)
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, 40px)' }}>
                  {seats.map(seat => (
                    <button key={seat.id} onClick={() => toggleSeat(seat)}
                      className={`seat ${!seat.is_available ? 'booked' : selected.find(s => s.id === seat.id) ? 'selected' : 'available'}`}
                      disabled={!seat.is_available}
                      title={`Seat ${seat.seat_number}`}
                    >
                      {seat.seat_number}
                    </button>
                  ))}
                </div>
              </div>

              {selected.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setStep(2)}>Continue ({selected.length} seat{selected.length > 1 ? 's' : ''})</Button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Passenger Details</h2>
              {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
              <div className="space-y-4">
                <Input label="Passenger Name" value={passenger.name} onChange={e => setPassenger(p => ({...p, name: e.target.value}))} required />
                <Input label="Phone Number" type="tel" value={passenger.phone} onChange={e => setPassenger(p => ({...p, phone: e.target.value}))} />
                <Input label="Email" type="email" value={passenger.email} onChange={e => setPassenger(p => ({...p, email: e.target.value}))} required />
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleBook} loading={booking} className="flex-1">
                  Pay ₹{total.toLocaleString()} & Confirm
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Booking Summary</h3>
            {bus && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Route</span><span className="font-medium text-right">{bus.routes?.source} → {bus.routes?.destination}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Bus</span><span className="font-medium">{bus.bus_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Type</span><Badge color="ocean">{bus.bus_type}</Badge></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Date</span><span className="font-medium">{params.get('date')}</span></div>
                {dep && <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Departure</span><span className="font-medium">{format(dep,'HH:mm')}</span></div>}
                <hr className="border-gray-100 dark:border-gray-800" />
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Seats</span>
                  <span className="font-medium">{selected.length > 0 ? selected.map(s => s.seat_number).join(', ') : 'None selected'}</span>
                </div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Price/seat</span><span>₹{bus.price_per_seat}</span></div>
                <hr className="border-gray-100 dark:border-gray-800" />
                <div className="flex justify-between text-base font-bold"><span>Total</span><span className="text-purple-600">₹{total.toLocaleString()}</span></div>
              </div>
            )}
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 flex items-start gap-2">
              <CheckCircle size={14} className="mt-0.5 shrink-0" />
              Instant confirmation + simulated payment
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
