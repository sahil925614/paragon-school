import { ArrowUp } from 'lucide-react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 350)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <button type="button" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-5 right-5 z-[70] grid size-11 place-items-center rounded-xl bg-[#ef5f6c] text-white shadow-[0_12px_30px_rgba(52,48,92,.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#34305c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37a9df] sm:bottom-7 sm:right-7 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>
    <ArrowUp size={20} strokeWidth={2.5} />
  </button>
}