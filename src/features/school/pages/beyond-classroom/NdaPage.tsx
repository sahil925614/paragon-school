import { Award, Shield, Target, Image as ImageIcon } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { useEffect, useRef, type ReactNode } from "react";

import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

/* =========================================================
   TYPES
========================================================= */

type ActivityCardImage = {
  image?: string | null;
  image_url?: string | null;
};

type ActivityCard = {
  title?: string | null;
  description?: string | null;
  images?: ActivityCardImage[] | null;
};

type ActivityCardsSettings = {
  cards?: ActivityCard[] | null;
};

type NdaSection = {
  id?: number;
  type: string;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  button_text?: string | null;
  button_url?: string | null;
  image?: string | null;
  image_url?: string | null;
  settings?: ActivityCardsSettings | [];
  sort_order?: number;
  is_active: boolean;
};

type NdaPageData = {
  id?: number;
  site_id?: number;
  title: string;
  slug: string;
  template?: string;
  is_home?: boolean;
  seo?: PageSeo;
  sections: NdaSection[];
};

/* =========================================================
   STORAGE
========================================================= */

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

/* =========================================================
   HELPERS
========================================================= */

function mediaUrl(
  image?: string | null,
  imageUrl?: string | null,
): string | undefined {
  /*
   * Prefer valid full image_url from API.
   */
  if (
    imageUrl &&
    !imageUrl.includes("localhost") &&
    /^https?:\/\//i.test(imageUrl)
  ) {
    return imageUrl;
  }

  /*
   * Build full URL from storage path.
   */
  if (image) {
    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  }

  /*
   * Final relative image_url fallback.
   */
  if (imageUrl && !imageUrl.includes("localhost")) {
    return imageUrl;
  }

  return undefined;
}

function decodeHtml(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&ldquo;/gi, "“")
    .replace(/&rdquo;/gi, "”")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&rsquo;/gi, "’");
}

