import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { kidsApi } from "../api/kidsApi";

const fallbackQuickLinks = [
  ["Admission", "/kids/admission"],
  ["Gallery", "/kids/gallery"],
  ["Activities", "/kids/activities"],
  ["Contact", "/kids/contact"],
];

const fallbackGalleryImages = [
  ["art_room_1.webp", "Creative class activities"],
  ["sports_day.webp", "Annual sports meet"],
  ["school_bus.webp", "Kids excursions"],
  ["music_room.webp", "Music and celebrations"],
  ["smart_classes.webp", "Learning in class"],
  ["auditorium.webp", "Paragon Kids events"],
];

type FooterQuickLink = { label?: string; url?: string };
type FooterGalleryImage = { url?: string; image_url?: string; alt?: string };
type KidsFooterData = {
  about_title?: string;
  about_text?: string;
  logo?: string;
  logo_url?: string;
  quick_links?: FooterQuickLink[];
  gallery_images?: FooterGalleryImage[];
  contact_title?: string;
  address?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  social?: {
    facebook_url?: string | null;
    instagram_url?: string | null;
    youtube_url?: string | null;
  };
  style?: { background_color?: string; text_color?: string };
  copyright_text?: string;
};

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function footerMediaUrl(path?: string | null, url?: string | null) {
  if (url && !url.includes("localhost")) return url;
  return path ? `${storageBaseUrl}${path.replace(/^\/+/, "")}` : undefined;
}

