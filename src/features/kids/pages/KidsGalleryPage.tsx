import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Bus, CalendarHeart, Images, Medal, Palette } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { KidsPageBanner } from "../components/KidsPageBanner";
import { kidsApi } from "../api/kidsApi";
import { applyPageSeo, type PageSeo } from "../../school/utils/pageSeo";

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
  page: { title: string; slug: string; seo?: PageSeo };
  banner?: GallerySection;
  content?: GallerySection;
  categories?: GalleryCategory[];
};

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(image?: string | null, imageUrl?: string | null) {
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  return undefined;
}

function plainText(html?: string | null) {
  return html?.replace(/<br\s*\/?\s*>/gi, " ").replace(/<\/p>/gi, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || "";
}

const galleryIcons = [CalendarHeart, Medal, Palette, Bus];

const cardStyles = [
  {
    color: "#ef5f6c",
    soft: "#fff0f2",
    rotate: "lg:-rotate-[1deg]",
  },
  {
    color: "#37a9df",
    soft: "#edf9fe",
    rotate: "lg:rotate-[1deg]",
  },
  {
    color: "#f4b63e",
    soft: "#fff8e7",
    rotate: "lg:rotate-[.6deg]",
  },
  {
    color: "#20a98b",
    soft: "#edfaf7",
    rotate: "lg:-rotate-[.7deg]",
  },
];


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
      { threshold: 0.12, rootMargin: "0px 0px -55px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden =
    direction === "left"
      ? "-translate-x-10 opacity-0"
      : direction === "right"
        ? "translate-x-10 opacity-0"
        : direction === "scale"
          ? "translate-y-5 scale-[.95] opacity-0"
          : "translate-y-10 opacity-0";

  return (
    <div
      ref={ref}
      className={`kids-gallery-reveal transition-all duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hidden
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function KidsGalleryPage() {
  const { data: gallery } = useQuery({
    queryKey: ["kids-gallery"],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: GalleryResponse }>("gallery");
      return response.data.data;
    },
  });

  const categories = gallery?.categories ?? [];

  useEffect(() => {
    applyPageSeo(gallery?.page.seo);
  }, [gallery]);

  return (
    <>
      <KidsPageBanner
        title={gallery?.banner?.title || gallery?.page.title || "Gallery"}
        description={plainText(gallery?.banner?.description) || "See cheerful classrooms, celebrations, projects and memorable learning moments."}
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
            -left-40
            top-20
            size-[340px]
            rounded-full
            border-[55px]
            border-[#37a9df]/[.055]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-44
            top-[32%]
            size-[380px]
            rounded-full
            border-[60px]
            border-[#ffd34e]/[.08]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-36
            bottom-24
            size-[300px]
            rounded-full
            border-[48px]
            border-[#ef5f6c]/[.045]
          "
        />

        <FloatingDot
          className="left-[7%] top-[10%]"
          color="#ef5f6c"
          delay="0s"
        />

        <FloatingDot
          className="right-[9%] top-[14%]"
          color="#37a9df"
          delay=".8s"
        />

        <FloatingDot
          className="left-[5%] top-[58%]"
          color="#ffd34e"
          delay="1.2s"
        />

        <FloatingDot
          className="right-[7%] bottom-[15%]"
          color="#20a98b"
          delay=".4s"
        />

        {/* =====================================================
            HEADING
        ====================================================== */}

        <section className="container relative py-14 sm:py-16 lg:py-20">
          <Reveal className="mx-auto max-w-3xl text-center" direction="scale">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#ef5f6c]/15
                bg-[#fff2f3]
                px-4
                py-2
              "
            >
              <span className="size-2 rounded-full bg-[#ef5f6c]" />

              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[.2em]
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
                text-4xl
                font-bold
                leading-tight
                text-[#34305c]
                sm:text-5xl
                lg:text-[54px]
              "
            >
              Explore Our{" "}
              <span className="relative inline-block text-[#37a9df]">
                {gallery?.content?.title || "Happy Moments"}
                <HandUnderline />
              </span>
            </h2>

            {gallery?.content?.description && (
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6d697a] sm:text-base">
                {plainText(gallery.content.description)}
              </p>
            )}

            {/* Brand color strip */}
            <div className="mx-auto mt-8 flex w-28 gap-1.5">
              <span className="h-1.5 flex-1 rounded-full bg-[#ef5f6c]" />
              <span className="h-1.5 flex-1 rounded-full bg-[#ffd34e]" />
              <span className="h-1.5 flex-1 rounded-full bg-[#20a98b]" />
              <span className="h-1.5 flex-1 rounded-full bg-[#37a9df]" />
            </div>
          </Reveal>
        </section>

        {/* =====================================================
            GALLERY GRID
        ====================================================== */}

        <section className="container relative pb-16 sm:pb-20 lg:pb-24">
          <div
            className="
              mx-auto
              grid
              max-w-[1180px]
              grid-cols-1
              gap-7
              sm:grid-cols-2
              lg:gap-x-10
              lg:gap-y-12
            "
          >
            {categories.map((category, index) => {
              const Icon = galleryIcons[index % galleryIcons.length];
              const theme = cardStyles[index % cardStyles.length];
              const cover = mediaUrl(category.image, category.image_url);

              return (
                <Reveal
                  key={category.slug}
                  delay={(index % 4) * 120}
                  direction={index % 2 === 0 ? "left" : "right"}
                  className={index % 2 === 1 ? "lg:translate-y-7" : ""}
                >
                <Link
                  to={`/kids/gallery/${category.slug}`}
                  className={`
                    group
                    relative
                    block
                    transition-all
                    duration-500
                    hover:z-10
                    hover:-translate-y-2
                    hover:rotate-0
                    hover:scale-[1.015]
                    ${theme.rotate}
                  `}
                >
                  {/* Decorative back sheet */}
                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      inset-2
                      translate-x-2
                      translate-y-2
                      rounded-[32px]
                      transition-transform
                      duration-500
                      group-hover:translate-x-3
                      group-hover:translate-y-3
                    "
                    style={{
                      backgroundColor: theme.soft,
                    }}
                  />

                  {/* Main card */}
                  <article
                    className="
                      relative
                      overflow-hidden
                      rounded-[30px]
                      border
                      border-[#34305c]/[.07]
                      bg-white
                      p-3
                      shadow-[0_25px_70px_-42px_rgba(52,48,92,.48)]
                      transition-shadow
                      duration-500
                      group-hover:shadow-[0_30px_80px_-35px_rgba(52,48,92,.55)]
                      sm:p-4
                    "
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-20 -top-20 size-44 rounded-full opacity-[.07] blur-2xl"
                      style={{ backgroundColor: theme.color }}
                    />

                    {/* =================================================
                        IMAGE
                    ================================================== */}

                    <div
                      className="
                        relative
                        aspect-[4/3]
                        overflow-hidden
                        rounded-[22px]
                        bg-[#eee]
                        sm:aspect-[16/11]
                      "
                    >
                      <img
                        src={cover}
                        alt={category.title}
                        loading={index < 2 ? "eager" : "lazy"}
                        className="
                          size-full
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-[1.07]
                        "
                      />

                      {/* soft gradient */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-[#34305c]/40
                          via-transparent
                          to-transparent
                        "
                      />

                      {/* Number */}
                      <span
                        className="
                          absolute
                          left-4
                          top-4
                          flex
                          h-9
                          min-w-9
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/40
                          bg-white/90
                          px-2
                          text-[10px]
                          font-black
                          tracking-[.12em]
                          shadow-sm
                          backdrop-blur-md
                        "
                        style={{
                          color: theme.color,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Icon */}
                      <span
                        className="
                          absolute
                          bottom-4
                          left-4
                          grid
                          size-12
                          place-items-center
                          rounded-2xl
                          text-white
                          shadow-lg
                          transition-all
                          duration-500
                          group-hover:-translate-y-1
                          group-hover:rotate-3
                        "
                        style={{
                          backgroundColor: theme.color,
                        }}
                      >
                        <Icon size={22} strokeWidth={2} />
                      </span>

                      {/* Top decorative corner */}
                      <span
                        aria-hidden="true"
                        className="
                          absolute
                          -right-8
                          -top-8
                          size-24
                          rounded-full
                          border-[17px]
                          border-white/20
                        "
                      />
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================== */}

                    <div className="px-2 pb-2 pt-6 sm:px-3 sm:pb-3">
                      <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0">
                          <p
                            className="
                              mb-2
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[.2em]
                            "
                            style={{
                              color: theme.color,
                            }}
                          >
                            Paragon Kids Gallery
                          </p>

                          <h3
                            className="
                              font-serif
                              text-[27px]
                              font-bold
                              leading-tight
                              text-[#34305c]
                              sm:text-[30px]
                            "
                          >
                            {category.title}
                          </h3>
                        </div>

                        {/* Arrow */}
                        <span
                          className="
                            mt-1
                            grid
                            size-11
                            shrink-0
                            place-items-center
                            rounded-full
                            transition-all
                            duration-300
                            group-hover:rotate-12
                            group-hover:text-white
                          "
                          style={{
                            backgroundColor: theme.soft,
                            color: theme.color,
                          }}
                        >
                          <ArrowUpRight size={19} />
                        </span>
                      </div>

                      <p
                        className="
                          mt-3
                          max-w-lg
                          text-sm
                          leading-6
                          text-[#6d697a]
                        "
                      >
                        Explore the {category.title} photo collection from Paragon Kids.
                      </p>

                      {/* Bottom */}
                      <div
                        className="
                          mt-6
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
                            font-black
                            uppercase
                            tracking-[.16em]
                          "
                          style={{
                            color: theme.color,
                          }}
                        >
                          View Gallery
                        </span>

                        <div className="flex items-center gap-1">
                          <span
                            className="h-1 w-7 rounded-full"
                            style={{
                              backgroundColor: theme.color,
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
                </Reveal>
              );
            })}
          </div>

          {/* =====================================================
              BOTTOM MESSAGE
          ====================================================== */}

          <Reveal className="mt-14 flex justify-center sm:mt-16" direction="up" delay={100}>
            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-[#34305c]/[.08]
                bg-white
                px-5
                py-3
                text-sm
                text-[#716d7e]
                shadow-[0_12px_35px_-22px_rgba(52,48,92,.4)]
              "
            >
              <span
                className="
                  grid
                  size-8
                  place-items-center
                  rounded-full
                  bg-[#fff0f2]
                  text-[#ef5f6c]
                "
              >
                <Images size={16} />
              </span>

              Choose a category to discover more moments
            </div>
          </Reveal>
        </section>
      </main>

      <style>{`
        @keyframes kidsGalleryFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }

        @keyframes kidsGalleryWiggle {
          0%, 100% { transform: translateY(-4px) rotate(3deg) scale(1); }
          35% { transform: translateY(-6px) rotate(-5deg) scale(1.06); }
          70% { transform: translateY(-5px) rotate(6deg) scale(1.04); }
        }

        @keyframes kidsGalleryUnderline {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .kids-gallery-underline {
          transform-origin: left center;
          animation: kidsGalleryUnderline .9s .25s both cubic-bezier(.2,.8,.2,1);
        }

        @media (prefers-reduced-motion: reduce) {
          .kids-gallery-reveal,
          .kids-gallery-underline {
            animation: none !important;
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
   DECORATIVE FLOATING DOT
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
      className={`pointer-events-none absolute size-3 rounded-full opacity-40 ${className}`}
      style={{
        backgroundColor: color,
        animation: `kidsGalleryFloat 5s ease-in-out ${delay} infinite`,
      }}
    />
  );
}

/* =========================================================
   HAND-DRAWN UNDERLINE
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
        kids-gallery-underline
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