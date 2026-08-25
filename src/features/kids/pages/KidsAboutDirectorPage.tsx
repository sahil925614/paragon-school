import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { KidsPageBanner } from '../components/KidsPageBanner'
import { kidsApi } from '../api/kidsApi'
import { applyPageSeo, type PageSeo } from '../../school/utils/pageSeo'
type DirectorSettings = {
  director_name?: string
  director_position?: string
}

type DirectorSection = {
  type: string
  title?: string
  description?: string | null
  image?: string | null
  image_url?: string | null
  is_active: boolean
  settings?: DirectorSettings | []
}

type DirectorPageData = {
  title: string
  slug: string
  seo?: PageSeo
  sections: DirectorSection[]
}

const storageBaseUrl = 'https://lightskyblue-eland-620788.hostingersite.com/storage/'

function mediaUrl(image?: string | null, imageUrl?: string | null) {
  if (imageUrl && !imageUrl.includes('localhost')) return imageUrl
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, '')}`
  return undefined
}

function plainText(html?: string | null) {
  return html?.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<\/p>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&rsquo;/gi, '’').replace(/\s+/g, ' ').trim() || ''
}

function htmlParagraphs(html?: string | null) {
  if (!html) return []
  const paragraphs = Array.from(html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
    .map((match) => plainText(match[1]))
    .filter(Boolean)
  return paragraphs.length ? paragraphs : [plainText(html)].filter(Boolean)
}
function useScrollReveal(threshold = 0.16) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold, rootMargin: '0px 0px -55px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

export function KidsAboutDirectorPage() {
  const { data: page } = useQuery({
    queryKey: ['kids-page', 'directors-message'],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: DirectorPageData }>('pages/directors-message')
      return response.data.data
    },
  })
  const banner = page?.sections.find((section) => section.type === 'home_banner' && section.is_active)
  const content = page?.sections.find((section) => section.type === 'director_desk_content' && section.is_active)
  const paragraphs = htmlParagraphs(content?.description)
  const settings = content?.settings && !Array.isArray(content.settings) ? content.settings : undefined
  const directorImage = mediaUrl(content?.image, content?.image_url)
  const messageTitle = content?.title || "Director's Message"
  const messageTitleParts = messageTitle.match(/^(.*?)(?:\s+)(Message)$/i)

  useEffect(() => {
    applyPageSeo(page?.seo)
  }, [page])

  const sectionReveal = useScrollReveal()

  return (
    <>
      <KidsPageBanner title={banner?.title || page?.title || "About Director"} description={plainText(banner?.description) || "Meet the educational leader bringing our child-first vision to everyday experiences."} />
      <main className="relative overflow-hidden bg-[#fffdf8]">
        <style>{`
          @keyframes directorFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(2deg); }
          }
          @keyframes directorDot {
            0%, 100% { transform: scale(1); opacity: .55; }
            50% { transform: scale(1.4); opacity: 1; }
          }
          @keyframes directorUnderline {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            .director-motion {
              animation: none !important;
              transition: none !important;
              transform: none !important;
              opacity: 1 !important;
            }
          }
        `}</style>

      {/* ================= BACKGROUND DECORATIONS ================= */}

      <div
        className="
          pointer-events-none absolute -left-36 top-16
          size-[360px] rounded-full border-[52px]
          border-[#37a9df]/[0.05]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none absolute -right-28 top-[30%]
          size-72 rounded-full border-[40px]
          border-[#ffd34e]/[0.08]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none absolute bottom-24 left-[7%]
          size-4 rounded-full bg-[#ef5f6c]/20
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none absolute right-[8%] top-20
          size-3 rounded-full bg-[#20a98b]/25
        "
        aria-hidden="true"
      />


      {/* ================= MAIN SECTION ================= */}

      <section className="container relative py-14 sm:py-16 lg:py-20 xl:py-24">

        <div
          ref={sectionReveal.ref}
          className="
            flex                
  flex-col-reverse    
  items-center
  gap-12
  lg:grid            
  lg:grid-cols-[1.03fr_.97fr]
  lg:gap-16
  xl:gap-24
          "
        >

          {/* ================= LEFT CONTENT ================= */}

          <div
            className={`director-motion relative z-10 transition-all duration-[950ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
              sectionReveal.visible
                ? 'translate-x-0 translate-y-0 opacity-100'
                : '-translate-x-10 translate-y-5 opacity-0'
            }`}
          >

            {/* LABEL */}

            


            {/* TITLE */}

            <h1
              className="
                mt-6 font-serif
                text-[40px] font-bold
                leading-[1.08]
                text-[#34305c]
                sm:text-5xl
                lg:text-[56px]
              "
            >
              {messageTitleParts?.[1] || "Director's"}{" "}

              <span className="relative text-[#37a9df]">
                {messageTitleParts?.[2] || "Message"}

                <svg
                  viewBox="0 0 150 12"
                  preserveAspectRatio="none"
                  className="
                    absolute -bottom-3 left-0
                    h-3 w-full
                    text-[#ef5f6c]
                  "
                  aria-hidden="true"
                >
                  <path
                    d="M3 8C38 3 96 2 147 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>

              </span>
            </h1>


            {/* PARAGRAPH 1 */}

            <p
              className="director-motion 
                mt-10 max-w-2xl
                text-[15px]
                leading-[1.9]
                text-[#625f72]
                sm:text-base
              "
             style={{ transitionDelay: "180ms" }}>
              {paragraphs[0] || "The vision of Paragon Senior Secondary School has always been rooted in innovation, excellence, and progress."}
            </p>


            {/* PARAGRAPH 2 */}

            <p
              className="director-motion 
                mt-5 max-w-2xl
                text-[15px]
                leading-[1.9]
                text-[#625f72]
                sm:text-base
              "
             style={{ transitionDelay: "320ms" }}>
              {paragraphs[1] || "His enthusiasm for exploring new horizons in education resulted in significant advancements in academic excellence and infrastructure development."}
            </p>


            {/* COLOR DIVIDER */}

            <div className="my-7 flex items-center gap-2">
              <span className="h-[3px] w-8 rounded-full bg-[#f28c28]" />
              <span className="h-[3px] w-5 rounded-full bg-[#ef5f6c]" />
              <span className="h-[3px] w-4 rounded-full bg-[#ffd34e]" />
              <span className="h-[3px] w-3 rounded-full bg-[#20a98b]" />
              <span className="h-[3px] w-2 rounded-full bg-[#37a9df]" />
            </div>


            {/* PARAGRAPH 3 */}

            <p
              className="director-motion 
                max-w-2xl
                text-[15px]
                leading-[1.9]
                text-[#625f72]
                sm:text-base
              "
             style={{ transitionDelay: "460ms" }}>
              {paragraphs[2] || "Though we recently lost this exceptional leader, his legacy continues to inspire us."}
            </p>
            {paragraphs.slice(3).map((paragraph, index) => (
              <p
                key={`${paragraph}-${index}`}
                className="director-motion mt-5 max-w-2xl text-[15px] leading-[1.9] text-[#625f72] sm:text-base"
                style={{ transitionDelay: `${600 + index * 140}ms` }}
              >
                {paragraph}
              </p>
            ))}

          </div>


          {/* ================= RIGHT IMAGE ================= */}

          <div
            className={`director-motion
              relative mx-auto
              w-full max-w-[570px]
              lg:mx-0
              transition-all duration-[1050ms] ease-[cubic-bezier(.2,.8,.2,1)]
              ${sectionReveal.visible
                ? 'translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100'
                : 'translate-x-12 translate-y-6 rotate-2 scale-[.96] opacity-0'
              }
            `}
            style={{ transitionDelay: '180ms' }}
          >

            {/* ORANGE BACKGROUND SHAPE */}

            <div
              className="
                pointer-events-none
                absolute
                -right-7 -top-7
                h-[58%] w-[64%]
                rounded-[38px]
                bg-[#f4a62a]/15
                sm:-right-10 sm:-top-10
              "
              aria-hidden="true"
            />


            {/* BLUE BACKGROUND SHAPE */}

            <div
              className="
                pointer-events-none
                absolute
                -bottom-8 -left-8
                size-44
                rounded-full
                bg-[#37a9df]/10
              "
              aria-hidden="true"
            />


            {/* DECORATIVE DOT */}

            <span
              className="
                pointer-events-none
                absolute
                -left-3 top-[25%]
                size-5 rounded-full
                bg-[#ef5f6c]/75
              "
              aria-hidden="true"
            style={{
                animation: sectionReveal.visible
                  ? 'directorDot 2.4s ease-in-out infinite'
                  : undefined,
              }}
            />


            {/* IMAGE CARD */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border border-[#eee5d8]
                bg-white
                p-2
                shadow-[0_30px_70px_-30px_rgba(52,48,92,0.35)]
                sm:rounded-[36px]
                sm:p-3
              "
            >

              <div
                className="
                  relative
                  aspect-[1.05/1]
                  overflow-hidden
                  rounded-[21px]
                  bg-[#f4efe9]
                  sm:rounded-[28px]
                "
              >
                <img
                  src={directorImage || "/images/director-paragon.webp"}
                  alt={settings?.director_name || "Iqbal Shergill"}
                  className="
                    size-full
                    object-cover
                    object-center
                    transition-transform
                    duration-700
                    hover:scale-[1.025]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute inset-0
                    bg-gradient-to-t
                    from-[#34305c]/10
                    via-transparent
                    to-transparent
                  "
                />
              </div>

            </div>


            {/* ================= NAME CARD ================= */}

            <div
              className="director-motion 
                relative z-10
                mx-auto
                -mt-7
                w-[88%]
                rounded-[20px]
                border border-[#eee5d8]
                bg-white
                px-5 py-5
                text-center
                shadow-[0_15px_40px_rgba(52,48,92,0.12)]
                sm:w-[80%]
                sm:px-7
              "
             style={{
                animation: sectionReveal.visible
                  ? 'directorFloat 4s .9s ease-in-out infinite'
                  : undefined,
              }}>

              <p
                className="
                  font-serif
                  text-lg font-bold
                  text-[#37a9df]
                  sm:text-xl
                "
              >
                {settings?.director_name || "Iqbal Shergill"}
              </p>

              <div
                className="
                  mx-auto my-3
                  h-[2px] w-8
                  rounded-full
                  bg-[#ef5f6c]
                "
              />

              <p
                className="
                  text-sm font-bold
                  text-[#34305c]
                "
              >
                {settings?.director_position || "Director"}
              </p>

            </div>


            {/* MULTICOLOR DOTS */}

            <div
              className="
                absolute
                -right-3 bottom-[20%]
                hidden flex-col gap-2
                sm:flex
              "
              aria-hidden="true"
            >
              <span className="size-2 rounded-full bg-[#f28c28]" />
              <span className="size-2 rounded-full bg-[#ef5f6c]" />
              <span className="size-2 rounded-full bg-[#ffd34e]" />
              <span className="size-2 rounded-full bg-[#20a98b]" />
              <span className="size-2 rounded-full bg-[#37a9df]" />
            </div>

          </div>

        </div>

      </section>


      {/* ================= BOTTOM COLOR STRIP ================= */}

      <div className="container pb-12 sm:pb-16">
        <div
          className={`director-motion
            flex h-[5px]
            overflow-hidden
            rounded-full
            opacity-80
            origin-left transition-transform duration-[1200ms]
            ${sectionReveal.visible ? 'scale-x-100' : 'scale-x-0'}
          `}
          aria-hidden="true"
        >
          <span className="flex-1 bg-[#f28c28]" />
          <span className="flex-1 bg-[#ef5f6c]" />
          <span className="flex-1 bg-[#ffd34e]" />
          <span className="flex-1 bg-[#20a98b]" />
          <span className="flex-1 bg-[#37a9df]" />
          <span className="flex-1 bg-[#8b65c2]" />
        </div>
      </div>

    </main>
    </>
  );
}