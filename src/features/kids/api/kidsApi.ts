import axios from 'axios'

export const kidsApi = axios.create({
  baseURL: import.meta.env.VITE_KIDS_API_BASE_URL ?? 'https://lightskyblue-eland-620788.hostingersite.com/api/paragon-kids/',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 15_000,
})

