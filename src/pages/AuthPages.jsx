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
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(135deg, #fff8f0 0%, #f0f9ff 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-saffron-500 rounded-2xl items-center justify-center shadow-lg mb-4">
            <Bus size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal-900">Welcome Back</h1>
          <p className="text-charcoal-500 mt-1">Sign in to your TravelGo account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-charcoal-100 p-8">
          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} required />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-charcoal-700">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({...p, password:e.target.value}))} required className="w-full px-4 py-3 pr-12 rounded-xl border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-saffron-300 text-sm" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
          </form>

          {/* <div className="mt-4 p-3 bg-charcoal-50 rounded-xl text-xs text-charcoal-500 text-center">
            <strong>Admin:</strong> admin@travelbooking.com / Admin@123
          </div> */}

          <p className="text-center text-sm text-charcoal-500 mt-6">
            Don't have an account? <Link to="/register" className="text-saffron-600 font-semibold hover:text-saffron-700">Sign up free</Link>
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(135deg, #fff8f0 0%, #f0f9ff 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-ocean-500 rounded-2xl items-center justify-center shadow-lg mb-4">
            <Bus size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal-900">Create Account</h1>
          <p className="text-charcoal-500 mt-1">Join millions of happy travelers</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-charcoal-100 p-8">
          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))} required />
            <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} required />
            <Input label="Phone Number" type="tel" placeholder="+91 9800000000" value={form.phone} onChange={e => setForm(p => ({...p, phone:e.target.value}))} />
            <Input label="Password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(p => ({...p, password:e.target.value}))} required />
            <Button type="submit" loading={loading} variant="ocean" className="w-full" size="lg">Create Account</Button>
          </form>
          <p className="text-center text-sm text-charcoal-500 mt-6">
            Already have an account? <Link to="/login" className="text-saffron-600 font-semibold hover:text-saffron-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

function LoginPage(props) { return <LoginPage {...props} /> }
