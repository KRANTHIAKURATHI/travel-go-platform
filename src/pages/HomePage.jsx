import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bus, MapPin, ArrowRight, Star, Shield,
  Clock, Headphones, ChevronRight, Ticket, Sparkles
} from 'lucide-react'
import { packageAPI } from '../services/api'

const CITIES = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Coimbatore', 'Goa', 'Jaipur', 'Pune', 'Mysore', 'Agra', 'Vijayawada']

const FEATURED_PACKAGES = [
  { id: '7122f80e-c845-47bb-8278-fe36b329fd79', title: 'Kerala Backwaters Bliss', destination: 'Kerala', days: 5, price: 18500, category: 'Beach', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80&auto=format&fit=crop' },
  { id: '34045061-5b95-4f0f-8d3e-fc2c00907c52', title: 'Rajasthan Royal Heritage', destination: 'Rajasthan', days: 7, price: 28000, category: 'Cultural', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80&auto=format&fit=crop' },
  { id: '2b95d830-fa89-4225-88cd-dbb0acd207bc', title: 'Manali Adventure Trek', destination: 'Himachal', days: 6, price: 22000, category: 'Adventure', img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80&auto=format&fit=crop' },
  { id: '2cfaa811-83c7-4647-9de2-270bb9099961', title: 'Andaman Island Escape', destination: 'Andaman', days: 6, price: 32000, category: 'Beach', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('bus')
  const [busForm, setBusForm] = useState({ source: '', destination: '', date: '' })
  const [featuredPackages, setFeaturedPackages] = useState([])
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await packageAPI.getAll({ limit: 4 })
        // Filter featured or just take the first 4 for now
        const featured = res.data.packages.filter(p => p.is_featured)
        setFeaturedPackages(featured.length > 0 ? featured : res.data.packages.slice(0, 4))
      } catch (err) {
        console.error('Failed to fetch packages:', err)
      }
    }
    fetchPackages()
  }, [])


  const handleBusSearch = (e) => {
    e.preventDefault()
    if (!busForm.source || !busForm.destination || !busForm.date) return
    navigate(`/buses/results?source=${busForm.source}&destination=${busForm.destination}&date=${busForm.date}`)
  }

  const navigateToPackages = () => {
    navigate('/packages');
  }

  const navigateToPackageDetails = (id) => {
    navigate(`/packages/${id}`);
  }

  return (
    <div className="animate-in fade-in duration-700">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#1e0a3c 0%,#3b0764 40%,#6d28d9 80%,#7c3aed 100%)', minHeight: 580 }}>
        {/* Decorative Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle,#c084fc,transparent)', transform: 'translate(20%,-20%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-[80px] opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle,#7c3aed,transparent)', transform: 'translate(-20%,20%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-purple-100 text-sm font-medium mb-6">
              <Sparkles size={14} className="text-purple-300 animate-pulse" /> India's Premium Travel Platform
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Your Next Adventure<br />
              <span style={{ background: 'linear-gradient(135deg,#e9d5ff,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Starts Here
              </span>
            </h1>
            <p className="text-purple-100 text-lg max-w-xl mx-auto opacity-90">Seamless bus bookings and curated tour experiences designed for the modern traveler.</p>
          </div>

          {/* Mode toggle */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-1 bg-black/20 backdrop-blur-xl rounded-2xl p-1.5 mb-6 w-fit mx-auto border border-white/10 shadow-2xl">
              <button onClick={() => setMode('bus')} className={`flex items-center gap-2 px-10 py-4 rounded-xl text-base font-bold transition-all duration-300 ${mode === 'bus' ? 'bg-white dark:bg-gray-900 text-purple-900 shadow-xl scale-105' : 'text-white hover:bg-white/10'}`}>
                <Bus size={20} /> Bus Tickets
              </button>
              <button onClick={() => setMode('tour')} className={`flex items-center gap-2 px-10 py-4 rounded-xl text-base font-bold transition-all duration-300 ${mode === 'tour' ? 'bg-white dark:bg-gray-900 text-purple-900 shadow-xl scale-105' : 'text-white hover:bg-white/10'}`}>
                <MapPin size={20} /> Tour Packages
              </button>
            </div>

            {mode === 'bus' ? (
              <form onSubmit={handleBusSearch} className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 border border-purple-100 dark:border-purple-900/40 transition-all duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[['From', 'source'], ['To', 'destination']].map(([lbl, key]) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-purple-900/40 dark:text-purple-300/60 uppercase tracking-widest mb-2 px-1">{lbl}</label>
                      <select value={busForm[key]} onChange={e => setBusForm(p => ({ ...p, [key]: e.target.value }))} required
                        className="w-full px-5 py-4.5 rounded-2xl border-2 border-gray-50 dark:border-gray-700 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100 text-base bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all font-medium appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.25rem' }}>
                        <option value="">Select City</option>
                        {CITIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold text-purple-900/40 dark:text-purple-300/60 uppercase tracking-widest mb-2 px-1">Journey Date</label>
                    <input type="date" min={today} value={busForm.date} onChange={e => setBusForm(p => ({ ...p, date: e.target.value }))} required
                      className="w-full px-5 py-4.5 rounded-2xl border-2 border-gray-50 dark:border-gray-700 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100 text-base bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all font-medium" />
                  </div>
                </div>
                <button type="submit" className="mt-8 w-full py-5 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95 text-lg shadow-[0_12px_30px_rgba(124,58,237,0.4)]" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                  Find Available Buses <ArrowRight size={22} />
                </button>
              </form>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-10 text-center border border-purple-100 dark:border-purple-900/40 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Ticket size={32} className="text-purple-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 font-semibold text-lg">Discover exclusive, handcrafted tour experiences</p>
                <button onClick={navigateToPackages} className="py-4 px-10 rounded-2xl font-black text-white flex items-center gap-3 mx-auto transition-all hover:scale-105 shadow-xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                  Explore All Packages <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-purple-50 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['2.5M+', 'Travelers'], ['800+', 'Daily Routes'], ['150+', 'Tour Deals'], ['24/7', 'Live Help']].map(([val, label]) => (
            <div key={label} className="group">
              <div className="text-3xl font-black text-purple-600 group-hover:scale-110 transition-transform">{val}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Packages ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-purple-600 text-xs font-black uppercase tracking-[0.2em] mb-3">
              <div className="w-8 h-[2px] bg-purple-600" /> Handpicked Tours
            </div>
            <h2 className="font-display text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Featured Destinations</h2>
          </div>
          <button onClick={navigateToPackages} className="group flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-5 py-2.5 rounded-full hover:bg-purple-600 hover:text-white transition-all">
            View All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(featuredPackages.length > 0 ? featuredPackages : FEATURED_PACKAGES).map((pkg) => (
            <div key={pkg.id || pkg.title} onClick={() => navigateToPackageDetails(pkg.id)}
              className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-purple-100 dark:border-purple-900/40 cursor-pointer transition-all duration-500 hover:-translate-y-3"
              style={{ boxShadow: '0 10px 30px rgba(109,40,217,0.04)' }}>

              <div className="relative h-56 overflow-hidden bg-purple-50 dark:bg-purple-900/10">
                <img src={pkg.images?.[0] || pkg.img} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white dark:bg-gray-900/95 backdrop-blur text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm text-purple-700">
                    {pkg.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-sm font-bold flex items-center gap-1.5">
                  <MapPin size={14} className="text-purple-300" /> {pkg.destination}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight mb-4 line-clamp-2 h-10 group-hover:text-purple-700 transition-colors">{pkg.title}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Starting at</div>
                    <div className="font-black text-purple-600 text-xl">₹{parseFloat(pkg.price_per_person || pkg.price).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 text-[10px] font-black px-3 py-2 rounded-xl">
                    <Clock size={12} /> {pkg.duration_days || pkg.days}D / {(pkg.duration_days || pkg.days) - 1}N
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Routes ── */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-black text-gray-900 dark:text-gray-100">Popular Bus Routes</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Direct connections at the most affordable prices</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[['Chennai', 'Bangalore'], ['Delhi', 'Jaipur'], ['Mumbai', 'Pune'], ['Bangalore', 'Goa'], ['Hyderabad', 'Vijayawada'], ['Chennai', 'Hyderabad'], ['Delhi', 'Agra'], ['Mumbai', 'Goa'], ['Chennai', 'Coimbatore'], ['Bangalore', 'Mysore']].map(([s, d]) => (
              <Link key={`${s}-${d}`} to={`/buses/results?source=${s}&destination=${d}&date=${today}`}
                className="bg-white dark:bg-gray-900 rounded-2xl px-5 py-4 text-left border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all group active:scale-95 block">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter mb-1">From {s}</div>
                <div className="text-purple-600 font-black text-sm flex items-center gap-2">
                  To {d} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-black text-gray-900 dark:text-gray-100">Why TravelGo?</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium max-w-lg mx-auto">Experience the standard of travel that millions of users rely on every single day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            [Shield, 'Secure Portal', 'Bank-grade SSL encryption for all your transactions.'],
            [Clock, 'Instant Tix', 'Get your digital tickets on WhatsApp and Email instantly.'],
            [Star, 'Price Match', 'Found it cheaper? We will match the price, no questions.'],
            [Headphones, 'Human Help', 'Talk to real travel experts 24/7, not just robots.'],
          ].map(([Icon, title, desc]) => (
            <div key={title} className="group p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:border-purple-200 hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <Icon size={28} className="text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-gray-100 mb-3 text-lg tracking-tight">{title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}