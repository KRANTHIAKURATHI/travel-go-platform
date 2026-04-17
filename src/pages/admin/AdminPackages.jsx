import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { LoadingScreen, Alert, Button, Input, Select, Badge } from '../../components/common/UI'

const EMPTY = { title:'', description:'', destination:'', duration_days:5, price_per_person:'', max_participants:20, available_slots:20, category:'adventure', difficulty:'easy', is_featured:false, inclusions:'', exclusions:'', start_date:'', end_date:'' }

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try { const res = await adminAPI.getPackages(); setPackages(res.data.packages || []) }
    catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const open = (pkg = null) => {
    setForm(pkg ? {
      ...pkg,
      inclusions: (pkg.inclusions || []).join('\n'),
      exclusions: (pkg.exclusions || []).join('\n'),
      start_date: pkg.start_date || '',
      end_date: pkg.end_date || '',
    } : EMPTY)
    setModal({ edit: !!pkg, id: pkg?.id })
    setError('')
  }

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    const payload = {
      ...form,
      inclusions: form.inclusions.split('\n').filter(Boolean),
      exclusions: form.exclusions.split('\n').filter(Boolean),
      price_per_person: parseFloat(form.price_per_person),
      duration_days: parseInt(form.duration_days),
      max_participants: parseInt(form.max_participants),
      available_slots: parseInt(form.available_slots),
    }
    try {
      if (modal.edit) await adminAPI.updatePackage(modal.id, payload)
      else await adminAPI.createPackage(payload)
      setMsg(modal.edit ? 'Package updated!' : 'Package created!')
      setModal(null); load()
    } catch (err) { setError(err.response?.data?.error || 'Save failed') }
    finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!confirm('Deactivate this package?')) return
    try { await adminAPI.deletePackage(id); setMsg('Package deactivated'); load() }
    catch { setError('Failed') }
  }

  return (
    <AdminLayout title="Tour Packages">
      <div className="space-y-5">
        {msg && <Alert type="success" message={msg} onClose={() => setMsg('')} />}
        {error && !modal && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100">Tour Packages</h2>
          <Button size="sm" onClick={() => open()}><Plus size={14}/> Add Package</Button>
        </div>

        {loading ? <LoadingScreen /> : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-purple-100 dark:border-purple-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>{['Title','Destination','Days','Price','Category','Slots','Featured','Action'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {packages.map(pkg => (
                    <tr key={pkg.id} className={`hover:bg-gray-50 dark:bg-gray-800 transition-colors ${!pkg.is_active ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 max-w-[180px] truncate">{pkg.title}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{pkg.destination}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{pkg.duration_days}d</td>
                      <td className="px-4 py-3 font-semibold text-purple-600">₹{parseFloat(pkg.price_per_person || 0).toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge color="ocean">{pkg.category}</Badge></td>
                      <td className="px-4 py-3"><span className={pkg.available_slots < 5 ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>{pkg.available_slots}</span></td>
                      <td className="px-4 py-3">{pkg.is_featured ? '⭐' : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => open(pkg)} className="p-1.5 rounded-lg hover:bg-ocean-50 text-ocean-500"><Pencil size={14}/></button>
                          <button onClick={() => del(pkg.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No packages yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-purple-100 dark:border-purple-900/40 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{modal.edit ? 'Edit Package' : 'Add Tour Package'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 dark:text-gray-300"><X size={20}/></button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4">
              {error && <Alert type="error" message={error} />}
              <Input label="Package Title" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} required />
              <Input label="Destination" value={form.destination} onChange={e => setForm(p=>({...p,destination:e.target.value}))} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saffron-300" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Input label="Duration (days)" type="number" value={form.duration_days} onChange={e => setForm(p=>({...p,duration_days:e.target.value}))} required />
                <Input label="Price/person (₹)" type="number" value={form.price_per_person} onChange={e => setForm(p=>({...p,price_per_person:e.target.value}))} required />
                <Input label="Max Participants" type="number" value={form.max_participants} onChange={e => setForm(p=>({...p,max_participants:e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Available Slots" type="number" value={form.available_slots} onChange={e => setForm(p=>({...p,available_slots:e.target.value}))} required />
                <Select label="Category" value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>
                  {['adventure','cultural','beach','pilgrimage','wildlife','honeymoon','family'].map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select label="Difficulty" value={form.difficulty} onChange={e => setForm(p=>({...p,difficulty:e.target.value}))}>
                  {['easy','moderate','hard'].map(d => <option key={d}>{d}</option>)}
                </Select>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p=>({...p,is_featured:e.target.checked}))} className="w-4 h-4 accent-saffron-500" />
                    <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Date" type="date" value={form.start_date} onChange={e => setForm(p=>({...p,start_date:e.target.value}))} />
                <Input label="End Date" type="date" value={form.end_date} onChange={e => setForm(p=>({...p,end_date:e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions (one per line)</label>
                <textarea value={form.inclusions} onChange={e => setForm(p=>({...p,inclusions:e.target.value}))} rows={3} placeholder="Hotel stay&#10;All meals&#10;Guide" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saffron-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions (one per line)</label>
                <textarea value={form.exclusions} onChange={e => setForm(p=>({...p,exclusions:e.target.value}))} rows={2} placeholder="Flight tickets&#10;Personal expenses" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saffron-300" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" type="button" onClick={() => setModal(null)}>Cancel</Button>
                <Button className="flex-1" loading={saving}>{modal.edit ? 'Update Package' : 'Create Package'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
