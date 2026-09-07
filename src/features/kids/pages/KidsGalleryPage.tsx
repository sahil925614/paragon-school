import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Bus,
  CalendarHeart,
  ImageOff,
  Images,
  Medal,
  Palette,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { KidsPageBanner } from "../components/KidsPageBanner";
import { kidsApi } from "../api/kidsApi";
import {
  applyPageSeo,
  type PageSeo,
} from "../../school/utils/pageSeo";

/* =========================================================
   TYPES
========================================================= */

type GalleryCategory = {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  url?: string;
};

type GallerySection = {
  title?: string;
  description?: string | null;
  is_active: boolean;
};

type GalleryResponse = {
  page: {
    title: string;
    slug: string;
    seo?: PageSeo;
  };
  banner?: GallerySection;
  content?: GallerySection;
  categories?: GalleryCategory[];
};

/* =========================================================
   CONFIG
========================================================= */

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

const galleryIcons = [
  CalendarHeart,
  Medal,
  Palette,
  Bus,
];

const themes = [
  {
    color: "#ef5f6c",
    soft: "#fff2f4",
  },
  {
    color: "#37a9df",
    soft: "#eef9fe",
  },
  {
    color: "#e6aa24",
    soft: "#fff8e6",
  },
  {
    color: "#20a98b",
    soft: "#eefaf7",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function mediaUrl(
  image?: string | null,
  imageUrl?: string | null
): string | undefined {
  /*
   * Prefer API's complete image URL.
   */
  if (
    imageUrl &&
    !imageUrl.includes("localhost") &&
    /^https?:\/\//i.test(imageUrl)
  ) {
    return imageUrl;
  }

  /*
   * Otherwise build URL using storage path.
   */
  if (image) {
    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  }

  if (
    imageUrl &&
    !imageUrl.includes("localhost")
  ) {
    return imageUrl;
  }

  return undefined;
}

function plainText(
  html?: string | null
): string {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   PAGE
========================================================= */

export function KidsGalleryPage() {
  /*
   * KEEPING EXISTING API FUNCTIONALITY.
   */
  const {
    data: gallery,
    isLoading,
  } = useQuery({
    queryKey: ["kids-gallery"],

    queryFn: async () => {
      const response =
        await kidsApi.get<{
          data: GalleryResponse;
        }>("gallery");

      return response.data.data;
    },
  });

  const categories =
    gallery?.categories ?? [];

  /*
   * KEEPING EXISTING SEO FUNCTIONALITY.
   */
  useEffect(() => {
    applyPageSeo(
      gallery?.page.seo
    );
  }, [gallery]);

  return (
    <>
      {/* =====================================================
          EXISTING PAGE BANNER
      ===================================================== */}

      <KidsPageBanner
        title={
          gallery?.banner?.title ||
          gallery?.page.title ||
          "Gallery"
        }
        description={
          plainText(
            gallery?.banner?.description
          ) ||
          "See cheerful classrooms, celebrations, projects and memorable learning moments."
        }
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          relative
          overflow-hidden
          bg-[#fffdfa]
        "
      >
        {/* Background decorations */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-40
            top-32
            size-[330px]
            rounded-full
            bg-[#37a9df]/[.035]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-44
            top-[40%]
            size-[380px]
            rounded-full
            bg-[#ffd34e]/[.05]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-40
            bottom-20
            size-[300px]
            rounded-full
            bg-[#ef5f6c]/[.025]
          "
        />

        {/* ===================================================
            INTRO
        =================================================== */}

        <section
          className="
            container
            relative
            pb-10
            pt-12
            sm:pb-12
            sm:pt-16
            lg:pb-14
            lg:pt-20
          "
        >
          <div
            className="
              mx-auto
              max-w-[760px]
              text-center
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#ef5f6c]/15
                bg-[#fff2f4]
                px-4
                py-2
              "
            >
              <Sparkles
                size={13}
                className="text-[#ef5f6c]"
              />

              <span
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[.18em]
                  text-[#ef5f6c]
                "
              >
                Life at Paragon Kids
              </span>
            </div>

            <h2
              className="
                mt-5
                font-serif
                text-[34px]
                font-bold
                leading-[1.12]
                tracking-[-.025em]
                text-[#34305c]
                sm:text-[42px]
                lg:text-[48px]
              "
            >
              Moments That Make
              Childhood{" "}
              <span className="text-[#37a9df]">
                Special
              </span>
            </h2>

            {gallery?.content
              ?.description && (
              <p
                className="
                  mx-auto
                  mt-5
                  max-w-2xl
                  text-[14px]
                  leading-7
                  text-[#706c7c]
                  sm:text-[15px]
                "
              >
                {plainText(
                  gallery.content
                    .description
                )}
              </p>
            )}

            {/* Brand line */}

            <div
              className="
                mx-auto
                mt-7
                flex
                w-24
                gap-1
              "
            >
              <span className="h-1 flex-1 rounded-full bg-[#ef5f6c]" />
              <span className="h-1 flex-1 rounded-full bg-[#ffd34e]" />
              <span className="h-1 flex-1 rounded-full bg-[#20a98b]" />
              <span className="h-1 flex-1 rounded-full bg-[#37a9df]" />
            </div>
          </div>
        </section>

        {/* ===================================================
            LOADING
        =================================================== */}

        {isLoading && (
          <GallerySkeleton />
        )}

        {/* ===================================================
            GALLERY CATEGORIES
        =================================================== */}

        {!isLoading &&
          categories.length > 0 && (
            <section
              className="
                container
                relative
                pb-16
                sm:pb-20
                lg:pb-24
              "
            >
              <div
                className="
                  mx-auto
                  max-w-[1220px]
                "
              >
                {/* Section Header */}

                <div
                  className="
                    mb-7
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-[#34305c]/[.08]
                    pb-5
                    sm:mb-9
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-[.18em]
                        text-[#ef5f6c]
                      "
                    >
                      Explore Memories
                    </p>

                    <h3
                      className="
                        mt-2
                        font-serif
                        text-[27px]
                        font-bold
                        leading-tight
                        text-[#34305c]
                        sm:text-[32px]
                      "
                    >
                      Choose a Gallery
                    </h3>
                  </div>

                  <div
                    className="
                      flex
                      w-fit
                      items-center
                      gap-2
                      rounded-full
                      bg-white
                      px-4
                      py-2
                      text-xs
                      font-bold
                      text-[#777382]
                      shadow-sm
                      ring-1
                      ring-[#34305c]/[.06]
                    "
                  >
                    <Images
                      size={14}
                      className="text-[#37a9df]"
                    />

                    {categories.length}{" "}
                    {categories.length ===
                    1
                      ? "Collection"
                      : "Collections"}
                  </div>
                </div>

                {/* ===========================================
                    RESPONSIVE CATEGORY GRID
                =========================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    sm:gap-6
                    lg:gap-7
                  "
                >
                  {categories.map(
                    (
                      category,
                      index
                    ) => (
                      <GalleryCategoryCard
                        key={
                          category.id ||
                          category.slug
                        }
                        category={
                          category
                        }
                        index={index}
                      />
                    )
                  )}
                </div>
              </div>
            </section>
          )}

        {/* ===================================================
            EMPTY
        =================================================== */}

        {!isLoading &&
          categories.length === 0 && (
            <section
              className="
                container
                pb-20
              "
            >
              <div
                className="
                  mx-auto
                  max-w-lg
                  rounded-[26px]
                  border
                  border-[#34305c]/[.08]
                  bg-white
                  px-6
                  py-14
                  text-center
                  shadow-[0_20px_60px_-40px_rgba(52,48,92,.35)]
                "
              >
                <div
                  className="
                    mx-auto
                    grid
                    size-14
                    place-items-center
                    rounded-2xl
                    bg-[#fff2f4]
                    text-[#ef5f6c]
                  "
                >
                  <Images size={23} />
                </div>

                <h3
                  className="
                    mt-5
                    font-serif
                    text-2xl
                    font-bold
                    text-[#34305c]
                  "
                >
                  Gallery coming soon
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-[#706c7c]
                  "
                >
                  New memories from
                  Paragon Kids will be
                  added here.
                </p>
              </div>
            </section>
          )}
      </main>
    </>
  );
}

/* =========================================================
   CATEGORY CARD

   IMPORTANT:
   ROUTING FUNCTIONALITY IS KEPT EXACTLY THE SAME:
   /kids/gallery/${category.slug}
========================================================= */

function GalleryCategoryCard({
  category,
  index,
}: {
  category: GalleryCategory;
  index: number;
}) {
  const Icon =
    galleryIcons[
      index % galleryIcons.length
    ];

  const theme =
    themes[index % themes.length];

  const cover = mediaUrl(
    category.image,
    category.image_url
  );

  const [imageFailed, setImageFailed] =
    useState(false);

  return (
    /*
     * DO NOT CHANGE THIS LINK.
     * This preserves your existing category routing.
     */
    <Link
      to={`/kids/gallery/${category.slug}`}
      className="
        group
        block
        min-w-0
        rounded-[26px]
        outline-none
        transition-transform
        duration-300
        hover:-translate-y-1
        focus-visible:ring-2
        focus-visible:ring-[#34305c]
        focus-visible:ring-offset-4
      "
    >
      <article
        className="
          h-full
          overflow-hidden
          rounded-[26px]
          border
          border-[#34305c]/[.08]
          bg-white
          p-2.5
          shadow-[0_18px_55px_-38px_rgba(52,48,92,.45)]
          transition-shadow
          duration-300
          group-hover:shadow-[0_24px_60px_-35px_rgba(52,48,92,.52)]
          sm:p-3
        "
      >
        {/* =================================================
            IMAGE AREA
        ================================================== */}

        <div
          className="
            relative
            flex
            aspect-[4/3]
            w-full
            items-center
            justify-center
            overflow-hidden
            rounded-[20px]
            sm:aspect-[16/11]
          "
          style={{
            backgroundColor:
              theme.soft,
          }}
        >
          {cover &&
          !imageFailed ? (
            <>
              {/* blurred ambient background */}

              <img
                src={cover}
                alt=""
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  size-full
                  scale-110
                  object-cover
                  opacity-[.12]
                  blur-xl
                "
              />

              {/* ORIGINAL IMAGE
                  object-contain avoids unnecessary cropping
                  and stretching.
              */}

              <img
                src={cover}
                alt={category.title}
                loading={
                  index < 2
                    ? "eager"
                    : "lazy"
                }
                decoding="async"
                onError={() =>
                  setImageFailed(
                    true
                  )
                }
                className="
                  relative
                  z-[1]
                  max-h-full
                  max-w-full
                  object-contain
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-[1.015]
                "
              />
            </>
          ) : (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-2
                text-[#8c8896]
              "
            >
              <ImageOff
                size={24}
              />

              <span
                className="
                  text-xs
                  font-semibold
                "
              >
                Image unavailable
              </span>
            </div>
          )}

          {/* Number */}

          <span
            className="
              absolute
              left-3
              top-3
              z-10
              flex
              h-8
              min-w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/95
              px-2
              text-[9px]
              font-black
              tracking-[.08em]
              shadow-sm
            "
            style={{
              color: theme.color,
            }}
          >
            {String(
              index + 1
            ).padStart(2, "0")}
          </span>

          {/* Icon */}

          <span
            className="
              absolute
              bottom-3
              left-3
              z-10
              grid
              size-10
              place-items-center
              rounded-xl
              text-white
              shadow-lg
              transition-transform
              duration-300
              group-hover:-translate-y-0.5
            "
            style={{
              backgroundColor:
                theme.color,
            }}
          >
            <Icon
              size={18}
              strokeWidth={2}
            />
          </span>
        </div>

        {/* =================================================
            CARD CONTENT
        ================================================== */}

        <div
          className="
            px-2
            pb-2
            pt-5
            sm:px-3
            sm:pb-3
            sm:pt-6
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[.18em]
                "
                style={{
                  color:
                    theme.color,
                }}
              >
                Paragon Kids
                Gallery
              </p>

              <h3
                className="
                  mt-2
                  font-serif
                  text-[24px]
                  font-bold
                  leading-[1.15]
                  text-[#34305c]
                  sm:text-[27px]
                "
              >
                {category.title}
              </h3>
            </div>

            {/* Arrow */}

            <span
              className="
                grid
                size-10
                shrink-0
                place-items-center
                rounded-full
                transition-all
                duration-300
                group-hover:translate-x-0.5
              "
              style={{
                backgroundColor:
                  theme.soft,
                color: theme.color,
              }}
            >
              <ArrowRight
                size={17}
              />
            </span>
          </div>

          <p
            className="
              mt-3
              text-[13px]
              leading-6
              text-[#706c7c]
              sm:text-sm
            "
          >
            Explore memorable moments
            from{" "}
            {category.title} at
            Paragon Kids.
          </p>

          {/* Bottom CTA */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              border-t
              border-[#34305c]/[.07]
              pt-4
            "
          >
            <span
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[.15em]
              "
              style={{
                color: theme.color,
              }}
            >
              View Gallery
            </span>

            <div
              aria-hidden="true"
              className="
                flex
                items-center
                gap-1
              "
            >
              <span
                className="
                  h-1
                  w-6
                  rounded-full
                "
                style={{
                  backgroundColor:
                    theme.color,
                }}
              />

              <span className="size-1 rounded-full bg-[#ef5f6c]" />
              <span className="size-1 rounded-full bg-[#ffd34e]" />
              <span className="size-1 rounded-full bg-[#37a9df]" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function GallerySkeleton() {
  return (
    <section
      className="
        container
        pb-20
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-[1220px]
          grid-cols-1
          gap-5
          sm:grid-cols-2
          sm:gap-6
        "
      >
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="
                rounded-[26px]
                border
                border-[#34305c]/[.06]
                bg-white
                p-3
              "
            >
              <div
                className="
                  aspect-[4/3]
                  animate-pulse
                  rounded-[20px]
                  bg-[#efefed]
                  sm:aspect-[16/11]
                "
              />

              <div
                className="
                  px-3
                  pb-4
                  pt-6
                "
              >
                <div
                  className="
                    h-2
                    w-28
                    animate-pulse
                    rounded-full
                    bg-[#eee]
                  "
                />

                <div
                  className="
                    mt-4
                    h-7
                    w-1/2
                    animate-pulse
                    rounded-md
                    bg-[#eee]
                  "
                />

                <div
                  className="
                    mt-4
                    h-3
                    w-full
                    animate-pulse
                    rounded
                    bg-[#eee]
                  "
                />

                <div
                  className="
                    mt-2
                    h-3
                    w-3/4
                    animate-pulse
                    rounded
                    bg-[#eee]
                  "
                />
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}