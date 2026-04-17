import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import ManagerLayout from '../../components/manager/ManagerLayout'
import { LoadingScreen, Alert, Badge } from '../../components/common/UI'
import { format } from 'date-fns'
import { Search, UserCheck } from 'lucide-react'

export default function ManagerUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminAPI.getUsers()
      .then(r => { setUsers(r.data.users || []); setLoading(false) })
      .catch((err) => { 
        setError(err.response?.data?.error || 'Failed to load users')
        setLoading(false) 
      })
  }, [])

  const filtered = search
    ? users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users

  return (
    <ManagerLayout title="User Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-playfair text-3xl font-bold text-gray-900 dark:text-gray-100 italic tracking-tight underline decoration-blue-500/30">Customer Records</h2>
            <p className="text-[10px] text-blue-500/80 font-black mt-1 uppercase tracking-[0.3em]">Currently managing {users.length} registered users</p>
          </div>
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-12 pr-6 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-full md:w-80 transition-all shadow-sm"
            />
          </div>
        </div>

        {error && (
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-up">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck size={40} className="text-blue-500" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Restricted Access</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              Customer sensitive data is currently restricted to System Administrators for privacy reasons. 
              <br/><br/>
              <span className="text-[10px] font-black uppercase text-blue-500">Manager Access: Verified</span>
            </p>
          </div>
        )}

        {loading ? <LoadingScreen /> : !error && (
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    {['Member Identity', 'Contact Details', 'Access Level', 'Registration Date'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-gray-900 dark:text-gray-200 font-medium">{u.email}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{u.phone || 'No phone provided'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge color={u.role === 'admin' ? 'saffron' : (u.role === 'manager' ? 'ocean' : 'default')}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-gray-500 dark:text-gray-400 font-medium">
                          {u.created_at ? format(new Date(u.created_at), 'MMM dd, yyyy') : '—'}
                        </div>
                        <div className="text-[10px] text-gray-300 dark:text-gray-600 font-bold mt-0.5">ESTABLISHED MEMBER</div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-bold italic">No matching user records found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  )
}
