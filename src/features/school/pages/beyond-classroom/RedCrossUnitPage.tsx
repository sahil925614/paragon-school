import {
  ArrowLeft,
  Check,
  Cross,
  HeartHandshake,
  ShieldCheck,
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
  images?: Array<{
    image?: string;
    image_url?: string;
  }>;
};

type RedCrossSection = {
  type: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: { cards?: ActivityCard[] } | [];
};

type RedCrossPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: RedCrossSection[];
};

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(image?: string, imageUrl?: string) {
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  return undefined;
}

function plainText(html?: string | null) {
  return (
    html
      ?.replace(/&nbsp;|&#160;|&#x0*a0;/gi, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim() || ""
  );
}

function contentParagraphs(html?: string | null) {
  return Array.from(html?.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi) ?? [])
    .map((match) => plainText(match[1]))
    .filter(Boolean);
}

function contentLists(html?: string | null) {
  return Array.from(html?.matchAll(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi) ?? []).map(
    (list) =>
      Array.from(list[1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
        .map((item) => plainText(item[1]))
        .filter(Boolean),
  );
}
export function RedCrossUnitPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "red-cross-unit"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: RedCrossPageData }>(
        "pages/red-cross-unit",
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
  const primaryCard = cards[0];
  const cardHtml = primaryCard?.description || content?.description;
  const paragraphs = contentParagraphs(cardHtml);
  const lists = contentLists(cardHtml);
  const introduction = paragraphs[0] || "";
  const coreAreasHeading = paragraphs[1] || "";
  const coreAreas = lists[0] || [];
  const humanitarianValues = paragraphs[2] || "";
  const activitiesHeading = paragraphs[3] || "";
  const activities = lists[1] || [];
  const gallery = cards.flatMap((card) =>
    (card.images ?? []).flatMap((image) => {
      const src = mediaUrl(image.image, image.image_url);
      return src ? [src] : [];
    }),
  );
  const description = plainText(banner?.description);

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <main className="overflow-hidden bg-[#fcfbf8]">
      {/* =====================================================
          PAGE BANNER
      ===================================================== */}

      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={banner?.title || page?.title || "Red Cross Unit"}
        description={description}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        {/* Background decoration */}

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
            top-[42%]
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
            bottom-[-130px]
            left-[18%]
            size-80
            rounded-full
            bg-navy/[.018]
          "
        />

        <div className="container relative">
          {/* =================================================
              MISSING TITLE - ADDED
          ================================================= */}

          <div className="mx-auto max-w-4xl text-center">
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
              <Cross size={25} strokeWidth={2.2} />
            </div>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[.22em] text-gold-dark">
              Paragon Senior Secondary School
            </p>

            <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl lg:text-5xl">
              {content?.title || page?.title || "Red Cross Unit"}
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
              IMAGE GALLERY
          ================================================= */}

          {gallery.length > 0 && (
          <div className="relative mx-auto mt-12 max-w-6xl sm:mt-14">
            {/* Navy backing */}

            <div
              aria-hidden="true"
              className="
                absolute
                -bottom-5
                -left-5
                h-[70%]
                w-[62%]
                rounded-[30px]
                bg-navy
              "
            />

            {/* Gold ring */}

            <div
              aria-hidden="true"
              className="
                absolute
                -right-5
                -top-5
                size-32
                rounded-full
                border-[18px]
                border-gold/20
              "
            />

            <div className="relative grid gap-4 lg:grid-cols-2">
              {gallery.map((image, index) => (
                <figure
                  key={image}
                  className="
                    group
                    overflow-hidden
                    rounded-[26px]
                    bg-white
                    p-2
                    shadow-[0_25px_65px_-38px_rgba(16,42,67,.55)]
                  "
                >
                  <div className="relative overflow-hidden rounded-[20px] bg-slate-100">
                    <img
                      src={image}
                      alt={
                        (primaryCard?.title || page?.title || "Red Cross Unit") +
                        " activity " +
                        (index + 1)
                      }
                      loading={index < 2 ? "eager" : "lazy"}
                      className="
                        aspect-[16/9]
                        size-full
                        object-cover
                        transition
                        duration-700
                        ease-out
                        group-hover:scale-[1.025]
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
            {/* Number/detail */}

            <span
              className="
                absolute
                -bottom-4
                right-8
                grid
                h-12
                min-w-12
                place-items-center
                rounded-xl
                bg-gold
                px-3
                text-[11px]
                font-bold
                text-white
                shadow-lg
              "
            >
              RC
            </span>
          </div>

          )}

          {/* =================================================
              INTRODUCTION
          ================================================= */}

          <section className="mx-auto mt-16 max-w-6xl sm:mt-20">
            <div className="grid gap-8 lg:grid-cols-[.3fr_.7fr] lg:gap-14">
              {/* LEFT */}

              <div>
                <div
                  className="
                    grid
                    size-12
                    place-items-center
                    rounded-xl
                    bg-[#f8f2df]
                    text-gold-dark
                  "
                >
                  <HeartHandshake size={22} />
                </div>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                  {content?.title || page?.title || "Red Cross Unit"}
                </p>

                <h3 className="mt-3 font-serif text-2xl leading-tight text-navy sm:text-3xl">
                  {primaryCard?.title || content?.title || page?.title}
                </h3>

                <div className="mt-5 h-[2px] w-10 bg-gold" />
              </div>

              {/* RIGHT */}

              <article
                className="
                  relative
                  overflow-hidden
                  rounded-[26px]
                  bg-white
                  p-7
                  shadow-[0_22px_65px_-45px_rgba(16,42,67,.45)]
                  sm:p-9
                "
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-1 bg-gold"
                />

                <p className="text-[15px] leading-8 text-slate-600 sm:text-base">
                  {introduction}
                </p>
              </article>
            </div>
          </section>

          {/* =================================================
              FOUR CORE AREAS
          ================================================= */}

          <section className="mx-auto mt-16 max-w-6xl sm:mt-20">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                Core Areas
              </p>

              <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl">
                {coreAreasHeading}
              </h2>

              <div className="mt-5 h-[2px] w-12 bg-gold" />
            </div>

            {/* CORE AREA CARDS */}

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {coreAreas.map((area, index) => (
                <article
                  key={area}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[22px]
                    bg-white
                    p-6
                    shadow-[0_18px_50px_-40px_rgba(16,42,67,.5)]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_24px_55px_-35px_rgba(16,42,67,.45)]
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      inset-x-0
                      top-0
                      h-[3px]
                      bg-gold
                    "
                  />

                  <div className="flex items-center justify-between">
                    <span
                      className="
                        grid
                        size-10
                        place-items-center
                        rounded-xl
                        bg-[#f8f2df]
                        text-gold-dark
                      "
                    >
                      <ShieldCheck size={18} />
                    </span>

                    <span className="text-xs font-bold text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-5 text-[15px] font-semibold leading-7 text-navy">
                    {area}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* =================================================
              HUMANITARIAN VALUES
          ================================================= */}

          <section className="mx-auto mt-12 max-w-6xl">
            <div
              className="
                relative
                overflow-hidden
                rounded-[26px]
                bg-navy
                px-7
                py-8
                text-white
                sm:px-10
                sm:py-10
                lg:px-12
              "
            >
              {/* Decoration */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  -right-16
                  -top-16
                  size-48
                  rounded-full
                  border-[30px]
                  border-white/[.04]
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-[-55px]
                  right-[25%]
                  size-32
                  rounded-full
                  bg-gold/[.08]
                "
              />

              <p className="relative max-w-5xl text-[15px] leading-8 text-white/80 sm:text-base">
                {humanitarianValues}
              </p>
            </div>
          </section>

          {/* =================================================
              ACTIVITIES
          ================================================= */}

          <section className="mx-auto mt-16 max-w-6xl sm:mt-20">
            <div className="grid gap-10 lg:grid-cols-[.34fr_.66fr] lg:gap-14">
              {/* LEFT TITLE */}

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                  Activities
                </p>

                <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl">
                  {activitiesHeading}
                </h2>

                <div className="mt-5 h-[2px] w-12 bg-gold" />
              </div>

              {/* ACTIVITY LIST */}

              <div
                className="
                  rounded-[26px]
                  bg-white
                  p-6
                  shadow-[0_22px_65px_-45px_rgba(16,42,67,.45)]
                  sm:p-8
                "
              >
                <div className="space-y-1">
                  {activities.map((activity, index) => (
                    <div
                      key={activity}
                      className="
                        flex
                        items-start
                        gap-4
                        border-b
                        border-slate-100
                        py-4
                        last:border-b-0
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
                        "
                      >
                        <Check size={14} strokeWidth={3} />
                      </span>

                      <div>
                        <span className="block text-[10px] font-bold tracking-[.12em] text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="mt-1 text-[15px] leading-7 text-slate-600">
                          {activity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <div className="mx-auto mt-16 max-w-6xl border-t border-slate-200 pt-8">
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