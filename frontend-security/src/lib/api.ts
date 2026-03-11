import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') { const t = localStorage.getItem('access_token'); if (t) config.headers.Authorization = `Bearer ${t}`; }
  return config;
});
api.interceptors.response.use((r) => r, async (error) => {
  if (error.response?.status === 401) { const r = localStorage.getItem('refresh_token'); if (r) { try { const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh: r }); localStorage.setItem('access_token', res.data.access); error.config.headers.Authorization = `Bearer ${res.data.access}`; return api(error.config); } catch { localStorage.clear(); window.location.href = '/login'; } } }
  return Promise.reject(error);
});
export default api;