function quickLinkPath(label: string, url?: string) {
  if (url && url !== "#") return url;
  const paths: Record<string, string> = {
    admission: "/kids/admission",
    gallery: "/kids/gallery",
    activities: "/kids/activities",
    contact: "/kids/contact",
  };
  return paths[label.toLowerCase()] || "/kids";
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
/* =========================================================`n   SCROLL REVEAL
========================================================= */

function FooterReveal({
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
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px",
      },
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
          ? "translate-y-6 scale-[.92] opacity-0"
          : "translate-y-12 opacity-0";

  return (
    <div
      ref={ref}
      className={`
        kids-footer-reveal
        transition-all
        duration-[900ms]
        ease-[cubic-bezier(.2,.8,.2,1)]
        ${
          visible
            ? "translate-x-0 translate-y-0 scale-100 opacity-100"
            : hidden
        }
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   FOOTER
========================================================= */

export function KidsFooter() {
  const { data: footer } = useQuery({
    queryKey: ["kids-footer"],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: KidsFooterData }>("footer");
      return response.data.data;
    },
  });

  const quickLinks = footer?.quick_links?.length
    ? footer.quick_links.map((link) => [
        link.label || "Link",
        quickLinkPath(link.label || "", link.url),
      ] as const)
    : fallbackQuickLinks;
  const galleryImages = footer?.gallery_images?.length
    ? footer.gallery_images.map((image) => [
        footerMediaUrl(image.url, image.image_url) || "/images/art_room_1.webp",
        image.alt || "Paragon Kids gallery",
      ] as const)
    : fallbackGalleryImages.map(([image, alt]) => [`/images/${image}`, alt] as const);
  const mobileNumbers = footer?.mobile
    ?.split(",")
    .map((number) => number.trim())
    .filter(Boolean) || ["+91 8284848899", "9915509652", "9855953220"];
  const logoUrl = footerMediaUrl(footer?.logo, footer?.logo_url) ||
    "/images/paragon-kids-logo.webp";

  return (
    <>
      <footer
        className="relative isolate overflow-hidden bg-[#34305c] text-white"
        style={{
          backgroundColor: footer?.style?.background_color || undefined,
          color: footer?.style?.text_color || undefined,
        }}
      >

        {/* =====================================================
            ANIMATED TOP COLOR STRIP
        ===================================================== */}

        <div
          className="absolute inset-x-0 top-0 z-20 flex h-2 overflow-hidden"
          aria-hidden="true"
        >
          <span className="kids-footer-color flex-1 bg-[#f28c28]" />
          <span className="kids-footer-color flex-1 bg-[#ef5f6c]" />
          <span className="kids-footer-color flex-1 bg-[#ffd34e]" />
          <span className="kids-footer-color flex-1 bg-[#20a98b]" />
          <span className="kids-footer-color flex-1 bg-[#37a9df]" />
          <span className="kids-footer-color flex-1 bg-[#8b65c2]" />
        </div>

        {/* =====================================================
            BACKGROUND
        ===================================================== */}

        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_8%_20%,rgba(55,169,223,.12),transparent_24%),radial-gradient(circle_at_88%_80%,rgba(239,95,108,.09),transparent_26%),linear-gradient(135deg,#34305c_0%,#373468_55%,#34305c_100%)]" />

        {/* dotted texture */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            -z-10
            opacity-[.035]
            [background-image:radial-gradient(circle,#fff_1.3px,transparent_1.3px)]
            [background-size:27px_27px]
          "
        />

        {/* =====================================================
            PLAYFUL BACKGROUND SHAPES
        ===================================================== */}

        <div
          className="
            kids-footer-ring
            pointer-events-none
            absolute
            -right-24
            -top-24
            size-72
            rounded-full
            border-[42px]
            border-[#ffd34e]/10
          "
          aria-hidden="true"
        />

        <div
          className="
            kids-footer-blue
            pointer-events-none
            absolute
            -bottom-28
            left-[28%]
            size-64
            rounded-full
            bg-[#37a9df]/[.07]
          "
          aria-hidden="true"
        />

        <span
          className="
            kids-footer-star
            pointer-events-none
            absolute
            right-[22%]
            top-16
            text-3xl
            text-[#ef5f6c]/50
          "
          aria-hidden="true"
        >
          ABC
        </span>

        <span
          className="
            kids-footer-spark
            pointer-events-none
            absolute
            right-[9%]
            top-[43%]
            text-2xl
            text-[#ffd34e]/50
          "
          aria-hidden="true"
        >
         123
        </span>

        <span
          className="
            kids-footer-dot-one
            pointer-events-none
            absolute
            left-[8%]
            top-[23%]
            size-3
            rounded-full
            bg-[#20a98b]/60
          "
          aria-hidden="true"
        />

        <span
          className="
            kids-footer-dot-two
            pointer-events-none
            absolute
            bottom-[25%]
            left-[43%]
            size-2.5
            rounded-full
            bg-[#f28c28]/70
          "
          aria-hidden="true"
        />

        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="container relative py-16 sm:py-20 lg:py-24">
          <div
            className="
              grid
              gap-12
              sm:grid-cols-2
              lg:grid-cols-[1.25fr_.7fr_1fr_1.15fr]
              lg:gap-10
            "
          >

            {/* =================================================
                ABOUT
            ================================================= */}

            <FooterReveal direction="left">
              <section>
                <Link
                  to="/kids"
                  className="
                    kids-footer-logo
                    group
                    relative
                    inline-block
                    rounded-[22px]
                    bg-white
                    p-2.5
                    shadow-[0_18px_45px_-18px_rgba(0,0,0,.55)]
                    transition
                    duration-500
                    hover:-translate-y-1
                    hover:rotate-1
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      -right-2
                      -top-2
                      size-4
                      rounded-full
                      bg-[#ffd34e]
                      shadow
                    "
                  />

                  <img
                    src={logoUrl}
                    alt="Paragon Kids"
                    className="
                      h-16
                      w-auto
                      transition
                      duration-500
                      group-hover:scale-[1.04]
                    "
                  />
                </Link>

                <h2 className="mt-7 font-serif text-2xl leading-tight sm:text-[28px]">
                  {footer?.about_title || "About Paragon Kids School"}
                </h2>

                {/* colorful heading accent */}

                <div
                  className="mt-4 flex h-1 w-20 overflow-hidden rounded-full"
                  aria-hidden="true"
                >
                  <span className="flex-1 bg-[#ef5f6c]" />
                  <span className="flex-1 bg-[#ffd34e]" />
                  <span className="flex-1 bg-[#20a98b]" />
                  <span className="flex-1 bg-[#37a9df]" />
                </div>

                <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
                  {footer?.about_text || "We focus on core learning areas and thoughtful methods that enhance the unique gifts of every child."}
                </p>

                <p className="mt-7 text-xs font-black uppercase tracking-[.18em] text-[#ffd34e]">
                  Explore us
                </p>

                <div className="mt-4 flex gap-3">
                  <a
                    href={footer?.social?.facebook_url || "https://www.facebook.com/paragonkids71"}
                    aria-label="Paragon Kids on Facebook"
                    className="
                      kids-social-button
                      grid
                      size-11
                      place-items-center
                      rounded-full
                      border
                      border-white/10
                      bg-white/[.08]
                      text-white
                      transition
                      duration-300
                      hover:-translate-y-1.5
                      hover:rotate-6
                      hover:border-[#37a9df]
                      hover:bg-[#37a9df]
                    "
                  >
                    <span className="font-black">f</span>
                  </a>

                  <a
                    href={footer?.social?.instagram_url || "https://www.instagram.com/paragon71_official/"}
                    aria-label="Paragon Kids on Instagram"
                    className="
                      kids-social-button
                      grid
                      size-11
                      place-items-center
                      rounded-full
                      border
                      border-white/10
                      bg-white/[.08]
                      text-white
                      transition
                      duration-300
                      hover:-translate-y-1.5
                      hover:-rotate-6
                      hover:border-[#ef5f6c]
                      hover:bg-[#ef5f6c]
                    "
                  >
                    <span className="text-xs font-black">IG</span>
                  </a>
                </div>
              </section>
            </FooterReveal>

            {/* =================================================
                QUICK LINKS
            ================================================= */}

            <FooterReveal
              direction="up"
              delay={100}
            >
              <section>
                <FooterHeading
                  title="Quick Links"
                  color="#ffd34e"
                />

                <div className="mt-6 grid gap-1">
                  {quickLinks.map(([label, path], index) => (
                    <Link
                      key={path}
                      to={path}
                      className="
                        group
                        relative
                        flex
                        items-center
                        justify-between
                        overflow-hidden
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        text-white/70
                        transition
                        duration-300
                        hover:translate-x-1
                        hover:bg-white/[.06]
                        hover:text-[#ffd34e]
                      "
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="size-1.5 rounded-full transition-transform duration-300 group-hover:scale-[1.7]"
                          style={{
                            backgroundColor:
                              [
                                "#ef5f6c",
                                "#ffd34e",
                                "#20a98b",
                                "#37a9df",
                              ][index],
                          }}
                        />

                        {label}
                      </span>

                      <ArrowUpRight
                        size={15}
                        className="
                          -translate-x-2
                          translate-y-2
                          opacity-0
                          transition-all
                          duration-300
                          group-hover:translate-x-0
                          group-hover:translate-y-0
                          group-hover:opacity-100
                        "
                      />
                    </Link>
                  ))}
                </div>
              </section>
            </FooterReveal>

            {/* =================================================
                GALLERY
            ================================================= */}

            <FooterReveal
              direction="scale"
              delay={180}
            >
              <section>
                <FooterHeading
                  title="Gallery"
                  color="#20a98b"
                />

                <div className="mt-6 grid grid-cols-3 gap-2.5">
                  {galleryImages.map(([image, alt], index) => (
                    <Link
                      key={image}
                      to="/kids/gallery"
                      aria-label={`View ${alt}`}
                      className="
                        group
                        relative
                        aspect-square
                        overflow-hidden
                        rounded-[14px]
                        border
                        border-white/10
                        bg-white/5
                        shadow-sm
                        transition
                        duration-300
                        hover:-translate-y-1
                      "
                    >
                      <img
                        src={image}
                        alt={alt}
                        className="
                          size-full
                          object-cover
                          transition
                          duration-700
                          ease-out
                          group-hover:scale-[1.14]
                        "
                        loading="lazy"
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-[#34305c]/20
                          opacity-0
                          transition
                          duration-300
                          group-hover:opacity-100
                        "
                      />

                      <span
                        className="
                          absolute
                          right-1.5
                          top-1.5
                          grid
                          size-5
                          translate-y-1
                          place-items-center
                          rounded-full
                          bg-white
                          text-[8px]
                          font-black
                          text-[#34305c]
                          opacity-0
                          shadow
                          transition
                          duration-300
                          group-hover:translate-y-0
                          group-hover:opacity-100
                        "
                      >
                        {index + 1}
                      </span>
                    </Link>
                  ))}
                </div>

                <Link
                  to="/kids/gallery"
                  className="
                    group
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    text-xs
                    font-black
                    uppercase
                    tracking-[.14em]
                    text-[#20a98b]
                    transition
                    hover:text-white
                  "
                >
                  View Gallery

                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </section>
            </FooterReveal>

            {/* =================================================
                CONTACT
            ================================================= */}

            <FooterReveal
              direction="right"
              delay={260}
            >
              <section>
                <FooterHeading
                  title={footer?.contact_title || "Contact"}
                  color="#ef5f6c"
                />

                <div className="mt-6 space-y-3 text-sm leading-6 text-white/70">

                  <ContactRow
                    icon={
                      <MapPin
                        size={18}
                        className="text-[#ef5f6c]"
                      />
                    }
                  >
                    <p>{footer?.address || "Paragon Kids, Sector 71, SAS Nagar, Mohali, Punjab, PIN 160071, India"}</p>
                  </ContactRow>

                  <ContactRow
                    icon={
                      <Phone size={18} className="text-[#20a98b]" />
                    }
                  >
                    <p>
                      <a href={phoneHref(footer?.phone || "0172-5097142")} className="transition hover:text-white">
                        {footer?.phone || "0172-5097142"}
                      </a>
                      {mobileNumbers.map((number) => (
                        <span key={number}>
                          <br />
                          <a href={phoneHref(number)} className="transition hover:text-white">
                            {number}
                          </a>
                        </span>
                      ))}
                    </p>
                  </ContactRow>

                  <ContactRow
                    icon={
                      <Mail
                        size={18}
                        className="text-[#37a9df]"
                      />
                    }
                  >
                    <a
                      href={`mailto:${footer?.email || "paragonkids71@gmail.com"}`}
                      className="break-all transition hover:text-white"
                    >
                      {footer?.email || "paragonkids71@gmail.com"}
                    </a>
                  </ContactRow>
                </div>
              </section>
            </FooterReveal>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div className="relative border-t border-white/10 bg-black/[.06]">
          <div
            className="
              container
              flex
              flex-col
              items-center
              justify-between
              gap-4
              py-5
              text-center
              text-xs
              text-white/55
              sm:flex-row
              sm:text-left
            "
          >
            <p>
              {footer?.copyright_text || `© ${new Date().getFullYear()} Paragon Kids School. All rights reserved.`}
            </p>

            <p className="kids-footer-tagline flex items-center gap-2.5">
              <span className="kids-tag-dot size-2 rounded-full bg-[#ef5f6c]" />

              <span>
                Growing happy, curious minds.
              </span>

              <span className="kids-tag-dot size-2 rounded-full bg-[#37a9df]" />
            </p>
          </div>
        </div>
      </footer>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        /* ---------------------------------------------
           TOP COLOR STRIP
        --------------------------------------------- */

        .kids-footer-color {
          transform: scaleX(0);
          transform-origin: left;
          animation: kidsFooterColorIn .8s ease forwards;
        }

        .kids-footer-color:nth-child(1) {
          animation-delay: .05s;
        }

        .kids-footer-color:nth-child(2) {
          animation-delay: .12s;
        }

        .kids-footer-color:nth-child(3) {
          animation-delay: .19s;
        }

        .kids-footer-color:nth-child(4) {
          animation-delay: .26s;
        }

        .kids-footer-color:nth-child(5) {
          animation-delay: .33s;
        }

        .kids-footer-color:nth-child(6) {
          animation-delay: .4s;
        }

        @keyframes kidsFooterColorIn {
          to {
            transform: scaleX(1);
          }
        }


        /* ---------------------------------------------
           LOGO
        --------------------------------------------- */

        .kids-footer-logo {
          animation:
            kidsFooterLogoFloat
            4.5s
            ease-in-out
            infinite;
        }

        @keyframes kidsFooterLogoFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-6px) rotate(.8deg);
          }
        }


        /* ---------------------------------------------
           YELLOW RING
        --------------------------------------------- */

        .kids-footer-ring {
          animation:
            kidsFooterRing
            12s
            linear
            infinite;
        }

        @keyframes kidsFooterRing {
          0% {
            transform: rotate(0deg) scale(1);
          }

          50% {
            transform: rotate(180deg) scale(1.07);
          }

          100% {
            transform: rotate(360deg) scale(1);
          }
        }


        /* ---------------------------------------------
           BLUE BACKGROUND BALL
        --------------------------------------------- */

        .kids-footer-blue {
          animation:
            kidsFooterBlue
            6s
            ease-in-out
            infinite;
        }

        @keyframes kidsFooterBlue {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-20px) scale(1.08);
          }
        }


        /* ---------------------------------------------
           STAR
        --------------------------------------------- */

        .kids-footer-star {
          animation:
            kidsFooterStar
            3.2s
            ease-in-out
            infinite;
        }

        @keyframes kidsFooterStar {
          0%,
          100% {
            transform: rotate(12deg) scale(1);
            opacity: .5;
          }

          50% {
            transform: rotate(32deg) scale(1.35);
            opacity: .9;
          }
        }


        /* ---------------------------------------------
           SPARK
        --------------------------------------------- */

        .kids-footer-spark {
          animation:
            kidsFooterSpark
            2.6s
            ease-in-out
            infinite;
        }

        @keyframes kidsFooterSpark {
          0%,
          100% {
            transform: scale(.9) rotate(0deg);
            opacity: .4;
          }

          50% {
            transform: scale(1.45) rotate(25deg);
            opacity: .9;
          }
        }


        /* ---------------------------------------------
           FLOATING DOTS
        --------------------------------------------- */

        .kids-footer-dot-one {
          animation:
            kidsFooterDot
            3.8s
            ease-in-out
            infinite;
        }

        .kids-footer-dot-two {
          animation:
            kidsFooterDot
            4.5s
            ease-in-out
            .6s
            infinite;
        }

        @keyframes kidsFooterDot {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-14px) scale(1.35);
          }
        }


        /* ---------------------------------------------
           SOCIAL BUTTONS
        --------------------------------------------- */

        .kids-social-button:hover {
          box-shadow:
            0 12px 28px -12px
            rgba(0, 0, 0, .55);
        }


        /* ---------------------------------------------
           TAGLINE DOTS
        --------------------------------------------- */

        .kids-tag-dot {
          animation:
            kidsFooterDotPulse
            2.2s
            ease-in-out
            infinite;
        }

        .kids-tag-dot:last-child {
          animation-delay: .6s;
        }

        @keyframes kidsFooterDotPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: .7;
          }

          50% {
            transform: scale(1.55);
            opacity: 1;
          }
        }


        /* ---------------------------------------------
           REDUCED MOTION
        --------------------------------------------- */

        @media (prefers-reduced-motion: reduce) {
          .kids-footer-reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .kids-footer-color,
          .kids-footer-logo,
          .kids-footer-ring,
          .kids-footer-blue,
          .kids-footer-star,
          .kids-footer-spark,
          .kids-footer-dot-one,
          .kids-footer-dot-two,
          .kids-tag-dot {
            animation: none !important;
            transform: none !important;
          }

          .kids-footer-color {
            transform: scaleX(1) !important;
          }
        }
      `}</style>
    </>
  );
}

/* =========================================================
   FOOTER HEADING
========================================================= */

function FooterHeading({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl">
        {title}
      </h2>

      <div className="mt-3 flex items-center gap-2">
        <span
          className="h-1 w-8 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

        <span
          className="size-1.5 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   CONTACT ROW
========================================================= */

function ContactRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className="
        group
        flex
        gap-3
        rounded-2xl
        border
        border-transparent
        p-2.5
        transition
        duration-300
        hover:translate-x-1
        hover:border-white/[.06]
        hover:bg-white/[.045]
      "
    >
      <span
        className="
          mt-0.5
          grid
          size-9
          shrink-0
          place-items-center
          rounded-xl
          bg-white/[.07]
          transition
          duration-300
          group-hover:-rotate-6
          group-hover:scale-110
          group-hover:bg-white/[.11]
        "
      >
        {icon}
      </span>

      <div className="pt-1">
        {children}
      </div>
    </div>
  );
}