import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { KidsPageBanner } from '../components/KidsPageBanner'
import { kidsApi } from '../api/kidsApi'
import { applyPageSeo, type PageSeo } from '../../school/utils/pageSeo'
type HistoryLegacySection = {
  type: string
  title?: string
  description?: string | null
  image?: string | null
  image_url?: string | null
  is_active: boolean
}

type HistoryLegacyPageData = {
  title: string
  slug: string
  seo?: PageSeo
  sections: HistoryLegacySection[]
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
export function KidsHistoryLegacyPage() {
  const { data: page } = useQuery({
    queryKey: ['kids-page', 'history-and-legacy'],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: HistoryLegacyPageData }>('pages/history-and-legacy')
      return response.data.data
    },
  })
  const banner = page?.sections.find((section) => section.type === 'home_banner' && section.is_active)
  const content = page?.sections.find((section) => section.type === 'history_legacy_content' && section.is_active)
  const paragraphs = htmlParagraphs(content?.description)
  const contentTitle = content?.title || 'History And Legacy'
  const titleParts = contentTitle.split(/\s+(?:and|&)\s+/i)
  const historyImage = mediaUrl(content?.image, content?.image_url)
  const establishedYear = paragraphs[0]?.match(/\b(?:18|19|20)\d{2}\b/)?.[0] || '1981'

  useEffect(() => {
    applyPageSeo(page?.seo)
  }, [page])

  const pageRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = pageRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.16 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <KidsPageBanner title={banner?.title || page?.title || "History And Legacy"} description={plainText(banner?.description) || "Discover the values and milestones that continue to guide Paragon Kids today."} />
      <main ref={pageRef} className="relative overflow-hidden bg-[#fffdf8]">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-28
          top-24
          size-72
          rounded-full
          border-[42px]
          border-[#37a9df]/[0.28]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          top-[32%]
          size-64
          rounded-full
          bg-[#ffd34e]/[0.28]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[12%]
          left-[6%]
          size-4
          rounded-full
          bg-[#ef5f6c]/25
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[8%]
          top-[15%]
          size-3
          rounded-full
          bg-[#20a98b]/30
        "
        aria-hidden="true"
      />


      {/* =====================================================
          HISTORY & LEGACY
      ===================================================== */}

      <section
        className="
          container
          relative
          py-14
          sm:py-16
          lg:py-20
          xl:py-24
        "
      >

        <div
          className="
            flex             
  flex-col-reverse   
  gap-10
  lg:grid            
  lg:grid-cols-[0.92fr_1.08fr]
  lg:items-center
  lg:gap-14
  xl:gap-20
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className={`relative z-10 transition-all duration-1000 ease-out ${visible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>

            {/* LABEL */}

           

            {/* HEADING */}

            <h1
              className="
                mt-6
                font-serif
                text-[40px]
                font-bold
                leading-[1.08]
                text-[#34305c]
                sm:text-5xl
                lg:text-[56px]
              "
            >
              {titleParts[0] || "History"}{" "}

              <span className="relative text-[#37a9df]">
                {titleParts[1] ? `& ${titleParts.slice(1).join(" & ")}` : "& Legacy"}

                {/* playful underline */}

                <svg
                  viewBox="0 0 190 12"
                  preserveAspectRatio="none"
                  className="
                    absolute
                    -bottom-3
                    left-0
                    h-3
                    w-full
                    text-[#ef5f6c]
                  "
                  aria-hidden="true"
                >
                  <path
                    d="M3 8C48 2 112 2 187 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>

              </span>
            </h1>


            {/* ORIGINAL CONTENT - PARAGRAPH 1 */}

            <p
              className="
                mt-10
                max-w-2xl
                text-[15px]
                leading-[1.9]
                text-[#625f72]
                sm:text-base
              "
            >
              {paragraphs[0] || "Paragon School was established in 1981 with an objective of providing education that focuses not only on academics but also on overall harmonious growth and development of students. The school is co-educational with medium of instruction being English. Starting from play group, the school provides education till senior secondary level and is affiliated with the Central Board of Secondary Education, New Delhi. The school campus is spread over an area of sprawling 4 acres and is housed in a 3 storeyed building, equipped with all infrastructural facilities, well stocked library, laboratories, auditorium, audio visual equipment, and facilities for creative arts, indoor and outdoor games."}
            </p>


            {/* COLOR DIVIDER */}

            <div className="my-7 flex items-center gap-2">
              <span className="h-[3px] w-8 rounded-full bg-[#f28c28]" />
              <span className="h-[3px] w-5 rounded-full bg-[#ef5f6c]" />
              <span className="h-[3px] w-3 rounded-full bg-[#ffd34e]" />
              <span className="h-[3px] w-2 rounded-full bg-[#20a98b]" />
              <span className="h-[3px] w-2 rounded-full bg-[#37a9df]" />
            </div>


            {/* ORIGINAL CONTENT - PARAGRAPH 2 */}

            <p
              className="
                max-w-2xl
                text-[15px]
                leading-[1.9]
                text-[#625f72]
                sm:text-base
              "
            >
              {paragraphs[1] || "As we stand at the threshold of a new era, the role of education has changed. At Paragon School, we believe that one has to go beyond the traditional methods and ensure education for understanding that is excellent in quality, engage personally and prepare its students to be global citizens who are ready to face challenges of this ever changing world. Paragon seeks to instill in its students high standards of academic scholarship, integrity, leadership and responsible citizenship."}
            </p>

          </div>


          {/* =================================================
              RIGHT IMAGE
          ================================================= */}

          <div
            className={`
              relative
              mx-auto
              w-full
              max-w-[650px]
              transition-all duration-1000 delay-200 ease-out
              lg:mx-0
              ${visible ? "translate-x-0 scale-100 opacity-100" : "translate-x-10 scale-[.96] opacity-0"}
            `}
          >

            {/* yellow circle */}

            <div
              className="
                pointer-events-none
                absolute
                -right-6
                -top-6
                size-28
                rounded-full
                bg-[#ffd34e]/20
                sm:-right-8
                sm:-top-8
                sm:size-36
              "
              aria-hidden="true"
            />


            {/* blue circle */}

            <div
              className="
                pointer-events-none
                absolute
                -bottom-8
                -left-8
                size-28
                rounded-full
                bg-[#37a9df]/10
              "
              aria-hidden="true"
            />


            {/* IMAGE FRAME */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-[#eee5d8]
                bg-white
                p-2
                shadow-[0_28px_70px_-32px_rgba(52,48,92,0.32)]
                sm:rounded-[36px]
                sm:p-3
              "
            >

              <div
                className="
                  relative
                  aspect-[1.35/1]
                  overflow-hidden
                  rounded-[23px]
                  bg-[#f6f3ed]
                  sm:rounded-[28px]
                "
              >
                <img
                  src={historyImage || "/images/paragon_school_history.webp"}
                  alt={content?.title || "Paragon Kids School"}
                  className="
                    size-full
                    object-cover
                    transition-transform
                    duration-700
                    hover:scale-[1.025]
                  "
                />

                {/* subtle image overlay */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#34305c]/15
                    via-transparent
                    to-transparent
                  "
                />

              </div>

            </div>


            {/* =================================================
                FLOATING YEAR
            ================================================= */}

            <div
              className="
                absolute
                -bottom-5
                right-5
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-[#eee5d8]
                bg-white
                px-5
                py-3
                shadow-[0_14px_35px_rgba(52,48,92,0.15)]
                transition-all duration-700 delay-700
                sm:right-8
                sm:px-6
                sm:py-4
              "
            >
              <span
                className="
                  grid
                  size-9
                  place-items-center
                  rounded-xl
                  bg-[#fff1e4]
                  text-sm
                  font-black
                  text-[#f28c28]
                "
              >
                {establishedYear.slice(-2)}
              </span>

              <div>
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[#9b96a5]
                  "
                >
                  Established
                </p>

                <p
                  className="
                    mt-0.5
                    font-serif
                    text-lg
                    font-bold
                    leading-none
                    text-[#34305c]
                  "
                >
                  {establishedYear}
                </p>
              </div>

            </div>


            {/* DECORATIVE DOTS */}

            <div
              className="
                history-pulse
                absolute
                -left-3
                top-10
                hidden
                flex-col
                gap-2
                sm:flex
              "
              aria-hidden="true"
            >
              <span className="size-2 rounded-full bg-[#ef5f6c]" />
              <span className="size-2 rounded-full bg-[#ffd34e]" />
              <span className="size-2 rounded-full bg-[#20a98b]" />
              <span className="size-2 rounded-full bg-[#37a9df]" />
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SIMPLE BOTTOM DECORATION
          No extra content
      ===================================================== */}

      <div className={`container relative pb-12 transition-all duration-1000 delay-500 sm:pb-16 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>

        <div
          className="
            flex
            h-[5px]
            w-full
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