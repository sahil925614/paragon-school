import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { KidsPageBanner } from '../components/KidsPageBanner'
import { kidsApi } from '../api/kidsApi'
import { applyPageSeo, type PageSeo } from '../../school/utils/pageSeo'
type CurriculumCard = {
  title?: string
  description?: string | null
}

type CurriculumSettings = {
  cards?: CurriculumCard[]
}

type CurriculumSection = {
  type: string
  title?: string
  description?: string | null
  is_active: boolean
  settings?: CurriculumSettings | []
}

type CurriculumPageData = {
  title: string
  slug: string
  seo?: PageSeo
  sections: CurriculumSection[]
}

function plainText(html?: string | null) {
  return html?.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<\/p>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&apos;/gi, "'").replace(/\s+/g, ' ').trim() || ''
}

function htmlParagraphs(html?: string | null) {
  if (!html) return []
  const paragraphs = Array.from(html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
    .map((match) => plainText(match[1]))
    .filter(Boolean)
  return paragraphs.length ? paragraphs : [plainText(html)].filter(Boolean)
}

function htmlParagraphBodies(html?: string | null) {
  if (!html) return []
  return Array.from(html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)).map((match) => match[1])
}

function phaseSections(html?: string | null) {
  if (!html) return []
  return Array.from(html.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4[^>]*>|$)/gi))
    .map((match) => ({ title: plainText(match[1]), html: match[2].trim() }))
    .filter((phase) => phase.title && phase.html)
}

function splitHeading(title: string) {
  const words = title.trim().split(/\s+/)
  return {
    first: words.slice(0, -1).join(' ') || words[0] || '',
    accent: words.length > 1 ? words.at(-1) || '' : '',
  }
}
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold, rootMargin: '0px 0px -65px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

