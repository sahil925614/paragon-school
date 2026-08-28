import { ArrowLeft, MapPin, Plane } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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
  title?: string | null;
  description?: string | null;
  images?: ActivityCardImage[] | null;
};

type ActivityCardsSettings = {
  cards?: ActivityCard[] | null;
};

type ExcursionSection = {
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

type ExcursionPageData = {
  id?: number;
  site_id?: number;
  title: string;
  slug: string;
  template?: string;
  is_home?: boolean;
  seo?: PageSeo;
  sections: ExcursionSection[];
};

type TripSection = {
  title: string;
  image: string;
  paragraphs: string[];
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
  /*
   * Prefer image_url when API already gives us a complete
   * production URL.
   */
  if (
    imageUrl &&
    !imageUrl.includes("localhost") &&
    /^https?:\/\//i.test(imageUrl)
  ) {
    return imageUrl;
  }

  /*
   * Otherwise build URL from the stored relative path.
   */
  if (image) {
    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  }

  /*
   * Allow non-local image_url values even if they are relative.
   */
  if (imageUrl && !imageUrl.includes("localhost")) {
    return imageUrl;
  }

  return undefined;
}

function plainText(html?: string | null): string {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
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
   FALLBACK CONTENT

   Used only if API cards/images are unavailable.
========================================================= */

const tripSections: TripSection[] = [
  {
    title: "Globalities visit Kennedy Space Center in USA",
    image: "/images/12.webp",
    paragraphs: [
      "It was indeed a once in a life time experience for 10 students of PARAGON SENIOR SECONDARY SCHOOL sector 71 Mohali, who embarked on a trip to the USA. The students were accompanied by two faculty members Mr. Maninder Pal Singh and Mrs. Jatinder Kaur along with Rajnish Sharma from Travel Today who had organized the 12-day educational-cum-fun trip.",
      "The students went to three cities New York, Washington DC and Orlando, where they visited the Times Square, Madame Tussauds Museum, Statue of Liberty, Empire State Building, World Bank, Universal Studios, The White House, Smithsonian Museum to name a few. They also visited Kennedy Space Center where they spent the entire day and experienced shuttle launch through virtual simulation and Lunch with Astronaut. The NASA bus tour also took the students to the places where spaceships are assembled and launched from.",
    ],
  },

  {
    title: "Visit To Chandigarh Museum",
    image: "/images/13.webp",
    paragraphs: [
      "The student of Heritage Club spent their day exploring art and its surrounding art and archaeology themed attractions at the Fine Arts College Sector-10. They were thrilled and excited to learn about their rich heritage and culture depicted in the form of textiles, paintings, artifacts and much more.",
    ],
  },

  {
    title: "Visit To Sangol Museum",
    image: "/images/14.webp",
    paragraphs: [
      "A museum is a house of treasures filled with antiques. It is a miniature reflection of a country’s past and ancient times a vivid picture of the traditions, customs, and conventions of the country. The students of PARAGON SENIOR SECONDARY SCHOOL sector 71 Mohali visited the archaeological museum in Sanghol, Punjab, India.",
      "The existing building of the Museum was inaugurated as a subordinate unit of the Department of Cultural Affairs, Archaeology and Museums of the Punjab Government. The visit to the museum was thrilling as well as an enriching experience for the students. Students got to know deeply and see the vast storehouse of our country’s ancient glory. This visit to the Sanghol Museum was meant to be an interesting and educative experience for the students.",
    ],
  },

  {
    title: "Visit To Chapparchiri",
    image: "/images/15.webp",
    paragraphs: [
      "The students PARAGON SENIOR SECONDARY SCHOOL sector 71 Mohali visited chapparchiri. It is a small village located in Sahibzada Ajit Singh Nagar district, Punjab, India. The village is famous due to Fateh Burj The Victory Tower. The purpose of this visit was to educate students about our history and culture of Punjab and famous battles won by our great Sikh warriors. Fateh Burj holds a significant position as it is the tallest victory tower in the country.",
      "Students had a great experience visiting and getting to know interesting facts about baba Banda Singh Bahadur war memorial. We plan to make studies as interesting as possible for students by planning such trips that are interesting and educate students about different things.",
    ],
  },

  {
    title: "Visit To Educational Trip Kurukshetra",
    image: "/images/16.webp",
    paragraphs: [
      "On 26 October, 2018 students of Paragon Senior Secondary School visited Kurukshetra City. They visited the Kalpana Chawla planetarium where they were illuminated with astronomy shows, the gallery and the astro park. They also visited the Kurukshetra Panorama and Science Centre where they got an opportunity to learn about the epic heritage of India in Science and Technology.",
      "They acquired knowledge about the historical battle of Kurukshetra. It was a fun filled trip away from school and home where students had the opportunity to learn in a totally different environment.",
    ],
  },
];

/* =========================================================
   PAGE
========================================================= */

export function ExcursionPage() {
  /* =======================================================
     API
  ======================================================= */

  const { data: page } = useQuery({
    queryKey: ["school-page", "excursion"],

    queryFn: async () => {
      const response = await schoolApi.get<{
        data: ExcursionPageData;
      }>("pages/excursion");

      return response.data.data;
    },
  });

  /* =======================================================
     SECTIONS
  ======================================================= */

  const banner = page?.sections.find(
    (section) =>
      section.type === "home_banner" &&
      section.is_active
  );

  const content = page?.sections.find(
    (section) =>
      section.type === "activity_cards_content" &&
      section.is_active
  );

  /* =======================================================
     CARDS
  ======================================================= */

  const cards: ActivityCard[] =
    content?.settings &&
    !Array.isArray(content.settings)
      ? content.settings.cards ?? []
      : [];

  /* =======================================================
     API TRIPS

     API structure:
     card.images[0].image
     card.images[0].image_url
  ======================================================= */

  const apiTrips: TripSection[] = cards
    .map((card, index): TripSection | null => {
      const firstImage = card.images?.[0];

      const resolvedImage = mediaUrl(
        firstImage?.image,
        firstImage?.image_url
      );

      /*
       * If this particular card has no valid image,
       * don't create an invalid trip.
       */
      if (!resolvedImage) {
        return null;
      }

      return {
        title:
          card.title?.trim() ||
          `Excursion ${index + 1}`,

        image: resolvedImage,

        paragraphs: extractParagraphs(
          card.description
        ),
      };
    })
    .filter(
      (trip): trip is TripSection =>
        trip !== null
    );

  /* =======================================================
     FALLBACK
  ======================================================= */

  const displayedTrips =
    apiTrips.length > 0
      ? apiTrips
      : tripSections;

  /* =======================================================
     PAGE CONTENT
  ======================================================= */

  const introText =
    plainText(content?.description);

  const description =
    plainText(banner?.description) ||
    "The school organizes trips and tours for the students in the nearby areas of Chandigarh and sometimes within the city itself.";

  /* =======================================================
     SEO
  ======================================================= */

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="overflow-hidden bg-[#fcfbf8]">

      {/* ===================================================
          PAGE BANNER
      =================================================== */}

      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={
          banner?.title ||
          page?.title ||
          "Excursion"
        }
        description={description}
      />

      {/* ===================================================
          PAGE CONTENT
      =================================================== */}

      <section className="relative py-16 sm:py-20 lg:py-24">

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
            top-[31%]
            size-[410px]
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
            top-[62%]
            size-72
            rounded-full
            bg-navy/[.018]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-32
            bottom-[4%]
            size-80
            rounded-full
            border-[45px]
            border-gold/[.04]
          "
        />

        <div className="container relative">

          {/* =================================================
              INTRODUCTION
          ================================================= */}

          <section className="mx-auto max-w-5xl text-center">

            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-gold-dark">
              Excursion
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-tight text-navy sm:text-4xl lg:text-5xl">
              {content?.title ||
                page?.title ||
                "Trips and Tours"}
            </h2>

            <div
              className="mx-auto mt-5 flex items-center justify-center gap-2"
              aria-hidden="true"
            >
              <span className="h-[2px] w-10 bg-gold" />

              <span className="size-1.5 rotate-45 bg-gold" />

              <span className="h-[2px] w-10 bg-gold" />
            </div>

            <p className="mx-auto mt-7 max-w-4xl text-[15px] leading-8 text-slate-600 sm:text-base">
              {introText ||
                "The school organizes trips and tours for students in nearby areas and beyond, fostering responsibility, confidence, reliability and practical learning through visits to institutions, museums, scientific centres and international destinations."}
            </p>

          </section>

          {/* =================================================
              TRIPS
          ================================================= */}

          <div className="mx-auto mt-16 max-w-6xl sm:mt-20 lg:mt-24">

            {displayedTrips.map(
              (trip, index) => {

                const imageLeft =
                  index % 2 === 0;

                return (
                  <section
                    key={`${trip.title}-${index}`}
                    className="
                      relative
                      grid
                      items-center
                      gap-10
                      py-12
                      first:pt-0
                      last:pb-0
                      sm:py-16
                      lg:grid-cols-2
                      lg:gap-16
                      lg:py-20
                    "
                  >

                    {/* =========================================
                        IMAGE
                    ========================================= */}

                    <div
                      className={
                        imageLeft
                          ? "lg:order-1"
                          : "lg:order-2"
                      }
                    >

                      <figure className="group relative">

                        {/* BACKGROUND BLOCK */}

                        <div
                          aria-hidden="true"
                          className={`
                            absolute
                            bottom-[-18px]
                            h-[72%]
                            w-[72%]
                            rounded-[28px]

                            ${
                              imageLeft
                                ? "-left-[18px] bg-navy"
                                : "-right-[18px] bg-gold/20"
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
                              imageLeft
                                ? "-right-5 border-gold/20"
                                : "-left-5 border-navy/[.07]"
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
                              bg-[#f3f1eb]
                            "
                          >

                            <img
                              src={trip.image}
                              alt={trip.title}
                              className="
                                h-full
                                w-full
                                object-contain
                                transition
                                duration-700
                                ease-out
                                group-hover:scale-[1.015]
                              "
                              loading={
                                index < 2
                                  ? "eager"
                                  : "lazy"
                              }
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

                          </div>

                        </div>

                        {/* TRIP NUMBER */}

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
                              imageLeft
                                ? "right-7 bg-gold text-white"
                                : "left-7 bg-navy text-gold"
                            }
                          `}
                        >
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                      </figure>

                    </div>

                    {/* =========================================
                        CONTENT
                    ========================================= */}

                    <article
                      className={
                        imageLeft
                          ? "lg:order-2"
                          : "lg:order-1"
                      }
                    >

                      <div
                        className={`
                          grid
                          size-12
                          place-items-center
                          rounded-2xl

                          ${
                            index % 2 === 0
                              ? "bg-cream text-gold-dark"
                              : "bg-navy text-gold"
                          }
                        `}
                      >
                        {index === 0 ? (
                          <Plane size={21} />
                        ) : (
                          <MapPin size={21} />
                        )}
                      </div>

                      <p className="mt-6 text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                        Trip{" "}
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </p>

                      <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl">
                        {trip.title}
                      </h2>

                      <div className="mt-5 h-[2px] w-10 bg-gold" />

                      <div className="mt-6 space-y-5 text-[15px] leading-8 text-slate-600 sm:text-base">

                        {trip.paragraphs.map(
                          (
                            paragraph,
                            paragraphIndex
                          ) => (
                            <p
                              key={`${index}-${paragraphIndex}`}
                            >
                              {paragraph}
                            </p>
                          )
                        )}

                      </div>

                    </article>

                    {/* =========================================
                        SEPARATOR
                    ========================================= */}

                    {index !==
                      displayedTrips.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="
                          absolute
                          inset-x-0
                          bottom-0
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <span className="h-px flex-1 bg-slate-200/70" />

                        <span className="size-1.5 rotate-45 bg-gold/60" />

                        <span className="h-px w-8 bg-slate-200/70" />
                      </div>
                    )}

                  </section>
                );
              }
            )}

          </div>

          {/* =================================================
              BACK TO HOME
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