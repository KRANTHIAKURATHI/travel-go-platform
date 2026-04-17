import { Link } from 'react-router-dom'
import { Bus, MapPin, Mail, Phone, Instagram, Twitter, Facebook, Ticket } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="text-gray-300 mt-auto" style={{ background:'linear-gradient(180deg,#2e1065 0%,#1e0a3c 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-purple-500/30 border border-purple-400/30 flex items-center justify-center">
              <Ticket size={18} className="text-purple-300" />
            </div>
            <span className="font-display font-bold text-xl text-white">TravelGo</span>
          </div>
          <p className="text-sm leading-relaxed text-purple-300">Your one-stop platform for bus tickets and tour packages across India.</p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-400/20 flex items-center justify-center hover:bg-purple-500/40 transition-colors">
                <Icon size={15} className="text-purple-300" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/buses', 'Bus Tickets'], ['/packages', 'Tour Packages'], ['/bookings', 'My Bookings']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-purple-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Popular Routes</h4>
          <ul className="space-y-2 text-sm">
            {[
              ['Chennai', 'Bangalore'],
              ['Delhi', 'Jaipur'],
              ['Mumbai', 'Pune'],
              ['Bangalore', 'Goa'],
              ['Hyderabad', 'Vijayawada']
            ].map(([s, d]) => (
              <li key={`${s}-${d}`}>
                <Link 
                  to={`/buses/results?source=${s}&destination=${d}&date=${new Date().toISOString().split('T')[0]}`} 
                  className="flex items-center gap-1.5 hover:text-purple-400 transition-colors"
                >
                  <MapPin size={11} className="text-purple-400" />
                  {s} → {d}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail size={14} className="text-purple-400" /> support@travelgo.in</li>
            <li className="flex items-center gap-2"><Phone size={14} className="text-purple-400" /> +91 9800-TRAVEL</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-purple-800/50 py-5 text-center text-sm text-purple-500">
        © 2025 TravelGo. All rights reserved.
      </div>
    </footer>
  )
}
