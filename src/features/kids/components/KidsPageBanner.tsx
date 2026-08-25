import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

type KidsPageBannerProps = {
  title: string;
  description: string;
};

export function KidsPageBanner({ title, description }: KidsPageBannerProps) {
  // Split title so every word can animate separately
  const titleWords = title.split(" ");

  return (
    <>
      <section className="kids-banner relative isolate overflow-hidden bg-[#34305c] text-white">
        {/* =====================================================
            BACKGROUND
        ===================================================== */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_15%,rgba(255,215,93,.28),transparent_24%),radial-gradient(circle_at_70%_110%,rgba(38,174,102,.24),transparent_28%),linear-gradient(115deg,#34305c_0%,#3b3971_58%,#285b83_100%)]" />

        {/* Dotted pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[.08] [background-image:radial-gradient(circle,#fff_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

        {/* =====================================================
            ANIMATED DECORATIONS
        ===================================================== */}

        {/* Yellow circle */}
        <div
          aria-hidden="true"
          className="kids-ring pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border-[38px] border-[#f6bd28]/20"
        />

        {/* Red square */}
        <div
          aria-hidden="true"
          className="kids-red-shape pointer-events-none absolute right-[22%] top-12 size-16 rotate-12 rounded-2xl bg-[#f04f5f]/80 shadow-xl"
        />

        {/* Green shape */}
        <div
          aria-hidden="true"
          className="kids-green-shape pointer-events-none absolute bottom-8 right-[9%] size-20 -rotate-12 rounded-[45%_55%_45%_55%] bg-[#29aa5b]/75 shadow-xl"
        />

        {/* Blue circle */}
        <div
          aria-hidden="true"
          className="kids-blue-ball pointer-events-none absolute bottom-[-3rem] right-[32%] size-32 rounded-full bg-[#25a9e0]/35"
        />

        {/* Floating stars */}
        <div
          aria-hidden="true"
          className="kids-star-one pointer-events-none absolute right-[17%] top-[43%] text-4xl text-[#f6bd28]"
        >
          ✦
        </div>

        <div
          aria-hidden="true"
          className="kids-star-two pointer-events-none absolute right-[4%] top-[48%] text-3xl text-white/50"
        >
          ★
        </div>

        {/* Extra playful small dots */}
        <span
          aria-hidden="true"
          className="kids-dot kids-dot-one pointer-events-none absolute right-[29%] top-[28%] size-3 rounded-full bg-[#f6bd28]"
        />

        <span
          aria-hidden="true"
          className="kids-dot kids-dot-two pointer-events-none absolute right-[12%] top-[22%] size-2.5 rounded-full bg-[#25a9e0]"
        />

        <span
          aria-hidden="true"
          className="kids-dot kids-dot-three pointer-events-none absolute bottom-[24%] right-[25%] size-2 rounded-full bg-[#f04f5f]"
        />

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="container relative z-10 flex min-h-[310px] flex-col justify-center py-14 sm:min-h-[350px] sm:py-16 lg:min-h-[390px] lg:py-20">
          {/* BREADCRUMB */}

          <nav
            aria-label="Breadcrumb"
            className="kids-breadcrumb flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-white/70 sm:text-sm"
          >
            <Link
              to="/kids"
              className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-[#f6bd28]"
            >
              <Home size={15} aria-hidden="true" />
              Home
            </Link>

            <ChevronRight
              size={15}
              className="text-[#f6bd28]"
              aria-hidden="true"
            />

            <span
              className="max-w-[15rem] truncate text-white"
              aria-current="page"
            >
              {title}
            </span>
          </nav>

          {/* TEXT */}

          <div className="mt-7 max-w-4xl">
            {/* TITLE */}

            <h1
              className="kids-title mt-4 flex max-w-4xl flex-wrap gap-x-[0.25em] font-serif text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
              aria-label={title}
            >
              {titleWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  aria-hidden="true"
                  className="kids-title-word inline-block"
                  style={{
                    animationDelay: `${0.18 + index * 0.1}s`,
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Animated underline */}

            <div
              className="kids-title-line mt-4 flex h-1.5 w-[110px] overflow-hidden rounded-full"
              aria-hidden="true"
            >
              <span className="flex-1 bg-[#f04f5f]" />
              <span className="flex-1 bg-[#f6bd28]" />
              <span className="flex-1 bg-[#29aa5b]" />
              <span className="flex-1 bg-[#25a9e0]" />
            </div>

            {/* DESCRIPTION */}

            <p className="kids-description mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              {description}
            </p>
          </div>
        </div>

        {/* =====================================================
            BOTTOM COLOUR BAR
        ===================================================== */}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex h-2"
          aria-hidden="true"
        >
          <span className="kids-color-bar flex-1 bg-[#f04f5f]" />
          <span className="kids-color-bar flex-1 bg-[#f6bd28]" />
          <span className="kids-color-bar flex-1 bg-[#29aa5b]" />
          <span className="kids-color-bar flex-1 bg-[#25a9e0]" />
        </div>
      </section>

      {/* =====================================================
          BANNER ANIMATIONS
      ===================================================== */}

      <style>{`
        /* ---------------------------------------------
           BREADCRUMB ENTRANCE
        --------------------------------------------- */

        .kids-breadcrumb {
          opacity: 0;
          transform: translateX(-45px);
          animation: kidsBreadcrumbIn 0.75s
            cubic-bezier(.22, 1, .36, 1) 0.05s forwards;
        }

        @keyframes kidsBreadcrumbIn {
          0% {
            opacity: 0;
            transform: translateX(-45px);
          }

          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }


        /* ---------------------------------------------
           TITLE WORD ENTRANCE
        --------------------------------------------- */

        .kids-title-word {
          opacity: 0;
          transform:
            translateY(45px)
            rotate(3deg)
            scale(.88);

          animation:
            kidsWordEnter 0.85s
            cubic-bezier(.34, 1.56, .64, 1)
            forwards;
        }

        @keyframes kidsWordEnter {
          0% {
            opacity: 0;
            transform:
              translateY(45px)
              rotate(3deg)
              scale(.88);
          }

          65% {
            opacity: 1;
            transform:
              translateY(-7px)
              rotate(-1deg)
              scale(1.025);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              rotate(0)
              scale(1);
          }
        }


        /* ---------------------------------------------
           TITLE UNDERLINE
        --------------------------------------------- */

        .kids-title-line {
          transform: scaleX(0);
          transform-origin: left center;

          animation:
            kidsLineGrow 0.9s
            cubic-bezier(.22, 1, .36, 1)
            .65s forwards;
        }

        @keyframes kidsLineGrow {
          to {
            transform: scaleX(1);
          }
        }


        /* ---------------------------------------------
           DESCRIPTION
        --------------------------------------------- */

        .kids-description {
          opacity: 0;
          transform: translateY(30px);

          animation:
            kidsDescriptionIn .8s
            cubic-bezier(.22, 1, .36, 1)
            .65s forwards;
        }

        @keyframes kidsDescriptionIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* ---------------------------------------------
           RED SHAPE
        --------------------------------------------- */

        .kids-red-shape {
          animation:
            kidsRedFloat 4.2s
            ease-in-out infinite;
        }

        @keyframes kidsRedFloat {
          0%, 100% {
            transform:
              translateY(0)
              rotate(12deg);
          }

          50% {
            transform:
              translateY(-18px)
              rotate(22deg);
          }
        }


        /* ---------------------------------------------
           GREEN SHAPE
        --------------------------------------------- */

        .kids-green-shape {
          animation:
            kidsGreenFloat 5s
            ease-in-out infinite;
        }

        @keyframes kidsGreenFloat {
          0%, 100% {
            transform:
              translateY(0)
              rotate(-12deg)
              scale(1);
          }

          50% {
            transform:
              translateY(-16px)
              rotate(-3deg)
              scale(1.06);
          }
        }


        /* ---------------------------------------------
           BLUE BALL
        --------------------------------------------- */

        .kids-blue-ball {
          animation:
            kidsBlueBall 5.5s
            ease-in-out infinite;
        }

        @keyframes kidsBlueBall {
          0%, 100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-22px) scale(1.08);
          }
        }


        /* ---------------------------------------------
           YELLOW RING
        --------------------------------------------- */

        .kids-ring {
          animation:
            kidsRing 9s
            linear infinite;
        }

        @keyframes kidsRing {
          0% {
            transform: rotate(0deg) scale(1);
          }

          50% {
            transform: rotate(180deg) scale(1.06);
          }

          100% {
            transform: rotate(360deg) scale(1);
          }
        }


        /* ---------------------------------------------
           STARS
        --------------------------------------------- */

        .kids-star-one {
          animation:
            kidsStarOne 2.6s
            ease-in-out infinite;
        }

        @keyframes kidsStarOne {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: .75;
          }

          50% {
            transform: scale(1.45) rotate(22deg);
            opacity: 1;
          }
        }


        .kids-star-two {
          animation:
            kidsStarTwo 3.3s
            ease-in-out infinite;
        }

        @keyframes kidsStarTwo {
          0%, 100% {
            transform: translateY(0) rotate(0);
          }

          50% {
            transform: translateY(-12px) rotate(-15deg);
          }
        }


        /* ---------------------------------------------
           SMALL DOTS
        --------------------------------------------- */

        .kids-dot-one {
          animation: kidsDotFloat 3s ease-in-out infinite;
        }

        .kids-dot-two {
          animation: kidsDotFloat 3.8s ease-in-out .5s infinite;
        }

        .kids-dot-three {
          animation: kidsDotFloat 4.3s ease-in-out 1s infinite;
        }

        @keyframes kidsDotFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-15px) scale(1.3);
          }
        }


        /* ---------------------------------------------
           BOTTOM COLOR BAR
        --------------------------------------------- */

        .kids-color-bar {
          transform: scaleX(0);
          transform-origin: left center;
          animation: kidsBarReveal .8s ease forwards;
        }

        .kids-color-bar:nth-child(1) {
          animation-delay: .1s;
        }

        .kids-color-bar:nth-child(2) {
          animation-delay: .2s;
        }

        .kids-color-bar:nth-child(3) {
          animation-delay: .3s;
        }

        .kids-color-bar:nth-child(4) {
          animation-delay: .4s;
        }

        @keyframes kidsBarReveal {
          to {
            transform: scaleX(1);
          }
        }


        /* ---------------------------------------------
           MOBILE
        --------------------------------------------- */

        @media (max-width: 767px) {
          .kids-red-shape {
            right: 7%;
            top: 18%;
            width: 42px;
            height: 42px;
            opacity: .5;
          }

          .kids-green-shape {
            right: 5%;
            bottom: 12%;
            width: 54px;
            height: 54px;
            opacity: .5;
          }

          .kids-star-one {
            right: 18%;
            top: 30%;
            font-size: 24px;
          }

          .kids-star-two {
            display: none;
          }

          .kids-dot {
            opacity: .65;
          }
        }


        /* ---------------------------------------------
           ACCESSIBILITY
        --------------------------------------------- */

        @media (prefers-reduced-motion: reduce) {
          .kids-breadcrumb,
          .kids-title-word,
          .kids-title-line,
          .kids-description,
          .kids-red-shape,
          .kids-green-shape,
          .kids-blue-ball,
          .kids-ring,
          .kids-star-one,
          .kids-star-two,
          .kids-dot,
          .kids-color-bar {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}
