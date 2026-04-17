import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bus, ArrowRight, ArrowLeftRight } from 'lucide-react'
import { Select, Input } from '../components/common/UI'

const CITIES = ['Chennai','Bangalore','Mumbai','Delhi','Hyderabad','Coimbatore','Goa','Jaipur','Pune','Mysore','Agra','Vijayawada']

export default function BusSearchPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ source: '', destination: '', date: '' })
  const today = new Date().toISOString().split('T')[0]

  const swap = () => setForm(p => ({ ...p, source: p.destination, destination: p.source }))

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/buses/results?source=${form.source}&destination=${form.destination}&date=${form.date}`)
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] dark:bg-[#0f0f12]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center shadow-lg mb-4" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            <Bus size={32} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Search Bus Tickets</h1>
          <p className="text-gray-500 dark:text-gray-400">Find and book bus tickets at the best prices</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-purple-100 dark:border-purple-900/40 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Select label="From (Source City)" value={form.source} onChange={e => setForm(p => ({...p, source: e.target.value}))} required>
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <button type="button" onClick={swap} className="mb-0.5 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:bg-purple-900/20 hover:border-purple-300 transition-colors text-gray-500 dark:text-gray-400 hover:text-purple-600">
                <ArrowLeftRight size={18} />
              </button>
              <div className="flex-1">
                <Select label="To (Destination City)" value={form.destination} onChange={e => setForm(p => ({...p, destination: e.target.value}))} required>
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
            </div>

            <Input label="Travel Date" type="date" min={today} value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} required />

            <button type="submit" className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg text-base" style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)' }}>
              Search Buses <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Popular Routes</p>
            <div className="flex flex-wrap gap-2">
              {[['Chennai','Bangalore'],['Delhi','Jaipur'],['Mumbai','Pune'],['Bangalore','Goa']].map(([s,d]) => (
                <button key={`${s}-${d}`} onClick={() => setForm({source:s, destination:d, date:today})}
                  className="text-xs px-4 py-2 rounded-full font-semibold border-2 border-purple-200 text-purple-700 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all">
                  {s} → {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
