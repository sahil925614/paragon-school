import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { KidsPageBanner } from '../components/KidsPageBanner'
import { kidsApi } from '../api/kidsApi'
import { applyPageSeo, type PageSeo } from '../../school/utils/pageSeo'
type FounderSettings = {
  founder_name?: string
  founder_position?: string
}

type FounderSection = {
  type: string
  title?: string
  description?: string | null
  image?: string | null
  image_url?: string | null
  is_active: boolean
  settings?: FounderSettings | []
}

type FounderPageData = {
  title: string
  slug: string
  seo?: PageSeo
  sections: FounderSection[]
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
export function KidsFounderPage() {
  const { data: page } = useQuery({
    queryKey: ['kids-page', 'founder'],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: FounderPageData }>('pages/founder')
      return response.data.data
    },
  })
  const banner = page?.sections.find((section) => section.type === 'home_banner' && section.is_active)
  const content = page?.sections.find((section) => section.type === 'founder_content' && section.is_active)
  const paragraphs = htmlParagraphs(content?.description)
  const settings = content?.settings && !Array.isArray(content.settings) ? content.settings : undefined
  const founderImage = mediaUrl(content?.image, content?.image_url)

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
      <KidsPageBanner title={banner?.title || page?.title || "Founder"} description={plainText(banner?.description) || "Learn about the vision that established Paragon as a place for knowledge and character."} />
      <main className="relative overflow-hidden bg-[#fffdf8]">
        <style>{`
          @keyframes founderFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1deg); }
          }
          @keyframes founderDot {
            0%, 100% { transform: scale(1); opacity: .55; }
            50% { transform: scale(1.5); opacity: 1; }
          }
        `}</style>

      {/* =====================================================
          BACKGROUND DECORATIONS
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-16
          size-80
          rounded-full
          border-[45px]
          border-[#37a9df]/[0.25]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          top-[28%]
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
          bottom-20
          left-[8%]
          size-4
          rounded-full
          bg-[#ef5f6c]/20
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[7%]
          top-20
          size-3
          rounded-full
          bg-[#20a98b]/25
        "
        aria-hidden="true"
      />


      {/* =====================================================
          FOUNDER SECTION
      ===================================================== */}

      <section
        ref={sectionRef}
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
  items-center
  gap-12
  lg:grid            
  lg:grid-cols-[0.95fr_1.05fr]
  lg:gap-16
  xl:gap-24
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div
              className={`relative z-10 transition-all duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                visible
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-16 opacity-0'
              }`}
            >

            {/* SMALL LABEL */}

           

            {/* TITLE */}

            <h1
              className={`mt-6 font-serif
                transition-all delay-150 duration-[850ms]
                ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-[.94] opacity-0'}
                
                text-[42px]
                font-bold
                leading-[1.08]
                text-[#34305c]
                sm:text-5xl
                lg:text-[58px]`}
            >
              Our{" "}

              <span className="relative text-[#37a9df]">
                {content?.title || "Founder"}

                <svg
                  viewBox="0 0 160 12"
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
                    d="M3 8C42 2 96 2 157 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>

              </span>
            </h1>


            {/* ORIGINAL PARAGRAPH 1 */}

            <p
              className={`mt-10 max-w-2xl text-[15px] leading-[1.9] text-[#625f72] sm:text-base
                transition-all delay-300 duration-700
                ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              {paragraphs[0] || "The school was founded by Late S. Balraj Singh Shergill was a dynamic personality who possessed magnetic virtues and an aura of humanity. In him, there was a powerful skill to transform embryonic souls into illustrious students."}
            </p>


            {/* ORIGINAL PARAGRAPH 2 */}

            <p
              className={`mt-5 max-w-2xl text-[15px] leading-[1.9] text-[#625f72] sm:text-base
                transition-all delay-[450ms] duration-700
                ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              {paragraphs[1] || "He encouraged eyes to dream, shy tongues to raise their voice, inexperienced hands to chisel perfection and unwilling legs to initiate action. The indomitable will, visionary foresight, devout faith and inexhaustible benevolence are just a few highlights of his exemplary character."}
            </p>


            {/* MULTICOLOR DIVIDER */}

            <div className="my-7 flex items-center gap-2">
              <span className="h-[3px] w-8 rounded-full bg-[#f28c28]" />
              <span className="h-[3px] w-5 rounded-full bg-[#ef5f6c]" />
              <span className="h-[3px] w-4 rounded-full bg-[#ffd34e]" />
              <span className="h-[3px] w-3 rounded-full bg-[#20a98b]" />
              <span className="h-[3px] w-2 rounded-full bg-[#37a9df]" />
            </div>


            {/* ORIGINAL PARAGRAPH 3 */}

            <p
              className={`max-w-2xl text-[15px] leading-[1.9] text-[#625f72] sm:text-base
                transition-all delay-[650ms] duration-700
                ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              {paragraphs[2] || "This fine soul was the spirit behind the inception of Paragon School. For all Paragonians, the world has never seen a sweeter soul than his. His vision was to place the school amongst the list of most sought of educational institutions and so, he emphasized on the importance of good human relationships based upon tolerance, sensitivity, goodwill and understanding."}
            </p>

          </div>


          {/* =================================================
              RIGHT — FOUNDER IMAGE
          ================================================= */}

          <div
            className={`relative mx-auto w-full max-w-[570px] lg:mx-0
              transition-all delay-200 duration-[1100ms] ease-[cubic-bezier(.2,.8,.2,1)]
              ${visible ? 'translate-x-0 rotate-0 scale-100 opacity-100' : 'translate-x-16 rotate-2 scale-[.92] opacity-0'}`}
          >

            {/* ORANGE DECORATION */}

            <div
              className="
                pointer-events-none
                absolute
                -right-7
                -top-7
                size-40
                rounded-[36px]
                bg-[#f4a62a]/15
                sm:-right-10
                sm:-top-10
                sm:size-52
              "
              aria-hidden="true"
            />


            {/* BLUE DECORATION */}

            <div
              className="
                pointer-events-none
                absolute
                -bottom-8
                -left-8
                size-36
                rounded-full
                bg-[#37a9df]/10
              "
              aria-hidden="true"
            />


            {/* RED SMALL CIRCLE */}

            <div
              className="
                pointer-events-none
                absolute
                -left-3
                top-[22%]
                size-5
                rounded-full
                bg-[#ef5f6c]/80
              "
              aria-hidden="true"
            />


            {/* IMAGE CARD */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-[#eee5d8]
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
                  aspect-[1/1]
                  overflow-hidden
                  rounded-[23px]
                  bg-[#f4efe9]
                  sm:rounded-[28px]
                "
              >
                <img
                  src={founderImage || "/images/founder.webp"}
                  alt={settings?.founder_name || "S. Balraj Singh Shergill"}
                  className="
                    size-full
                    object-cover
                    object-top
                    transition-transform
                    duration-700
                    hover:scale-[1.025]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#34305c]/10
                    via-transparent
                    to-transparent
                  "
                />
              </div>

            </div>


            {/* =================================================
                NAME CARD
            ================================================= */}

            <div
              className="
                relative
                z-10
                mx-auto
                -mt-7
                w-[88%]
                rounded-[20px]
                border
                border-[#eee5d8]
                bg-white
                px-5
                py-5
                text-center
                shadow-[0_15px_40px_rgba(52,48,92,0.12)]
                sm:w-[82%]
                sm:px-7
              "
              style={visible ? { animation: 'founderFloat 4s ease-in-out 1.4s infinite' } : undefined}
            >

              <p
                className="
                  font-serif
                  text-lg
                  font-bold
                  uppercase
                  tracking-[0.04em]
                  text-[#37a9df]
                  sm:text-xl
                "
              >
                {settings?.founder_name || "S. Balraj Singh Shergill"}
              </p>

              <div
                className="
                  mx-auto
                  my-3
                  h-[2px]
                  w-8
                  rounded-full
                  bg-[#ef5f6c]
                "
              />

              <p
                className="
                  text-sm
                  font-bold
                  text-[#34305c]
                "
              >
                {settings?.founder_position || "Founder"}
              </p>

            </div>


            {/* COLOR DOTS */}

            <div
              className="
                absolute
                -right-3
                bottom-[22%]
                hidden
                flex-col
                gap-2
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


      {/* =====================================================
          BOTTOM COLOR LINE
          Decoration only — no extra content
      ===================================================== */}

      <div className="container pb-12 sm:pb-16">
        <div
          className="
            flex
            h-[5px]
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