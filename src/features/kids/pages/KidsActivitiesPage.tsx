import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ImageOff,
  Images,
  Sparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { KidsPageBanner } from "../components/KidsPageBanner";
import { kidsApi } from "../api/kidsApi";
import {
  applyPageSeo,
  type PageSeo,
} from "../../school/utils/pageSeo";

/* =========================================================
   TYPES
========================================================= */

type ActivityImage = {
  image?: string | null;
  image_url?: string | null;
};

type ActivityCard = {
  title?: string | null;
  description?: string | null;
  images?: ActivityImage[];
};

type ActivitySettings = {
  cards?: ActivityCard[];
};

type ActivitySection = {
  type: string;
  title?: string | null;
  description?: string | null;
  is_active: boolean;
  settings?: ActivitySettings | [];
};

type ActivitiesPageData = {
  title: string;
  seo?: PageSeo;
  sections: ActivitySection[];
};

type DisplayActivity = {
  title: string;
  description: string;
  images: string[];
};

/* =========================================================
   CONFIG
========================================================= */

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

const activityThemes = [
  {
    accent: "#ef5f6c",
    soft: "#fff2f4",
  },
  {
    accent: "#37a9df",
    soft: "#eef9fe",
  },
  {
    accent: "#20a98b",
    soft: "#eefaf7",
  },
  {
    accent: "#e7aa26",
    soft: "#fff8e7",
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
   * Prefer the complete URL returned by API.
   */
  if (
    imageUrl &&
    !imageUrl.includes("localhost") &&
    /^https?:\/\//i.test(imageUrl)
  ) {
    return imageUrl;
  }

  /*
   * Build URL from storage path.
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
    .replace(/<\/li>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   MAIN PAGE
========================================================= */

export function KidsActivitiesPage() {
  const {
    data: activitiesPage,
    isLoading,
  } = useQuery({
    queryKey: [
      "kids-page",
      "activities",
    ],

    queryFn: async () => {
      const response =
        await kidsApi.get<{
          data: ActivitiesPageData;
        }>("pages/activities");

      return response.data.data;
    },
  });

  /* ---------------------------------------------------------
     API SECTIONS
  --------------------------------------------------------- */

  const banner =
    activitiesPage?.sections.find(
      (section) =>
        section.type ===
          "home_banner" &&
        section.is_active
    );

  const contentSection =
    activitiesPage?.sections.find(
      (section) =>
        section.type ===
          "activity_cards_content" &&
        section.is_active
    );

  const settings =
    contentSection?.settings &&
    !Array.isArray(
      contentSection.settings
    )
      ? contentSection.settings
      : undefined;

  /* ---------------------------------------------------------
     NORMALIZE API ACTIVITIES
  --------------------------------------------------------- */

  const activities: DisplayActivity[] =
    (settings?.cards ?? [])
      .map((card, index) => {
        const images = (
          card.images ?? []
        )
          .map((item) =>
            mediaUrl(
              item.image,
              item.image_url
            )
          )
          .filter(
            (
              image
            ): image is string =>
              Boolean(image)
          );

        return {
          title:
            plainText(card.title) ||
            `Activity ${index + 1}`,

          description: plainText(
            card.description
          ),

          images,
        };
      })
      .filter(
        (activity) =>
          activity.title ||
          activity.description ||
          activity.images.length
      );

  /* ---------------------------------------------------------
     SEO
  --------------------------------------------------------- */

  useEffect(() => {
    applyPageSeo(
      activitiesPage?.seo
    );
  }, [activitiesPage]);

  return (
    <>
      {/* =====================================================
          EXISTING KIDS BANNER
      ===================================================== */}

      <KidsPageBanner
        title={
          banner?.title ||
          activitiesPage?.title ||
          "Activities"
        }
        description={
          plainText(
            banner?.description
          ) ||
          "Art, music, movement and discovery help little learners express and connect."
        }
      />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main
        className="
          relative
          overflow-hidden
          bg-[#fffdfa]
        "
      >
        {/* subtle background decorations */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-40
            top-32
            size-[320px]
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
            top-[42%]
            size-[360px]
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
            bottom-32
            size-[300px]
            rounded-full
            bg-[#ef5f6c]/[.025]
          "
        />

        {/* ===================================================
            INTRODUCTION
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
              max-w-3xl
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
                bg-[#fff3f5]
                px-4
                py-2
              "
            >
              {/* <Sparkles
                size={14}
                className="text-[#ef5f6c]"
              /> */}

              <span
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[.18em]
                  text-[#ef5f6c]
                "
              >
                {contentSection?.title ||
                  "Activities at Paragon Kids"}
              </span>
            </div>

            <h2
              className="
                mt-5
                font-serif
                text-[34px]
                font-bold
                leading-[1.12]
                tracking-[-.02em]
                text-[#34305c]
                sm:text-[42px]
                lg:text-[48px]
              "
            >
              Learning Through{" "}
              <span className="text-[#37a9df]">
                Happy Experiences
              </span>
            </h2>

            {contentSection
              ?.description && (
              <p
                className="
                  mx-auto
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-[#706c7c]
                  sm:text-[15px]
                "
              >
                {plainText(
                  contentSection.description
                )}
              </p>
            )}

            {/* Brand strip */}

            <div
              aria-hidden="true"
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
          <section
            className="
              container
              pb-20
            "
          >
            <ActivitiesSkeleton />
          </section>
        )}

        {/* ===================================================
            ACTIVITIES
        =================================================== */}

        {!isLoading &&
          activities.length > 0 && (
            <div>
              {activities.map(
                (
                  activity,
                  index
                ) => (
                  <ActivitySectionBlock
                    key={`${activity.title}-${index}`}
                    activity={
                      activity
                    }
                    index={index}
                  />
                )
              )}
            </div>
          )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {!isLoading &&
          activities.length === 0 && (
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
                  border-[#34305c]/10
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
                  <Images size={24} />
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
                  Activities coming
                  soon
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-[#706c7c]
                  "
                >
                  New activities and
                  memorable moments
                  will appear here.
                </p>
              </div>
            </section>
          )}
      </main>
    </>
  );
}

/* =========================================================
   SINGLE ACTIVITY SECTION
========================================================= */

function ActivitySectionBlock({
  activity,
  index,
}: {
  activity: DisplayActivity;
  index: number;
}) {
  const theme =
    activityThemes[
      index %
        activityThemes.length
    ];

  return (
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
          max-w-[1240px]
        "
      >
        {/* =================================================
            ACTIVITY HEADER
        ================================================== */}

        <div
          className="
            mb-7
            flex
            flex-col
            gap-4
            border-b
            border-[#34305c]/[.08]
            pb-6
            sm:mb-8
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="max-w-3xl">
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
                  size-9
                  place-items-center
                  rounded-xl
                "
                style={{
                  backgroundColor:
                    theme.soft,
                  color:
                    theme.accent,
                }}
              >
                <Camera
                  size={17}
                />
              </span>

              <span
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[.18em]
                "
                style={{
                  color:
                    theme.accent,
                }}
              >
                Paragon Kids
                Activity
              </span>
            </div>

            <h3
              className="
                mt-4
                font-serif
                text-[29px]
                font-bold
                leading-[1.15]
                tracking-[-.015em]
                text-[#34305c]
                sm:text-[36px]
                lg:text-[40px]
              "
            >
              {activity.title}
            </h3>
          </div>

          {activity.images.length >
            0 && (
            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-[#34305c]/[.08]
                bg-white
                px-4
                py-2.5
                text-xs
                font-bold
                text-[#716d7e]
                shadow-sm
              "
            >
              <Images
                size={15}
                style={{
                  color:
                    theme.accent,
                }}
              />

              {activity.images.length}{" "}
              {activity.images
                .length === 1
                ? "Photo"
                : "Photos"}
            </div>
          )}
        </div>

        {/* =================================================
            FEATURE AREA
        ================================================== */}

        <div
          className={`
            grid
            gap-6
            ${
              activity.images.length >
              0
                ? "lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,.88fr)] lg:items-stretch"
                : ""
            }
          `}
        >
          {/* =================================================
              FEATURE IMAGE
          ================================================== */}

          {activity.images.length >
            0 && (
            <ActivityPhoto
              src={
                activity.images[0]
              }
              alt={activity.title}
              index={0}
              accent={
                theme.accent
              }
              featured
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent(
                    "open-activity-gallery",
                    {
                      detail: {
                        images:
                          activity.images,
                        index: 0,
                        title:
                          activity.title,
                      },
                    }
                  )
                );
              }}
            />
          )}

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <div
            className="
              relative
              flex
              flex-col
              justify-center
              overflow-hidden
              rounded-[26px]
              border
              border-[#34305c]/[.08]
              bg-white
              p-6
              shadow-[0_20px_60px_-42px_rgba(52,48,92,.35)]
              sm:p-8
              lg:p-9
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                -right-12
                -top-12
                size-36
                rounded-full
                opacity-[.55]
              "
              style={{
                backgroundColor:
                  theme.soft,
              }}
            />

            <div className="relative">
              <span
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[.18em]
                "
                style={{
                  color:
                    theme.accent,
                }}
              >
                About the Activity
              </span>

              <h4
                className="
                  mt-3
                  font-serif
                  text-[25px]
                  font-bold
                  leading-tight
                  text-[#34305c]
                  sm:text-[29px]
                "
              >
                {activity.title}
              </h4>

              {activity.description ? (
                <p
                  className="
                    mt-5
                    text-[14px]
                    leading-7
                    text-[#686477]
                    sm:text-[15px]
                    sm:leading-8
                  "
                >
                  {
                    activity.description
                  }
                </p>
              ) : (
                <p
                  className="
                    mt-5
                    text-sm
                    leading-7
                    text-[#85818e]
                  "
                >
                  Explore memorable
                  moments from this
                  activity at Paragon
                  Kids.
                </p>
              )}

              {activity.images.length >
                1 && (
                <div
                  className="
                    mt-7
                    flex
                    items-center
                    gap-3
                    border-t
                    border-[#34305c]/[.07]
                    pt-5
                  "
                >
                  <span
                    className="
                      grid
                      size-9
                      place-items-center
                      rounded-xl
                    "
                    style={{
                      backgroundColor:
                        theme.soft,
                      color:
                        theme.accent,
                    }}
                  >
                    <Images
                      size={16}
                    />
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-[#777382]
                    "
                  >
                    Discover all{" "}
                    {
                      activity.images
                        .length
                    }{" "}
                    memories below
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            REMAINING PHOTOS
        ================================================== */}

        {activity.images.length >
          1 && (
          <ActivityPhotoGrid
            activity={activity}
            accent={
              theme.accent
            }
            soft={theme.soft}
          />
        )}
      </div>

      <ActivityLightboxListener />
    </section>
  );
}

/* =========================================================
   REMAINING PHOTO GRID
========================================================= */

function ActivityPhotoGrid({
  activity,
  accent,
  soft,
}: {
  activity: DisplayActivity;
  accent: string;
  soft: string;
}) {
  return (
    <div
      className="
        mt-8
        sm:mt-10
      "
    >
      <div
        className="
          mb-5
          flex
          items-center
          gap-4
        "
      >
        <div>
          <p
            className="
              text-[9px]
              font-extrabold
              uppercase
              tracking-[.18em]
            "
            style={{
              color: accent,
            }}
          >
            Photo Memories
          </p>

          <h4
            className="
              mt-1
              font-serif
              text-xl
              font-bold
              text-[#34305c]
              sm:text-2xl
            "
          >
            More From{" "}
            {activity.title}
          </h4>
        </div>

        <div
          className="
            hidden
            h-px
            flex-1
            bg-[#34305c]/[.08]
            sm:block
          "
        />
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:gap-4
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {activity.images
          .slice(1)
          .map(
            (
              image,
              imageIndex
            ) => {
              const actualIndex =
                imageIndex + 1;

              return (
                <ActivityPhoto
                  key={`${image}-${actualIndex}`}
                  src={image}
                  alt={`${activity.title} photograph ${
                    actualIndex +
                    1
                  }`}
                  index={
                    actualIndex
                  }
                  accent={
                    accent
                  }
                  soft={soft}
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent(
                        "open-activity-gallery",
                        {
                          detail: {
                            images:
                              activity.images,
                            index:
                              actualIndex,
                            title:
                              activity.title,
                          },
                        }
                      )
                    );
                  }}
                />
              );
            }
          )}
      </div>
    </div>
  );
}

/* =========================================================
   PHOTO
========================================================= */

function ActivityPhoto({
  src,
  alt,
  index,
  accent,
  soft = "#f5f4f2",
  featured = false,
  onClick,
}: {
  src: string;
  alt: string;
  index: number;
  accent: string;
  soft?: string;
  featured?: boolean;
  onClick?: () => void;
}) {
  const [failed, setFailed] =
    useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        block
        w-full
        overflow-hidden
        border
        border-[#34305c]/[.08]
        bg-white
        text-left
        shadow-[0_16px_45px_-32px_rgba(52,48,92,.4)]
        outline-none
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_20px_50px_-30px_rgba(52,48,92,.5)]
        focus-visible:ring-2
        focus-visible:ring-[#34305c]
        focus-visible:ring-offset-3
        ${
          featured
            ? "rounded-[26px] p-2.5 sm:p-3"
            : "rounded-[20px] p-2"
        }
      `}
    >
      <div
        className={`
          relative
          flex
          w-full
          items-center
          justify-center
          overflow-hidden
          rounded-[16px]
          ${
            featured
              ? "aspect-[4/3] sm:aspect-[16/11] lg:min-h-[430px]"
              : "aspect-[4/3]"
          }
        `}
        style={{
          backgroundColor: soft,
        }}
      >
        {!failed ? (
          <>
            {/* Background fill only */}

            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                size-full
                scale-110
                object-cover
                opacity-[.1]
                blur-xl
              "
            />

            {/* Original photograph */}

            <img
              src={src}
              alt={alt}
              loading={
                featured
                  ? "eager"
                  : "lazy"
              }
              decoding="async"
              onError={() =>
                setFailed(true)
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
              gap-2
              text-[#9995a2]
            "
          >
            <ImageOff
              size={22}
            />

            <span className="text-xs font-semibold">
              Image unavailable
            </span>
          </div>
        )}

        {/* number */}

        <span
          className="
            absolute
            left-3
            top-3
            z-10
            grid
            size-8
            place-items-center
            rounded-full
            border
            border-white/80
            bg-white/95
            text-[9px]
            font-black
            tracking-[.08em]
            shadow-sm
          "
          style={{
            color: accent,
          }}
        >
          {String(index + 1).padStart(
            2,
            "0"
          )}
        </span>

        {/* View icon */}

        <span
          className="
            absolute
            bottom-3
            right-3
            z-10
            grid
            size-9
            translate-y-1
            place-items-center
            rounded-full
            bg-white/95
            text-[#34305c]
            opacity-0
            shadow-md
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <Camera size={15} />
        </span>
      </div>
    </button>
  );
}

/* =========================================================
   LIGHTBOX EVENT LISTENER
========================================================= */

type LightboxData = {
  images: string[];
  index: number;
  title: string;
};

function ActivityLightboxListener() {
  const [lightbox, setLightbox] =
    useState<LightboxData | null>(
      null
    );

  useEffect(() => {
    const handleOpen = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<LightboxData>;

      setLightbox(
        customEvent.detail
      );
    };

    window.addEventListener(
      "open-activity-gallery",
      handleOpen
    );

    return () => {
      window.removeEventListener(
        "open-activity-gallery",
        handleOpen
      );
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKey = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape"
      ) {
        setLightbox(null);
      }

      if (
        event.key ===
          "ArrowRight" &&
        lightbox.images.length > 1
      ) {
        setLightbox(
          (current) => {
            if (!current)
              return null;

            return {
              ...current,
              index:
                (current.index +
                  1) %
                current.images
                  .length,
            };
          }
        );
      }

      if (
        event.key ===
          "ArrowLeft" &&
        lightbox.images.length > 1
      ) {
        setLightbox(
          (current) => {
            if (!current)
              return null;

            return {
              ...current,
              index:
                (current.index -
                  1 +
                  current.images
                    .length) %
                current.images
                  .length,
            };
          }
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      document.body.style.overflow =
        previous;

      window.removeEventListener(
        "keydown",
        handleKey
      );
    };
  }, [lightbox]);

  if (!lightbox) return null;

  const previous = () => {
    setLightbox((current) => {
      if (!current) return null;

      return {
        ...current,
        index:
          (current.index -
            1 +
            current.images.length) %
          current.images.length,
      };
    });
  };

  const next = () => {
    setLightbox((current) => {
      if (!current) return null;

      return {
        ...current,
        index:
          (current.index + 1) %
          current.images.length,
      };
    });
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-[#171525]/95
        p-3
        backdrop-blur-sm
        sm:p-6
      "
      role="dialog"
      aria-modal="true"
      aria-label={`${lightbox.title} photo gallery`}
      onClick={() =>
        setLightbox(null)
      }
    >
      {/* CLOSE */}

      <button
        type="button"
        aria-label="Close gallery"
        onClick={(event) => {
          event.stopPropagation();
          setLightbox(null);
        }}
        className="
          absolute
          right-4
          top-4
          z-20
          grid
          size-11
          place-items-center
          rounded-full
          bg-white
          text-[#34305c]
          shadow-xl
          transition
          hover:scale-105
          sm:right-6
          sm:top-6
        "
      >
        <X size={20} />
      </button>

      {/* IMAGE */}

      <div
        className="
          relative
          flex
          h-full
          max-h-[88vh]
          w-full
          max-w-[1200px]
          items-center
          justify-center
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <img
          src={
            lightbox.images[
              lightbox.index
            ]
          }
          alt={`${lightbox.title} photograph ${
            lightbox.index + 1
          }`}
          className="
            max-h-full
            max-w-full
            object-contain
          "
        />

        {/* PREVIOUS */}

        {lightbox.images.length >
          1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={previous}
              className="
                absolute
                left-1
                grid
                size-10
                place-items-center
                rounded-full
                bg-white/95
                text-[#34305c]
                shadow-xl
                transition
                hover:scale-105
                sm:left-4
                sm:size-12
              "
            >
              <ArrowLeft
                size={20}
              />
            </button>

            {/* NEXT */}

            <button
              type="button"
              aria-label="Next photo"
              onClick={next}
              className="
                absolute
                right-1
                grid
                size-10
                place-items-center
                rounded-full
                bg-white/95
                text-[#34305c]
                shadow-xl
                transition
                hover:scale-105
                sm:right-4
                sm:size-12
              "
            >
              <ArrowRight
                size={20}
              />
            </button>
          </>
        )}

        {/* COUNTER */}

        <div
          className="
            absolute
            bottom-2
            left-1/2
            -translate-x-1/2
            rounded-full
            bg-black/55
            px-4
            py-2
            text-xs
            font-bold
            text-white
            backdrop-blur
          "
        >
          {lightbox.index + 1}
          {" / "}
          {lightbox.images.length}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function ActivitiesSkeleton() {
  return (
    <div
      className="
        mx-auto
        max-w-[1240px]
      "
    >
      <div
        className="
          mb-7
          flex
          items-end
          justify-between
          border-b
          border-[#34305c]/[.07]
          pb-6
        "
      >
        <div>
          <div
            className="
              h-3
              w-28
              animate-pulse
              rounded-full
              bg-[#eee]
            "
          />

          <div
            className="
              mt-4
              h-9
              w-64
              max-w-full
              animate-pulse
              rounded-lg
              bg-[#eee]
            "
          />
        </div>
      </div>

      <div
        className="
          grid
          gap-6
          lg:grid-cols-[1.12fr_.88fr]
        "
      >
        <div
          className="
            aspect-[4/3]
            animate-pulse
            rounded-[26px]
            bg-[#efefed]
          "
        />

        <div
          className="
            rounded-[26px]
            border
            border-[#34305c]/[.07]
            bg-white
            p-8
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
              mt-5
              h-8
              w-2/3
              animate-pulse
              rounded-lg
              bg-[#eee]
            "
          />

          <div className="mt-7 space-y-3">
            <div className="h-3 animate-pulse rounded bg-[#eee]" />
            <div className="h-3 animate-pulse rounded bg-[#eee]" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-[#eee]" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-[#eee]" />
          </div>
        </div>
      </div>
    </div>
  );
}