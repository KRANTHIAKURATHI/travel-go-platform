import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPin, Ticket, CheckCircle, Shield, Star, Clock } from 'lucide-react'
import { Alert, Input } from '../components/common/UI'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
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
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#1e0a3c 0%,#3b0764 40%,#6d28d9 80%,#7c3aed 100%)', minHeight: '100vh' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle,#c084fc,transparent)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }} />

        <div className="relative z-10 flex flex-col items-center text-center px-10 py-12 max-w-sm">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border border-white/20 shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
            <MapPin size={40} className="text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-2">Join TravelGo</h2>
          <p className="text-purple-200 text-sm leading-relaxed mb-8">Create your account and start booking in minutes</p>

          <div className="w-full space-y-3">
            {[
              [CheckCircle, 'Free forever — no hidden fees'],
              [Shield,      'Your data is safe with us'],
              [Star,        'Earn rewards on every booking'],
              [Clock,       'Cancel anytime, full refunds'],
            ].map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white text-sm"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(196,132,252,0.25)' }}>
                  <Icon size={14} className="text-purple-200" />
                </div>
                <span className="text-purple-50">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: registration form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: 'linear-gradient(135deg,#f5f3ff 0%,#faf5ff 100%)' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden inline-flex w-14 h-14 rounded-2xl items-center justify-center shadow-lg mb-3"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              <Ticket size={28} className="text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-1 text-sm">Join millions of happy travelers today</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 p-8"
            style={{ boxShadow: '0 20px 60px rgba(109,40,217,0.12)' }}>
            {error && <div className="mb-5"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

            {/* Google */}
            <button onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-semibold text-gray-700 text-sm transition-all"
              style={{ border: '2px solid #e5e7eb', background: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#a855f7'; e.currentTarget.style.background='#faf5ff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.background='white' }}>
              <GoogleIcon /> Sign up with Google
            </button>

            <div className="flex items-center gap-3 my-5">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400 font-medium px-1">or register with email</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
              <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
              <Input label="Phone Number" type="tel" placeholder="+91 9800000000" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
              <Input label="Password" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 shadow-lg"
                style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#9333ea 100%)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                {loading
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Create My Account'
                }
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
