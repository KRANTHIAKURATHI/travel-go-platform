import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { packageAPI } from '../services/api'
import { MapPin, Clock, Users, Star, SlidersHorizontal, Search } from 'lucide-react'
import { LoadingScreen, Alert, Badge } from '../components/common/UI'

const CATEGORIES = ['', 'adventure', 'cultural', 'beach', 'pilgrimage', 'wildlife', 'honeymoon', 'family']
const CAT_LABELS = { '': 'All', adventure: 'Adventure', cultural: 'Cultural', beach: 'Beach', pilgrimage: 'Pilgrimage', wildlife: 'Wildlife', honeymoon: 'Honeymoon', family: 'Family' }
const CAT_COLORS = { adventure: 'purple', cultural: 'purple', beach: 'purple', pilgrimage: 'gray', wildlife: 'green', honeymoon: 'purple', family: 'green' }

function PackageCard({ pkg, onClick }) {
  const img = pkg.images?.[0] || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format`
  return (
    <div onClick={onClick} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 card-hover cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img src={img} alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1">
          <Badge color={CAT_COLORS[pkg.category] || 'gray'}>{CAT_LABELS[pkg.category] || pkg.category}</Badge>
          {pkg.is_featured && <Badge color="saffron">⭐ Featured</Badge>}
        </div>
        <div className="absolute bottom-3 left-3 text-white text-sm font-bold flex items-center gap-1">
          <MapPin size={13} /> {pkg.destination}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-snug line-clamp-2">{pkg.title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">{pkg.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1"><Clock size={11} /> {pkg.duration_days} Days</span>
          <span className="flex items-center gap-1"><Users size={11} /> {pkg.available_slots} slots left</span>
          <span className="flex items-center gap-1 capitalize">{pkg.difficulty}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Starting from</div>
            <div className="text-xl font-bold text-purple-600">₹{parseFloat(pkg.price_per_person).toLocaleString()}<span className="text-xs font-normal text-gray-400">/person</span></div>
          </div>
          <div className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl group-hover:bg-purple-600 transition-colors">View Details</div>
        </div>
      </div>
    </div>
  )
}

export default function PackagesPage() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true); setError('')
      try {
        const params = { limit: 20 }
        if (category) params.category = category
        if (maxPrice) params.max_price = maxPrice
        const res = await packageAPI.getAll(params)
        setPackages(res.data.packages || [])
        setTotal(res.data.total || 0)
      } catch { setError('Failed to load packages') }
      finally { setLoading(false) }
    }
    fetch()
  }, [category, maxPrice])

  const filtered = search ? packages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.destination.toLowerCase().includes(search.toLowerCase())) : packages

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold mb-2">Explore India's Best Tour Packages</h1>
          <p className="text-white mb-6">Handcrafted experiences for every traveler</p>
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destination or package name..." className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300 shadow" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${category === c ? 'bg-purple-600 text-white shadow' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}>
                {CAT_LABELS[c]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-xs text-gray-500 dark:text-gray-400">Max Price:</label>
            <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-900 focus:outline-none">
              <option value="">Any</option>
              {[10000, 15000, 20000, 30000, 50000].map(p => <option key={p} value={p}>₹{p.toLocaleString()}</option>)}
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{filtered.length} packages found</p>

        {error && <Alert type="error" message={error} />}
        {loading ? <LoadingScreen /> : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="font-semibold text-gray-700">No packages found</h3>
            <p className="text-gray-400 text-sm mt-1">Try different filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} onClick={() => navigate(`/packages/${pkg.id}`)} />)}
          </div>
        )}
      </div>
    </div>
  )
}
