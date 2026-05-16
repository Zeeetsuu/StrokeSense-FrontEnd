import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function healthCheck() {
  const { data } = await api.get('/api/health')
  return data
}

export async function getFields() {
  const { data } = await api.get('/api/fields')
  return data
}

export async function createPrediction(payload) {
  const { data } = await api.post('/api/predict', payload)
  return data
}

export async function getPredictions() {
  const { data } = await api.get('/api/predictions')
  return data
}

export async function getPredictionById(id) {
  const { data } = await api.get(`/api/predictions/${id}`)
  return data
}

export async function deletePrediction(id) {
  const { data } = await api.delete(`/api/predictions/${id}`)
  return data
}
