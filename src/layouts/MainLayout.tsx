import { Outlet } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  )
}
