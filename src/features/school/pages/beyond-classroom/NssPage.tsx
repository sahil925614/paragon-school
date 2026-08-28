import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ArrowLeft,
  Check,
  HeartHandshake,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

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
  title?: string;
  description?: string | null;
  images?: ActivityCardImage[];
};

type NssSection = {
  id?: number;
  type: string;
  name?: string;
  title?: string | null;
  description?: string | null;
  button_text?: string | null;
  button_url?: string | null;
  image?: string | null;
  image_url?: string | null;
  settings?: {
    cards?: ActivityCard[];
  } | [];
  sort_order?: number;
  is_active: boolean;
};

type NssPageData = {
  id?: number;
  site_id?: number;
  title: string;
  slug: string;
  template?: string;
  seo?: PageSeo;
  sections: NssSection[];
};

/* =========================================================
   MEDIA
========================================================= */

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(
  image?: string | null,
  imageUrl?: string | null,
) {
  if (image) {
    return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  }

  if (imageUrl && !imageUrl.includes("localhost")) {
    return imageUrl;
  }

  return undefined;
}

/* =========================================================
   HTML HELPERS
========================================================= */

function plainText(html?: string | null) {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract normal paragraphs from the HTML.
 * Lists are handled separately.
 */
function extractParagraphs(html?: string | null) {
  if (!html) return [];

  const matches = [...html.matchAll(/<p[^>]*>(.*?)<\/p>/gis)];

  return matches
    .map((match) => plainText(match[1]))
    .filter(Boolean);
}

/**
 * Extract all <li> values from API description.
 */
function extractListItems(html?: string | null) {
  if (!html) return [];

  const matches = [...html.matchAll(/<li[^>]*>(.*?)<\/li>/gis)];

  return matches
    .map((match) => plainText(match[1]))
    .filter(Boolean);
}

/* =========================================================
   PAGE
========================================================= */

export function NssPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "nss"],

    queryFn: async () => {
      const response = await schoolApi.get<{
        data: NssPageData;
      }>("pages/nss");

      return response.data.data;
    },
  });

  /* =======================================================
     API SECTIONS
  ======================================================= */

  const banner = page?.sections.find(
    (section) =>
      section.type === "home_banner" &&
      section.is_active,
  );

  const content = page?.sections.find(
    (section) =>
      section.type === "activity_cards_content" &&
      section.is_active,
  );

  const cards =
    content?.settings &&
    !Array.isArray(content.settings)
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
    plainText(banner?.description) ||
    "Explore NSS at Paragon Senior School.";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="overflow-hidden bg-[#fcfbf8]">

      {/* =====================================================
          PAGE BANNER
      ===================================================== */}

      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={
          banner?.title ||
          page?.title ||
          "NSS"
        }
        description={bannerDescription}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">

        {/* BACKGROUND DECORATION */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-44
            top-24
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
            border-[55px]
            border-gold/[.055]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[-130px]
            left-[18%]
            size-72
            rounded-full
            bg-navy/[.018]
          "
        />

        <div className="container relative">

          {/* =================================================
              SECTION HEADING
          ================================================= */}

          <header className="mx-auto max-w-4xl text-center">

            <div
              className="
                mx-auto
                grid
                size-14
                place-items-center
                rounded-2xl
                bg-navy
                text-gold
                shadow-[0_15px_35px_-18px_rgba(16,42,67,.55)]
              "
            >
              <HeartHandshake
                size={25}
                strokeWidth={1.8}
              />
            </div>

            <p
              className="
                mt-6
                text-[11px]
                font-bold
                uppercase
                tracking-[.22em]
                text-gold-dark
              "
            >
              National Service Scheme
            </p>

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
                "NATIONAL SERVICE SCHEME"}
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

          </header>

          {/* =================================================
              API CARDS
          ================================================= */}

          <div className="mt-14 space-y-20 sm:mt-16 sm:space-y-24">

            {cards.map((card, cardIndex) => {

              /* ===============================================
                 CARD DATA
              =============================================== */

              const images =
                card.images
                  ?.map((item) =>
                    mediaUrl(
                      item.image,
                      item.image_url,
                    ),
                  )
                  .filter(
                    (image): image is string =>
                      Boolean(image),
                  ) ?? [];

              const paragraphs =
                extractParagraphs(
                  card.description,
                );

              const activities =
                extractListItems(
                  card.description,
                );

              /*
               * API currently has:
               *
               * paragraph 1 = main NSS description
               * paragraph 2 = activity introduction
               */

              const mainParagraph =
                paragraphs[0] || "";

              const activitiesHeading =
                paragraphs[1] || "";

              return (
                <article
                  key={`${card.title}-${cardIndex}`}
                  className="
                    mx-auto
                    max-w-6xl
                  "
                >

                  {/* =============================================
                      CARD TITLE
                  ============================================= */}

                  {card.title && (
                    <div className="mb-8 sm:mb-10">

                      <div className="flex items-center gap-3">

                        <span
                          className="
                            grid
                            size-10
                            place-items-center
                            rounded-xl
                            border
                            border-gold/20
                            bg-[#f8f2df]
                            text-gold-dark
                          "
                        >
                          <HeartHandshake
                            size={18}
                            strokeWidth={1.8}
                          />
                        </span>

                        <p
                          className="
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[.2em]
                            text-gold-dark
                          "
                        >
                          NSS Programme
                        </p>

                      </div>

                      <h3
                        className="
                          mt-4
                          font-serif
                          text-3xl
                          leading-tight
                          text-navy
                          sm:text-4xl
                        "
                      >
                        {card.title}
                      </h3>

                      <div className="mt-4 h-[2px] w-12 bg-gold" />

                    </div>
                  )}

                  {/* =============================================
                      IMAGE GALLERY
                  ============================================= */}

                  {images.length > 0 && (
                    <div
                      className={`
                        relative
                        grid
                        gap-5

                        ${
                          images.length === 1
                            ? "grid-cols-1"
                            : "md:grid-cols-2"
                        }
                      `}
                    >

                      {/* DECORATION */}

                      <div
                        aria-hidden="true"
                        className="
                          pointer-events-none
                          absolute
                          -bottom-5
                          -left-5
                          hidden
                          h-[72%]
                          w-[60%]
                          rounded-[30px]
                          bg-navy
                          lg:block
                        "
                      />

                      <div
                        aria-hidden="true"
                        className="
                          pointer-events-none
                          absolute
                          -right-4
                          -top-4
                          hidden
                          size-28
                          rounded-full
                          border-[16px]
                          border-gold/20
                          lg:block
                        "
                      />

                      {images.map(
                        (image, imageIndex) => (
                          <figure
                            key={`${image}-${imageIndex}`}
                            className="
                              group
                              relative
                              overflow-hidden
                              rounded-[26px]
                              bg-white
                              p-2
                              shadow-[0_25px_65px_-38px_rgba(16,42,67,.55)]
                            "
                          >

                            <div
                              className="
                                relative
                                overflow-hidden
                                rounded-[20px]
                                bg-[#eef1f3]
                              "
                            >

                              <img
                                src={image}
                                alt={`${card.title || "NSS"} activity ${imageIndex + 1}`}
                                loading={
                                  cardIndex === 0 &&
                                  imageIndex < 2
                                    ? "eager"
                                    : "lazy"
                                }
                                className="
                                  aspect-[16/9]
                                  w-full
                                  object-contain
                                  transition
                                  duration-700
                                  ease-out
                                  group-hover:scale-[1.015]
                                "
                              />

                              <div
                                aria-hidden="true"
                                className="
                                  pointer-events-none
                                  absolute
                                  inset-x-0
                                  bottom-0
                                  h-16
                                  bg-gradient-to-t
                                  from-navy/10
                                  to-transparent
                                "
                              />

                              <span
                                className="
                                  absolute
                                  bottom-4
                                  right-4
                                  grid
                                  size-9
                                  place-items-center
                                  rounded-full
                                  bg-navy/80
                                  text-white
                                  opacity-0
                                  backdrop-blur
                                  transition
                                  duration-300
                                  group-hover:opacity-100
                                "
                              >
                                <ImageIcon
                                  size={15}
                                />
                              </span>

                            </div>

                          </figure>
                        ),
                      )}

                    </div>
                  )}

                  {/* =============================================
                      INTRODUCTION
                  ============================================= */}

                  {mainParagraph && (
                    <section
                      className="
                        mt-12
                        grid
                        gap-7
                        lg:grid-cols-[.28fr_.72fr]
                        lg:gap-14
                      "
                    >

                      {/* LEFT */}

                      <div>

                        <p
                          className="
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[.2em]
                            text-gold-dark
                          "
                        >
                          National Service Scheme
                        </p>

                        <h3
                          className="
                            mt-3
                            font-serif
                            text-2xl
                            leading-tight
                            text-navy
                            sm:text-3xl
                          "
                        >
                          Social Service & Welfare
                        </h3>

                        <div className="mt-5 h-[2px] w-10 bg-gold" />

                      </div>

                      {/* RIGHT */}

                      <div
                        className="
                          relative
                          overflow-hidden
                          rounded-[26px]
                          border
                          border-slate-200/80
                          bg-white
                          p-7
                          shadow-[0_22px_65px_-45px_rgba(16,42,67,.45)]
                          sm:p-9
                        "
                      >

                        <span
                          aria-hidden="true"
                          className="
                            absolute
                            left-0
                            top-0
                            h-full
                            w-1
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
                          {mainParagraph}
                        </p>

                      </div>

                    </section>
                  )}

                  {/* =============================================
                      ACTIVITIES
                  ============================================= */}

                  {activities.length > 0 && (
                    <section className="mt-14 sm:mt-16">

                      <div className="max-w-4xl">

                        <p
                          className="
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[.2em]
                            text-gold-dark
                          "
                        >
                          NSS Activities
                        </p>

                        {activitiesHeading && (
                          <h3
                            className="
                              mt-3
                              font-serif
                              text-2xl
                              leading-tight
                              text-navy
                              sm:text-3xl
                              lg:text-4xl
                            "
                          >
                            {activitiesHeading}
                          </h3>
                        )}

                        <div className="mt-5 h-[2px] w-12 bg-gold" />

                      </div>

                      {/* ACTIVITY GRID */}

                      <div
                        className="
                          mt-9
                          overflow-hidden
                          rounded-[28px]
                          border
                          border-slate-200/80
                          bg-white
                          shadow-[0_24px_70px_-48px_rgba(16,42,67,.5)]
                        "
                      >

                        <div
                          className="
                            grid
                            lg:grid-cols-2
                          "
                        >

                          {activities.map(
                            (
                              activity,
                              activityIndex,
                            ) => (
                              <div
                                key={`${activity}-${activityIndex}`}
                                className="
                                  group
                                  relative
                                  flex
                                  items-start
                                  gap-4
                                  border-b
                                  border-slate-100
                                  px-6
                                  py-5
                                  transition
                                  duration-300
                                  hover:bg-[#fbfaf7]
                                  sm:px-7
                                  lg:border-r
                                  lg:even:border-r-0
                                "
                              >

                                <span
                                  className="
                                    mt-0.5
                                    grid
                                    size-8
                                    shrink-0
                                    place-items-center
                                    rounded-lg
                                    bg-[#f8f2df]
                                    text-gold-dark
                                    transition
                                    duration-300
                                    group-hover:bg-navy
                                    group-hover:text-white
                                  "
                                >
                                  <Check
                                    size={14}
                                    strokeWidth={3}
                                  />
                                </span>

                                <div className="min-w-0 flex-1">

                                  <span
                                    className="
                                      mb-1
                                      block
                                      text-[10px]
                                      font-bold
                                      tracking-[.14em]
                                      text-slate-400
                                    "
                                  >
                                    {String(
                                      activityIndex +
                                        1,
                                    ).padStart(
                                      2,
                                      "0",
                                    )}
                                  </span>

                                  <p
                                    className="
                                      text-[14px]
                                      leading-7
                                      text-slate-600
                                      sm:text-[15px]
                                    "
                                  >
                                    {activity}
                                  </p>

                                </div>

                              </div>
                            ),
                          )}

                        </div>

                      </div>

                    </section>
                  )}

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
                shadow-sm
              "
            >
              <HeartHandshake
                size={28}
                className="mx-auto text-gold-dark"
              />

              <p className="mt-4 text-sm text-slate-500">
                NSS content is currently unavailable.
              </p>
            </div>
          )}

          {/* =================================================
              BACK
          ================================================= */}

          <div
            className="
              mx-auto
              mt-16
              max-w-6xl
              border-t
              border-slate-200
              pt-8
            "
          >

            <Link
              to="/school"
              className="
                group
                inline-flex
                items-center
                gap-3
                text-sm
                font-bold
                text-navy
                transition
                duration-300
                hover:text-gold-dark
              "
            >

              <span
                className="
                  grid
                  size-9
                  place-items-center
                  rounded-full
                  border
                  border-navy/10
                  bg-white
                  transition
                  duration-300
                  group-hover:-translate-x-1
                  group-hover:border-gold/40
                "
              >
                <ArrowLeft size={16} />
              </span>

              Back to home

            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}