function plainText(html?: string | null): string {
  if (!html) return "";

  return decodeHtml(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function extractParagraphs(html?: string | null): string[] {
  if (!html) return [];

  const matches = [...html.matchAll(/<p[^>]*>(.*?)<\/p>/gis)];

  if (!matches.length) {
    const text = plainText(html);
    return text ? [text] : [];
  }

  return matches
    .map((match) => plainText(match[1]))
    .filter((paragraph): paragraph is string => Boolean(paragraph));
}

/* =========================================================
   FALLBACK DATA
========================================================= */

const fallbackImage = "/images/nda.webp";

const fallbackParagraphs = [
  "At Paragon School, we take immense pride in our association with Mohali Defence Academy, India’s No. 1 NDA Coaching Institute. Together, we aim to provide exceptional guidance and comprehensive preparation for students aspiring to join the National Defence Academy (NDA). With our collaborative efforts, we are setting the gold standard in NDA coaching, ensuring every student has the tools, knowledge, and confidence to achieve their dreams.",

  "At Paragon School, we are more than educators—we are mentors shaping the future of young leaders. Our students are equipped with the skills and knowledge to excel in NDA exams and emerge as confident individuals ready to serve the nation.",
];

/* =========================================================
   SCROLL REVEAL
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

    if (!("IntersectionObserver" in window)) {
      element.classList.add("nda-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        element.classList.add("nda-visible");
        observer.unobserve(element);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -35px 0px",
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
  /* =======================================================
     API
  ======================================================= */

  const { data: page } = useQuery({
    queryKey: ["school-page", "nda"],

    queryFn: async () => {
      const response = await schoolApi.get<{
        data: NdaPageData;
      }>("pages/nda");

      return response.data.data;
    },
  });

  /* =======================================================
     SECTIONS
  ======================================================= */

  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );

  const content = page?.sections.find(
    (section) => section.type === "activity_cards_content" && section.is_active,
  );

  /* =======================================================
     CARDS
  ======================================================= */

  const cards: ActivityCard[] =
    content?.settings && !Array.isArray(content.settings)
      ? (content.settings.cards ?? [])
      : [];

  /* =======================================================
     SEO
  ======================================================= */

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  /* =======================================================
     BANNER
  ======================================================= */

  const bannerDescription =
    plainText(banner?.description) || "Explore NDA at Paragon Senior School.";

  return (
    <>
      <main className="overflow-hidden bg-[#fcfbf8]">
        {/* =====================================================
            PAGE BANNER
        ===================================================== */}

        <PageBanner
          image={banner?.image}
          imageUrl={banner?.image_url}
          title={banner?.title || page?.title || "NDA"}
          description={bannerDescription}
        />

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <section
          className="
            relative
            overflow-hidden
            py-16
            sm:py-20
            lg:py-24
          "
        >
          {/* BACKGROUND DECORATIONS */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -left-44
              top-20
              size-[430px]
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
              border-[58px]
              border-gold/[.055]
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
                SECTION HEADING
            ================================================= */}

            <Reveal direction="up" className="mx-auto max-w-4xl text-center">
            

              <h2
                className="
                  mt-3
                  font-serif
                  text-3xl
                  leading-tight
                  text-navy
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {content?.title || page?.title || "NDA"}
              </h2>

              <div
                aria-hidden="true"
                className="
                  mx-auto
                  mt-6
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <span className="h-[2px] w-10 bg-gold" />
                <span className="size-1.5 rotate-45 bg-gold" />
                <span className="h-[2px] w-10 bg-gold" />
              </div>
            </Reveal>

            {/* =================================================
                DYNAMIC API CARDS
            ================================================= */}

            <div
              className="
                mx-auto
                mt-14
                max-w-6xl
                space-y-16
                sm:mt-16
              "
            >
              {cards.map((card, cardIndex) => {
                /* =============================================
                   CARD DATA
                ============================================= */

                const cardTitle =
                  card.title ||
                  "Mohali Defence Academy: Achieve Your NDA Dreams with Paragon School";

                const apiImages =
                  card.images
                    ?.map((item) => mediaUrl(item.image, item.image_url))
                    .filter((image): image is string => Boolean(image)) ?? [];

                const displayedImages =
                  apiImages.length > 0 ? apiImages : [fallbackImage];

                const paragraphs = extractParagraphs(card.description);

                const displayedParagraphs =
                  paragraphs.length > 0 ? paragraphs : fallbackParagraphs;

                return (
                  <article
                    key={`${cardTitle}-${cardIndex}`}
                    className="
                      overflow-hidden
                      rounded-[30px]
                      border
                      border-slate-200/80
                      bg-white
                      shadow-[0_30px_80px_-48px_rgba(16,42,67,.5)]
                    "
                  >
                    {/* =========================================
                        CARD TITLE
                    ========================================= */}

                    <Reveal direction="up">
                      <div
                        className="
                          relative
                          overflow-hidden
                          border-b
                          border-slate-100
                          bg-[#f7f5ef]
                          px-6
                          py-8
                          sm:px-9
                          sm:py-9
                          lg:px-11
                        "
                      >
                        {/* decorative circle */}

                        <div
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-16
                            size-48
                            rounded-full
                            border-[30px]
                            border-gold/[.08]
                          "
                        />

                        <div className="relative">
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <span
                              className="
                                grid
                                size-10
                                place-items-center
                                rounded-xl
                                bg-navy
                                text-gold
                              "
                            >
                              <Shield size={18} />
                            </span>

                            <span
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[.18em]
                                text-gold-dark
                              "
                            >
                              Defence Preparation
                            </span>
                          </div>

                          <h3
                            className="
                              mt-5
                              max-w-4xl
                              font-serif
                              text-2xl
                              leading-tight
                              text-navy
                              sm:text-3xl
                              lg:text-[38px]
                            "
                          >
                            {cardTitle}
                          </h3>

                          <div className="mt-5 h-[2px] w-12 bg-gold" />
                        </div>
                      </div>
                    </Reveal>

                    {/* =========================================
                        IMAGE
                    ========================================= */}

                    {displayedImages.map((image, imageIndex) => (
                      <Reveal
                        key={`${image}-${imageIndex}`}
                        direction="scale"
                        delay={80}
                        className="
                            px-5
                            pt-6
                            sm:px-8
                            sm:pt-8
                            lg:px-10
                            lg:pt-10
                          "
                      >
                        <figure
                          className="
                              nda-image-card
                              group
                              relative
                            "
                        >
                          {/* navy background block */}

                          <div
                            aria-hidden="true"
                            className="
                                absolute
                                -bottom-4
                                -left-4
                                h-[65%]
                                w-[58%]
                                rounded-[28px]
                                bg-navy
                              "
                          />

                          {/* gold decorative ring */}

                          <div
                            aria-hidden="true"
                            className="
                                absolute
                                -right-4
                                -top-4
                                size-28
                                rounded-full
                                border-[16px]
                                border-gold/20
                              "
                          />

                          {/* image frame */}

                          <div
                            className="
                                relative
                                overflow-hidden
                                rounded-[28px]
                                bg-white
                                p-2
                                shadow-[0_25px_65px_-35px_rgba(16,42,67,.5)]
                                sm:p-2.5
                              "
                          >
                            <div
                              className="
                                  relative
                                  flex
                                  min-h-[220px]
                                  items-center
                                  justify-center
                                  overflow-hidden
                                  rounded-[21px]
                                  bg-[#f2f1ed]
                                  sm:min-h-[320px]
                                  lg:min-h-[420px]
                                "
                            >
                              <img
                                src={image}
                                alt={`${cardTitle} - ${imageIndex + 1}`}
                                loading={imageIndex === 0 ? "eager" : "lazy"}
                                className="
                                    h-auto
                                    max-h-[620px]
                                    w-full
                                    object-contain
                                    transition
                                    duration-700
                                    ease-out
                                    group-hover:scale-[1.01]
                                  "
                              />

                              {/* subtle gradient */}

                              <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-x-0
                                    bottom-0
                                    h-24
                                    bg-gradient-to-t
                                    from-navy/[.08]
                                    to-transparent
                                  "
                              />
                            </div>
                          </div>

                          {/* photo badge */}

                          <div
                            className="
                                absolute
                                bottom-6
                                left-6
                                hidden
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-white/50
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
                              <ImageIcon size={16} />
                            </span>

                            <span
                              className="
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  tracking-[.13em]
                                  text-navy
                                "
                            >
                              NDA Programme
                            </span>
                          </div>
                        </figure>
                      </Reveal>
                    ))}

                    {/* =========================================
                        COMPLETE CONTENT
                    ========================================= */}

                    <Reveal
                      direction="up"
                      delay={100}
                      className="
                        px-6
                        pb-9
                        pt-12
                        sm:px-9
                        sm:pb-11
                        sm:pt-14
                        lg:px-11
                      "
                    >
                      <div
                        className="
                          grid
                          gap-8
                          lg:grid-cols-[.3fr_.7fr]
                          lg:gap-14
                        "
                      >
                        {/* LEFT INTRO */}

                        <div>
                          <div
                            className="
                              grid
                              size-13
                              place-items-center
                              rounded-2xl
                              bg-cream
                              text-gold-dark
                            "
                          >
                            <Award size={23} />
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

                          <h4
                            className="
                              mt-3
                              max-w-xs
                              font-serif
                              text-2xl
                              leading-tight
                              text-navy
                              sm:text-3xl
                            "
                          >
                            Preparing students for their NDA dreams.
                          </h4>

                          <div
                            className="
                              mt-5
                              flex
                              items-center
                              gap-2
                            "
                            aria-hidden="true"
                          >
                            <span className="h-[2px] w-10 bg-gold" />
                            <span className="size-1.5 rounded-full bg-navy" />
                          </div>
                        </div>

                        {/* ALL API PARAGRAPHS */}

                        <div className="space-y-5">
                          {displayedParagraphs.map(
                            (paragraph, paragraphIndex) => (
                              <div
                                key={`${paragraph}-${paragraphIndex}`}
                                className="
                                  relative
                                  overflow-hidden
                                  rounded-[22px]
                                  border
                                  border-slate-100
                                  bg-[#faf9f6]
                                  p-6
                                  sm:p-7
                                "
                              >
                                <span
                                  aria-hidden="true"
                                  className="
                                    absolute
                                    left-0
                                    top-0
                                    h-full
                                    w-[3px]
                                    bg-gold
                                  "
                                />

                                <p
                                  className="
                                    text-[15px]
                                    leading-8
                                    text-slate-600
                                    sm:text-base
                                  "
                                >
                                  {paragraph}
                                </p>
                              </div>
                            ),
                          )}

                          {/* final accent */}
                        </div>
                      </div>
                    </Reveal>
                  </article>
                );
              })}
            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {page && cards.length === 0 && (
              <div
                className="
                  mx-auto
                  mt-14
                  max-w-4xl
                  rounded-[26px]
                  border
                  border-slate-200
                  bg-white
                  p-8
                  text-center
                "
              >
                <Shield size={28} className="mx-auto text-gold-dark" />

                <p className="mt-4 text-sm text-slate-500">
                  NDA programme information is currently unavailable.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* =====================================================
          ANIMATION CSS
      ===================================================== */}

      <style>{`

        .nda-reveal {
          opacity: 0;

          transition:
            opacity .85s cubic-bezier(.22,1,.36,1),
            transform .95s cubic-bezier(.22,1,.36,1);

          will-change: transform, opacity;
        }

        .nda-reveal-up {
          transform: translateY(50px);
        }

        .nda-reveal-left {
          transform: translateX(-55px);
        }

        .nda-reveal-right {
          transform: translateX(55px);
        }

        .nda-reveal-scale {
          transform:
            translateY(28px)
            scale(.97);
        }

        .nda-reveal.nda-visible {
          opacity: 1;
          transform: none;
        }

        .nda-image-card {
          transition:
            transform .55s cubic-bezier(.22,1,.36,1);
        }

        .nda-image-card:hover {
          transform: translateY(-4px);
        }

        @media (max-width: 767px) {

          .nda-reveal-left,
          .nda-reveal-right {
            transform: translateY(40px);
          }

          .nda-reveal.nda-visible {
            transform: none;
          }

        }

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

          .nda-image-card {
            transform: none !important;
            transition: none !important;
          }

        }

      `}</style>
    </>
  );
}
