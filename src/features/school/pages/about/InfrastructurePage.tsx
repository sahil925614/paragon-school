import {
  Ambulance,
  BookMarked,
  BusFront,
  Drama,
  Dumbbell,
  FlaskConical,
  Landmark,
  MonitorSmartphone,
  Music2,
  Palette,
  Play,
  ShieldCheck,
  SunMedium,
  UtensilsCrossed,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type InfrastructureCard = {
  title?: string;
  description?: string;
  image?: string;
  image_url?: string;
};

type InfrastructureSettings = {
  cards?: InfrastructureCard[];
  video_title?: string;
  video_url?: string;
  video_description?: string;
};

type InfrastructureSection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  is_active: boolean;
  settings?: InfrastructureSettings | [];
};

type InfrastructurePageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: InfrastructureSection[];
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
      ?.replace(/<br\s*\/?\s*>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim() || ""
  );
}
type Facility = {
  icon: React.ElementType;
  title: string;
  image: string;
  badge: string;
  copy: string;
};

const facilities: Facility[] = [
  {
    icon: BookMarked,
    title: "Library",
    image: "/images/library.webp",
    badge: "Academics & Study",
    copy: "Our well-stocked library offers over 5,000 books, from encyclopaedias and fiction to reference books in different languages. It gives young minds a quiet place to explore, inquire and develop reading habits that last.",
  },
  {
    icon: FlaskConical,
    title: "Laboratories",
    image: "/images/lab.webp",
    badge: "Practical Science & IT",
    copy: "Well-equipped Physics, Chemistry, Biology, Computer and Mathematics laboratories make learning practical. Modern equipment, resources and air-conditioned IT labs support hands-on discovery.",
  },
  {
    icon: Drama,
    title: "Auditorium & Multimedia Theatre",
    image: "/images/auditorium.webp",
    badge: "Events & Culture",
    copy: "Our centrally air-conditioned auditorium seats up to 700 people and hosts workshops, seminars, conferences, school functions and multimedia presentations.",
  },
  {
    icon: MonitorSmartphone,
    title: "Smart Classrooms",
    image: "/images/smart_classes.webp",
    badge: "Digital Learning",
    copy: "Technology-enabled classrooms bring content to life through digital learning, interactive material, maps, diagrams and illustrations that encourage engagement and collaboration.",
  },
  {
    icon: Dumbbell,
    title: "Sports",
    image: "/images/sports_day.webp",
    badge: "Athletics & Fitness",
    copy: "Students receive specialist coaching in athletics, badminton, basketball, cricket, karate, table tennis, taekwondo, volleyball, yoga, chess and more—with the facilities to play, train and thrive.",
  },
  {
    icon: Palette,
    title: "Art Room",
    image: "/images/art_room_1.webp",
    badge: "Creative Arts",
    copy: "A bright, dedicated art room celebrates student creativity through paintings, drawings and artefacts, giving every learner space to express and develop artistic ability.",
  },
  {
    icon: Music2,
    title: "Music & Dance Room",
    image: "/images/music_room.webp",
    badge: "Performing Arts",
    copy: "Well-equipped vocal, instrumental music and dance rooms invite students to train, perform and discover the joy of creative expression.",
  },
  {
    icon: Ambulance,
    title: "Medical Room",
    image: "/images/medical_room.webp",
    badge: "Health & Care",
    copy: "A full-time doctor and nurse provide first aid and support for routine health needs during school hours. Care records are maintained systematically and shared with parents.",
  },
  {
    icon: ShieldCheck,
    title: "Safety & Security",
    image: "/images/security_cameras.webp",
    badge: "Campus Security",
    copy: "Supervision with CCTV cameras helps safeguard the campus. Firefighting readiness and a 125 KV generator support a secure, uninterrupted school day.",
  },
  {
    icon: BusFront,
    title: "Transport",
    image: "/images/school_bus.webp",
    badge: "Fleet & Commute",
    copy: "A fleet of buses serves students across Chandigarh, Mohali and Kharar. GPS-enabled vehicles, trained staff and regular maintenance make every route dependable.",
  },
  {
    icon: SunMedium,
    title: "Solar Panels",
    image: "/images/solar-panels.webp",
    badge: "Sustainability",
    copy: "Our solar-friendly campus is powered by a 24×7 solar backup system, supporting a cleaner, sustainable environment for students and staff.",
  },
  {
    icon: Landmark,
    title: "Hostel",
    image: "/images/hostel.webp",
    badge: "Residential",
    copy: "Hostel facility is available for students from Class VII to Class XII. Parents may contact the school administrative office for admission details.",
  },
  {
    icon: UtensilsCrossed,
    title: "Canteen",
    image: "/images/school_canteen.webp",
    badge: "Dining & Nutrition",
    copy: "A clean, hygienic canteen with ample seating offers cooked and packed food, with a modern kitchen facility for freshly prepared choices.",
  },
];

