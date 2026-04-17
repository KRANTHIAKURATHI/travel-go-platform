import axios from 'axios'

const BASE_URL = 'https://insfandcpciiqlujphxz.supabase.co/functions/v1/api'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (d) => api.post('/auth/register', d),
  login: (d) => api.post('/auth/login', d),
  me: () => api.get('/auth/me'),
  updateProfile: (d) => api.put('/auth/profile', d),
}

export const busAPI = {
  search: (params) => api.get('/buses/search', { params }),
  getById: (id) => api.get(`/buses/${id}`),
  getSeats: (busId) => api.get(`/seats/${busId}`),
}

export const bookingAPI = {
  create: (d) => api.post('/bookings', d),
  getByUser: (id) => api.get(`/bookings/user/${id}`),
  cancel: (id) => api.delete(`/bookings/${id}`),
}

export const packageAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getById: (id) => api.get(`/packages/${id}`),
}

export const packageBookingAPI = {
  create: (d) => api.post('/package-bookings', d),
  getByUser: (id) => api.get(`/package-bookings/user/${id}`),
  cancel: (id) => api.delete(`/package-bookings/${id}`),
}

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getBuses: () => api.get('/admin/buses'),
  createBus: (d) => api.post('/admin/bus', d),
  updateBus: (id, d) => api.put(`/admin/bus/${id}`, d),
  deleteBus: (id) => api.delete(`/admin/bus/${id}`),
  getRoutes: () => api.get('/admin/routes'),
  createRoute: (d) => api.post('/admin/route', d),
  getPackages: () => api.get('/admin/packages'),
  createPackage: (d) => api.post('/admin/package', d),
  updatePackage: (id, d) => api.put(`/admin/package/${id}`, d),
  deletePackage: (id) => api.delete(`/admin/package/${id}`),
  getAllBookings: () => api.get('/admin/bookings'),
  getAllPackageBookings: () => api.get('/admin/package-bookings'),
  getUsers: () => api.get('/admin/users'),
}

export default api
