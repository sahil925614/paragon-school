import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { KidsPageBanner } from '../components/KidsPageBanner'
import { kidsApi } from '../api/kidsApi'
import { applyPageSeo, type PageSeo } from '../../school/utils/pageSeo'
type PrincipalSettings = {
  principal_name?: string
  principal_position?: string
}

type PrincipalSection = {
  type: string
  title?: string
  description?: string | null
  image?: string | null
  image_url?: string | null
  is_active: boolean
  settings?: PrincipalSettings | []
}

type PrincipalPageData = {
  title: string
  slug: string
  seo?: PageSeo
  sections: PrincipalSection[]
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
  const paragraphs = Array.from(html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
    .map((match) => plainText(match[1]))
    .filter(Boolean)
  return paragraphs.length ? paragraphs : [plainText(html)].filter(Boolean)
}
export function KidsPrincipalsDeskPage() {
  const { data: page } = useQuery({
    queryKey: ['kids-page', 'principals-desk'],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: PrincipalPageData }>('pages/principals-desk')
      return response.data.data
    },
  })
  const banner = page?.sections.find((section) => section.type === 'home_banner' && section.is_active)
  const content = page?.sections.find((section) => section.type === 'principal_desk_content' && section.is_active)
  const paragraphs = htmlParagraphs(content?.description)
  const settings = content?.settings && !Array.isArray(content.settings) ? content.settings : undefined
  const principalImage = mediaUrl(content?.image, content?.image_url)
  const deskTitle = content?.title || "Principal's Desk"
  const deskTitleParts = deskTitle.match(/^(.*?)(?:\s+)(Desk)$/i)

  useEffect(() => {
    applyPageSeo(page?.seo)
  }, [page])

  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.14, rootMargin: '0px 0px -70px 0px' }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <KidsPageBanner title={banner?.title || page?.title || "Principal Desk"} description={plainText(banner?.description) || "A warm message about strong foundations and celebrating the unique spark in every child."} />
      <main className="relative overflow-hidden bg-[#fffdf8]">
        <style>{`
          @keyframes principalFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-9px) rotate(.8deg); }
          }
          @keyframes principalPulse {
            0%, 100% { transform: scale(1); opacity: .55; }
            50% { transform: scale(1.45); opacity: 1; }
          }
        `}</style>

      {/* ================= BACKGROUND DECORATIONS ================= */}

      <div
        className="
          pointer-events-none absolute -left-40 top-16
          size-[380px] rounded-full border-[54px]
          border-[#37a9df]/[0.25]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none absolute -right-32 top-[26%]
          size-[320px] rounded-full border-[44px]
          border-[#ffd34e]/[0.27]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none absolute bottom-20 left-[6%]
          size-4 rounded-full bg-[#20a98b]/20
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none absolute right-[9%] top-16
          size-3 rounded-full bg-[#ef5f6c]/25
        "
        aria-hidden="true"
      />


      {/* ================= MAIN CONTENT ================= */}

      <section ref={sectionRef} className="container relative py-14 sm:py-16 lg:py-20 xl:py-24">

        <div
          className="
            flex              
  flex-col-reverse  
  items-center 
  gap-12
  lg:grid            
  lg:grid-cols-[1.02fr_.98fr]
  lg:gap-16
  xl:gap-24
          "
        >

          {/* ================= LEFT CONTENT ================= */}

          <div
              className={`relative z-10 transition-all duration-[950ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                visible ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'
              }`}
            >

            {/* SMALL LABEL */}

          


            {/* HEADING */}

            <h1
              className={`mt-6 font-serif text-[40px] font-bold leading-[1.08] text-[#34305c] sm:text-5xl lg:text-[56px]
                transition-all delay-150 duration-[850ms]
                ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-9 scale-[.94] opacity-0'}`}
            >
              {deskTitleParts?.[1] || "Principal's"}{" "}

              <span className="relative text-[#37a9df]">
                {deskTitleParts?.[2] || "Desk"}

                <svg
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  className="
                    absolute -bottom-3 left-0
                    h-3 w-full
                    text-[#ef5f6c]
                  "
                  aria-hidden="true"
                >
                  <path
                    d="M3 8C27 3 64 2 97 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>

              </span>
            </h1>


            {/* FIRST PARAGRAPH */}

            <p
              className={`mt-10 max-w-2xl text-[15px] leading-[1.9] text-[#625f72] sm:text-base
                transition-all delay-300 duration-700
                ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              {paragraphs[0] || "It is my proud privilege to welcome you into the portals of Paragon learning community. Here, in Paragon School, we make honest and sincere efforts to educate the future torch bearers in the classrooms through multifarious activities, aimed at all-round development of their personality. The holistic approach of the institution stimulates innovation among students by inspiring fresh ideas with varied perceptiveness, creative thinking and strong conviction. As a result, the school has enjoyed tremendous success over the past four decades and has established incredible traditions and legacies."}
            </p>


            {/* COLOR ACCENT */}

            <div className="my-7 flex items-center gap-2" aria-hidden="true">
              <span className="h-[3px] w-8 rounded-full bg-[#f28c28]" />
              <span className="h-[3px] w-5 rounded-full bg-[#ef5f6c]" />
              <span className="h-[3px] w-4 rounded-full bg-[#ffd34e]" />
              <span className="h-[3px] w-3 rounded-full bg-[#20a98b]" />
              <span className="h-[3px] w-2 rounded-full bg-[#37a9df]" />
            </div>


            {/* SECOND PARAGRAPH */}

            <p
              className={`max-w-2xl text-[15px] leading-[1.9] text-[#625f72] sm:text-base
                transition-all delay-[520ms] duration-700
                ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              {paragraphs[1] || "Our curriculum, course and co-curricular offerings aim towards growth of our students. The school always works towards reducing the gap between home and school so that parents and teachers are in the best possible position to support a child's learning. The school uses learning technologies that reflect the modern world our students live in."}
            </p>

          </div>


          {/* ================= RIGHT PROFILE ================= */}

          <div
            className={`relative mx-auto w-full max-w-[570px] lg:mx-0
              transition-all delay-200 duration-[1100ms] ease-[cubic-bezier(.2,.8,.2,1)]
              ${visible ? 'translate-x-0 rotate-0 scale-100 opacity-100' : 'translate-x-16 rotate-2 scale-[.91] opacity-0'}`}
          >

            {/* ORANGE DECORATION */}

            <div
              className="
                pointer-events-none
                absolute
                -right-7 -top-7
                h-[60%] w-[62%]
                rounded-[38px]
                bg-[#f4a62a]/15
                sm:-right-10 sm:-top-10
              "
              aria-hidden="true"
            />

            {/* BLUE CIRCLE */}

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

            {/* SMALL RED CIRCLE */}

            <div
              className="
                pointer-events-none
                absolute
                -left-3 top-[24%]
                size-5
                rounded-full
                bg-[#ef5f6c]/75
              "
              aria-hidden="true"
              style={visible ? { animation: 'principalPulse 2.8s ease-in-out 1.2s infinite' } : undefined}
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
                  src={principalImage || "/images/principal-desk.webp"}
                  alt={settings?.principal_name || "Mrs Jasmeet Kaur"}
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
              className="
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
              style={visible ? { animation: 'principalFloat 4.2s ease-in-out 1.35s infinite' } : undefined}
            >
              <p
                className="
                  font-serif
                  text-lg font-bold
                  text-[#37a9df]
                  sm:text-xl
                "
              >
                {settings?.principal_name || "Mrs Jasmeet Kaur"}
              </p>

              <div
                className="
                  mx-auto my-3
                  h-[2px] w-8
                  rounded-full
                  bg-[#ef5f6c]
                "
              />

              <p className="text-sm font-bold text-[#34305c]">
                {settings?.principal_position || "Principal"}
              </p>
            </div>


            {/* RIGHT MULTICOLOR DOTS */}

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


      {/* ================= BOTTOM MULTICOLOR LINE ================= */}

      <div className="container pb-12 sm:pb-16">
        <div
          className="
            flex h-[5px]
            overflow-hidden
            rounded-full
            opacity-80
          "
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