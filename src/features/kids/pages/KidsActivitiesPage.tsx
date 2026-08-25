import { useQuery } from "@tanstack/react-query";
import { Camera, Globe2, Images } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { KidsPageBanner } from "../components/KidsPageBanner";
import { kidsApi } from "../api/kidsApi";
import { applyPageSeo, type PageSeo } from "../../school/utils/pageSeo";




type ActivityImage = { image?: string; image_url?: string };
type ActivityCard = { title?: string; description?: string | null; images?: ActivityImage[] };
type ActivitySettings = { cards?: ActivityCard[] };
type ActivitySection = {
  type: string;
  title?: string;
  description?: string | null;
  is_active: boolean;
  settings?: ActivitySettings | [];
};
type ActivitiesPageData = { title: string; seo?: PageSeo; sections: ActivitySection[] };
type DisplayActivity = { title: string; description: string; images: string[] };

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";
function mediaUrl(image?: string, imageUrl?: string) {
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  return undefined;
}
function plainText(html?: string | null) {
  return html?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || "";
}
const classShowImages = [
  "/images/14.webp",
  "/images/15.webp",
  "/images/16.webp",
  "/images/1 (1).webp",
  "/images/2 (1).webp",
  "/images/3 (1).webp",
  "/images/4.webp",
  "/images/5.webp",
  "/images/6.webp",
  "/images/7.webp",
  "/images/8.webp",
  "/images/9.webp",
  "/images/10.webp",
  "/images/11.webp",
  "/images/12.webp",
  "/images/13.webp",
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden =
    direction === "left"
      ? "-translate-x-12 opacity-0"
      : direction === "right"
        ? "translate-x-12 opacity-0"
        : direction === "scale"
          ? "translate-y-5 scale-[.94] opacity-0"
          : "translate-y-12 opacity-0";

  return (
    <div
      ref={ref}
      className={`kids-activity-reveal transition-all duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hidden
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function KidsActivitiesPage() {
  const { data: activitiesPage } = useQuery({
    queryKey: ["kids-page", "activities"],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: ActivitiesPageData }>("pages/activities");
      return response.data.data;
    },
  });
  const banner = activitiesPage?.sections.find((section) => section.type === "home_banner" && section.is_active);
  const contentSection = activitiesPage?.sections.find((section) => section.type === "activity_cards_content" && section.is_active);
  const settings = contentSection?.settings && !Array.isArray(contentSection.settings) ? contentSection.settings : undefined;
  const apiActivities: DisplayActivity[] = (settings?.cards ?? []).map((card, index) => ({
    title: plainText(card.title) || `Activity ${index + 1}`,
    description: plainText(card.description),
    images: (card.images ?? []).map((image) => mediaUrl(image.image, image.image_url)).filter((image): image is string => Boolean(image)),
  })).filter((activity) => activity.images.length > 0);
  const activities: DisplayActivity[] = apiActivities.length ? apiActivities : [{
    title: "Class Show",
    description: "Our KG 2 students took an exciting journey across the globe with their class show themed Around the World.",
    images: classShowImages,
  }];

  useEffect(() => {
    applyPageSeo(activitiesPage?.seo);
  }, [activitiesPage]);

  return (
    <>
      {/* =====================================================
          PAGE BANNER
      ====================================================== */}

      <KidsPageBanner
        title={banner?.title || activitiesPage?.title || "Activities"}
        description={plainText(banner?.description) || "Art, music, movement and discovery help little learners express and connect."}
      />

      <main className="relative overflow-hidden bg-[#fffdf8]">
        {/* =====================================================
            BACKGROUND DECORATIONS
        ====================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-36
            top-20
            size-[330px]
            rounded-full
            border-[52px]
            border-[#37a9df]/[.055]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-40
            top-[36%]
            size-[360px]
            rounded-full
            border-[58px]
            border-[#ffd34e]/[.08]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-40
            bottom-32
            size-[320px]
            rounded-full
            border-[50px]
            border-[#ef5f6c]/[.045]
          "
        />

        <FloatingDot
          className="left-[7%] top-[7%]"
          color="#ef5f6c"
          delay="0s"
        />

        <FloatingDot
          className="right-[9%] top-[12%]"
          color="#37a9df"
          delay=".7s"
        />

        <FloatingDot
          className="left-[5%] top-[52%]"
          color="#ffd34e"
          delay="1.2s"
        />

        <FloatingDot
          className="right-[6%] bottom-[12%]"
          color="#20a98b"
          delay=".4s"
        />

        {/* =====================================================
            INTRO
        ====================================================== */}

        <section className="container relative pb-10 pt-14 sm:pb-12 sm:pt-16 lg:pt-20">
          <Reveal className="mx-auto max-w-3xl text-center" direction="scale">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#ef5f6c]/15
                bg-[#fff1f3]
                px-4
                py-2
              "
            >
             

              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[.2em]
                  text-[#ef5f6c]
                "
              >
                {contentSection?.title || "Activities at Paragon Kids"}
              </span>
            </div>

            <h2
              className="
                mt-5
                font-serif
                text-4xl
                font-bold
                leading-tight
                text-[#34305c]
                sm:text-5xl
                lg:text-[54px]
              "
            >
              <span className="relative inline-block text-[#37a9df]">{plainText(contentSection?.description) || "Learning Through Happy Moments"}<HandUnderline /></span>
            </h2>

            <div className="mx-auto mt-8 flex w-28 gap-1.5">
              <span className="h-1.5 flex-1 rounded-full bg-[#ef5f6c]" />
              <span className="h-1.5 flex-1 rounded-full bg-[#ffd34e]" />
              <span className="h-1.5 flex-1 rounded-full bg-[#20a98b]" />
              <span className="h-1.5 flex-1 rounded-full bg-[#37a9df]" />
            </div>
          </Reveal>
        </section>

       

        {activities.map((activity, activityIndex) => (
        <section key={`${activity.title}-${activityIndex}`} className="container relative pb-20 sm:pb-24">
          <div className="mx-auto max-w-[1180px]">
            {/* EVENT HEADING */}

            <Reveal
              direction="left"
              className="
                mb-8
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="
                      grid
                      size-11
                      place-items-center
                      rounded-2xl
                      bg-[#fff2c9]
                      text-[#e7a719]
                    "
                  >
                    <Globe2 size={21} />
                  </span>

                  <span
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[.2em]
                      text-[#20a98b]
                    "
                  >
                    {activity.title}
                  </span>
                </div>

                <h3
                  className="
                    mt-4
                    font-serif
                    text-3xl
                    font-bold
                    text-[#34305c]
                    sm:text-4xl
                  "
                >
                  {activity.title}
                </h3>
              </div>

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
                  py-2
                  text-xs
                  font-bold
                  text-[#706c7c]
                  shadow-sm
                "
              >
                <Images size={15} className="text-[#ef5f6c]" />
                {activity.title} Memories
              </div>
            </Reveal>

            {/* =================================================
                FEATURED COLLAGE
            ================================================== */}

            <Reveal
              direction="scale"
              className="
                grid
                gap-4
                lg:grid-cols-[1.35fr_.65fr]
              "
            >
              {/* LARGE FEATURE IMAGE */}

              <div
                className="
                  group
                  relative
                  min-h-[340px]
                  overflow-hidden
                  rounded-[30px]
                  bg-[#34305c]
                  shadow-[0_25px_70px_-38px_rgba(52,48,92,.55)]
                  sm:min-h-[450px]
                  lg:min-h-[540px]
                "
              >
                <img
                  src={activity.images[0]}
                  alt={activity.title}
                  className="
                    absolute
                    inset-0
                    size-full
                    object-cover
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
                    from-[#34305c]/80
                    via-[#34305c]/10
                    to-transparent
                  "
                />

                {/* Number */}

                <span
                  className="
                    absolute
                    left-5
                    top-5
                    rounded-full
                    border
                    border-white/30
                    bg-white/90
                    px-4
                    py-2
                    text-[10px]
                    font-black
                    tracking-[.16em]
                    text-[#ef5f6c]
                    backdrop-blur
                  "
                >
                  01
                </span>

                {/* Bottom text */}

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span
                    className="
                      mb-4
                      grid
                      size-12
                      place-items-center
                      rounded-2xl
                      bg-[#ef5f6c]
                      text-white
                      shadow-lg
                      [animation:kidsActivityWiggle_3.8s_ease-in-out_infinite]
                    "
                  >
                    <Camera size={21} />
                  </span>

                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[.2em]
                      text-[#ffd34e]
                    "
                  >
                    Paragon Kids
                  </p>

                  <h4
                    className="
                      mt-2
                      font-serif
                      text-3xl
                      font-bold
                      text-white
                      sm:text-4xl
                    "
                  >
                    {activity.title}
                  </h4>
                </div>
              </div>

              {/* RIGHT COLLAGE */}

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                {activity.images.slice(1, 3).map((image, index) => (
                  <PhotoCard
                    key={image}
                    image={image}
                    number={index + 2}
                    title={activity.title}
                  />
                ))}
              </div>
            </Reveal>

            {/* =================================================
                STORY CONTENT
            ================================================== */}

            <Reveal
              direction="right"
              delay={100}
              className="
                relative
                mx-auto
                -mt-1
                max-w-[1050px]
                overflow-hidden
                rounded-b-[30px]
                border-x
                border-b
                border-[#34305c]/[.07]
                bg-white
                px-6
                py-8
                shadow-[0_25px_60px_-45px_rgba(52,48,92,.4)]
                sm:px-9
                sm:py-9
                lg:px-12
              "
            >
              {/* Colored top line */}

            

              <div
                className="
                  grid
                  gap-6
                  md:grid-cols-[180px_1fr]
                  md:items-start
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[.2em]
                      text-[#ef5f6c]
                    "
                  >
                  {activity.title}
                  </p>

                  <p
                    className="
                      mt-2
                      font-serif
                      text-2xl
                      font-bold
                      leading-tight
                      text-[#34305c]
                    "
                  >
                    {activity.title}

                  </p>
                </div>

                <p
                  className="
                    text-[15px]
                    leading-7
                    text-[#686477]
                  "
                >
                  {activity.description}

                </p>
              </div>
            </Reveal>

            {/* =================================================
                MORE MEMORIES
            ================================================== */}

            {activity.images.length > 3 && (
              <div className="mt-14 sm:mt-16">
                <Reveal className="mb-7 flex items-center gap-4" direction="left">
                  <div>
                    <p
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[.2em]
                        text-[#37a9df]
                      "
                    >
                      Photo Memories
                    </p>

                    <h3
                      className="
                        mt-1
                        font-serif
                        text-2xl
                        font-bold
                        text-[#34305c]
                        sm:text-3xl
                      "
                    >
                      More From {activity.title}
                    </h3>
                  </div>

                  <div className="h-px flex-1 bg-[#34305c]/10" />
                </Reveal>

                {/* Creative masonry-like grid */}

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
                  {activity.images.slice(3).map((image, index) => {
                    const realIndex = index + 3;

                    const large =
                      realIndex === 4 ||
                      realIndex === 9;

                    return (
                      <Reveal
                        key={`${image}-${realIndex}`}
                        delay={(index % 4) * 90}
                        direction={index % 2 === 0 ? "up" : "scale"}
                      >
                        <div
                          className={`
                          group
                          relative
                          overflow-hidden
                          rounded-[20px]
                          bg-[#eee]
                          shadow-[0_18px_45px_-30px_rgba(52,48,92,.45)]
                          ${
                            large
                              ? "md:col-span-2"
                              : ""
                          }
                        `}
                      >
                        <div
                          className={
                            large
                              ? "aspect-[16/8]"
                              : "aspect-[4/3]"
                          }
                        >
                          <img
                            src={image}
                            alt={`${activity.title} photograph ${realIndex + 1}`}
                            loading="lazy"
                            className="
                              size-full
                              object-cover
                              transition-transform
                              duration-700
                              group-hover:scale-[1.08]
                            "
                          />
                        </div>

                        <div
                          className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-[#34305c]/35
                            via-transparent
                            to-transparent
                            opacity-0
                            transition-opacity
                            duration-300
                            group-hover:opacity-100
                          "
                        />

                        <span
                          className="
                            absolute
                            bottom-3
                            right-3
                            grid
                            size-8
                            translate-y-2
                            place-items-center
                            rounded-full
                            bg-white/90
                            text-[9px]
                            font-black
                            text-[#34305c]
                            opacity-0
                            shadow
                            backdrop-blur
                            transition-all
                            duration-300
                            group-hover:translate-y-0
                            group-hover:opacity-100
                          "
                        >
                          {String(realIndex + 1).padStart(2, "0")}
                        </span>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
        ))}
      </main>

      <style>{`
        @keyframes kidsActivityFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }

        @keyframes kidsActivityWiggle {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-5deg) translateY(-2px); }
          50% { transform: rotate(3deg) translateY(-5px); }
          75% { transform: rotate(-2deg) translateY(-2px); }
        }

        @keyframes kidsActivityPulse {
          0%, 100% { transform: scale(1); opacity: .4; }
          50% { transform: scale(1.35); opacity: .75; }
        }

        @media (prefers-reduced-motion: reduce) {
          .kids-activity-reveal {
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </>
  );
}

/* =========================================================
   PHOTO CARD
========================================================= */

function PhotoCard({
  image,
  number,
  title,
}: {
  image: string;
  number: number;
  title: string;
}) {
  return (
    <div
      className="
        group
        relative
        min-h-[190px]
        overflow-hidden
        rounded-[25px]
        bg-[#eee]
        sm:min-h-[220px]
        lg:min-h-0
      "
    >
      <img
        src={image}
        alt={`${title} photograph ${number}`}
        className="
          absolute
          inset-0
          size-full
          object-cover
          transition-transform
          duration-700
          group-hover:scale-[1.07]
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[#34305c]/35
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
          bg-white/90
          text-[10px]
          font-black
          text-[#34305c]
          shadow
          backdrop-blur
        "
      >
        {String(number).padStart(2, "0")}
      </span>
    </div>
  );
}

/* =========================================================
   FLOATING DOT
========================================================= */

function FloatingDot({
  className,
  color,
  delay,
}: {
  className: string;
  color: string;
  delay: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`
        pointer-events-none
        absolute
        size-3
        rounded-full
        opacity-40
        ${className}
      `}
      style={{
        backgroundColor: color,
        animation: `kidsActivityFloat 5s ease-in-out ${delay} infinite`,
      }}
    />
  );
}

/* =========================================================
   HAND DRAWN UNDERLINE
========================================================= */

function HandUnderline() {
  return (
    <svg
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="
        absolute
        -bottom-3
        left-0
        h-3
        w-full
        text-[#ef5f6c]
      "
    >
      <path
        d="M3 8C25 3 62 2 97 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}