import { Outlet } from 'react-router-dom'
import { Footer } from '../../../components/layout/Footer'
import { Header } from '../../../components/layout/Header'

export function SchoolLayout() {
  return <div className="min-h-screen bg-stone-50 text-slate-900">
    <Header />
    <main><Outlet /></main>
    <Footer />
  </div>
}
