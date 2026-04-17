import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { busAPI } from '../services/api'
import { Bus, Clock, Wifi, Zap, ArrowRight, Filter, Star } from 'lucide-react'
import { LoadingScreen, Alert, Badge } from '../components/common/UI'
import { format } from 'date-fns'

function BusCard({ bus, onSelect }) {
  const dep = new Date(bus.departure_time)
  const arr = new Date(bus.arrival_time)
  const dur = Math.round((arr - dep) / 60000)
  const hrs = Math.floor(dur / 60)
  const mins = dur % 60

  const typeColors = { 'Volvo': 'ocean', 'Sleeper': 'saffron', 'AC': 'green', 'Semi-Sleeper': 'gray', 'Non-AC': 'gray' }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <Bus size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{bus.bus_name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge color={typeColors[bus.bus_type] || 'gray'}>{bus.bus_type}</Badge>
              <span className="text-xs text-gray-400">{bus.bus_number}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{format(dep, 'HH:mm')}</div>
            <div className="text-xs text-gray-400">{bus.routes?.source}</div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> {hrs}h {mins}m</div>
            <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-700 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-600 rounded-full -mt-px" />
              <ArrowRight size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{format(arr, 'HH:mm')}</div>
            <div className="text-xs text-gray-400">{bus.routes?.destination}</div>
          </div>
        </div>

        {bus.amenities?.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {bus.amenities.slice(0,4).map(a => (
              <span key={a} className="flex items-center gap-1 text-xs bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                {a === 'WiFi' ? <Wifi size={10}/> : a === 'USB Charging' ? <Zap size={10}/> : <Star size={10}/>} {a}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 shrink-0">
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">₹{parseFloat(bus.price_per_seat).toLocaleString()}</div>
          <div className="text-xs text-gray-400">per seat</div>
        </div>
        <button onClick={() => onSelect(bus)} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          View Seats
        </button>
      </div>
    </div>
  )
}

export default function BusResultsPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const source = params.get('source') || ''
  const destination = params.get('destination') || ''
  const date = params.get('date') || ''

  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true); setError('')
      try {
        const res = await busAPI.search({ source, destination })
        setBuses(res.data.buses || [])
      } catch (err) {
        setError('Failed to fetch buses. Please try again.')
      } finally { setLoading(false) }
    }
    if (source && destination) fetch()
  }, [source, destination])

  const filtered = filter ? buses.filter(b => b.bus_type === filter) : buses

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Header bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100">{source} → {destination}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{date} • {filtered.length} buses found</p>
          </div>
          <button onClick={() => navigate('/buses')} className="text-sm text-purple-600 font-semibold hover:underline">Modify Search</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-5">
          <Filter size={15} className="text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mr-2">Filter:</span>
          {['', 'AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Volvo'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === t ? 'bg-purple-600 text-white shadow' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-400'}`}>
              {t || 'All'}
            </button>
          ))}
        </div>

        {loading ? <LoadingScreen /> : error ? <Alert type="error" message={error} /> : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <Bus size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-1">No buses found</h3>
            <p className="text-gray-400 text-sm">Try a different route or date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(bus => <BusCard key={bus.id} bus={bus} onSelect={b => navigate(`/buses/${b.id}/seats?source=${source}&destination=${destination}&date=${date}`)} />)}
          </div>
        )}
      </div>
    </div>
  )
}
