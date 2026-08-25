import {
  Compass,
  Flag,
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

type ActivityCard = {
  title?: string;
  description?: string;
  image?: string;
  image_url?: string;
};

type ScoutsSection = {
  type: string;
  title: string;
  description?: string | null;
  is_active: boolean;
  settings?: { cards?: ActivityCard[] } | [];
};

type ScoutsPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: ScoutsSection[];
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
const images = [
  "/images/scouts-and-guides.webp",
  "/images/scouts-and-guides-2.webp",
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        element.classList.add("scout-visible");
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
   PAGE
========================================================= */

export function ScoutsAndGuidesPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "scouts-and-guides"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: ScoutsPageData }>(
        "pages/scouts-and-guides",
      );
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
  const apiImages = cards
    .map((card) => mediaUrl(card.image, card.image_url))
    .filter((image): image is string => Boolean(image));
  const displayedImages = apiImages.length >= 2 ? apiImages : images;
  const firstContent =
    plainText(cards[0]?.description) || plainText(content?.description);
  const secondContent = plainText(cards[1]?.description);
  const finalContent = plainText(cards[2]?.description);
  const description =
    plainText(banner?.description) ||
    "The little champs of Paragon actively participated in the Scout and Guide Camp Tritiya Charan.";

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <>
      <main className="overflow-hidden bg-[#fcfbf8]">

        {/* =====================================================
            PAGE BANNER
        ===================================================== */}

        <PageBanner
          title={banner?.title || page?.title || "Scouts and Guides"}
          description={description}
        />

        {/* =====================================================
            MAIN SECTION
        ===================================================== */}

        <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">

          {/* =================================================
              BACKGROUND CIRCLES
          ================================================= */}

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
              top-[35%]
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

            {/* =================================================
                INTRODUCTION
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
                Scouts & Guides
              </p>

              <h2
                className="
                  mt-4
                  font-serif
                  text-3xl
                  leading-tight
                  text-navy
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {content?.title || page?.title || "Scouts and Guides Camp"}
                <span className="block text-gold-dark">
                  “Tritya Charan”
                </span>
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
                FIRST CONTENT / IMAGE
            ================================================= */}

            <div
              className="
                mx-auto
                mt-12
                grid
                max-w-6xl
                items-center
                gap-10
                sm:mt-14
                lg:grid-cols-[1.08fr_.92fr]
                lg:gap-16
              "
            >

              {/* IMAGE 01 */}

              <Reveal direction="left">
                <figure className="scout-image-card group relative">

                  {/* BACK SHAPE */}

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      -bottom-5
                      -left-5
                      h-[75%]
                      w-[70%]
                      rounded-[28px]
                      bg-navy
                    "
                  />

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      -right-4
                      -top-4
                      size-28
                      rounded-full
                      border-[16px]
                      border-gold/25
                    "
                  />

                  {/* IMAGE */}

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
                    <div className="overflow-hidden rounded-[22px]">
                      <img
                        src={displayedImages[0]}
                        alt="Scouts and Guides Camp Tritya Charan 1"
                        className="
                          aspect-[4/3]
                          size-full
                          object-cover
                          transition
                          duration-700
                          ease-out
                          group-hover:scale-[1.035]
                        "
                      />
                    </div>
                  </div>

                  {/* NUMBER */}

                  <span
                    className="
                      absolute
                      -bottom-4
                      right-7
                      grid
                      size-12
                      place-items-center
                      rounded-xl
                      bg-gold
                      text-xs
                      font-bold
                      text-white
                      shadow-lg
                    "
                  >
                    01
                  </span>
                </figure>
              </Reveal>

              {/* CONTENT 01 */}

              <Reveal
                direction="right"
                delay={100}
              >
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
                    <Flag size={23} />
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
                    Camp Experience
                  </p>

                  <div className="mt-4 h-[2px] w-10 bg-gold" />

                  <p
                    className="
                      mt-6
                      text-[15px]
                      leading-8
                      text-slate-600
                      sm:text-base
                    "
                  >
                    {firstContent || "The little champs of Paragon actively participated in the Scout and Guide Camp Tritya Charan. Over fifty students from classes III to VI enthusiastically engaged in activities such as the Flag Song, Scout and Guide Prayer, Scout Sign, and Basic Knot Skills."}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* =================================================
                SECOND CONTENT / IMAGE
                REVERSED LAYOUT
            ================================================= */}

            <div
              className="
                mx-auto
                mt-20
                grid
                max-w-6xl
                items-center
                gap-10
                sm:mt-24
                lg:grid-cols-[.92fr_1.08fr]
                lg:gap-16
              "
            >

              {/* CONTENT 02 */}

              <Reveal
                direction="left"
                className="order-2 lg:order-1"
              >
                <div>
                  <div
                    className="
                      grid
                      size-13
                      place-items-center
                      rounded-2xl
                      bg-navy
                      text-gold
                      shadow-[0_12px_28px_-15px_rgba(16,42,67,.5)]
                    "
                  >
                    <Compass size={23} />
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
                    Learning Through Participation
                  </p>

                  <div className="mt-4 h-[2px] w-10 bg-gold" />

                  <p
                    className="
                      mt-6
                      text-[15px]
                      leading-8
                      text-slate-600
                      sm:text-base
                    "
                  >
                    {secondContent || "These activities helped students develop character, essential life skills, service, teamwork, discipline, self-reliance, tent-setting techniques and practical participation."}
                  </p>
                </div>
              </Reveal>

              {/* IMAGE 02 */}

              <Reveal
                direction="right"
                delay={100}
                className="order-1 lg:order-2"
              >
                <figure className="scout-image-card group relative">

                  {/* GOLD BACKGROUND */}

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      -bottom-5
                      -right-5
                      h-[75%]
                      w-[70%]
                      rounded-[28px]
                      bg-gold/20
                    "
                  />

                  {/* NAVY RING */}

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      -left-5
                      -top-5
                      size-28
                      rounded-full
                      border-[16px]
                      border-navy/[.08]
                    "
                  />

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
                    <div className="overflow-hidden rounded-[22px]">
                      <img
                        src={displayedImages[1]}
                        alt="Scouts and Guides Camp Tritya Charan 2"
                        className="
                          aspect-[4/3]
                          size-full
                          object-cover
                          transition
                          duration-700
                          ease-out
                          group-hover:scale-[1.035]
                        "
                      />
                    </div>
                  </div>

                  <span
                    className="
                      absolute
                      -bottom-4
                      left-7
                      grid
                      size-12
                      place-items-center
                      rounded-xl
                      bg-navy
                      text-xs
                      font-bold
                      text-gold
                      shadow-lg
                    "
                  >
                    02
                  </span>
                </figure>
              </Reveal>
            </div>

            {/* =================================================
                FINAL STATEMENT
            ================================================= */}

            <Reveal
              direction="up"
              delay={80}
              className="mx-auto mt-20 max-w-5xl sm:mt-24"
            >
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[28px]
                  bg-navy
                  px-7
                  py-10
                  text-center
                  shadow-[0_25px_65px_-38px_rgba(16,42,67,.65)]
                  sm:px-12
                  sm:py-12
                "
              >

                {/* GRID PATTERN */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-[.04]
                    [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)]
                    [background-size:30px_30px]
                  "
                />

                {/* DECORATIVE CIRCLE */}

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    -right-20
                    -top-20
                    size-52
                    rounded-full
                    border-[35px]
                    border-gold/10
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    -bottom-20
                    -left-20
                    size-48
                    rounded-full
                    bg-white/[.025]
                  "
                />

                <div className="relative">

                  <div
                    className="
                      mx-auto
                      grid
                      size-13
                      place-items-center
                      rounded-2xl
                      bg-white/10
                      text-gold
                    "
                  >
                    <ShieldCheck size={24} />
                  </div>

                  <div
                    className="
                      mx-auto
                      mt-6
                      h-[2px]
                      w-10
                      bg-gold
                    "
                  />

                  <p
                    className="
                      mx-auto
                      mt-6
                      max-w-3xl
                      font-serif
                      text-xl
                      leading-9
                      text-white
                      sm:text-2xl
                      sm:leading-10
                    "
                  >
                    {finalContent || "This enriching experience was instrumental in shaping confident and responsible young individuals, ready to contribute positively to their community."}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* =====================================================
          ANIMATION STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           REVEAL BASE
        ===================================================== */

        .scout-reveal {
          opacity: 0;

          transition:
            opacity .85s cubic-bezier(.22,1,.36,1),
            transform .95s cubic-bezier(.22,1,.36,1);

          will-change: transform, opacity;
        }


        .scout-reveal-up {
          transform: translateY(60px);
        }


        .scout-reveal-left {
          transform: translateX(-65px);
        }


        .scout-reveal-right {
          transform: translateX(65px);
        }


        .scout-reveal-scale {
          transform:
            translateY(35px)
            scale(.94);
        }


        .scout-reveal.scout-visible {
          opacity: 1;
          transform: none;
        }


        /* =====================================================
           IMAGE CARDS
        ===================================================== */

        .scout-image-card {
          transition:
            transform .55s cubic-bezier(.22,1,.36,1);
        }


        .scout-image-card:hover {
          transform: translateY(-5px);
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767px) {

          .scout-reveal-left,
          .scout-reveal-right {
            transform: translateY(45px);
          }


          .scout-reveal.scout-visible {
            transform: none;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

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