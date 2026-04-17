import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Save, Shield } from 'lucide-react'
import { Alert, Button, Input, Card } from '../components/common/UI'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      await updateProfile(form)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">My Profile</h1>

        {/* Avatar card */}
        <Card className="p-6 mb-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Shield size={12} className="text-purple-600" />
              <span className="text-xs font-semibold capitalize text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">{user?.role}</span>
            </div>
          </div>
        </Card>

        {/* Edit form */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-5">Edit Profile</h3>

          {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}
          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                <Mail size={15} className="text-gray-400" /> {user?.email}
                <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded-full">Cannot change</span>
              </div>
            </div>
            <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9800000000" />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              <Save size={16} /> Save Changes
            </Button>
          </form>
        </Card>

        {/* Account info */}
        <Card className="p-6 mt-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 dark:text-gray-400">Account Type</span>
              <span className="font-semibold capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 dark:text-gray-400">Login Method</span>
              <span className="font-semibold">Email & Password</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400">Account Status</span>
              <span className="font-semibold text-green-600">Active</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
