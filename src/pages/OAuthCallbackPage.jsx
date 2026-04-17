import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/common/UI'

export default function OAuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setUserFromOAuth } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    const userRaw = params.get('user')
    const error = params.get('error')

    if (error) { navigate('/login?error=' + error); return }
    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw))
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUserFromOAuth(user)
        navigate(user.role === 'admin' ? '/admin' : '/')
      } catch { navigate('/login?error=parse_failed') }
    } else {
      navigate('/login?error=missing_params')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}>
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-purple-700 font-semibold">Completing Google Sign In...</p>
      </div>
    </div>
  )
}
