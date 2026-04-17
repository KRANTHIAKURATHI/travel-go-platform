import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import ManagerLayout from '../../components/manager/ManagerLayout'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { LoadingScreen, Alert, Button, Input, Select, Badge } from '../../components/common/UI'

const EMPTY = { title:'', description:'', destination:'', duration_days:5, price_per_person:'', max_participants:20, available_slots:20, category:'adventure', difficulty:'easy', is_featured:false, inclusions:'', exclusions:'', start_date:'', end_date:'' }

export default function ManagerPackages() {
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
    <ManagerLayout title="Tour Packages">
      <div className="space-y-6">
        {msg && <Alert type="success" message={msg} onClose={() => setMsg('')} />}
        {error && !modal && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-100 italic tracking-tight underline decoration-blue-500/30">Package Management</h2>
            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Create and curate travel experiences</p>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20" onClick={() => open()}>
            <Plus size={16} className="mr-1" /> Create Package
          </Button>
        </div>

        {loading ? <LoadingScreen /> : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <tr>{['Package Info','Destination','Days','Price','Slots','Featured','Status','Action'].map(h => <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {packages.map(pkg => (
                    <tr key={pkg.id} className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors ${!pkg.is_active ? 'opacity-40 grayscale' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-900 dark:text-gray-100 max-w-[200px] truncate">{pkg.title}</div>
                        <div className="text-[10px] text-blue-500 font-bold uppercase">{pkg.category}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-medium">{pkg.destination}</td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400 font-bold">{pkg.duration_days} Days</td>
                      <td className="px-5 py-4 font-black text-blue-600">₹{parseFloat(pkg.price_per_person || 0).toLocaleString()}</td>
                      <td className="px-5 py-4 font-mono">
                         <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${pkg.available_slots < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                           {pkg.available_slots} Left
                         </span>
                      </td>
                      <td className="px-5 py-4">{pkg.is_featured ? <span className="text-amber-400 text-lg">✦</span> : <span className="text-gray-200">—</span>}</td>
                      <td className="px-5 py-4">
                        <Badge color={pkg.is_active ? 'ocean' : 'error'}>{pkg.is_active ? 'Active' : 'Inactive'}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex gap-2">
                          <button onClick={() => open(pkg)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white border border-transparent hover:border-blue-100 text-blue-600 transition-all"><Pencil size={14}/></button>
                          <button onClick={() => del(pkg.id)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white border border-transparent hover:border-red-100 text-red-400 transition-all"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && <tr><td colSpan={8} className="px-5 py-16 text-center text-gray-400 font-medium">No travel packages found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-20">
              <h3 className="font-extrabold text-2xl text-gray-900 dark:text-gray-100 tracking-tight">{modal.edit ? 'Edit Package Info' : 'Design New Experience'}</h3>
              <button onClick={() => setModal(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400"><X size={24}/></button>
            </div>
            
            <form onSubmit={save} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              {error && <Alert type="error" message={error} />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Package Title" placeholder="e.g. Himalayan Summer Escape" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} required />
                <Input label="Primary Destination" placeholder="City or Region" value={form.destination} onChange={e => setForm(p=>({...p,destination:e.target.value}))} required />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Narrative</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm(p=>({...p,description:e.target.value}))} 
                  rows={4} 
                  placeholder="Describe the adventure..."
                  className="w-full px-5 py-4 rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Input label="Duration (Days)" type="number" value={form.duration_days} onChange={e => setForm(p=>({...p,duration_days:e.target.value}))} required />
                <Input label="Price / Person (₹)" type="number" value={form.price_per_person} onChange={e => setForm(p=>({...p,price_per_person:e.target.value}))} required />
                <Input label="Max Group Size" type="number" value={form.max_participants} onChange={e => setForm(p=>({...p,max_participants:e.target.value}))} required />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 <Select label="Type/Category" value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>
                  {['adventure','cultural','beach','pilgrimage','wildlife','honeymoon','family'].map(c => <option key={c}>{c}</option>)}
                </Select>
                <Select label="Difficulty" value={form.difficulty} onChange={e => setForm(p=>({...p,difficulty:e.target.value}))}>
                  {['easy','moderate','hard'].map(d => <option key={d}>{d}</option>)}
                </Select>
                <div className="flex items-center justify-center p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/40">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p=>({...p,is_featured:e.target.checked}))} className="w-5 h-5 accent-blue-600 rounded" />
                    <span className="text-[11px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Featured</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">What's Included (One per line)</label>
                  <textarea 
                    value={form.inclusions} 
                    onChange={e => setForm(p=>({...p,inclusions:e.target.value}))} 
                    rows={4} 
                    className="w-full px-5 py-4 rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">What's Excluded (One per line)</label>
                  <textarea 
                    value={form.exclusions} 
                    onChange={e => setForm(p=>({...p,exclusions:e.target.value}))} 
                    rows={4} 
                    className="w-full px-5 py-4 rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>
            </form>
            
            <div className="p-8 bg-gray-50 dark:bg-gray-800/50 flex gap-4">
              <Button variant="secondary" className="flex-1 rounded-2xl h-14 font-bold" type="button" onClick={() => setModal(null)}>Discard Changes</Button>
              <Button className="flex-1 rounded-2xl h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20" loading={saving} onClick={save}>
                {modal.edit ? 'Update Package' : 'Publish Package'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  )
}
