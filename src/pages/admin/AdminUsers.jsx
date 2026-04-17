import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import { LoadingScreen, Alert, Badge, Button, Input, Select } from '../../components/common/UI'
import { format } from 'date-fns'
import { Search, UserPlus, X } from 'lucide-react'

const EMPTY_MANAGER = { name:'', email:'', password:'', role:'manager', phone:'' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_MANAGER)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    adminAPI.getUsers()
      .then(r => { setUsers(r.data.users || []); setLoading(false) })
      .catch(() => { setError('Failed to load users'); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleAddManager = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await adminAPI.createUser(form)
      setMsg('Manager created successfully!')
      setShowModal(false)
      setForm(EMPTY_MANAGER)
      load()
    } catch (err) {
      console.error('Create manager error:', err)
      const backendError = err.response?.data?.error || err.response?.data?.message || err.message
      setError(backendError || 'Failed to create manager. Make sure you have admin permissions and the data is valid.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = search
    ? users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users

  return (
    <AdminLayout title="Users">
      <div className="space-y-5">
        {msg && <Alert type="success" message={msg} onClose={() => setMsg('')} />}
        {error && !showModal && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100">
              Users <span className="text-gray-400 font-normal text-base">({users.length})</span>
            </h2>
            <Button size="sm" onClick={() => setShowModal(true)} className="flex items-center gap-2">
              <UserPlus size={14} /> Add Manager
            </Button>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300 w-full sm:w-60"
            />
          </div>
        </div>

        {loading ? <LoadingScreen /> : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-purple-100 dark:border-purple-900/40 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-600 dark:text-gray-400">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Role', 'Joined'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-purple">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium">{u.email}</td>
                      <td className="px-5 py-4">{u.phone || '—'}</td>
                      <td className="px-5 py-4">
                        <select 
                          className={`bg-transparent text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer transition-all ${
                            u.role === 'admin' ? 'text-saffron-600' : (u.role === 'manager' ? 'text-blue-600' : 'text-gray-500')
                          }`}
                          value={u.role}
                          onChange={async (e) => {
                            const newRole = e.target.value
                            if (u.role === 'admin' && !confirm('Are you sure you want to change an admin role?')) return
                            try {
                              await adminAPI.updateUser(u.id, { role: newRole })
                              setMsg(`Role updated for ${u.name}`)
                              load()
                            } catch (err) {
                              setError(err.response?.data?.error || 'Failed to update role')
                            }
                          }}
                        >
                          <option value="user">USER</option>
                          <option value="manager">MANAGER</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-gray-400">
                        {u.created_at ? format(new Date(u.created_at), 'dd MMM yyyy') : '—'}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-20 text-center text-gray-400 font-medium italic">No matching users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Manager Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex items-center justify-between p-7 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100">Add Manager</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase font-black tracking-widest leading-none">Create a new team account</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddManager} className="p-7 space-y-4">
              {error && <Alert type="error" message={error} />}
              <Input label="Full Name" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm(p=>({...p, name: e.target.value}))} required />
              <Input label="Email Address" type="email" placeholder="manager@travelgo.com" value={form.email} onChange={e => setForm(p=>({...p, email: e.target.value}))} required />
              <Input label="Temporary Password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(p=>({...p, password: e.target.value}))} required />
              <Input label="Phone Number (Optional)" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(p=>({...p, phone: e.target.value}))} />
              
              <div className="flex gap-4 pt-4">
                <Button variant="secondary" className="flex-1 rounded-2xl h-14 font-bold" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button className="flex-1 rounded-2xl h-14 font-bold" loading={saving}>Create Account</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
