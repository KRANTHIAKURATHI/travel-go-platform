import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import ManagerLayout from '../../components/manager/ManagerLayout'
import { Plus, Pencil, Trash2, Bus, X, ExternalLink } from 'lucide-react'
import { LoadingScreen, Alert, Button, Input, Select, Badge } from '../../components/common/UI'
import { format } from 'date-fns'

const EMPTY_BUS = { route_id:'', bus_number:'', bus_name:'', bus_type:'AC', total_seats:40, price_per_seat:'', operator_name:'', departure_time:'', arrival_time:'' }

export default function ManagerBuses() {
  const [buses, setBuses] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | {type:'bus'|'route', data?}
  const [form, setForm] = useState(EMPTY_BUS)
  const [routeForm, setRouteForm] = useState({ source:'', destination:'', distance_km:'', estimated_duration_minutes:'' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [br, rr] = await Promise.all([adminAPI.getBuses(), adminAPI.getRoutes()])
      setBuses(br.data.buses || [])
      setRoutes(rr.data.routes || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openBusModal = (bus = null) => {
    setForm(bus ? { ...bus, departure_time: bus.departure_time?.slice(0,16), arrival_time: bus.arrival_time?.slice(0,16) } : EMPTY_BUS)
    setModal({ type: 'bus', edit: !!bus, id: bus?.id })
    setError('')
  }

  const saveBus = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (modal.edit) await adminAPI.updateBus(modal.id, form)
      else await adminAPI.createBus(form)
      setMsg(modal.edit ? 'Bus updated!' : 'Bus created!')
      setModal(null); load()
    } catch (err) { setError(err.response?.data?.error || 'Save failed') }
    finally { setSaving(false) }
  }

  const deleteBus = async (id) => {
    if (!confirm('Delete this bus?')) return
    try { await adminAPI.deleteBus(id); setMsg('Bus deleted'); load() }
    catch { setError('Delete failed') }
  }

  const saveRoute = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      await adminAPI.createRoute(routeForm)
      setMsg('Route created!'); setModal(null); load()
    } catch (err) { setError(err.response?.data?.error || 'Save failed') }
    finally { setSaving(false) }
  }

  return (
    <ManagerLayout title="Buses & Routes">
      <div className="space-y-5">
        {msg && <Alert type="success" message={msg} onClose={() => setMsg('')} />}
        {error && !modal && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-2xl font-bold text-gray-900 dark:text-gray-100 italic tracking-tight underline decoration-blue-500/30">Bus Management</h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => { setModal({ type:'route' }); setRouteForm({ source:'', destination:'', distance_km:'', estimated_duration_minutes:'' }); setError('') }}>
              <Plus size={14}/> Add Route
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => openBusModal()}>
              <Plus size={14}/> Add Bus
            </Button>
          </div>
        </div>

        {loading ? <LoadingScreen /> : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <tr>{['Bus Name','Number','Type','Route','Departure','Price','Action'].map(h => <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-blue-900/40 dark:text-blue-200/40 uppercase tracking-[0.2em] font-playfair">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {buses.map(bus => (
                    <tr key={bus.id} className="hover:bg-gray-50 dark:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 font-playfair font-bold text-gray-900 dark:text-gray-100">{bus.bus_name}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{bus.bus_number}</td>
                      <td className="px-4 py-3"><Badge color="ocean">{bus.bus_type}</Badge></td>
                      <td className="px-4 py-3">
                         <div className="flex flex-col">
                            <span className="text-gray-700 dark:text-gray-300 font-bold">{bus.routes?.source} → {bus.routes?.destination}</span>
                            <a 
                              href={`https://www.google.com/maps/dir/${bus.routes?.source}/${bus.routes?.destination}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] text-blue-500 hover:text-blue-600 font-black uppercase flex items-center gap-1 mt-0.5 tracking-tighter transition-colors"
                            >
                              <ExternalLink size={10} /> View Route Map
                            </a>
                         </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{bus.departure_time ? format(new Date(bus.departure_time), 'dd MMM, HH:mm') : '-'}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">₹{parseFloat(bus.price_per_seat || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openBusModal(bus)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 transition-colors"><Pencil size={14}/></button>
                          <button onClick={() => deleteBus(bus.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {buses.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No buses added yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Routes list */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">Active Routes ({routes.length})</h3>
          <div className="flex flex-wrap gap-2">
            {routes.map(r => (
              <span key={r.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 text-[11px] font-bold px-3 py-1.5 rounded-full text-blue-700 dark:text-blue-400 uppercase tracking-tight">
                {r.source} → {r.destination} {r.distance_km ? `• ${r.distance_km}km` : ''}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bus Modal */}
      {modal?.type === 'bus' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{modal.edit ? 'Update Bus Details' : 'Register New Bus'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 dark:text-gray-200 transition-colors"><X size={22}/></button>
            </div>
            <form onSubmit={saveBus} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <Alert type="error" message={error} />}
              <Select label="Assign Route" value={form.route_id} onChange={e => setForm(p => ({...p, route_id: e.target.value}))} required>
                <option value="">Select an active route</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.source} → {r.destination}</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Bus Name" value={form.bus_name} onChange={e => setForm(p => ({...p, bus_name: e.target.value}))} required />
                <Input label="Registration Number" placeholder="e.g. MH 12 AB 1234" value={form.bus_number} onChange={e => setForm(p => ({...p, bus_number: e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Seating Type" value={form.bus_type} onChange={e => setForm(p => ({...p, bus_type: e.target.value}))}>
                  {['AC','Non-AC','Sleeper','Semi-Sleeper','Volvo'].map(t => <option key={t}>{t}</option>)}
                </Select>
                <Input label="Total Capacity" type="number" value={form.total_seats} onChange={e => setForm(p => ({...p, total_seats: e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Departure" type="datetime-local" value={form.departure_time} onChange={e => setForm(p => ({...p, departure_time: e.target.value}))} required />
                <Input label="Arrival" type="datetime-local" value={form.arrival_time} onChange={e => setForm(p => ({...p, arrival_time: e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Fare (₹)" type="number" value={form.price_per_seat} onChange={e => setForm(p => ({...p, price_per_seat: e.target.value}))} required />
                <Input label="Travel Operator" value={form.operator_name} onChange={e => setForm(p => ({...p, operator_name: e.target.value}))} />
              </div>
            </form>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
              <Button variant="secondary" className="flex-1" type="button" onClick={() => setModal(null)}>Cancel</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" loading={saving} onClick={saveBus}>{modal.edit ? 'Apply Changes' : 'Confirm Registration'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {modal?.type === 'route' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Add New Route</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={22}/></button>
            </div>
            <form onSubmit={saveRoute} className="p-6 space-y-4">
              {error && <Alert type="error" message={error} />}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Source City" value={routeForm.source} onChange={e => setRouteForm(p => ({...p, source: e.target.value}))} required />
                <Input label="Destination City" value={routeForm.destination} onChange={e => setRouteForm(p => ({...p, destination: e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Distance (km)" type="number" value={routeForm.distance_km} onChange={e => setRouteForm(p => ({...p, distance_km: e.target.value}))} />
                <Input label="Duration (mins)" type="number" value={routeForm.estimated_duration_minutes} onChange={e => setRouteForm(p => ({...p, estimated_duration_minutes: e.target.value}))} />
              </div>
            </form>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
              <Button variant="secondary" className="flex-1" type="button" onClick={() => setModal(null)}>Cancel</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" loading={saving} onClick={saveRoute}>Initialize Route</Button>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  )
}
