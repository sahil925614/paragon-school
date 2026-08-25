import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AppRoutes } from './app/AppRoutes'

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    const favicon = document.getElementById('favicon') as HTMLLinkElement | null

    if (favicon) {
      favicon.href = pathname.startsWith('/kids')
        ? '/images/paragon-kids-logo.webp'
        : '/images/paragon-school-logo.webp'
    }
  }, [pathname])

  return <AppRoutes />
}
