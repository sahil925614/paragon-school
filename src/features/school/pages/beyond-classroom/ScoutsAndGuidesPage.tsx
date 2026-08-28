import {
  Compass,
  Flag,
  Images,
  ShieldCheck,
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

type ScoutsSection = {
  id?: number;
  type: string;
  name?: string;
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

type ScoutsPageData = {
  id?: number;
  site_id?: number;
  title: string;
  slug: string;
  template?: string;
  is_home?: boolean;
  seo?: PageSeo;
  sections: ScoutsSection[];
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
  imageUrl?: string | null
): string | undefined {
  if (
    imageUrl &&
    !imageUrl.includes("localhost") &&
    /^https?:\/\//i.test(imageUrl)
  ) {
    return imageUrl;
  }

  if (image) {
    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  }

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
      .trim()
  );
}

function extractParagraphs(
  html?: string | null
): string[] {
  if (!html) return [];

  const matches = [
    ...html.matchAll(
      /<p[^>]*>(.*?)<\/p>/gis
    ),
  ];

  if (!matches.length) {
    const text = plainText(html);

    return text ? [text] : [];
  }

  return matches
    .map((match) =>
      plainText(match[1])
    )
    .filter(
      (paragraph): paragraph is string =>
        Boolean(paragraph)
    );
}

/* =========================================================
   FALLBACK
========================================================= */

const fallbackImages = [
  "/images/scouts-and-guides.webp",
  "/images/scouts-and-guides-2.webp",
];

const fallbackParagraphs = [
  "The little champs of Paragon actively participated in the Scout and Guide Camp “Tritya Charan” held during school hours. Over fifty students from classes III to VI enthusiastically engaged in various activities such as the Flag Song, Scout and Guide Prayer, Scout Sign, and Basic Knot Skills.",

  "These activities helped students develop their character, enhance essential life skills, and cultivate a strong spirit of service. The camp also provided an opportunity for the scouts to learn tent-setting techniques and perform various related tasks, fostering teamwork, discipline, and self-reliance.",

  "This enriching experience was instrumental in shaping confident and responsible young individuals, ready to contribute positively to their community.",
];

/* =========================================================
   REVEAL
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
  direction?:
    | "up"
    | "left"
    | "right"
    | "scale";
}) {
  const ref =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    if (
      !("IntersectionObserver" in window)
    ) {
      element.classList.add(
        "scout-visible"
      );
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          element.classList.add(
            "scout-visible"
          );

          observer.unobserve(element);
        },
        {
          threshold: 0.1,
          rootMargin:
            "0px 0px -35px 0px",
        }
      );

    observer.observe(element);

    return () =>
      observer.disconnect();
  }, []);

  const directionClass = {
    up: "scout-reveal-up",
    left: "scout-reveal-left",
    right: "scout-reveal-right",
    scale: "scout-reveal-scale",
  }[direction];

  return (
    <div
      ref={ref}
      className={`scout-reveal ${directionClass} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   IMAGE GALLERY
========================================================= */

function ScoutsGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (!images.length) return null;

  return (
    <div
      className={`
        grid
        gap-5

        ${
          images.length === 1
            ? "grid-cols-1"
            : "md:grid-cols-2"
        }
      `}
    >
      {images.map(
        (image, index) => (
          <figure
            key={`${image}-${index}`}
            className="
              scout-image-card
              group
              relative
            "
          >
            {/* BACKGROUND SHAPE */}

            <div
              aria-hidden="true"
              className={`
                absolute
                -bottom-4
                h-[72%]
                w-[72%]
                rounded-[28px]

                ${
                  index % 2 === 0
                    ? "-left-4 bg-navy"
                    : "-right-4 bg-gold/20"
                }
              `}
            />

            {/* DECORATIVE RING */}

            <div
              aria-hidden="true"
              className={`
                absolute
                -top-4
                size-24
                rounded-full
                border-[14px]

                ${
                  index % 2 === 0
                    ? "-right-4 border-gold/20"
                    : "-left-4 border-navy/[.07]"
                }
              `}
            />

            {/* IMAGE FRAME */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                bg-white
                p-2
                shadow-[0_25px_65px_-35px_rgba(16,42,67,.5)]
              "
            >
              <div
                className="
                  relative
                  flex
                  aspect-[4/3]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[22px]
                  bg-[#f2f1ed]
                "
              >
                <img
                  src={image}
                  alt={`${title} image ${
                    index + 1
                  }`}
                  loading={
                    index === 0
                      ? "eager"
                      : "lazy"
                  }
                  className="
                    h-full
                    w-full
                    object-contain
                    transition
                    duration-700
                    ease-out
                    group-hover:scale-[1.02]
                  "
                />
              </div>
            </div>

            {/* IMAGE NUMBER */}

            <span
              className={`
                absolute
                -bottom-3
                grid
                size-11
                place-items-center
                rounded-xl
                text-[11px]
                font-bold
                shadow-lg

                ${
                  index % 2 === 0
                    ? "right-7 bg-gold text-white"
                    : "left-7 bg-navy text-gold"
                }
              `}
            >
              {String(
                index + 1
              ).padStart(2, "0")}
            </span>
          </figure>
        )
      )}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export function ScoutsAndGuidesPage() {
  const { data: page } = useQuery({
    queryKey: [
      "school-page",
      "scouts-and-guides",
    ],

    queryFn: async () => {
      const response =
        await schoolApi.get<{
          data: ScoutsPageData;
        }>(
          "pages/scouts-and-guides"
        );

      return response.data.data;
    },
  });

  /* =======================================================
     SECTIONS
  ======================================================= */

  const banner = page?.sections.find(
    (section) =>
      section.type ===
        "home_banner" &&
      section.is_active
  );

  const content = page?.sections.find(
    (section) =>
      section.type ===
        "activity_cards_content" &&
      section.is_active
  );

  /* =======================================================
     CARDS
  ======================================================= */

  const cards: ActivityCard[] =
    content?.settings &&
    !Array.isArray(
      content.settings
    )
      ? content.settings.cards ?? []
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
    plainText(
      banner?.description
    ) ||
    "Explore Scouts And Guides at Paragon Senior School.";

  return (
    <>
      <main className="overflow-hidden bg-[#fcfbf8]">

        {/* ===================================================
            BANNER
        =================================================== */}

        <PageBanner
          image={banner?.image}
          imageUrl={
            banner?.image_url
          }
          title={
            banner?.title ||
            page?.title ||
            "Scouts And Guides"
          }
          description={
            bannerDescription
          }
        />

        {/* ===================================================
            CONTENT
        =================================================== */}

        <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">

          {/* BACKGROUND */}

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
              top-[42%]
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
              bottom-12
              left-[22%]
              size-56
              rounded-full
              bg-navy/[.018]
            "
          />

          <div className="container relative">

            {/* ===============================================
                SECTION HEADING
            =============================================== */}

            <Reveal
              direction="up"
              className="
                mx-auto
                max-w-4xl
                text-center
              "
            >
             

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
                {content?.title ||
                  page?.title ||
                  "Scouts And Guides"}
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

            {/* ===============================================
                DYNAMIC CARDS
            =============================================== */}

            <div
              className="
                mx-auto
                mt-14
                max-w-6xl
                space-y-16
                sm:mt-16
                sm:space-y-20
              "
            >
              {cards.map(
                (card, cardIndex) => {
                  const apiImages =
                    card.images
                      ?.map(
                        (item) =>
                          mediaUrl(
                            item.image,
                            item.image_url
                          )
                      )
                      .filter(
                        (
                          image
                        ): image is string =>
                          Boolean(
                            image
                          )
                      ) ?? [];

                  /*
                   * Only fallback when API
                   * provides no images.
                   */
                  const displayedImages =
                    apiImages.length
                      ? apiImages
                      : fallbackImages;

                  const paragraphs =
                    extractParagraphs(
                      card.description
                    );

                  const displayedParagraphs =
                    paragraphs.length
                      ? paragraphs
                      : fallbackParagraphs;

                  const cardTitle =
                    card.title ||
                    "Scouts and Guides Camp “Tritya Charan”";

                  return (
                    <article
                      key={`${cardTitle}-${cardIndex}`}
                      className="
                        overflow-hidden
                        rounded-[30px]
                        border
                        border-slate-200/80
                        bg-white
                        shadow-[0_28px_80px_-50px_rgba(16,42,67,.5)]
                      "
                    >
                      {/* =======================================
                          CARD HEADER
                      ======================================= */}

                      <Reveal direction="up">

                        <div
                          className="
                            relative
                            overflow-hidden
                            border-b
                            border-slate-100
                            bg-[#f8f6f0]
                            px-6
                            py-7
                            sm:px-8
                            sm:py-8
                            lg:px-10
                          "
                        >
                          <div
                            aria-hidden="true"
                            className="
                              pointer-events-none
                              absolute
                              -right-16
                              -top-16
                              size-44
                              rounded-full
                              border-[28px]
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
                                <Flag
                                  size={18}
                                />
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
                                Camp Experience
                              </span>

                            </div>

                            <h3
                              className="
                                mt-5
                                max-w-4xl
                                font-serif
                                text-3xl
                                leading-tight
                                text-navy
                                sm:text-4xl
                              "
                            >
                              {cardTitle}
                            </h3>

                            <div className="mt-5 h-[2px] w-12 bg-gold" />

                          </div>

                        </div>

                      </Reveal>

                      {/* =======================================
                          ALL IMAGES TOGETHER
                      ======================================= */}

                      {displayedImages.length >
                        0 && (
                        <Reveal
                          direction="scale"
                          className="
                            px-6
                            pt-9
                            sm:px-8
                            sm:pt-10
                            lg:px-10
                          "
                        >
                          <div
                            className="
                              mb-6
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <Images
                              size={17}
                              className="text-gold-dark"
                            />

                            <span
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[.18em]
                                text-slate-400
                              "
                            >
                              {displayedImages.length}{" "}
                              {displayedImages.length ===
                              1
                                ? "Photograph"
                                : "Photographs"}
                            </span>
                          </div>

                          <ScoutsGallery
                            images={
                              displayedImages
                            }
                            title={
                              cardTitle
                            }
                          />

                        </Reveal>
                      )}

                      {/* =======================================
                          COMPLETE DESCRIPTION
                      ======================================= */}

                      <Reveal
                        direction="up"
                        delay={80}
                        className="
                          px-6
                          pb-8
                          pt-12
                          sm:px-8
                          sm:pb-10
                          sm:pt-14
                          lg:px-10
                        "
                      >
                        <div
                          className="
                            grid
                            gap-8
                            lg:grid-cols-[.28fr_.72fr]
                            lg:gap-12
                          "
                        >
                          {/* LEFT */}

                          <div>

                            <div
                              className="
                                grid
                                size-12
                                place-items-center
                                rounded-2xl
                                bg-cream
                                text-gold-dark
                              "
                            >
                              <ShieldCheck
                                size={21}
                              />
                            </div>

                            <p
                              className="
                                mt-5
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[.19em]
                                text-gold-dark
                              "
                            >
                              Scouts & Guides
                            </p>

                            <h4
                              className="
                                mt-3
                                font-serif
                                text-2xl
                                leading-tight
                                text-navy
                              "
                            >
                              Camp Details
                            </h4>

                            <div className="mt-4 h-[2px] w-10 bg-gold" />

                          </div>

                          {/* ALL PARAGRAPHS */}

                          <div
                            className="
                              space-y-5
                              text-[15px]
                              leading-8
                              text-slate-600
                              sm:text-base
                            "
                          >
                            {displayedParagraphs.map(
                              (
                                paragraph,
                                paragraphIndex
                              ) => (
                                <p
                                  key={`${paragraph}-${paragraphIndex}`}
                                >
                                  {
                                    paragraph
                                  }
                                </p>
                              )
                            )}
                          </div>

                        </div>

                      </Reveal>

                    </article>
                  );
                }
              )}
            </div>

            {/* ===============================================
                EMPTY STATE
            =============================================== */}

            {page &&
              cards.length === 0 && (
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
                  <Flag
                    size={28}
                    className="mx-auto text-gold-dark"
                  />

                  <p className="mt-4 text-sm text-slate-500">
                    Scouts and Guides
                    content is currently
                    unavailable.
                  </p>
                </div>
              )}

          </div>

        </section>

      </main>

      {/* =====================================================
          ANIMATION
      ===================================================== */}

      <style>{`

        .scout-reveal {
          opacity: 0;

          transition:
            opacity .85s cubic-bezier(.22,1,.36,1),
            transform .95s cubic-bezier(.22,1,.36,1);

          will-change: transform, opacity;
        }

        .scout-reveal-up {
          transform: translateY(50px);
        }

        .scout-reveal-left {
          transform: translateX(-55px);
        }

        .scout-reveal-right {
          transform: translateX(55px);
        }

        .scout-reveal-scale {
          transform:
            translateY(25px)
            scale(.97);
        }

        .scout-reveal.scout-visible {
          opacity: 1;
          transform: none;
        }

        .scout-image-card {
          transition:
            transform .55s cubic-bezier(.22,1,.36,1);
        }

        .scout-image-card:hover {
          transform: translateY(-5px);
        }

        @media (max-width: 767px) {

          .scout-reveal-left,
          .scout-reveal-right {
            transform: translateY(40px);
          }

          .scout-reveal.scout-visible {
            transform: none;
          }

        }

        @media (prefers-reduced-motion: reduce) {

          .scout-reveal,
          .scout-reveal-up,
          .scout-reveal-left,
          .scout-reveal-right,
          .scout-reveal-scale {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .scout-image-card {
            transform: none !important;
            transition: none !important;
          }

        }

      `}</style>
    </>
  );
}