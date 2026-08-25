import {
  ArrowLeft,
  Check,
  HeartHandshake,
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

type NssSection = {
  type: string;
  title: string;
  description?: string | null;
  is_active: boolean;
  settings?: { cards?: ActivityCard[] } | [];
};

type NssPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: NssSection[];
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
const nssActivities = [
  "Participated in NSS Republic Day Parade 2018 New Delhi.",
  "Participated in NSS Pre-Republic Day Parade 2017 Hisar (Haryana).",
  "Participated in National Integration Camp held at Jaipur.",
  "Participated in Inter-State youth exchange program at Chennai and Pondicherry.",
  "Participated in Youth Leadership Training camp held at Naggar, Manali.",
  "Participated in National Youth festival 2017 held at Rohtak, Haryana.",
  "Participated in NSS North Zone Pre-republic Day Parade camp held at Hisar, Haryana.",
  "Participated in State Level International Yoga Day celebrations.",
  "Participated in National Youth Festival 2016 held at Raipur, Chhattisgarh.",
  "Participated in World Cultural Festival held at New Delhi.",
  "Poster making and essay writing competitions- AIDS, SWACHHTA.",
  "Awareness Rallies: Say no to crackers, Go Green, Dengue, AIDS, Swachh Bharat Abhiyaan.",
  "Talks and Seminars: World Health Day, World Anti-Terrorism Day, World Heritage Day, National Voters day, human Rights Day, Dengue Awareness, Disability Day and many more.",
  "Signing Campaign: National Voters Day, Constitution Day, AIDS day.",
  "Pulse polio Campaign.",
  "Health check ups.",
  "Van Mahotsav- Tree Plantation and distribution of saplings.",
  "Republic Day and Independence Day celebrations.",
  "Fire Safety Mock drill and demos by Punjab Fire Service, SAS Nagar Mohali.",
  "Swachh Bharat Abhiyan: Cleanliness of school campus, Adopted village, Parks, Public Places, Roads.",
];

export function NssPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "nss"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: NssPageData }>("pages/nss");
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
  const gallery = apiImages.length >= 2 ? apiImages : ["/images/6.webp", "/images/7.webp"];
  const apiActivities = cards
    .map((card) => card.title || plainText(card.description))
    .filter((activity): activity is string => Boolean(activity));
  const displayedActivities = apiActivities.length ? apiActivities : nssActivities;
  const apiContent = plainText(content?.description);
  const description =
    plainText(banner?.description) ||
    "Social work is a professional and co curricular discipline committed to the pursuit of social welfare, social change and social justice.";

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <main className="overflow-hidden bg-[#fcfbf8]">
      {/* =====================================================
          PAGE BANNER
      ===================================================== */}

      <PageBanner
        title={banner?.title || page?.title || "National Service Scheme (NSS)"}
        description={description}
      />

      {/* =====================================================
          NSS CONTENT
      ===================================================== */}

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        {/* Background decorations */}

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
            border-[55px]
            border-gold/[.055]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[-120px]
            left-[18%]
            size-72
            rounded-full
            bg-navy/[.018]
          "
        />

        <div className="container relative">
          {/* =================================================
              MAIN TITLE
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
              <HeartHandshake size={25} />
            </div>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[.22em] text-gold-dark">
              NSS
            </p>

            <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl lg:text-5xl">
              {content?.title || page?.title || "National Service Scheme (NSS)"}
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

          <div className="relative mx-auto mt-12 max-w-6xl sm:mt-14">
            {/* Decorative background */}

            <div
              aria-hidden="true"
              className="
                absolute
                -bottom-5
                -left-5
                h-[72%]
                w-[65%]
                rounded-[30px]
                bg-navy
              "
            />

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
              {/* IMAGE 01 */}

              <figure
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
                    src={gallery[0]}
                    alt="Paragon NSS programmes and activities"
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

              {/* IMAGE 02 */}

              <figure
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
                    src={gallery[1]}
                    alt="Students participating in National Service Scheme activities"
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
            </div>

            {/* Gallery number */}

            <span
              className="
                absolute
                -bottom-4
                right-8
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
              NSS
            </span>
          </div>

          {/* =================================================
              NSS DESCRIPTION
          ================================================= */}

          <article className="mx-auto mt-16 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[.3fr_.7fr] lg:gap-14">
              {/* LEFT TITLE */}

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                  National Service Scheme
                </p>

                <h3 className="mt-3 font-serif text-2xl leading-tight text-navy sm:text-3xl">
                  Social Service & Welfare
                </h3>

                <div className="mt-5 h-[2px] w-10 bg-gold" />
              </div>

              {/* DESCRIPTION */}

              <div
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
                  className="
                    absolute
                    left-0
                    top-0
                    h-full
                    w-1
                    bg-gold
                  "
                />

                <p className="text-[15px] leading-8 text-slate-600 sm:text-base">
                  {apiContent || (<>Social work is a professional and co curricular discipline committed to the pursuit of social welfare, social change and social justice. The motto of NSS is <strong className="font-semibold text-navy">“Not Me But You”.</strong> It underlines the welfare of an individual that ultimately leads to the welfare of society as a whole. It is a two year voluntary service where Paragonians can enroll themselves and develop their personality through social service. Through NSS, the volunteers take active part in environment protection by conducting various acts like tree plantation, cleanliness drives and many more.</>)}
                </p>
              </div>
            </div>
          </article>

          {/* =================================================
              ACTIVITIES
          ================================================= */}

          <section className="mx-auto mt-16 max-w-6xl sm:mt-20">
            {/* Heading */}

            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
                NSS Activities
              </p>

              <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl">
                Some of the activities conducted by the Paragon NSS team over
                past couple of years are:
              </h2>

              <div className="mt-5 h-[2px] w-12 bg-gold" />
            </div>

            {/* Activity List */}

            <div
              className="
                mt-9
                rounded-[28px]
                bg-white
                p-6
                shadow-[0_24px_70px_-48px_rgba(16,42,67,.5)]
                sm:p-8
                lg:p-10
              "
            >
              <div className="grid gap-x-12 gap-y-3 lg:grid-cols-2">
                {displayedActivities.map((activity, index) => (
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
                      lg:last:border-b
                    "
                  >
                    <span
                      className="
                        mt-1
                        grid
                        size-7
                        shrink-0
                        place-items-center
                        rounded-lg
                        bg-[#f8f2df]
                        text-gold-dark
                      "
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>

                    <div className="flex-1">
                      <span className="mb-1 block text-[10px] font-bold tracking-[.12em] text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p className="text-[14px] leading-7 text-slate-600 sm:text-[15px]">
                        {activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

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