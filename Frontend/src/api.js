import axios from 'axios'

export const API_BASE = 'http://localhost:3000'
export const api = axios.create({ baseURL: `${API_BASE}/api` })
export const absoluteUrl = (u) => (u?.startsWith('http') ? u : `${API_BASE}${u || ''}`)


