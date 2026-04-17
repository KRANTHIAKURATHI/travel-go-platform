import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ChatBot from './components/common/ChatBot'
import ScrollToTop from './components/common/ScrollToTop'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OAuthCallbackPage from './pages/OAuthCallbackPage'
import BusSearchPage from './pages/BusSearchPage'
import BusResultsPage from './pages/BusResultsPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import PackagesPage from './pages/PackagesPage'
import PackageDetailsPage from './pages/PackageDetailsPage'
import BookingHistoryPage from './pages/BookingHistoryPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBuses from './pages/admin/AdminBuses'
import AdminPackages from './pages/admin/AdminPackages'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ManagerBuses from './pages/manager/ManagerBuses'
import ManagerPackages from './pages/manager/ManagerPackages'
import ManagerUsers from './pages/manager/ManagerUsers'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function ManagerRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'manager' && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
          <Route path="/buses" element={<BusSearchPage />} />
          <Route path="/buses/results" element={<BusResultsPage />} />
          <Route path="/buses/:busId/seats" element={<PrivateRoute><SeatSelectionPage /></PrivateRoute>} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:id" element={<PackageDetailsPage />} />
          <Route path="/bookings" element={<PrivateRoute><BookingHistoryPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/buses" element={<AdminRoute><AdminBuses /></AdminRoute>} />
          <Route path="/admin/packages" element={<AdminRoute><AdminPackages /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

          {/* Manager Routes */}
          <Route path="/manager" element={<ManagerRoute><ManagerDashboard /></ManagerRoute>} />
          <Route path="/manager/buses" element={<ManagerRoute><ManagerBuses /></ManagerRoute>} />
          <Route path="/manager/packages" element={<ManagerRoute><ManagerPackages /></ManagerRoute>} />
          <Route path="/manager/users" element={<ManagerRoute><ManagerUsers /></ManagerRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