export function InfrastructurePage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "infrastructure"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: InfrastructurePageData }>(
        "pages/infrastructure",
      );
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const infrastructure = page?.sections.find(
    (section) => section.type === "infrastructure_content" && section.is_active,
  );
  const settings =
    infrastructure?.settings && !Array.isArray(infrastructure.settings)
      ? infrastructure.settings
      : undefined;
  const cards = settings?.cards ?? [];
  const displayedFacilities: Facility[] = cards.length
    ? cards.map((card, index) => {
        const fallback = facilities[index % facilities.length];
        return {
          icon: fallback.icon,
          title: card.title || fallback.title,
          image: mediaUrl(card.image, card.image_url) || fallback.image,
          badge: fallback.badge,
          copy: plainText(card.description) || fallback.copy,
        };
      })
    : facilities;
  const mathsParkCard = cards.find((card) =>
    card.title?.toLowerCase().includes("maths park"),
  );
  const videoImage =
    mediaUrl(mathsParkCard?.image, mathsParkCard?.image_url) ||
    "/images/facilities/maths-park.webp";

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);
  return (
    <>
      <PageBanner
        title={banner?.title || page?.title || "Infrastructure"}
        description={plainText(banner?.description) || "Purpose-built spaces that make every school day richer, safer and more inspiring."}
      />

      <main className="relative isolate overflow-hidden bg-[#f4f7f8]">

        {/* =====================================================
            BACKGROUND DECORATIONS
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -left-[180px]
            top-[90px]
            -z-10
            size-[360px]
            rounded-full
            border-[44px]
            border-[#c72c3b]/[0.045]
            sm:size-[430px]
            lg:-left-[240px]
            lg:size-[560px]
            lg:border-[60px]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-[190px]
            top-[20%]
            -z-10
            size-[390px]
            rounded-full
            bg-navy/[0.025]
            lg:-right-[260px]
            lg:size-[570px]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-[210px]
            top-[48%]
            -z-10
            size-[440px]
            rounded-full
            border-[52px]
            border-navy/[0.025]
            lg:size-[620px]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-[180px]
            top-[69%]
            -z-10
            size-[380px]
            rounded-full
            border-[48px]
            border-[#c72c3b]/[0.035]
            lg:size-[540px]
          "
          aria-hidden="true"
        />

        <span
          className="
            pointer-events-none
            absolute
            right-[8%]
            top-[10%]
            size-2
            rounded-full
            bg-[#c72c3b]/25
          "
          aria-hidden="true"
        />

        <span
          className="
            pointer-events-none
            absolute
            left-[7%]
            top-[38%]
            size-2
            rounded-full
            bg-navy/10
          "
          aria-hidden="true"
        />

        <span
          className="
            pointer-events-none
            absolute
            right-[10%]
            top-[58%]
            size-1.5
            rounded-full
            bg-[#c72c3b]/20
          "
          aria-hidden="true"
        />

        {/* =====================================================
            INTRO
        ====================================================== */}

        <section className="relative border-b border-slate-200/70">
          <div
            className="
              container
              py-14
              text-center
              sm:py-18
              lg:py-20
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-[#c72c3b]
                sm:text-[11px]
              "
            >
              {infrastructure?.name || "School Infrastructure"}
            </p>

            <h2
              className="
                mx-auto
                mt-4
                max-w-3xl
                font-serif
                text-4xl
                leading-[1.1]
                text-navy
                sm:text-5xl
                lg:text-[54px]
              "
            >
              {infrastructure?.title || "A complete environment for growth."}
            </h2>

            <div
              className="
                mx-auto
                mt-5
                h-[2px]
                w-12
                rounded-full
                bg-[#c72c3b]
              "
            />

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-[15px]
                leading-7
                text-slate-600
                sm:text-base
              "
            >
{plainText(infrastructure?.description) || "Explore our thoughtfully engineered campus spaces designed to foster holistic development, academic rigour and absolute safety."}
            </p>
          </div>
        </section>

        {/* =====================================================
            FACILITIES
        ====================================================== */}

        <section
          className="
            container
            relative
            py-14
            sm:py-20
            lg:py-24
          "
        >
          <div
            className="
              space-y-14
              sm:space-y-18
              lg:space-y-24
            "
          >
            {displayedFacilities.map((facility, index) => (
              <FacilitySection
                key={facility.title}
                facility={facility}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* =====================================================
            MATHS PARK VIDEO
        ====================================================== */}

        <section
          className="
            relative
            border-t
            border-slate-200/70
            py-16
            sm:py-20
            lg:py-24
          "
        >
          <div className="container">

            {/* Heading */}

            <div
              className="
                mx-auto
                mb-9
                max-w-3xl
                text-center
                sm:mb-12
              "
            >
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#c72c3b]
                  sm:text-[11px]
                "
              >
                Virtual Experience
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
                {settings?.video_title || "A walk through our Maths Park."}
              </h2>

              <div
                className="
                  mx-auto
                  mt-4
                  h-[2px]
                  w-11
                  bg-[#c72c3b]
                "
              />

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-xl
                  text-[15px]
                  leading-7
                  text-slate-600
                "
              >
{plainText(settings?.video_description) || "Discover how outdoor hands-on spatial learning transforms student intuition."}
              </p>
            </div>

            {/* Video */}

            <a
              href={settings?.video_url || "https://youtu.be/xHgexKsAlXQ"}
              target="_blank"
              rel="noreferrer"
              className="
                group
                relative
                mx-auto
                block
                aspect-video
                max-w-5xl
                overflow-hidden
                rounded-[20px]
                bg-navy
                shadow-[0_25px_65px_-28px_rgba(7,27,58,.55)]
                sm:rounded-[24px]
              "
            >
              <img
                src={videoImage}
                alt="Paragon School Maths Park video"
                className="
                  absolute
                  inset-0
                  size-full
                  object-cover
                  transition
                  duration-700
                  group-hover:scale-[1.035]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-navy/90
                  via-navy/35
                  to-navy/15
                "
              />

              {/* Play button */}

              <div
                className="
                  absolute
                  inset-0
                  grid
                  place-items-center
                "
              >
                <div
                  className="
                    grid
                    size-16
                    place-items-center
                    rounded-full
                    border
                    border-white/30
                    bg-[#c72c3b]
                    text-white
                    shadow-[0_15px_35px_rgba(0,0,0,.3)]
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:bg-[#ad2331]
                    sm:size-20
                  "
                >
                  <Play
                    size={27}
                    fill="currentColor"
                    className="translate-x-[2px]"
                  />
                </div>
              </div>

              {/* Bottom information */}

              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  p-5
                  sm:p-7
                  lg:p-9
                "
              >
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-white/65
                    sm:text-[10px]
                  "
                >
                  Paragon 71 Mohali
                </p>

                <h3
                  className="
                    mt-2
                    max-w-xl
                    font-serif
                    text-xl
                    leading-tight
                    text-white
                    sm:text-2xl
                    lg:text-3xl
                  "
                >
                  {settings?.video_title || "Maths Park: where curiosity takes shape."}
                </h3>
              </div>
            </a>

          </div>
        </section>

      </main>
    </>
  );
}

/* =========================================================
   FACILITY SECTION
========================================================= */

function FacilitySection({
  facility,
  index,
}: {
  facility: Facility;
  index: number;
}) {
  const Icon = facility.icon;
  const imageOnRight = index % 2 !== 0;

  return (
    <article
      className="
        group
        relative
        mx-auto
        grid
        max-w-6xl
        items-center
        gap-7
        sm:gap-9
        lg:grid-cols-2
        lg:gap-14
        xl:gap-20
      "
    >

      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div
        className={`
          relative
          ${imageOnRight ? "lg:order-2" : "lg:order-1"}
        `}
      >
        <div
          className="
            relative
            aspect-[4/3]
            overflow-hidden
            rounded-[18px]
            bg-slate-200
            shadow-[0_20px_55px_-32px_rgba(7,27,58,.5)]
            sm:rounded-[22px]
          "
        >
          <img
            src={facility.image}
            alt={`${facility.title} at Paragon School`}
            loading={index < 2 ? "eager" : "lazy"}
            className="
              size-full
              object-cover
              object-center
              transition-transform
              duration-700
              group-hover:scale-[1.04]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-navy/55
              via-transparent
              to-transparent
            "
          />

          {/* Image badge */}

          <div
            className="
              absolute
              bottom-4
              left-4
              sm:bottom-5
              sm:left-5
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-navy/75
                px-3.5
                py-2
                text-[9px]
                font-bold
                uppercase
                tracking-[0.13em]
                text-white
                backdrop-blur-md
                sm:text-[10px]
              "
            >
              <Icon
                size={14}
                className="text-[#ff6371]"
              />

              {facility.badge}
            </span>
          </div>
        </div>

        {/* Offset accent */}

        <div
          className={`
            pointer-events-none
            absolute
            -z-10
            hidden
            h-[72%]
            w-[65%]
            rounded-[22px]
            border
            border-[#c72c3b]/10
            bg-[#c72c3b]/[0.025]
            sm:block
            ${
              imageOnRight
                ? "-right-4 -top-4"
                : "-left-4 -bottom-4"
            }
          `}
          aria-hidden="true"
        />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className={`
          relative
          ${imageOnRight ? "lg:order-1" : "lg:order-2"}
        `}
      >
        {/* Facility number */}

        <div className="flex items-center gap-4">

          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#c72c3b]
            "
          >
            Facility {String(index + 1).padStart(2, "0")}
          </span>

          <span
            className="
              h-px
              w-10
              bg-slate-300
            "
          />

        </div>

        {/* Icon */}

        <div
          className="
            mt-6
            grid
            size-12
            place-items-center
            rounded-xl
            border
            border-[#c72c3b]/10
            bg-[#c72c3b]/[0.065]
            text-[#c72c3b]
            transition-all
            duration-300
            group-hover:bg-[#c72c3b]
            group-hover:text-white
          "
        >
          <Icon size={22} strokeWidth={1.8} />
        </div>

        {/* Title */}

        <h3
          className="
            mt-5
            max-w-xl
            font-serif
            text-3xl
            leading-[1.15]
            text-navy
            sm:text-4xl
            lg:text-[40px]
          "
        >
          {facility.title}
        </h3>

        {/* Red line */}

        <div
          className="
            mt-5
            h-[2px]
            w-10
            rounded-full
            bg-[#c72c3b]
          "
        />

        {/* Content */}

        <p
          className="
            mt-6
            max-w-xl
            text-[15px]
            leading-7
            text-slate-600
            sm:text-base
            sm:leading-8
          "
        >
          {facility.copy}
        </p>

      </div>

    </article>
  );
}