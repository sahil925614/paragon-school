import axios from 'axios'

export const schoolApi = axios.create({
  baseURL:
    import.meta.env.VITE_SCHOOL_API_BASE_URL ??
    import.meta.env.VITE_API_BASE_URL ??
    'https://lightskyblue-eland-620788.hostingersite.com/api/paragon-senior-school/',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 15_000,
})
