import {
  Award,
  Shield,
  Target,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type ActivityCard = {
  title?: string;
  description?: string;
  image?: string;
  image_url?: string;
};

type NdaSection = {
  type: string;
  title: string;
  description?: string | null;
  is_active: boolean;
  settings?: { cards?: ActivityCard[] } | [];
};

type NdaPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: NdaSection[];
};

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(image?: string, imageUrl?: string) {
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  return undefined;
}

function plainText(html?: string | null) {
  return html?.replace(/<[^>]*>/g, "").trim() || "";
}
/* =========================================================
   SCROLL REVEAL WRAPPER
========================================================= */

function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        element.classList.add("nda-visible");
        observer.unobserve(element);
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const directionClass = {
    up: "nda-reveal-up",
    left: "nda-reveal-left",
    right: "nda-reveal-right",
    scale: "nda-reveal-scale",
  }[direction];

  return (
    <div
      ref={ref}
      className={`nda-reveal ${directionClass} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export function NdaPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "nda"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: NdaPageData }>("pages/nda");
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const content = page?.sections.find(
    (section) => section.type === "activity_cards_content" && section.is_active,
  );
  const cards =
    content?.settings && !Array.isArray(content.settings)
      ? content.settings.cards ?? []
      : [];
  const displayedImage =
    cards.map((card) => mediaUrl(card.image, card.image_url)).find(Boolean) ||
    "/images/nda.webp";
  const firstContent =
    plainText(cards[0]?.description) || plainText(content?.description);
  const secondContent = plainText(cards[1]?.description);
  const description =
    plainText(banner?.description) ||
    "Paragon School takes immense pride in its association with Mohali Defence Academy, India's No. 1 NDA Coaching Institute.";

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <>
      <main className="overflow-hidden bg-[#fcfbf8]">

        {/* =====================================================
            EXISTING SENIOR SCHOOL BANNER
        ===================================================== */}

        <PageBanner
          title={banner?.title || page?.title || "NDA"}
          description={description}
        />

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">

          {/* BACKGROUND DECORATIONS */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -left-40
              top-16
              size-[420px]
              rounded-full
              border-[62px]
              border-navy/[.025]
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-40
              top-[38%]
              size-[390px]
              rounded-full
              border-[55px]
              border-gold/[.06]
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-10
              left-[18%]
              size-52
              rounded-full
              bg-navy/[.018]
            "
          />

          <div className="container relative">

            {/* =================================================
                INTRO HEADING
            ================================================= */}

            <Reveal
              direction="up"
              className="mx-auto max-w-4xl text-center"
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[.22em]
                  text-gold-dark
                "
              >
                NDA Preparation
              </p>

              <h2
                className="
                  mx-auto
                  mt-4
                  max-w-4xl
                  font-serif
                  text-3xl
                  leading-tight
                  text-navy
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {content?.title || page?.title || "Mohali Defence Academy:"}
                <span className="block">
                  Achieve Your NDA Dreams with Paragon School
                </span>
              </h2>

              {/* ACCENT */}

              <div
                className="
                  mx-auto
                  mt-6
                  flex
                  items-center
                  justify-center
                  gap-2
                "
                aria-hidden="true"
              >
                <span className="h-[2px] w-10 bg-gold" />

                <span className="size-1.5 rotate-45 bg-gold" />

                <span className="h-[2px] w-10 bg-gold" />
              </div>
            </Reveal>

            {/* =================================================
                FEATURE IMAGE
            ================================================= */}

            <Reveal
              direction="scale"
              delay={120}
              className="mx-auto mt-12 max-w-6xl sm:mt-14"
            >
              <figure
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[28px]
                  bg-white
                  p-2
                  shadow-[0_25px_70px_-38px_rgba(16,42,67,.5)]
                  sm:p-3
                "
              >
                {/* NAVY BACK DECORATION */}

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    -right-12
                    -top-12
                    size-40
                    rounded-full
                    bg-navy/[.05]
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    -bottom-16
                    -left-16
                    size-44
                    rounded-full
                    bg-gold/[.08]
                  "
                />

                {/* IMAGE */}

                <div className="relative overflow-hidden rounded-[22px] bg-[#f3f1eb]">
                  <img
                    src={displayedImage}
                    alt="Paragon School students with Mohali Defence Academy representatives"
                    className="
                      h-auto
                      w-full
                      object-contain
                      transition
                      duration-700
                      ease-out
                      group-hover:scale-[1.015]
                    "
                  />

                  {/* subtle bottom gradient */}

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-x-0
                      bottom-0
                      h-24
                      bg-gradient-to-t
                      from-navy/10
                      to-transparent
                    "
                  />
                </div>

                {/* SMALL BADGE */}

                <div
                  className="
                    absolute
                    bottom-7
                    left-7
                    hidden
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-white/40
                    bg-white/90
                    px-4
                    py-3
                    shadow-lg
                    backdrop-blur-md
                    sm:flex
                  "
                >
                  <span
                    className="
                      grid
                      size-9
                      place-items-center
                      rounded-lg
                      bg-navy
                      text-gold
                    "
                  >
                    <Shield size={17} />
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[.12em]
                      text-navy
                    "
                  >
                    NDA
                  </span>
                </div>
              </figure>
            </Reveal>

            {/* =================================================
                CONTENT SECTION
            ================================================= */}

            <div
              className="
                mx-auto
                mt-14
                grid
                max-w-6xl
                gap-10
                lg:mt-16
                lg:grid-cols-[.36fr_.64fr]
                lg:gap-14
              "
            >

              {/* ===============================================
                  LEFT
              =============================================== */}

              <Reveal direction="left">
                <div className="lg:sticky lg:top-32">

                  <div
                    className="
                      grid
                      size-14
                      place-items-center
                      rounded-2xl
                      bg-navy
                      text-gold
                      shadow-[0_12px_30px_-15px_rgba(16,42,67,.55)]
                    "
                  >
                    <Target size={25} />
                  </div>

                  <p
                    className="
                      mt-6
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[.2em]
                      text-gold-dark
                    "
                  >
                    Paragon School
                  </p>

                  <h3
                    className="
                      mt-3
                      max-w-sm
                      font-serif
                      text-3xl
                      leading-tight
                      text-navy
                      sm:text-4xl
                    "
                  >
                    Preparing students for their NDA dreams.
                  </h3>

                  <div
                    className="mt-6 flex items-center gap-2"
                    aria-hidden="true"
                  >
                    <span className="h-[2px] w-12 bg-gold" />
                    <span className="size-1.5 rounded-full bg-navy" />
                  </div>
                </div>
              </Reveal>

              {/* ===============================================
                  RIGHT CONTENT
              =============================================== */}

              <div className="space-y-8">

                <Reveal
                  direction="right"
                  delay={80}
                >
                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-[24px]
                      bg-white
                      p-7
                      shadow-[0_18px_55px_-40px_rgba(16,42,67,.4)]
                      sm:p-9
                    "
                  >
                    {/* GOLD TOP DETAIL */}

                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        left-0
                        top-0
                        h-1
                        w-24
                        bg-gold
                      "
                    />

                    <div className="flex gap-5">

                      <span
                        className="
                          mt-1
                          hidden
                          size-10
                          shrink-0
                          place-items-center
                          rounded-xl
                          bg-cream
                          text-gold-dark
                          sm:grid
                        "
                      >
                        <Award size={20} />
                      </span>

                      <p
                        className="
                          text-[15px]
                          leading-8
                          text-slate-600
                          sm:text-base
                        "
                      >
{firstContent || "At Paragon School, we take immense pride in our association with Mohali Defence Academy, India's leading NDA coaching institute. Together, we provide exceptional guidance and comprehensive preparation, giving students the tools, knowledge and confidence to achieve their NDA dreams."}
                      </p>
                    </div>
                  </div>
                </Reveal>

                <Reveal
                  direction="right"
                  delay={160}
                >
                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-[24px]
                      bg-navy
                      p-7
                      text-white
                      shadow-[0_22px_60px_-35px_rgba(16,42,67,.65)]
                      sm:p-9
                    "
                  >
                    {/* BACKGROUND GRID */}

                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        opacity-[.045]
                        [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)]
                        [background-size:30px_30px]
                      "
                    />

                    {/* CIRCLE */}

                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        -right-16
                        -top-16
                        size-44
                        rounded-full
                        border-[28px]
                        border-gold/10
                      "
                    />

                    <div className="relative flex gap-5">

                      <span
                        className="
                          mt-1
                          hidden
                          size-10
                          shrink-0
                          place-items-center
                          rounded-xl
                          bg-white/10
                          text-gold
                          sm:grid
                        "
                      >
                        <Shield size={20} />
                      </span>

                      <p
                        className="
                          text-[15px]
                          leading-8
                          text-slate-200
                          sm:text-base
                        "
                      >
{secondContent || "At Paragon School, we are more than educators—we are mentors shaping future leaders. Students gain the skills and knowledge to excel in NDA exams and emerge as confident individuals ready to serve the nation."}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          ANIMATION CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           BASE REVEAL
        ===================================================== */

        .nda-reveal {
          opacity: 0;

          transition:
            opacity .85s cubic-bezier(.22,1,.36,1),
            transform .95s cubic-bezier(.22,1,.36,1);

          will-change: transform, opacity;
        }

        .nda-reveal-up {
          transform: translateY(55px);
        }

        .nda-reveal-left {
          transform: translateX(-60px);
        }

        .nda-reveal-right {
          transform: translateX(60px);
        }

        .nda-reveal-scale {
          transform:
            translateY(35px)
            scale(.94);
        }

        .nda-reveal.nda-visible {
          opacity: 1;
          transform: none;
        }


        /* =====================================================
           IMAGE ENTRANCE
        ===================================================== */

        .nda-reveal-scale.nda-visible figure {
          animation:
            ndaImageFloat
            6s
            ease-in-out
            1s
            infinite;
        }

        @keyframes ndaImageFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .nda-reveal,
          .nda-reveal-up,
          .nda-reveal-left,
          .nda-reveal-right,
          .nda-reveal-scale {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .nda-reveal-scale.nda-visible figure {
            animation: none !important;
          }
        }

      `}</style>
    </>
  );
}