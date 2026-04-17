import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import { Plus, Pencil, Trash2, Bus, X } from 'lucide-react'
import { LoadingScreen, Alert, Button, Input, Select, Badge } from '../../components/common/UI'
import { format } from 'date-fns'

const EMPTY_BUS = { route_id:'', bus_number:'', bus_name:'', bus_type:'AC', total_seats:40, price_per_seat:'', operator_name:'', departure_time:'', arrival_time:'' }

export default function AdminBuses() {
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
    <AdminLayout title="Buses & Routes">
      <div className="space-y-5">
        {msg && <Alert type="success" message={msg} onClose={() => setMsg('')} />}
        {error && !modal && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-gray-900">Bus Management</h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => { setModal({ type:'route' }); setRouteForm({ source:'', destination:'', distance_km:'', estimated_duration_minutes:'' }); setError('') }}>
              <Plus size={14}/> Add Route
            </Button>
            <Button size="sm" onClick={() => openBusModal()}>
              <Plus size={14}/> Add Bus
            </Button>
          </div>
        </div>

        {loading ? <LoadingScreen /> : (
          <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Bus Name','Number','Type','Route','Departure','Price','Action'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {buses.map(bus => (
                    <tr key={bus.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{bus.bus_name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{bus.bus_number}</td>
                      <td className="px-4 py-3"><Badge color="ocean">{bus.bus_type}</Badge></td>
                      <td className="px-4 py-3 text-gray-600">{bus.routes?.source} → {bus.routes?.destination}</td>
                      <td className="px-4 py-3 text-gray-500">{bus.departure_time ? format(new Date(bus.departure_time), 'dd MMM, HH:mm') : '-'}</td>
                      <td className="px-4 py-3 font-semibold text-purple-600">₹{parseFloat(bus.price_per_seat || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openBusModal(bus)} className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500 transition-colors"><Pencil size={14}/></button>
                          <button onClick={() => deleteBus(bus.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400 transition-colors"><Trash2 size={14}/></button>
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
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Available Routes ({routes.length})</h3>
          <div className="flex flex-wrap gap-2">
            {routes.map(r => (
              <span key={r.id} className="bg-white border border-gray-200 text-sm px-3 py-1.5 rounded-full text-gray-600">
                {r.source} → {r.destination} {r.distance_km ? `(${r.distance_km}km)` : ''}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bus Modal */}
      {modal?.type === 'bus' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-purple-100">
              <h3 className="font-semibold text-gray-900">{modal.edit ? 'Edit Bus' : 'Add New Bus'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={saveBus} className="p-5 space-y-4">
              {error && <Alert type="error" message={error} />}
              <Select label="Route" value={form.route_id} onChange={e => setForm(p => ({...p, route_id: e.target.value}))} required>
                <option value="">Select Route</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.source} → {r.destination}</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Bus Name" value={form.bus_name} onChange={e => setForm(p => ({...p, bus_name: e.target.value}))} required />
                <Input label="Bus Number" value={form.bus_number} onChange={e => setForm(p => ({...p, bus_number: e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select label="Bus Type" value={form.bus_type} onChange={e => setForm(p => ({...p, bus_type: e.target.value}))}>
                  {['AC','Non-AC','Sleeper','Semi-Sleeper','Volvo'].map(t => <option key={t}>{t}</option>)}
                </Select>
                <Input label="Total Seats" type="number" value={form.total_seats} onChange={e => setForm(p => ({...p, total_seats: e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Departure Time" type="datetime-local" value={form.departure_time} onChange={e => setForm(p => ({...p, departure_time: e.target.value}))} required />
                <Input label="Arrival Time" type="datetime-local" value={form.arrival_time} onChange={e => setForm(p => ({...p, arrival_time: e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Price Per Seat (₹)" type="number" value={form.price_per_seat} onChange={e => setForm(p => ({...p, price_per_seat: e.target.value}))} required />
                <Input label="Operator Name" value={form.operator_name} onChange={e => setForm(p => ({...p, operator_name: e.target.value}))} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" type="button" onClick={() => setModal(null)}>Cancel</Button>
                <Button className="flex-1" loading={saving}>{modal.edit ? 'Update Bus' : 'Create Bus'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {modal?.type === 'route' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-purple-100">
              <h3 className="font-semibold text-gray-900">Add New Route</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={saveRoute} className="p-5 space-y-4">
              {error && <Alert type="error" message={error} />}
              <div className="grid grid-cols-2 gap-3">
                <Input label="Source City" value={routeForm.source} onChange={e => setRouteForm(p => ({...p, source: e.target.value}))} required />
                <Input label="Destination City" value={routeForm.destination} onChange={e => setRouteForm(p => ({...p, destination: e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Distance (km)" type="number" value={routeForm.distance_km} onChange={e => setRouteForm(p => ({...p, distance_km: e.target.value}))} />
                <Input label="Duration (mins)" type="number" value={routeForm.estimated_duration_minutes} onChange={e => setRouteForm(p => ({...p, estimated_duration_minutes: e.target.value}))} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" type="button" onClick={() => setModal(null)}>Cancel</Button>
                <Button className="flex-1" loading={saving}>Create Route</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
