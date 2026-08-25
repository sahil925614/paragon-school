import {
  ArrowLeft,
  Check,
  Plane,
  Shield,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type ActivityCard = {
  title?: string;
  description?: string;
  image?: string;
  image_url?: string;
};

type NccSection = {
  type: string;
  title: string;
  description?: string | null;
  is_active: boolean;
  settings?: { cards?: ActivityCard[] } | [];
};

type NccPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: NccSection[];
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
const armyActivities = [
  "Ten-Day Annual Training Camp (ATC) at the NCC Air Academy, Chandigarh.",
  "Aviation Awareness Programs, including basics of aeromodelling and air force orientation.",
  "Cleanliness and Environmental Awareness Drives, such as tree plantation and Swachh Bharat initiatives.",
  "Anti-Drug Awareness Rallies to promote a healthy and drug-free lifestyle.",
  "Certification of 20+ students annually with the prestigious 'A' Certificate under the NCC Air Wing.",
];

const airWingActivities = [
  "Ten days annual training camp (ATC) at NCC academy Ropar",
  "Tree Plantation Drive",
  "Drugs awareness rally",
  "Participation of cadets in district level Republic Day and Independence day celebrations as a proud parade contingent",
  "Certification of 25 students every year with 'A' certificate",
];

/* =========================================================
   ACTIVITY LIST
========================================================= */

function ActivityList({
  activities,
}: {
  activities: string[];
}) {
  return (
    <ul className="mt-5 space-y-3">
      {activities.map((activity) => (
        <li
          key={activity}
          className="flex items-start gap-3 text-[15px] leading-7 text-slate-600 sm:text-base"
        >
          <span className="mt-1.5 grid size-5 shrink-0 place-items-center rounded-full bg-cream text-gold-dark">
            <Check size={11} strokeWidth={3} />
          </span>

          <span>{activity}</span>
        </li>
      ))}
    </ul>
  );
}

/* =========================================================
   IMAGE PAIR
========================================================= */

function GalleryPair({
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
  return (
    <div className="relative">
      {/* BACK DECORATION */}

      <div
        aria-hidden="true"
        className={`
          absolute
          bottom-[-18px]
          h-[70%]
          w-[72%]
          rounded-[28px]
          ${
            reverse
              ? "-right-[18px] bg-gold/20"
              : "-left-[18px] bg-navy"
          }
        `}
      />

      {/* DECORATIVE RING */}

      <div
        aria-hidden="true"
        className={`
          absolute
          -top-5
          size-28
          rounded-full
          border-[16px]
          ${
            reverse
              ? "-left-5 border-navy/[.07]"
              : "-right-5 border-gold/20"
          }
        `}
      />

      {/* IMAGES */}

      <div className="relative grid gap-3 sm:grid-cols-2">
        {images.map((image, index) => (
          <figure
            key={image}
            className="
              group
              relative
              overflow-hidden
              rounded-[24px]
              bg-white
              p-2
              shadow-[0_22px_60px_-35px_rgba(16,42,67,.5)]
            "
          >
            <div className="relative overflow-hidden rounded-[18px] bg-slate-100">
              <img
                src={image}
                alt={`${title} activities ${index + 1}`}
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

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-20
                  bg-gradient-to-t
                  from-navy/20
                  to-transparent
                "
              />
            </div>
          </figure>
        ))}
      </div>

      {/* NUMBER */}

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
   PAGE
========================================================= */

export function NccPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "ncc"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: NccPageData }>("pages/ncc");
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
  const gallery = apiImages.length >= 4
    ? apiImages
    : ["/images/8.webp", "/images/9.webp", "/images/10.webp", "/images/11.webp"];
  const apiActivities = cards
    .map((card) => card.title || plainText(card.description))
    .filter((activity): activity is string => Boolean(activity));
  const splitAt = Math.ceil(apiActivities.length / 2);
  const displayedArmyActivities = apiActivities.length
    ? apiActivities.slice(0, splitAt)
    : armyActivities;
  const displayedAirActivities = apiActivities.length
    ? apiActivities.slice(splitAt)
    : airWingActivities;
  const apiContent = plainText(content?.description);
  const description =
    plainText(banner?.description) ||
    "National Cadet Corps facilities for Paragon students.";

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);
  return (
    <main className="overflow-hidden bg-[#fcfbf8]">
      {/* =====================================================
          BANNER
      ===================================================== */}

      <PageBanner
        title={banner?.title || page?.title || "NCC"}
        description={description}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        {/* BACKGROUND CIRCLES */}

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
              INTRO HEADING
          ================================================= */}

          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-gold-dark">
              National Cadet Corps
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-tight text-navy sm:text-4xl lg:text-5xl">
              {content?.title || page?.title || "NCC at Paragon School"}
            </h2>

            <div
              aria-hidden="true"
              className="mx-auto mt-6 flex items-center justify-center gap-2"
            >
              <span className="h-[2px] w-10 bg-gold" />
              <span className="size-1.5 rotate-45 bg-gold" />
              <span className="h-[2px] w-10 bg-gold" />
            </div>
          </div>

          {/* =================================================
              ARMY WING
          ===================================================== */}

          <section className="mx-auto mt-16 max-w-6xl sm:mt-20 lg:mt-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
              {/* =============================================
                  IMAGES
              ============================================= */}

              <GalleryPair
                images={[
                  gallery[0],
                  gallery[1],
                ]}
                title="NCC Army Wing"
                number="01"
              />

              {/* =============================================
                  CONTENT
              ============================================= */}

              <article>
                <div className="grid size-13 place-items-center rounded-2xl bg-navy text-gold shadow-[0_12px_30px_-15px_rgba(16,42,67,.5)]">
                  <Shield size={23} />
                </div>

                <p className="mt-6 text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                  Army Wing
                </p>

                <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl">
                  National Cadet Corps
                  <span className="block">
                    (Army Wing)
                  </span>
                </h2>

                <div className="mt-5 h-[2px] w-10 bg-gold" />

                <p className="mt-6 text-[15px] leading-8 text-slate-600 sm:text-base">
                  {apiContent || "NCC facility both for boys and girls for junior Army Wing is provided in the school under the National Cadet Corps management. Students from class VI to X are eligible to join the same. The training and participation inculcate discipline, sportsmanship and leadership."}
                </p>
              </article>
            </div>

            {/* ===============================================
                ARMY ACTIVITIES
            =============================================== */}

            <div className="mt-14 grid gap-8 lg:grid-cols-[.34fr_.66fr] lg:gap-12">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                  Activities
                </p>

                <h3 className="mt-3 font-serif text-2xl leading-tight text-navy sm:text-3xl">
                  Some of the activities conducted by Paragon NCC team are:
                </h3>
              </div>

              <div className="rounded-[24px] bg-white p-6 shadow-[0_20px_60px_-45px_rgba(16,42,67,.45)] sm:p-8">
                <ActivityList activities={displayedArmyActivities} />
              </div>
            </div>
          </section>

          {/* =================================================
              SECTION DIVIDER
          ===================================================== */}

          <div
            aria-hidden="true"
            className="mx-auto my-20 flex max-w-6xl items-center gap-3 sm:my-24"
          >
            <span className="h-px flex-1 bg-slate-200" />
            <span className="size-2 rotate-45 bg-gold" />
            <span className="h-px w-12 bg-slate-200" />
          </div>

          {/* =================================================
              AIR WING
          ===================================================== */}

          <section className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-[.98fr_1.02fr] lg:gap-16">
              {/* =============================================
                  CONTENT
              ============================================= */}

              <article className="order-2 lg:order-1">
                <div className="grid size-13 place-items-center rounded-2xl bg-cream text-gold-dark">
                  <Plane size={23} />
                </div>

                <p className="mt-6 text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                  Air Wing
                </p>

                <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl">
                  National Cadet Corps
                  <span className="block">
                    (Air Wing)
                  </span>
                </h2>

                <div className="mt-5 h-[2px] w-10 bg-gold" />

                <p className="mt-6 text-[15px] leading-8 text-slate-600 sm:text-base">
                  The school proudly offers NCC Air Wing facilities for both
                  boys and girls under the management of the National Cadet
                  Corps. Students from classes VIII and IX are eligible to join
                  this prestigious wing. Participation in the NCC Air Wing
                  instills vital qualities such as discipline, teamwork,
                  leadership, and patriotism, providing a foundation for
                  personal and social growth.
                </p>
              </article>

              {/* =============================================
                  IMAGES
              ============================================= */}

              <div className="order-1 lg:order-2">
                <GalleryPair
                  images={[
                      gallery[2],
                    gallery[3],
                  ]}
                  title="NCC Air Wing"
                  number="02"
                  reverse
                />
              </div>
            </div>

            {/* ===============================================
                AIR WING ACTIVITIES
            =============================================== */}

            <div className="mt-14 grid gap-8 lg:grid-cols-[.34fr_.66fr] lg:gap-12">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                  Activities
                </p>

                <h3 className="mt-3 font-serif text-2xl leading-tight text-navy sm:text-3xl">
                  Activities Conducted by the Paragon NCC Air Wing Team:
                </h3>
              </div>

              <div>
                <div className="rounded-[24px] bg-white p-6 shadow-[0_20px_60px_-45px_rgba(16,42,67,.45)] sm:p-8">
                  <ActivityList activities={displayedAirActivities} />
                </div>

                {/* VIDEO TEXT - ORIGINAL CONTENT KEPT */}

                <p className="mt-7 text-[15px] font-semibold leading-7 text-navy sm:text-base">
                  Watch the thrilling moments of cadets soaring the skies here:{" "}
                  <span className="text-blue-600 underline">
                    Click to Watch
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              BACK TO HOME
          ===================================================== */}

          <div className="mx-auto mt-20 max-w-6xl border-t border-slate-200 pt-8">
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