export function KidsCurriculumPage() {
  const { data: page } = useQuery({
    queryKey: ['kids-page', 'curriculum'],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: CurriculumPageData }>('pages/curriculum')
      return response.data.data
    },
  })
  const banner = page?.sections.find((section) => section.type === 'home_banner' && section.is_active)
  const content = page?.sections.find((section) => section.type === 'kids_curriculum_content' && section.is_active)
  const settings = content?.settings && !Array.isArray(content.settings) ? content.settings : undefined
  const cards = settings?.cards ?? []
  const plannersCard = cards[0]
  const syllabusCard = cards[1]
  const methodologyCard = cards[2]
  const plannerParagraphs = htmlParagraphs(plannersCard?.description)
  const syllabusParagraphs = htmlParagraphs(syllabusCard?.description)
  const syllabusParagraphBodies = htmlParagraphBodies(syllabusCard?.description)
  const methodologyHtml = methodologyCard?.description || ''
  const methodologyIntroHtml = methodologyHtml.split(/<h4[^>]*>/i)[0]
  const methodologyParagraphs = htmlParagraphs(methodologyIntroHtml)
  const methodologyParagraphBodies = htmlParagraphBodies(methodologyIntroHtml)
  const contentHeading = splitHeading(content?.title || 'Teaching Methodology')
  const plannerHeading = splitHeading(plannersCard?.title || 'Monthly Planners')
  const syllabusHeading = splitHeading(syllabusCard?.title || 'Syllabus Offered')
  const methodologyHeading = splitHeading(methodologyCard?.title || content?.title || 'Teaching Methodology')

  useEffect(() => {
    applyPageSeo(page?.seo)
  }, [page])

  const introReveal = useScrollReveal()
  const plannersReveal = useScrollReveal()
  const syllabusReveal = useScrollReveal()
  const modelReveal = useScrollReveal()

  const learningPhases = [
    {
      number: "01",
      letter: "E",
      title: "Engage",
      color: "#ef5f6c",
      soft: "#fff0f2",
      content: (
        <>
          <p>
            This phase of the 5 E&apos;s starts the process. An &apos;engage&apos;
            activity should do the following:
          </p>

          <ul className="mt-4 space-y-2 pl-5">
            <li className="list-disc">
              Make connections between past and present learning experiences.
            </li>

            <li className="list-disc">
              Anticipate activities and focus students&apos; thinking on the
              learning outcomes of current activities. Students should become
              mentally engaged in the concept, process, or skill to be learned.
            </li>
          </ul>
        </>
      ),
    },

    {
      number: "02",
      letter: "E",
      title: "Explore",
      color: "#37a9df",
      soft: "#edf8fe",
      content: (
        <p>
          This phase of the 5 E&apos;s provides students with a common base of
          experiences. They identify and develop concepts, processes, and
          skills. During this phase, students actively explore their
          environment or manipulate materials.
        </p>
      ),
    },

    {
      number: "03",
      letter: "E",
      title: "Explain",
      color: "#f4a62a",
      soft: "#fff7e8",
      content: (
        <p>
          This phase of the 5 E&apos;s helps students explain the concepts they
          have been exploring. They have opportunities to verbalize their
          conceptual understanding or to demonstrate new skills or behaviors.
          This phase also provides opportunities for teachers to introduce
          formal terms, definitions, and explanations for concepts, processes,
          skills, or behaviors.
        </p>
      ),
    },

    {
      number: "04",
      letter: "E",
      title: "Elaborate",
      color: "#20a98b",
      soft: "#ecfaf6",
      content: (
        <p>
          This phase of the 5 E&apos;s extends students&apos; conceptual
          understanding and allows them to practice skills and behaviors.
          Through new experiences, the learners develop deeper and broader
          understanding of major concepts, obtain more information about areas
          of interest, and refine their skills.
        </p>
      ),
    },

    {
      number: "05",
      letter: "E",
      title: "Evaluate",
      color: "#8b65c2",
      soft: "#f5f0fb",
      content: (
        <p>
          This phase of the 5 E&apos;s encourages learners to assess their
          understanding and abilities and lets teachers evaluate students&apos;
          understanding of key concepts and skill development.
        </p>
      ),
    },
  ];

  const phasePalette = [
    { color: '#ef5f6c', soft: '#fff0f2' },
    { color: '#37a9df', soft: '#edf8fe' },
    { color: '#f4a62a', soft: '#fff7e8' },
    { color: '#20a98b', soft: '#ecfaf6' },
    { color: '#8b65c2', soft: '#f5f0fb' },
  ]
  const apiLearningPhases: LearningPhase[] = phaseSections(methodologyHtml).map((phase, index) => {
    const palette = phasePalette[index % phasePalette.length]
    return {
      number: String(index + 1).padStart(2, '0'),
      letter: phase.title.charAt(0).toUpperCase() || 'E',
      title: phase.title,
      color: palette.color,
      soft: palette.soft,
      content: (
        <div
          className="[&_p+ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc"
          dangerouslySetInnerHTML={{ __html: phase.html }}
        />
      ),
    }
  })
  const displayedLearningPhases = apiLearningPhases.length ? apiLearningPhases : learningPhases

  return (
    <>
      <KidsPageBanner title={banner?.title || page?.title || "Curriculum"} description={plainText(banner?.description) || "Our early-years curriculum blends language, numeracy, creativity, movement and play."} />
      <main className="relative overflow-hidden bg-[#fffdf8]">
        <style>{`
          @keyframes curriculumBob {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-7px) rotate(2deg); }
          }
          @keyframes curriculumPulse {
            0%, 100% { transform: scale(1); opacity: .45; }
            50% { transform: scale(1.45); opacity: .9; }
          }
          @media (prefers-reduced-motion: reduce) {
            .curriculum-motion {
              transition: none !important;
              animation: none !important;
              transform: none !important;
              opacity: 1 !important;
            }
          }
        `}</style>

      {/* =========================================================
          BACKGROUND DECORATIONS
      ========================================================= */}

      <div
        className="
          pointer-events-none
          absolute -left-48 top-24
          size-[430px]
          rounded-full
          border-[62px]
          border-[#37a9df]/[0.15]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute -right-44 top-[26%]
          size-[390px]
          rounded-full
          border-[58px]
          border-[#ffd34e]/[0.27]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute -left-32 bottom-[14%]
          size-[290px]
          rounded-full
          border-[42px]
          border-[#20a98b]/[0.25]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute right-[8%] top-20
          size-4 rounded-full bg-[#ef5f6c]/25
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute left-[7%] top-[39%]
          size-3 rounded-full bg-[#f4a62a]/30
        "
        aria-hidden="true"
      />


      {/* =========================================================
          PAGE INTRO
      ========================================================= */}

      <section className="container relative py-14 sm:py-16 lg:py-20">

        <div
          ref={introReveal.ref}
          className={`curriculum-motion mx-auto max-w-4xl text-center transition-all duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
            introReveal.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >

          <div
            className="
              inline-flex items-center gap-2
              rounded-full
              border border-[#37a9df]/15
              bg-[#eef9fe]
              px-4 py-2
              text-[11px]
              font-bold uppercase
              tracking-[0.18em]
              text-[#37a9df]
            "
          >
            <span className="size-2 rounded-full bg-[#ef5f6c]" />
            {page?.title || "Curriculum"}
          </div>

          <h1
            className="
              mt-6 font-serif
              text-[40px] font-bold
              leading-tight
              text-[#34305c]
              sm:text-5xl
              lg:text-[58px]
            "
          >
            {contentHeading.first}{" "}
            <span className="relative inline-block text-[#37a9df]">
              {contentHeading.accent || "Methodology"}

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

        </div>


        {/* =========================================================
            MONTHLY PLANNERS
        ========================================================= */}

        <div
          ref={plannersReveal.ref}
          className={`curriculum-motion
            relative
            mt-14
            overflow-hidden
            rounded-[28px]
            border border-[#37a9df]/10
            bg-white
            shadow-[0_22px_65px_-38px_rgba(52,48,92,.25)]
            sm:mt-16
            sm:rounded-[34px]
            transition-all duration-[950ms] ease-[cubic-bezier(.2,.8,.2,1)]
            ${plannersReveal.visible ? 'translate-x-0 rotate-0 opacity-100' : '-translate-x-12 -rotate-1 opacity-0'}
          `}
        >

          {/* Decorative top strip */}

          <div className="flex h-[6px]">
            <span className="flex-1 bg-[#37a9df]" />
            <span className="flex-1 bg-[#ef5f6c]" />
            <span className="flex-1 bg-[#ffd34e]" />
            <span className="flex-1 bg-[#20a98b]" />
          </div>

          <div
            className="
              grid gap-8
              p-6
              sm:p-9
              lg:grid-cols-[220px_1fr]
              lg:gap-12
              lg:p-12
            "
          >

            {/* Heading */}

            <div>
              <span
                className="
                  flex size-14
                  items-center justify-center
                  rounded-[18px]
                  bg-[#edf8fe]
                  font-serif
                  text-2xl font-bold
                  text-[#37a9df]
                "
              >
                01
              </span>

              <h2
                className="
                  mt-5 font-serif
                  text-3xl font-bold
                  text-[#34305c]
                  lg:text-[34px]
                "
              >
                {plannerHeading.first || "Monthly"}
                <span className="block text-[#37a9df]">
                  {plannerHeading.accent || "Planners"}
                </span>
              </h2>

              <div className="mt-4 h-[3px] w-10 rounded-full bg-[#ef5f6c]" />
            </div>


            {/* Content */}

            <div className="space-y-5 text-[15px] leading-8 text-[#625f72] sm:text-base">

              <p>
                {plannerParagraphs[0] || "Each month we make a curriculum information sheet. This includes the details of our subject wise programme for the children for the month ahead as well as the vocabulary they will be expected to understand and begin to use."}
              </p>

              <p>
                {plannerParagraphs[1] || "We micro-schedule all that has to be taught in the school to help out our educators provide the right content in the right manner to kids. Monthly theme-based learning through activities, rhymes and stories helps children understand concepts better."}
              </p>

            </div>
          </div>
        </div>


        {/* =========================================================
            SYLLABUS OFFERED
        ========================================================= */}

        <div
          ref={syllabusReveal.ref}
          className={`curriculum-motion
            relative
            mt-8
            overflow-hidden
            rounded-[28px]
            bg-[#34305c]
            px-6 py-9
            text-white
            shadow-[0_25px_70px_-35px_rgba(52,48,92,.55)]
            sm:px-9
            sm:py-11
            lg:px-12
            lg:py-12
            transition-all duration-[1000ms] ease-[cubic-bezier(.2,.8,.2,1)]
            ${syllabusReveal.visible ? 'translate-x-0 rotate-0 scale-100 opacity-100' : 'translate-x-12 rotate-1 scale-[.97] opacity-0'}
          `}
        >

          {/* background shapes */}

          <div
            className="
              pointer-events-none
              absolute -right-20 -top-24
              size-64 rounded-full
              border-[38px]
              border-white/[0.04]
            "
            aria-hidden="true"
          />

          <div
            className="
              pointer-events-none
              absolute -bottom-20 right-[20%]
              size-44 rounded-full
              bg-[#37a9df]/[0.25]
            "
            aria-hidden="true"
          />


          <div
            className="
              relative
              grid gap-8
              lg:grid-cols-[220px_1fr]
              lg:gap-12
            "
          >

            <div>
              <span
                className="
                  flex size-14
                  items-center justify-center
                  rounded-[18px]
                  bg-[#ffd34e]
                  font-serif
                  text-2xl font-bold
                  text-[#34305c]
                "
              >
                02
              </span>

              <h2
                className="
                  mt-5 font-serif
                  text-3xl font-bold
                  leading-tight
                  text-white
                  lg:text-[34px]
                "
              >
                {syllabusHeading.first || "Syllabus"}
                <span className="block text-[#ffd34e]">
                  {syllabusHeading.accent || "Offered"}
                </span>
              </h2>

              <div className="mt-4 h-[3px] w-10 rounded-full bg-[#ef5f6c]" />
            </div>


            <div className="space-y-6 text-[15px] leading-8 text-white/75 sm:text-base">

              <p>
                {syllabusParagraphs[0] || "Paragon Kids curriculum is a complete solution to the Modern Preschool Education. It comprises day-wise curriculum and teaching methods for Play way, Nursery, KG.1, KG. 2, Grade 1 and Grade 2. Based on Hi-Scope methodology, Paragon Kids offers child-initiated approach for teaching toddlers. As, this is a well-researched and field tested curriculum, it ensures joyful learning for kids comprising of various themes and activities."}
              </p>


              {/* Subject Highlight */}

              <div
                className="
                  rounded-[20px]
                  border border-white/10
                  bg-white/[0.06]
                  px-5 py-5
                  backdrop-blur-sm
                  sm:px-6
                "
              >
                <p>
                  <span className="[&_strong]:font-bold [&_strong]:text-[#ffd34e]" dangerouslySetInnerHTML={{ __html: syllabusParagraphBodies[1] || "<strong>Subjects Offered</strong> in Class 1 and Class 2 are English, Maths, Hindi, Punjabi whereas Computer, EVS, G.K &amp; M.Sc are taught orally." }} />
                </p>
              </div>

            </div>
          </div>
        </div>

      </section>


      {/* =========================================================
          5E TEACHING METHODOLOGY
      ========================================================= */}

      <section className="relative py-16 sm:py-20 lg:py-24">

        <div ref={modelReveal.ref} className="container relative">

          {/* Header */}

          <div
            className={`curriculum-motion mx-auto max-w-4xl text-center transition-all duration-[850ms] ${
              modelReveal.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >

            <div
              className="
                inline-flex items-center gap-2
                rounded-full
                bg-[#fff0f2]
                px-4 py-2
                text-[11px]
                font-bold uppercase
                tracking-[0.18em]
                text-[#ef5f6c]
              "
            >
              <span className="size-2 rounded-full bg-[#ef5f6c]" />
              The 5E Model
            </div>

            <h2
              className="
                mt-5 font-serif
                text-3xl font-bold
                text-[#34305c]
                sm:text-4xl
                lg:text-[46px]
              "
            >
              {methodologyHeading.first}{" "}
              <span className="text-[#37a9df]">
                {methodologyHeading.accent || "Methodology"}
              </span>
            </h2>

            <div
              className="
                mx-auto mt-5
                flex w-max items-center gap-1.5
              "
              aria-hidden="true"
            >
              <span className="h-[3px] w-8 rounded-full bg-[#ef5f6c]" />
              <span className="h-[3px] w-5 rounded-full bg-[#f4a62a]" />
              <span className="h-[3px] w-4 rounded-full bg-[#ffd34e]" />
              <span className="h-[3px] w-3 rounded-full bg-[#20a98b]" />
              <span className="h-[3px] w-2 rounded-full bg-[#37a9df]" />
            </div>

          </div>


          {/* Intro */}

          <div
            className={`curriculum-motion
              mx-auto mt-10
              max-w-5xl
              rounded-[24px]
              border border-[#34305c]/[0.07]
              bg-white
              p-6
              shadow-[0_18px_50px_-35px_rgba(52,48,92,.28)]
              sm:p-8
              transition-all delay-150 duration-[900ms]
              ${modelReveal.visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-[.97] opacity-0'}
            `}
          >
            <div className="space-y-5 text-[15px] leading-8 text-[#625f72] sm:text-base">

              <p>
                {methodologyParagraphs[0] || "We, the Paragonians follow the 5E Model of learning process that is aligned with the learning cycle advocated for effective learning in classrooms. The 5 E's is an instructional model based on the constructivist approach to learning, which says that learners build or construct new ideas on top of their old ideas. The 5 E's can be used with students of all ages, including adults."}
              </p>

              <p>
                <span className="[&_strong]:font-bold [&_strong]:text-[#34305c]" dangerouslySetInnerHTML={{ __html: methodologyParagraphBodies[1] || "<strong>Each of the 5 E&apos;s describes a phase of learning, and each phase begins with the letter &quot;E&quot;:</strong> Engage, Explore, Explain, Elaborate, and Evaluate." }} />
              </p>

            </div>
          </div>


          {/* =====================================================
              5E JOURNEY
          ===================================================== */}

          <div className="relative mx-auto mt-14 max-w-6xl sm:mt-16">

            {/* DESKTOP CENTER LINE */}

            <div
              className="
                pointer-events-none
                absolute bottom-14 left-1/2 top-14
                hidden w-px
                -translate-x-1/2
                bg-gradient-to-b
                from-[#ef5f6c]/30
                via-[#37a9df]/30
                to-[#8b65c2]/30
                lg:block
              "
              aria-hidden="true"
            />


            <div className="space-y-7 lg:space-y-10">

              {displayedLearningPhases.map((phase, index) => {
                const isRight = index % 2 !== 0;

                return (
                  <article
                    key={phase.title}
                    className={`curriculum-motion relative grid lg:grid-cols-[1fr_90px_1fr] lg:items-center
                      transition-all duration-[850ms] ease-[cubic-bezier(.2,.8,.2,1)]
                      ${modelReveal.visible
                        ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
                        : `${isRight ? 'lg:translate-x-12' : 'lg:-translate-x-12'} translate-y-8 scale-[.97] opacity-0`
                      }`}
                    style={{ transitionDelay: `${220 + index * 130}ms` }}
                  >

                    {/* LEFT */}

                    <div
                      className={
                        isRight
                          ? "hidden lg:block"
                          : "hidden lg:block lg:pr-8"
                      }
                    >
                      {!isRight && (
                        <PhaseCard phase={phase} />
                      )}
                    </div>


                    {/* CENTER E */}

                    <div
                      className="
                        relative z-10
                        hidden
                        items-center justify-center
                        lg:flex
                      "
                    >
                      <div
                        className="
                          grid size-14
                          place-items-center
                          rounded-full
                          border-[5px]
                          border-[#fffdf8]
                          font-serif
                          text-xl font-bold
                          text-white
                          shadow-lg
                        "
                        style={{
                          backgroundColor: phase.color,
                          animation: modelReveal.visible
                            ? `curriculumBob 3.2s ease-in-out ${index * 0.18}s infinite`
                            : undefined,
                        }}
                      >
                        {phase.letter}
                      </div>
                    </div>


                    {/* RIGHT */}

                    <div
                      className={
                        isRight
                          ? "hidden lg:block lg:pl-8"
                          : "hidden lg:block"
                      }
                    >
                      {isRight && (
                        <PhaseCard phase={phase} />
                      )}
                    </div>


                    {/* MOBILE */}

                    <div className="lg:hidden">
                      <PhaseCard phase={phase} />
                    </div>

                  </article>
                );
              })}

            </div>
          </div>

        </div>
      </section>


      {/* =========================================================
          BOTTOM COLOR STRIP
      ========================================================= */}

      <div className="container pb-12 sm:pb-16">

        <div
          className={`curriculum-motion
            flex h-[5px]
            overflow-hidden
            rounded-full
            opacity-80
            origin-left transition-transform duration-[1200ms]
            ${modelReveal.visible ? 'scale-x-100' : 'scale-x-0'}
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


/* =============================================================
   PHASE CARD
============================================================= */

type LearningPhase = {
  number: string;
  letter: string;
  title: string;
  color: string;
  soft: string;
  content: ReactNode;
};


function PhaseCard({ phase }: { phase: LearningPhase }) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[26px]
        border border-[#34305c]/[0.07]
        bg-white
        p-6
        shadow-[0_18px_50px_-32px_rgba(52,48,92,.28)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_24px_60px_-30px_rgba(52,48,92,.35)]
        sm:p-7
      "
    >

      {/* SOFT CIRCLE */}

      <div
        className="
          pointer-events-none
          absolute -right-12 -top-12
          size-36 rounded-full
        "
        style={{ backgroundColor: phase.soft }}
        aria-hidden="true"
      />


      <div className="relative">

        <div className="flex items-center gap-4">

          <div
            className="
              grid size-12
              shrink-0 place-items-center
              rounded-[16px]
              font-serif
              text-lg font-bold
            "
            style={{
              backgroundColor: phase.soft,
              color: phase.color,
            }}
          >
            {phase.number}
          </div>


          <div>
            <span
              className="
                text-[10px]
                font-bold uppercase
                tracking-[0.18em]
              "
              style={{ color: phase.color }}
            >
              Phase {phase.number}
            </span>

            <h3
              className="
                mt-1 font-serif
                text-[28px] font-bold
                leading-tight
                text-[#34305c]
              "
            >
              {phase.title}
            </h3>
          </div>

        </div>


        <div
          className="mt-5 h-[3px] w-10 rounded-full"
          style={{ backgroundColor: phase.color }}
        />


        <div
          className="
            mt-5
            text-[14px]
            leading-7
            text-[#625f72]
            sm:text-[15px]
          "
        >
          {phase.content}
        </div>

      </div>
    </div>
  );
}