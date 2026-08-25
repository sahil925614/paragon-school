import { KidsPageBanner } from '../components/KidsPageBanner'
import { useQuery } from '@tanstack/react-query'
import { kidsApi } from '../api/kidsApi'
import { applyPageSeo, type PageSeo } from '../../school/utils/pageSeo'
import { useEffect, useRef, useState } from 'react'
import type { ElementType } from 'react'
import {
  BookOpen,
  Heart,
  Lightbulb,
  Smile,
  Target,
} from 'lucide-react'

type MissionVisionSection = {
  type: string
  title?: string
  description?: string | null
  image?: string | null
  image_url?: string | null
  is_active: boolean
}

type MissionVisionPageData = {
  title: string
  slug: string
  seo?: PageSeo
  sections: MissionVisionSection[]
}

const storageBaseUrl = 'https://lightskyblue-eland-620788.hostingersite.com/storage/'

function mediaUrl(image?: string | null, imageUrl?: string | null) {
  if (imageUrl && !imageUrl.includes('localhost')) return imageUrl
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, '')}`
  return undefined
}

function plainText(html?: string | null) {
  return html?.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<\/p>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim() || ''
}

function htmlParagraphs(html?: string | null) {
  if (!html) return []
  const matches = Array.from(html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
  return matches.length ? matches.map((match) => match[1]) : [html]
}
export function KidsMissionVisionPage() {
  const { data: page } = useQuery({
    queryKey: ['kids-page', 'mission-and-vision'],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: MissionVisionPageData }>('pages/mission-and-vision')
      return response.data.data
    },
  })
  const banner = page?.sections.find((section) => section.type === 'home_banner' && section.is_active)
  const content = page?.sections.find((section) => section.type === 'mission_vision_content' && section.is_active)
  const contentParagraphs = htmlParagraphs(content?.description)
  const mainCopy = plainText(contentParagraphs[0])
  const mottoHtml = contentParagraphs[1]
  const illustration = mediaUrl(content?.image, content?.image_url)

  useEffect(() => {
    applyPageSeo(page?.seo)
  }, [page])

  const heroRef = useRef<HTMLElement | null>(null)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const section = heroRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.16, rootMargin: '0px 0px -70px 0px' }
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <KidsPageBanner
        title={banner?.title || page?.title || "Mission And Vision"}
        description={plainText(banner?.description) || "We nurture confident, compassionate and curious young learners through joyful experiences."}
      />

      <main className="relative overflow-hidden bg-[#fffdf8]">
        <style>{`
          @keyframes missionFloat {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform: translateY(-10px) rotate(.5deg);
            }
          }

          @keyframes missionDot {
            0%, 100% {
              transform: scale(1);
              opacity: .45;
            }

            50% {
              transform: scale(1.65);
              opacity: 1;
            }
          }
        `}</style>

        {/* =====================================================
            HERO / PAGE INTRO
        ===================================================== */}

        <section
          ref={heroRef}
          className="relative overflow-hidden"
        >
          {/* Decorative background */}

          <div
            className="
              pointer-events-none
              absolute
              -left-24
              top-16
              size-64
              rounded-full
              border-[38px]
              border-[#37a9df]/18
            "
            aria-hidden="true"
          />

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-16
              size-72
              rounded-full
              bg-[#ffd34e]/18
            "
            aria-hidden="true"
          />

          <div
            style={{
              animation: 'missionDot 2.8s ease-in-out infinite',
            }}
            className="
              pointer-events-none
              absolute
              right-[12%]
              top-24
              size-5
              rounded-full
              bg-[#20a98b]/20
            "
            aria-hidden="true"
          />

          <div
            style={{
              animation: 'missionDot 3.2s ease-in-out .7s infinite',
            }}
            className="
              pointer-events-none
              absolute
              left-[8%]
              top-[55%]
              size-3
              rounded-full
              bg-[#ef5f6c]/30
            "
            aria-hidden="true"
          />

          <div
            className="
              container
  relative
  flex  
  flex-col-reverse 
  gap-10
  py-14
  sm:py-16
  lg:grid      
  lg:grid-cols-[1fr_.9fr]
  lg:items-center
  lg:gap-16
  lg:py-20
  xl:gap-24
            "
          >
            {/* ================= LEFT CONTENT ================= */}

            <div
              className={`relative z-10 transition-all duration-[1000ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                heroVisible
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-20 opacity-0'
              }`}
            >
              {/* Small label */}

              {/* Title */}

              <h1
                className={`
                  mt-6
                  max-w-xl
                  font-serif
                  text-[42px]
                  font-bold
                  leading-[1.05]
                  text-[#34305c]
                  sm:text-5xl
                  lg:text-[58px]
                  transition-all
                  duration-[900ms]
                  delay-150
                  ${
                    heroVisible
                      ? 'translate-y-0 scale-100 opacity-100'
                      : 'translate-y-10 scale-[.94] opacity-0'
                  }
                `}
              >
                <span className="relative inline-block text-[#37a9df]">
                  {content?.title || "Mission And Vision"}

                  <svg
                    viewBox="0 0 180 12"
                    className="
                      absolute
                      -bottom-3
                      left-0
                      h-3
                      w-full
                      text-[#ffd34e]
                    "
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8C44 2 106 2 177 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Old content */}

              <p
                className={`
                  mt-9
                  max-w-2xl
                  text-[15px]
                  leading-8
                  text-[#625f72]
                  sm:text-base
                  transition-all
                  duration-700
                  delay-300
                  ${
                    heroVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }
                `}
              >
                {mainCopy || "We believe that the clarity of purpose, exceptional teachers and demonstrated outcomes are hallmarks of a great school. A great school is a place with a deep commitment to student learning where the educators nourish the intellectual, moral, emotional and social growth of every student."}
              </p>

              {/* Motto */}

              <div
                className={`
                  relative
                  mt-8
                  max-w-xl
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#ef5f6c]/10
                  bg-[#fff3f2]
                  px-6
                  py-6
                  sm:px-7
                  transition-all
                  duration-700
                  delay-[560ms]
                  ${
                    heroVisible
                      ? 'translate-y-0 rotate-0 opacity-100'
                      : 'translate-y-10 -rotate-2 opacity-0'
                  }
                `}
              >
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    top-0
                    w-[5px]
                    bg-[#ef5f6c]
                  "
                />

                <div
                  className="font-serif text-[23px] font-bold italic leading-[1.45] text-[#ef5f6c] sm:text-[27px] [&_br]:block"
                  dangerouslySetInnerHTML={{
                    __html:
                      mottoHtml ||
                      '“With the motto Fun, Grow and Learn,<br />Paragon Kids strives to be a great school.”',
                  }}
                />
              </div>
            </div>

            {/* ================= RIGHT VISUAL ================= */}

            <div
              className={`relative mx-auto w-full max-w-[560px] transition-all duration-[1100ms] delay-200 ease-[cubic-bezier(.2,.8,.2,1)] ${
                heroVisible
                  ? 'translate-x-0 scale-100 rotate-0 opacity-100'
                  : 'translate-x-20 scale-[.9] rotate-3 opacity-0'
              }`}
            >
              {/* Background blobs */}

              <div
                className="
                  absolute
                  left-[4%]
                  top-[9%]
                  size-24
                  rounded-full
                  bg-[#37a9df]/10
                "
                aria-hidden="true"
              />

              <div
                className="
                  absolute
                  bottom-[7%]
                  right-[1%]
                  size-32
                  rounded-full
                  bg-[#ffd34e]/15
                "
                aria-hidden="true"
              />

              {/* Main illustration container */}

              <div
                className="
                  relative
                  rounded-[36px]
                  border
                  border-[#eee6da]
                  bg-white
                  p-4
                  shadow-[0_25px_70px_-30px_rgba(52,48,92,0.25)]
                  sm:p-6
                "
                style={
                  heroVisible
                    ? {
                        animation:
                          'missionFloat 4.8s ease-in-out 1.2s infinite',
                      }
                    : undefined
                }
              >
                {/* Colored corner */}

                <div
                  className="
                    absolute
                    -right-3
                    -top-3
                    size-16
                    rounded-full
                    bg-[#ffd34e]
                    opacity-70
                  "
                  aria-hidden="true"
                />

                <div
                  className="
                    absolute
                    -bottom-3
                    -left-3
                    size-12
                    rounded-full
                    bg-[#37a9df]
                    opacity-20
                  "
                  aria-hidden="true"
                />

                {/*
                  Replace this with the original Kids Mission/Vision
                  illustration from the old website if you have it.
                */}

                <div
                  className="
                    relative
                    flex
                    min-h-[370px]
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[28px]
                    bg-gradient-to-br
                    from-[#fff9e9]
                    via-[#fffdf8]
                    to-[#effaff]
                    sm:min-h-[450px]
                  "
                >
                  <img
                    src={illustration || "/images/kids.webp"}
                    alt={content?.title || "Paragon Kids Mission and Vision"}
                    className="
                      relative
                      z-10
                      max-h-[430px]
                      w-full
                      object-contain
                      p-3
                      sm:p-5
                    "
                  />
                </div>
              </div>

              {/* Floating fun badge */}

              <div
                className={`
                  absolute
                  -bottom-5
                  left-1/2
                  z-20
                  flex
                  -translate-x-1/2
                  items-center
                  gap-3
                  whitespace-nowrap
                  rounded-full
                  border
                  border-[#eee5d8]
                  bg-white
                  px-5
                  py-3
                  shadow-[0_12px_35px_rgba(52,48,92,0.14)]
                  sm:px-6
                  transition-all
                  duration-700
                  delay-[800ms]
                  ${heroVisible ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                  transform: heroVisible
                    ? 'translate(-50%, 0) scale(1)'
                    : 'translate(-50%, 18px) scale(.8)',
                }}
              >
                <span className="size-2.5 rounded-full bg-[#f28c28]" />
                <span className="size-2.5 rounded-full bg-[#ef5f6c]" />
                <span className="size-2.5 rounded-full bg-[#ffd34e]" />
                <span className="size-2.5 rounded-full bg-[#20a98b]" />
                <span className="size-2.5 rounded-full bg-[#37a9df]" />

                <span className="ml-1 text-xs font-bold text-[#34305c]">
                  Fun · Grow · Learn
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

/* =========================================================
   VALUE CARD
========================================================= */

type ValueCardProps = {
  icon: ElementType
  title: string
  text: string
  color: string
  background: string
}

function ValueCard({
  icon: Icon,
  title,
  text,
  color,
  background,
}: ValueCardProps) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-[#eee7dd]
        bg-white
        p-6
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:shadow-[0_18px_45px_-20px_rgba(52,48,92,.22)]
      "
    >
      <div
        className="
          absolute
          -right-8
          -top-8
          size-24
          rounded-full
          opacity-50
          transition-transform
          duration-500
          group-hover:scale-125
        "
        style={{ backgroundColor: background }}
        aria-hidden="true"
      />

      <div
        className="
          relative
          grid
          size-12
          place-items-center
          rounded-2xl
        "
        style={{
          backgroundColor: background,
          color,
        }}
      >
        <Icon size={22} strokeWidth={2} />
      </div>

      <h3
        className="
          relative
          mt-5
          font-serif
          text-xl
          font-bold
          text-[#34305c]
        "
      >
        {title}
      </h3>

      <p
        className="
          relative
          mt-2
          text-sm
          leading-6
          text-[#777281]
        "
      >
        {text}
      </p>

      <div
        className="relative mt-5 h-[3px] w-8 rounded-full"
        style={{ backgroundColor: color }}
      />
    </article>
  )
}