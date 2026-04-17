import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bus, Eye, EyeOff } from 'lucide-react'
import { Alert, Button, Input } from '../components/common/UI'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f5f3ff] dark:bg-[#0f0f12]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-saffron-500 rounded-2xl items-center justify-center shadow-lg mb-4">
            <Bus size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to continue your journey</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} required />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(p => ({...p, password:e.target.value}))}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition text-sm"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">Sign In to TravelGo</Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            New to TravelGo?{' '}
            <Link to="/register" className="text-purple-600 font-semibold hover:text-purple-700">Create free account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError(''); setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f5f3ff] dark:bg-[#0f0f12]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-purple-600 rounded-2xl items-center justify-center shadow-lg mb-4">
            <Bus size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Join millions of happy travelers today</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))} required />
            <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} required />
            <Input label="Phone Number" type="tel" placeholder="+91 9800000000" value={form.phone} onChange={e => setForm(p => ({...p, phone:e.target.value}))} />
            <Input label="Password" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => setForm(p => ({...p, password:e.target.value}))} required />
            <Button type="submit" loading={loading} className="w-full" size="lg">Create My Account</Button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
