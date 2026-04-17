import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export function Spinner({ size = 'md', className = '' }) {
  const sz = { sm: 16, md: 24, lg: 36 }[size]
  return <Loader2 size={sz} className={`animate-spin text-purple-500 ${className}`} />
}

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

export function Alert({ type = 'error', message, onClose }) {
  if (!message) return null
  const styles = {
    error:   'bg-rose-50 border-rose-200 text-rose-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    info:    'bg-purple-50 border-purple-200 text-purple-700',
  }
  const Icon = type === 'success' ? CheckCircle : AlertCircle
  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border ${styles[type]} text-sm`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 text-lg leading-none">&times;</button>}
    </div>
  )
}

export function Badge({ children, color = 'purple' }) {
  const colors = {
    purple:  'bg-purple-100 text-purple-700',
    violet:  'bg-violet-100 text-violet-700',
    green:   'bg-emerald-100 text-emerald-700',
    red:     'bg-rose-100 text-rose-700',
    gray:    'bg-gray-100 text-gray-600',
    amber:   'bg-amber-100 text-amber-700',
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.purple}`}>{children}</span>
}

export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const variants = {
    primary:   'bg-purple-600 hover:bg-purple-700 text-white shadow-purple',
    secondary: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200',
    violet:    'bg-violet-600 hover:bg-violet-700 text-white',
    ghost:     'text-purple-600 hover:bg-purple-50',
    danger:    'bg-rose-500 hover:bg-rose-600 text-white',
    outline:   'border-2 border-purple-500 text-purple-600 hover:bg-purple-50',
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  )
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition text-gray-800 placeholder:text-gray-400 text-sm ${className}`} {...props} />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <select className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 text-sm ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}

export function Card({ children, className = '', ...props }) {
  return <div className={`bg-white rounded-2xl shadow-card border border-gray-100 ${className}`} {...props}>{children}</div>
}

export function StatusBadge({ status }) {
  const map = {
    confirmed: ['green',  'Confirmed'],
    pending:   ['amber',  'Pending'],
    cancelled: ['red',    'Cancelled'],
    failed:    ['red',    'Failed'],
  }
  const [color, label] = map[status] || ['gray', status]
  return <Badge color={color}>{label}</Badge>
}
