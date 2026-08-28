import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Plane,
  Shield,
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

type NccSection = {
  id?: number;
  type: string;
  name?: string;
  title?: string | null;
  description?: string | null;
  button_text?: string | null;
  button_url?: string | null;
  image?: string | null;
  image_url?: string | null;
  settings?:
    | {
        cards?: ActivityCard[];
      }
    | [];
  sort_order?: number;
  is_active: boolean;
};

type NccPageData = {
  id?: number;
  site_id?: number;
  title: string;
  slug: string;
  template?: string;
  seo?: PageSeo;
  sections: NccSection[];
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

function extractParagraphs(html?: string | null) {
  if (!html) return [];

  const matches = [...html.matchAll(/<p[^>]*>(.*?)<\/p>/gis)];

  return matches
    .map((match) => plainText(match[1]))
    .filter(Boolean);
}

function extractListItems(html?: string | null) {
  if (!html) return [];

  const matches = [...html.matchAll(/<li[^>]*>(.*?)<\/li>/gis)];

  return matches
    .map((match) => plainText(match[1]))
    .filter(Boolean);
}

function extractLinks(html?: string | null) {
  if (!html) return [];

  const matches = [
    ...html.matchAll(
      /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis,
    ),
  ];

  return matches
    .map((match) => ({
      url: match[1],
      text: plainText(match[2]) || "Open Link",
    }))
    .filter((link) => Boolean(link.url));
}

/* =========================================================
   ACTIVITY LIST
========================================================= */

function ActivityList({
  activities,
}: {
  activities: string[];
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[26px]
        border
        border-slate-200/80
        bg-white
        shadow-[0_22px_65px_-45px_rgba(16,42,67,.45)]
      "
    >
      {activities.map((activity, index) => (
        <div
          key={`${activity}-${index}`}
          className="
            group
            flex
            items-start
            gap-4
            border-b
            border-slate-100
            px-6
            py-5
            transition
            duration-300
            last:border-b-0
            hover:bg-[#fbfaf7]
            sm:px-7
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
            <Check size={14} strokeWidth={3} />
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
              {String(index + 1).padStart(2, "0")}
            </span>

            <p className="text-[14px] leading-7 text-slate-600 sm:text-[15px]">
              {activity}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   IMAGE GALLERY
========================================================= */

function WingGallery({
  images,
  title,
  number,
  reverse = false,
}: {
  images: string[];
  title: string;
  number: string;
  reverse?: boolean;
}) {
  if (!images.length) return null;

  return (
    <div className="relative">
      {/* background shape */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          bottom-[-18px]
          hidden
          h-[70%]
          w-[72%]
          rounded-[28px]
          sm:block
          ${
            reverse
              ? "-right-[18px] bg-gold/20"
              : "-left-[18px] bg-navy"
          }
        `}
      />

      {/* ring */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          -top-5
          hidden
          size-28
          rounded-full
          border-[16px]
          lg:block
          ${
            reverse
              ? "-left-5 border-navy/[.07]"
              : "-right-5 border-gold/20"
          }
        `}
      />

      {/* images */}

      <div
        className={`
          relative
          grid
          gap-4
          ${images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}
        `}
      >
        {images.map((image, index) => (
          <figure
            key={`${image}-${index}`}
            className="
              group
              overflow-hidden
              rounded-[24px]
              bg-white
              p-2
              shadow-[0_22px_60px_-35px_rgba(16,42,67,.5)]
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
                rounded-[18px]
                bg-[#eef1f3]
              "
            >
              <img
                src={image}
                alt={`${title} activity ${index + 1}`}
                loading={index < 2 ? "eager" : "lazy"}
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

              <span
                className="
                  absolute
                  bottom-3
                  right-3
                  grid
                  size-8
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
                <ImageIcon size={14} />
              </span>
            </div>
          </figure>
        ))}
      </div>

      {/* number */}

      <span
        className={`
          absolute
          -bottom-4
          grid
          size-12
          place-items-center
          rounded-xl
          text-xs
          font-bold
          shadow-lg
          ${
            reverse
              ? "left-7 bg-navy text-gold"
              : "right-7 bg-gold text-white"
          }
        `}
      >
        {number}
      </span>
    </div>
  );
}

/* =========================================================
   NCC WING
========================================================= */

function NccWing({
  card,
  index,
}: {
  card: ActivityCard;
  index: number;
}) {
  const isAirWing =
    card.title?.toLowerCase().includes("air wing") ?? false;

  const images =
    card.images
      ?.map((item) => mediaUrl(item.image, item.image_url))
      .filter((image): image is string => Boolean(image)) ?? [];

  const paragraphs = extractParagraphs(card.description);

  const activities = extractListItems(card.description);

  const links = extractLinks(card.description);

  /*
   * First paragraph = description
   * Second paragraph = activities heading
   * Last paragraph may contain the video link.
   */

  const mainDescription = paragraphs[0] || "";

  const activitiesHeading =
    paragraphs.length > 1 ? paragraphs[1] : "";

  const linkParagraph =
    links.length > 0 && paragraphs.length > 2
      ? paragraphs[paragraphs.length - 1]
      : "";

  return (
    <section
      className={`
        mx-auto
        max-w-6xl
        ${index === 0 ? "mt-16 sm:mt-20" : "mt-20 sm:mt-24"}
      `}
    >
      {/* =====================================================
          MAIN WING
      ===================================================== */}

      <div
        className="
          grid
          items-center
          gap-12
          lg:grid-cols-2
          lg:gap-16
        "
      >
        {/* IMAGE */}

        <div
          className={
            isAirWing
              ? "order-1 lg:order-2"
              : "order-1"
          }
        >
          <WingGallery
            images={images}
            title={card.title || "NCC"}
            number={String(index + 1).padStart(2, "0")}
            reverse={isAirWing}
          />
        </div>

        {/* CONTENT */}

        <article
          className={
            isAirWing
              ? "order-2 lg:order-1"
              : "order-2"
          }
        >
          <div
            className={`
              grid
              size-13
              place-items-center
              rounded-2xl
              shadow-[0_12px_30px_-15px_rgba(16,42,67,.5)]
              ${
                isAirWing
                  ? "bg-cream text-gold-dark"
                  : "bg-navy text-gold"
              }
            `}
          >
            {isAirWing ? (
              <Plane size={23} strokeWidth={1.8} />
            ) : (
              <Shield size={23} strokeWidth={1.8} />
            )}
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
            {isAirWing ? "Air Wing" : "Army Wing"}
          </p>

          <h2
            className="
              mt-3
              font-serif
              text-3xl
              leading-tight
              text-navy
              sm:text-4xl
            "
          >
            {card.title || "National Cadet Corps"}
          </h2>

          <div className="mt-5 h-[2px] w-10 bg-gold" />

          {mainDescription && (
            <p
              className="
                mt-6
                text-[15px]
                leading-8
                text-slate-600
                sm:text-base
              "
            >
              {mainDescription}
            </p>
          )}
        </article>
      </div>

      {/* =====================================================
          ACTIVITIES
      ===================================================== */}

      {activities.length > 0 && (
        <div
          className="
            mt-14
            grid
            gap-8
            lg:grid-cols-[.34fr_.66fr]
            lg:gap-12
          "
        >
          {/* LEFT HEADING */}

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
              Activities
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
                "
              >
                {activitiesHeading}
              </h3>
            )}

            <div className="mt-5 h-[2px] w-10 bg-gold" />
          </div>

          {/* RIGHT */}

          <div>
            <ActivityList activities={activities} />

            {/* API LINKS */}

            {links.length > 0 && (
              <div
                className="
                  mt-6
                  rounded-[20px]
                  border
                  border-gold/20
                  bg-[#f8f2df]/60
                  p-5
                  sm:flex
                  sm:items-center
                  sm:justify-between
                  sm:gap-5
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[.16em]
                      text-gold-dark
                    "
                  >
                    Watch NCC
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-slate-600
                    "
                  >
                    {linkParagraph ||
                      "Watch the thrilling moments of cadets soaring the skies here."}
                  </p>
                </div>

                <a
                  href={links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    mt-4
                    inline-flex
                    shrink-0
                    items-center
                    gap-2
                    rounded-full
                    bg-navy
                    px-5
                    py-3
                    text-xs
                    font-bold
                    text-white
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-gold-dark
                    sm:mt-0
                  "
                >
                  {links[0].text}

                  <ExternalLink
                    size={14}
                    className="
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export function NccPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "ncc"],

    queryFn: async () => {
      const response = await schoolApi.get<{
        data: NccPageData;
      }>("pages/ncc");

      return response.data.data;
    },
  });

  /* =======================================================
     SECTIONS
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
    "Explore NCC at Paragon Senior School.";

  return (
    <main className="overflow-hidden bg-[#fcfbf8]">

      {/* =====================================================
          BANNER
      ===================================================== */}

      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={banner?.title || page?.title || "NCC"}
        description={bannerDescription}
      />

      {/* =====================================================
          CONTENT
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
            -right-44
            top-[38%]
            size-[420px]
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
            -left-32
            bottom-[8%]
            size-72
            rounded-full
            bg-navy/[.018]
          "
        />

        <div className="container relative">

          {/* =================================================
              INTRODUCTION
          ================================================= */}

          <header className="mx-auto max-w-4xl text-center">

            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[.22em]
                text-gold-dark
              "
            >
              National Cadet Corps
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
              {content?.title ||
                page?.title ||
                "NCC"}
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
              DYNAMIC NCC WINGS
          ================================================= */}

          {cards.map((card, index) => (
            <div key={`${card.title}-${index}`}>

              {/* divider between cards */}

              {index > 0 && (
                <div
                  aria-hidden="true"
                  className="
                    mx-auto
                    mt-20
                    flex
                    max-w-6xl
                    items-center
                    gap-3
                    sm:mt-24
                  "
                >
                  <span className="h-px flex-1 bg-slate-200" />

                  <span className="size-2 rotate-45 bg-gold" />

                  <span className="h-px w-12 bg-slate-200" />
                </div>
              )}

              <NccWing
                card={card}
                index={index}
              />

            </div>
          ))}

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
              <Shield
                size={28}
                className="mx-auto text-gold-dark"
              />

              <p className="mt-4 text-sm text-slate-500">
                NCC content is currently unavailable.
              </p>
            </div>
          )}

          {/* =================================================
              BACK
          ================================================= */}

          <div
            className="
              mx-auto
              mt-20
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