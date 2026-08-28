import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

type PageBannerProps = {
  title: string
  description: string
  image?: string | null
  imageUrl?: string | null
}

const mediaBaseUrl =
  'https://lightskyblue-eland-620788.hostingersite.com/storage/'

function resolveBannerImage(image?: string | null, imageUrl?: string | null) {
  if (imageUrl && !imageUrl.includes('localhost')) return imageUrl
  if (!image) return undefined
  if (/^https?:\/\//i.test(image)) return image
  return `${mediaBaseUrl}${image.replace(/^\/+/, '')}`
}

export function PageBanner({
  title,
  description,
  image,
  imageUrl,
}: PageBannerProps) {
  const bannerImage = resolveBannerImage(image, imageUrl)
  return (
    <section className="page-banner relative isolate overflow-hidden bg-navy text-white">
      {bannerImage && (
        <>
          <img
            src={bannerImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,25,44,.96)_0%,rgba(5,25,44,.82)_52%,rgba(5,25,44,.62)_100%)]"
            aria-hidden="true"
          />
        </>
      )}
      {/* <div className="banner-orb banner-orb-one" aria-hidden="true" /> */}
      {/* <div className="banner-orb banner-orb-two" aria-hidden="true" /> */}
      {/* <div className="banner-ring pointer-events-none" aria-hidden="true" /> */}

      <div className="container relative z-10 flex min-h-[300px] flex-col justify-center py-14 sm:min-h-[340px] sm:py-16 lg:min-h-[390px] lg:py-20">
        <nav aria-label="Breadcrumb" className="banner-reveal flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-slate-300 sm:text-sm">
          <Link className="inline-flex items-center gap-2 hover:text-gold" to="/school">
            <Home size={15} aria-hidden="true" /> Home
          </Link>
          <ChevronRight className="text-gold" size={15} aria-hidden="true" />
          <span className="max-w-[12rem] truncate text-white" aria-current="page">{title}</span>
        </nav>

        <div className="mt-8 max-w-3xl sm:mt-8">
          {/* <p className="banner-reveal banner-delay-1 eyebrow flex items-center gap-2 text-gold">
            <Sparkles size={15} aria-hidden="true" /> Discover Paragon
          </p> */}
          <h1 className="banner-reveal banner-delay-2 mt-4 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="banner-reveal banner-delay-3 mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" aria-hidden="true" />
    </section>
  )
}
