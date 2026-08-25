import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Cross,
  Earth,
  Flag,
  GraduationCap,
  HandHelping,
  Languages,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  TentTree,
  Trophy,
  UsersRound,
  X,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AwardsSlider, type AwardItem } from "../components/AwardsSlider";
import { schoolApi } from "../features/school/api/schoolApi";
import { applyPageSeo, type PageSeo } from "../features/school/utils/pageSeo";

type HomeCard = {
  title?: string;
  description?: string;
  image?: string;
  image_url?: string;
  link_url?: string;
  quote?: string;
  name?: string;
  role?: string;
};

type HomeSection = {
  id: number;
  type: string;
  name?: string;
  title: string;
  description: string;
  button_text?: string | null;
  button_url?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?:
    | {
        cards?: HomeCard[];
        marquee_text?: string;
        marquee_link_text?: string;
        marquee_link_url?: string;
      }
    | [];
};

type HomePageData = {
  seo?: PageSeo;
  sections: HomeSection[];
};

const mediaBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function resolveMediaUrl(image?: string | null, imageUrl?: string | null) {
  if (image) return `${mediaBaseUrl}${image.replace(/^\/+/, "")}`;
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  return undefined;
}
/* =========================================================
   TYPES
========================================================= */

type Experience = {
  icon: LucideIcon;
  slug: string;
  title: string;
  text: string;
  linkUrl?: string;
};

type ResultItem = {
  image: string;
  alt: string;
};

type ActivityVideo = {
  title: string;
  image: string;
  url: string;
};

/* =========================================================
   EXPERIENCES
========================================================= */

const experiences: Experience[] = [
  {
    icon: Languages,
    slug: "german-language-teaching",
    title: "German Language",
    text: "In the realm of education, we can no longer remain confined to the territorial limits of the cities, states and nations.",
  },
  {
    icon: Cross,
    slug: "red-cross-unit",
    title: "Red Cross Unit",
    text: "St. John Ambulance (India) Indian Red Cross Society District Branch SAS Nagar has sanctioned this coveted unit to the school.",
  },
  {
    icon: HandHelping,
    slug: "nss",
    title: "NSS",
    text: "Social work is a professional and co curricular discipline committed to the pursuit of social welfare, social change and social justice. The motto of NSS is Not Me But You.",
  },
  {
    icon: GraduationCap,
    slug: "ncc",
    title: "NCC",
    text: "NCC facility both for boys and girls for junior Army Wing is provided in the school under the National Cadet Corps management.",
  },
  {
    icon: Earth,
    slug: "excursion",
    title: "Excursion",
    text: "The school organizes trips and tours for the students in the nearby areas of Chandigarh and sometimes within the city itself, with the aim of fostering values such as responsibility and confidence.",
  },
  {
    icon: CalendarDays,
    slug: "#",
    title: "Important Days",
    text: "List of important days in the year and monthly themes of the months.",
  },
  {
    icon: TentTree,
    slug: "scouts-and-guides",
    title: "Scouts and Guides",
    text: "The little champs of Paragon actively participated in the Scout and Guide Camp.",
  },
  {
    icon: Flag,
    slug: "nda",
    title: "NDA",
    text: "At Paragon School, we take immense pride in our association with Mohali Defence Academy, India's No. 1 NDA Coaching Institute.",
  },
];

/* =========================================================
   RESULTS

   Replace paths with your actual images if filenames differ.
========================================================= */

const results: ResultItem[] = [
  {
    image: "/images/10-class-result.webp",
    alt: "School Toppers Grade X 2024-25",
  },
  {
    image: "/images/12-class-result_2.webp",
    alt: "Grade 12 Commerce Results 2024-25",
  },
  {
    image: "/images/12-class-result_3.webp",
    alt: "Grade 12 Humanities Results 2024-25",
  },
  {
    image: "/images/subject-toppers-1.webp",
    alt: "Grade 12 Science Results 2024-25",
  },
  {
    image: "/images/subject-toppers-2.webp",
    alt: "Subject Toppers Grade X 2024-25",
  },
  {
    image: "/images/subject-toppers-3.webp",
    alt: "Subject Toppers Grade X 2024-25",
  },
];

const recentActivities: ActivityVideo[] = [
  {
    title: "German Delegation Visits Paragon School",
    image: "https://img.youtube.com/vi/Z4BAvV9i1Jw/maxresdefault.jpg",
    url: "https://youtu.be/Z4BAvV9i1Jw",
  },
  {
    title: "Parents Testimonials",
    image: "https://img.youtube.com/vi/HG86O-niqpM/maxresdefault.jpg",
    url: "https://youtu.be/HG86O-niqpM",
  },
  {
    title: "Goethe Institute, New Delhi",
    image: "https://img.youtube.com/vi/dS3XTNpLFyE/maxresdefault.jpg",
    url: "https://youtu.be/dS3XTNpLFyE",
  },
];

/* =========================================================
   HOME PAGE
========================================================= */

export function HomePage() {
  const activitiesSliderRef = useRef<HTMLDivElement>(null);
  const activitySlideIndexRef = useRef(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [resultLightboxIndex, setResultLightboxIndex] = useState<number | null>(null);
  const [activitiesPaused, setActivitiesPaused] = useState(false);
  const { data: homePage } = useQuery({
    queryKey: ["school-home"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: HomePageData }>("home");
      return response.data.data;
    },
  });

  const section = (type: string) =>
    homePage?.sections.find((item) => item.type === type && item.is_active);
  const banner = section("home_banner");
  const welcome = section("home_welcome");
  const awardsSection = section("home_awards");
  const featuresSection = section("home_features");
  const resultsSection = section("home_results");
  const cta = section("home_cta");
  const testimonials = section("home_testimonials");
  const whyChoose = section("home_why_choose");
  const activitiesSection = section("home_recent_activities");
  const yearBook = section("home_year_book");
  const cardsFor = (value?: HomeSection) =>
    value?.settings && !Array.isArray(value.settings)
      ? (value.settings.cards ?? [])
      : [];

  const apiExperiences = cardsFor(featuresSection);
  const displayedExperiences = apiExperiences.length
    ? apiExperiences.map((card, index) => ({
        ...experiences[index % experiences.length],
        title: card.title || experiences[index % experiences.length].title,
        text: card.description || experiences[index % experiences.length].text,
        linkUrl: card.link_url,
      }))
    : experiences;
  const apiResults = cardsFor(resultsSection);
  const displayedResults = apiResults.length
    ? apiResults.map((card, index) => ({
        image:
          resolveMediaUrl(card.image, card.image_url) ||
          results[index % results.length].image,
        alt: card.title || `Paragon School result ${index + 1}`,
      }))
    : results;
  const apiAwards = cardsFor(awardsSection);
  const displayedAwards: AwardItem[] | undefined = apiAwards.length
    ? apiAwards.map((card, index) => ({
        image:
          resolveMediaUrl(card.image, card.image_url) ||
          `/images/award${index + 1}.webp`,
        title: card.title || `Paragon School Award ${index + 1}`,
        category: awardsSection?.title || "Our Awards",
      }))
    : undefined;
  const testimonialCards = cardsFor(testimonials);
  const displayedTestimonials = testimonialCards.length
    ? testimonialCards
    : [
        {
          quote:
            "I am writing to express my sincere appreciation for the school staff's hard work and dedication.",
          name: "Mrs. Gurmit Kaur",
          role: "Mother of Shivjot",
        },
      ];
  const testimonial =
    displayedTestimonials[activeTestimonial] || displayedTestimonials[0];
  const whyChooseCards = cardsFor(whyChoose);
  const displayedWhyChooseCards = whyChooseCards.length
    ? whyChooseCards
    : [
        {
          title: "We Value Good Character",
          description:
            "Students at Paragon school are well rounded individuals, enjoying academics, sports and arts. Strong communication skills, social warmth, grit, compassion and adaptability are their hallmarks.",
        },
        {
          title: "Safe and Secure Environment",
          description:
            "Our campus follows strong safety measures and thoughtful protocols so students can learn in a secure and caring environment.",
        },
      ];
  const apiActivities = cardsFor(activitiesSection);
  const displayedActivities = apiActivities.length
    ? apiActivities.map((card, index) => ({
        title: card.title || `Recent Activity ${index + 1}`,
        image:
          resolveMediaUrl(card.image, card.image_url) ||
          recentActivities[index % recentActivities.length].image,
        url: card.link_url || "#",
      }))
    : recentActivities;
  const welcomeParts = (welcome?.description || "").split(/(?=The challenge)/);
  const yearBookUrl =
    resolveMediaUrl(yearBook?.image, yearBook?.image_url) || "/e-book.pdf";

  useEffect(() => {
    applyPageSeo(homePage?.seo);
  }, [homePage]);

  useEffect(() => {
    if (activeTestimonial >= displayedTestimonials.length) {
      setActiveTestimonial(0);
    }
  }, [activeTestimonial, displayedTestimonials.length]);

  useEffect(() => {
    if (displayedTestimonials.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveTestimonial(
        (current) => (current + 1) % displayedTestimonials.length,
      );
    }, 6000);
    return () => window.clearInterval(timer);
  }, [displayedTestimonials.length]);

  useEffect(() => {
    if (resultLightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setResultLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        setResultLightboxIndex((current) =>
          current === null ? null : (current - 1 + displayedResults.length) % displayedResults.length,
        );
      }
      if (event.key === "ArrowRight") {
        setResultLightboxIndex((current) =>
          current === null ? null : (current + 1) % displayedResults.length,
        );
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [resultLightboxIndex, displayedResults.length]);
  const showTestimonial = (direction: number) => {
    setActiveTestimonial(
      (current) =>
        (current + direction + displayedTestimonials.length) %
        displayedTestimonials.length,
    );
  };

  const scrollActivities = (direction: number) => {
    const slider = activitiesSliderRef.current;
    if (!slider || slider.children.length === 0) return;

    const totalSlides = slider.children.length;
    activitySlideIndexRef.current =
      (activitySlideIndexRef.current + direction + totalSlides) % totalSlides;
    const target = slider.children[activitySlideIndexRef.current] as HTMLElement;
    slider.scrollTo({ left: target.offsetLeft - slider.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    if (activitiesPaused || displayedActivities.length <= 1) return;

    const timer = window.setInterval(() => scrollActivities(1), 5000);
    return () => window.clearInterval(timer);
  }, [activitiesPaused, displayedActivities.length]);

  return (
    <main className="overflow-hidden">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative isolate overflow-hidden bg-navy text-white">
        {/* =====================================================
      BACKGROUND IMAGE
  ===================================================== */}

        <img
          src={
            resolveMediaUrl(banner?.image, banner?.image_url) ||
            "/images/paragon-school.webp"
          }
          alt="Paragon Senior Secondary School"
          className="
      absolute
      inset-0
      -z-20
      h-full
      w-full
      object-cover

      object-[62%_center]
      sm:object-[58%_center]
      md:object-center
      lg:object-center
    "
        />

        {/* =====================================================
      MOBILE OVERLAY

      Stronger on mobile so dynamic text always remains
      readable regardless of the uploaded banner image.
  ===================================================== */}

        <div
          className="
      absolute
      inset-0
      -z-10

      bg-[linear-gradient(90deg,rgba(5,25,44,.97)_0%,rgba(5,25,44,.90)_42%,rgba(5,25,44,.48)_100%)]

      sm:bg-gradient-to-r
      sm:from-[#071d35]/95
      sm:via-[#071d35]/72
      sm:to-[#071d35]/30

      lg:from-[#071d35]/95
      lg:via-[#071d35]/60
      lg:to-[#071d35]/20
    "
        />

        {/* bottom readability gradient */}

        <div
          className="
      absolute
      inset-0
      -z-10
      bg-gradient-to-t
      from-[#071d35]/75
      via-transparent
      to-[#071d35]/10

      sm:from-navy/50
    "
        />

        {/* =====================================================
      HERO CONTENT
  ===================================================== */}

        <div
          className="
      container
      flex
      min-h-[560px]
      items-center

      py-12

      sm:min-h-[620px]
      sm:py-16

      md:min-h-[660px]

      lg:min-h-[720px]
      lg:py-20
    "
        >
          <div
            className="
        w-full
        min-w-0
        max-w-[680px]

        sm:max-w-2xl
        lg:max-w-3xl
      "
          >
            {/* =================================================
          ADMISSION NOTICE
      ================================================== */}

            <div
              className="
          admission-notice
          inline-flex
          max-w-full
          items-center
          gap-2

          rounded-full
          border
          border-white/15
          bg-[#071d35]/55

          px-3
          py-2

          shadow-[0_10px_30px_rgba(0,0,0,.15)]
          backdrop-blur-md

          sm:gap-3
          sm:bg-white/[.10]
          sm:px-4
          sm:py-2.5
        "
            >
              {/* pulsing indicator */}

              <span
                className="
            relative
            flex
            size-2
            shrink-0
            items-center
            justify-center
          "
              >
                <span
                  className="
              absolute
              inline-flex
              size-full
              animate-ping
              rounded-full
              bg-[#ef4655]
              opacity-60
            "
                />

                <span
                  className="
              relative
              inline-flex
              size-1.5
              rounded-full
              bg-[#ef4655]
            "
                />
              </span>

              {/* dynamic admission text */}

              <span
                className="
            min-w-0
            truncate
            text-[8px]
            font-extrabold
            uppercase
            tracking-[.11em]
            text-white/90

            min-[390px]:text-[9px]

            sm:text-[10px]
            sm:tracking-[.15em]

            md:text-[11px]
          "
              >
                {banner?.settings && !Array.isArray(banner.settings)
                  ? banner.settings.marquee_text ||
                    "Admissions open for Session 2026-27"
                  : "Admissions open for Session 2026-27"}
              </span>

              {/* separator */}

              <span
                className="
            hidden
            h-4
            w-px
            shrink-0
            bg-white/15

            min-[370px]:block
          "
              />

              {/* enquiry link */}

              <a
                href={
                  banner?.settings && !Array.isArray(banner.settings)
                    ? banner.settings.marquee_link_url ||
                      "https://paragonmohali.schoolpad.in/enquiryManager/onlineOpenAdmissionForm/11"
                    : "https://paragonmohali.schoolpad.in/enquiryManager/onlineOpenAdmissionForm/11"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
            group
            inline-flex
            shrink-0
            items-center
            gap-1

            whitespace-nowrap

            text-[8px]
            font-bold
            text-[#ff7b86]

            transition-colors
            duration-300

            hover:text-white

            min-[390px]:text-[9px]

            sm:rounded-full
            sm:bg-[#c72c3b]
            sm:px-3.5
            sm:py-1.5
            sm:text-[10px]
            sm:text-white

            sm:hover:bg-[#b52030]
          "
              >
                {banner?.settings && !Array.isArray(banner.settings)
                  ? banner.settings.marquee_link_text || "Enquire Now"
                  : "Enquire Now"}

                <ArrowRight
                  size={11}
                  strokeWidth={2.4}
                  className="
              transition-transform
              duration-300
              group-hover:translate-x-0.5

              sm:size-[13px]
            "
                />
              </a>
            </div>

            {/* =================================================
          DYNAMIC HERO TITLE
      ================================================== */}

            <h1
              className="
          mt-6
          max-w-[15ch]
          break-words
          font-serif

          text-[clamp(2.35rem,10vw,3.35rem)]
          leading-[1.01]
          tracking-[-.025em]

          sm:mt-7
          sm:max-w-[13ch]
          sm:text-[56px]
          sm:leading-[1.02]

          md:text-6xl

          lg:max-w-[14ch]
          lg:text-7xl
          lg:leading-[1.02]
        "
            >
              {banner?.title || (
                <>
                  Learning today for a{" "}
                  <span className="text-gold">better tomorrow.</span>
                </>
              )}
            </h1>

            {/* small accent for mobile visual balance */}

            <div
              aria-hidden="true"
              className="
          mt-5
          flex
          items-center
          gap-1.5

          sm:hidden
        "
            >
              <span className="h-1 w-8 rounded-full bg-gold" />
              <span className="size-1.5 rounded-full bg-[#c72c3b]" />
              <span className="size-1.5 rounded-full bg-white/50" />
            </div>

            {/* =================================================
          DYNAMIC DESCRIPTION
      ================================================== */}

            <p
              className="
          mt-5
          max-w-[580px]

          text-[14px]
          leading-6
          text-slate-200

          sm:mt-6
          sm:text-base
          sm:leading-7

          md:mt-7
          md:text-lg
          md:leading-8
        "
            >
              {banner?.description ||
                "Paragon Senior Secondary School is committed to providing balanced academic, athletic, ethical and moral education for every student."}
            </p>

            {/* =================================================
          CTA BUTTONS
      ================================================== */}

            <div
              className="
          mt-7
          flex
          flex-wrap
          items-center
          gap-3

          sm:mt-9
        "
            >
              <Link
                to="/school/admission"
                className="
            group
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2

            rounded-lg
            bg-[#c72c3b]

            px-5
            py-3

            text-[12px]
            font-bold
            uppercase
            tracking-[.02em]
            text-white

            shadow-[0_10px_25px_rgba(0,0,0,.16)]

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:bg-[#b52030]

            sm:min-h-12
            sm:rounded-xl
            sm:px-6
            sm:py-3.5
            sm:text-sm
            sm:normal-case
          "
              >
                {banner?.button_text || "Register Now"}

                <ArrowRight
                  size={15}
                  className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
                />
              </Link>

              <Link
                to="/school/about/infrastructure"
                className="
            group
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2

            rounded-lg
            border
            border-white/25
            bg-white/[.08]

            px-5
            py-3

            text-[12px]
            font-semibold
            text-white

            backdrop-blur-md

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:border-white
            hover:bg-white
            hover:text-navy

            sm:min-h-12
            sm:rounded-xl
            sm:px-6
            sm:py-3.5
            sm:text-sm
          "
              >
                Discover Our School
                <ArrowRight
                  size={14}
                  className="
              opacity-60
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
                />
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
      BOTTOM ACCENT
  ===================================================== */}

        <div
          aria-hidden="true"
          className="
      absolute
      inset-x-0
      bottom-0
      flex
      h-[3px]
    "
        >
          <span className="flex-1 bg-[#c72c3b]" />
          <span className="flex-1 bg-gold" />
          <span className="flex-1 bg-white/40" />
        </div>
      </section>

      {/* =====================================================
          WELCOME
      ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#fbfaf7]
          py-16
          sm:py-20
          lg:py-24
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-28
            top-10
            size-72
            rounded-full
            border-[35px]
            border-gold/[.04]
          "
        />

        <div
          className="
            container
            relative
            grid
            gap-12
            lg:grid-cols-[.85fr_1.15fr]
            lg:items-center
            lg:gap-16
          "
        >
          {/* IMAGE */}

          <div className="relative mx-auto w-full max-w-[480px] lg:mx-0">
            <div
              className="
                overflow-hidden
                rounded-[30px]
                bg-[#edf2f5]
                shadow-[0_25px_70px_-35px_rgba(16,42,67,.35)]
              "
            >
              <img
                src={
                  resolveMediaUrl(welcome?.image, welcome?.image_url) ||
                  "/images/para-students.png"
                }
                alt="Paragon School students"
                className="
                  aspect-[5/4]
                  w-full
                  object-contain
                  object-bottom
                "
              />
            </div>

            <div
              className="
                absolute
                -bottom-5
                right-4
                rounded-2xl
                bg-gold-dark
                px-6
                py-5
                text-white
                shadow-xl
                sm:right-7
              "
            >
              <strong className="font-serif text-3xl sm:text-4xl">45+</strong>

              <span
                className="
                  mt-1
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-white/75
                "
              >
                Years of Purpose
              </span>
            </div>
          </div>

          {/* CONTENT */}

          <div>
            <SectionEyebrow>Welcome to Paragon</SectionEyebrow>

            <h2
              className="
                mt-4
                max-w-2xl
                font-serif
                text-4xl
                leading-[1.15]
                text-navy
                sm:text-5xl
              "
            >
              {welcome?.title || "Welcome to Paragon Senior Secondary School"}
            </h2>

            <div className="mt-5 h-[2px] w-12 bg-gold" />

            <p
              className="
                mt-7
                max-w-3xl
                text-base
                leading-8
                text-slate-600
                sm:text-lg
              "
            >
              {welcomeParts[0] ||
                "Paragon Senior Secondary School is an English Medium, Co-educational Institution focused on balanced student development."}
            </p>

            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              {welcomeParts[1] ||
                "The challenge is to create an environment that supports and inspires every learner."}
            </p>

            <Link
              to="/school/about/infrastructure"
              className="
                group
                mt-7
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-gold-dark
              "
            >
              Know More About Paragon
              <ChevronRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          AWARDS
      ====================================================== */}

      <AwardsSlider
        awards={displayedAwards}
        title={awardsSection?.title}
        description={awardsSection?.description}
      />

      {/* =====================================================
          EXPERIENCES
      ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-y
          border-navy/10
          bg-[#f2f5f6]
          py-16
          sm:py-20
          lg:py-24
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -left-32
            top-24
            size-80
            rounded-full
            border-[38px]
            border-gold/[.045]
          "
        />

        <div className="container relative">
          <SectionHeading
            eyebrow={featuresSection?.description || "Beyond the Classroom"}
            title={featuresSection?.title || "Learning Beyond Academics"}
          />

          <div
            className="
              mt-10
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {displayedExperiences.map(
              ({ icon: Icon, slug, title, text, linkUrl }, index) => (
                <Link
                  key={title}
                  to={linkUrl && linkUrl !== "#" ? linkUrl : `/school/${slug}`}
                  aria-label={`Learn more about ${title}`}
                  className="
                    group
                    relative
                    flex
                    min-h-[250px]
                    flex-col
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-[0_15px_45px_-35px_rgba(16,42,67,.35)]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-gold/40
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-gold-dark
                    focus-visible:ring-offset-2
                    hover:shadow-xl
                  "
                >
                  <span
                    className="
                      absolute
                      right-5
                      top-4
                      font-serif
                      text-4xl
                      text-navy/[.13]
                      transition-colors
                      group-hover:text-gold-dark/30
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="
                      grid
                      size-11
                      place-items-center
                      rounded-xl
                      bg-cream
                      text-gold-dark
                      transition
                      duration-300
                      group-hover:bg-navy
                      group-hover:text-white
                    "
                  >
                    <Icon size={21} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-navy">{title}</h3>
                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-slate-600
                    "
                  >
                    {text}
                  </p>
                  <span className="mt-auto flex items-center gap-2 pt-5 text-xs font-bold uppercase tracking-[.12em] text-gold-dark">
                    Explore
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>{" "}
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-slate-200/70 bg-[#f4f7f8] py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 -z-10 size-[360px] rounded-full border-[64px] border-[#c72c3b]/[.035]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-36 -left-32 -z-10 size-[340px] rounded-full border-[60px] border-navy/[.025]"
        />

        <div className="container relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.22em] text-[#c72c3b] sm:text-[11px]">
                <span className="h-px w-9 bg-[#c72c3b]" />
                {resultsSection?.description || "Celebrating Achievement"}
              </div>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[54px]">
                {resultsSection?.title || "Our Recent Results"}
              </h2>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-full border border-navy/10 bg-white px-4 py-2.5 shadow-sm">
              <span className="grid size-8 place-items-center rounded-full bg-[#c72c3b] text-[10px] font-bold text-white">
                {String(displayedResults.length).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">
                Result highlights
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:mt-12 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
            {displayedResults.map((result, index) => (
              <button
                type="button"
                key={`${result.image}-${index}`}
                onClick={() => setResultLightboxIndex(index)}
                aria-label={`Open ${result.alt} in image viewer`}
                className={`group relative text-left transition duration-500 hover:-translate-y-1.5 ${
                  index % 2 === 1 ? "lg:translate-y-5 lg:hover:translate-y-3.5" : ""
                }`}
              >
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[22px] bg-navy/[.06] transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
                <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_-30px_rgba(16,42,67,.38)] sm:p-2">
                  <div className="relative overflow-hidden rounded-[16px] bg-slate-100">
                    <img
                      src={result.image}
                      alt={result.alt}
                      loading={index < 5 ? "eager" : "lazy"}
                      className="aspect-square w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/35 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                    <span className="absolute bottom-2.5 right-2.5 grid size-8 place-items-center rounded-full border border-white/60 bg-white/95 text-[9px] font-black text-navy shadow-md backdrop-blur-sm sm:bottom-3 sm:right-3 sm:size-9">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 sm:mt-16 lg:mt-20">
            <span className="h-1 w-10 rounded-full bg-[#c72c3b]" />
            <span className="size-1.5 rounded-full bg-gold" />
            <span className="size-1.5 rounded-full bg-navy" />
          </div>
        </div>
      </section>
      {resultLightboxIndex !== null && displayedResults[resultLightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Result image viewer"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setResultLightboxIndex(null);
          }}
        >
          <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
              {resultLightboxIndex + 1} / {displayedResults.length}
            </span>
            <button
              type="button"
              onClick={() => setResultLightboxIndex(null)}
              aria-label="Close result image viewer"
              className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:rotate-90 hover:bg-white hover:text-navy"
            >
              <X size={21} />
            </button>
          </div>

          {displayedResults.length > 1 && (
            <button
              type="button"
              onClick={() => setResultLightboxIndex((resultLightboxIndex - 1 + displayedResults.length) % displayedResults.length)}
              aria-label="View previous result"
              className="absolute left-3 z-20 grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-navy sm:left-6 sm:size-12"
            >
              <ChevronLeft size={23} />
            </button>
          )}

          <div className="flex max-h-[calc(100vh-6rem)] max-w-[min(92vw,900px)] items-center justify-center overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-3">
            <img
              src={displayedResults[resultLightboxIndex].image}
              alt={displayedResults[resultLightboxIndex].alt}
              className="max-h-[calc(100vh-7.5rem)] max-w-full rounded-[16px] object-contain"
            />
          </div>

          {displayedResults.length > 1 && (
            <button
              type="button"
              onClick={() => setResultLightboxIndex((resultLightboxIndex + 1) % displayedResults.length)}
              aria-label="View next result"
              className="absolute right-3 z-20 grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-navy sm:right-6 sm:size-12"
            >
              <ChevronRight size={23} />
            </button>
          )}
        </div>
      )}
      {/* =====================================================
          ADMISSION CTA
      ====================================================== */}

      <section
        className="
    relative
    isolate
    overflow-hidden
    bg-[#071b3a]
    text-white
  "
      >
        {/* =====================================================
      BACKGROUND IMAGE
  ====================================================== */}

        <img
          src={
            resolveMediaUrl(banner?.image, banner?.image_url) ||
            "/images/paragon-school.webp"
          }
          alt=""
          aria-hidden="true"
          className="
      absolute
      inset-0
      -z-30
      h-full
      w-full
      object-cover
      object-center
      transition-transform
      duration-[1500ms]
    "
        />

        {/* =====================================================
      PREMIUM IMAGE OVERLAYS
  ====================================================== */}

        {/* Main navy overlay */}
        <div
          className="
      absolute
      inset-0
      -z-20
      bg-[#071b3a]/75
    "
        />

        {/* Cinematic gradient */}
        <div
          className="
      absolute
      inset-0
      -z-10
      bg-gradient-to-r
      from-[#041426]/75
      via-[#092d50]/40
      to-[#041426]/70
    "
        />

        {/* Bottom depth */}
        <div
          className="
      absolute
      inset-x-0
      bottom-0
      -z-10
      h-1/2
      bg-gradient-to-t
      from-[#041426]/55
      to-transparent
    "
        />

        {/* Soft central spotlight */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      -z-10
      h-[320px]
      w-[700px]
      max-w-[90vw]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-white/[0.045]
      blur-[80px]
    "
        />

        {/* =====================================================
      DECORATIVE DETAILS
  ====================================================== */}

        {/* top fine line */}
        <div
          aria-hidden="true"
          className="
      absolute
      left-1/2
      top-0
      h-px
      w-[60%]
      -translate-x-1/2
      bg-gradient-to-r
      from-transparent
      via-white/25
      to-transparent
    "
        />

        {/* decorative circle - left */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      -left-[120px]
      -top-[160px]
      size-[320px]
      rounded-full
      border
      border-white/[0.06]

      sm:size-[400px]
    "
        />

        {/* decorative circle - right */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      -bottom-[170px]
      -right-[130px]
      size-[330px]
      rounded-full
      border
      border-[#dda127]/15

      sm:size-[430px]
    "
        />

        {/* =====================================================
      CONTENT
  ====================================================== */}

        <div
          className="
      container
      relative
      mx-auto
      flex
      min-h-[400px]
      items-center
      justify-center
      px-5
      py-16
      text-center

      sm:min-h-[440px]
      sm:px-6
      sm:py-20

      lg:min-h-[470px]
      lg:py-24
    "
        >
          <div className="mx-auto w-full max-w-[850px]">
            {/* ===============================================
          EYEBROW
      ================================================ */}

            <div
              className="
          flex
          items-center
          justify-center
          gap-3
        "
            >
              <span
                className="
            h-px
            w-8
            bg-gradient-to-r
            from-transparent
            to-[#efc65f]/80

            sm:w-12
          "
              />

              <p
                className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.28em]
            text-[#efc65f]

            sm:text-[10px]
            sm:tracking-[0.32em]

            lg:text-[11px]
          "
              >
                {cta?.title || "Admissions 2026-27"}
              </p>

              <span
                className="
            h-px
            w-8
            bg-gradient-to-l
            from-transparent
            to-[#efc65f]/80

            sm:w-12
          "
              />
            </div>

            {/* ===============================================
          HEADING
      ================================================ */}

            <h2
              className="
          mx-auto
          mt-5
          max-w-[800px]
          font-serif
          text-[34px]
          font-medium
          leading-[1.08]
          tracking-[-0.025em]
          text-white
          drop-shadow-[0_5px_20px_rgba(0,0,0,.25)]

          sm:mt-6
          sm:text-[44px]

          md:text-[50px]

          lg:text-[56px]
        "
            >
              Admissions Open
              <span
                className="
            mt-1
            block
            text-[#efc65f]
          "
              >
                for 2026-27
              </span>
            </h2>

            {/* ===============================================
          DESCRIPTION
      ================================================ */}

            <p
              className="
          mx-auto
          mt-5
          max-w-[570px]
          text-[12px]
          leading-6
          text-white/65

          sm:text-[13px]

          md:text-[14px]
          md:leading-7
        "
            >
              {cta?.description ||
                "Begin your child&apos;s journey at Paragon Senior Secondary School, where academic excellence, strong values and confident futures come together."}
            </p>

            {/* ===============================================
          CTA
      ================================================ */}

            <div
              className="
          mt-7
          flex
          justify-center

          sm:mt-8
        "
            >
              <Link
                to="/school/admission"
                className="
            group
            relative
            inline-flex
            min-h-[52px]
            items-center
            justify-center
            gap-3
            overflow-hidden
            rounded-full
            bg-[#b51f2e]
            px-7
            text-[11px]
            font-bold
            uppercase
            tracking-[0.08em]
            text-white
            shadow-[0_14px_35px_rgba(181,31,46,.28)]
            transition-all
            duration-300

            hover:-translate-y-1
            hover:bg-[#c72c3b]
            hover:shadow-[0_18px_45px_rgba(181,31,46,.38)]

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#efc65f]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#071b3a]

            sm:min-h-[56px]
            sm:px-8
            sm:text-[12px]
          "
              >
                <span className="relative z-10">
                  {cta?.button_text || "Register Now"}
                </span>

                <span
                  className="
              relative
              z-10
              grid
              size-7
              place-items-center
              rounded-full
              bg-white/10
              transition-all
              duration-300

              group-hover:translate-x-1
              group-hover:bg-white
              group-hover:text-[#b51f2e]
            "
                >
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>

            {/* ===============================================
          SMALL SUPPORTING LINE
      ================================================ */}

            <div
              className="
          mt-6
          flex
          flex-wrap
          items-center
          justify-center
          gap-x-3
          gap-y-1
          text-[9px]
          font-medium
          tracking-[0.04em]
          text-white/40

          sm:text-[10px]
        "
            >
              <span>CBSE Curriculum</span>

              <span className="size-1 rounded-full bg-[#efc65f]/60" />

              <span>Experienced Faculty</span>

              <span className="size-1 rounded-full bg-[#efc65f]/60" />

              <span>Holistic Development</span>
            </div>
          </div>
        </div>

        {/* =====================================================
      BOTTOM GOLD ACCENT
  ====================================================== */}

        <div
          aria-hidden="true"
          className="
      absolute
      bottom-0
      left-1/2
      h-[2px]
      w-[110px]
      -translate-x-1/2
      bg-gradient-to-r
      from-transparent
      via-[#dda127]
      to-transparent

      sm:w-[160px]
    "
        />
      </section>

      {/* =====================================================
          TESTIMONIAL + WHY CHOOSE US
      ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#f5f7f7]
          py-16
          sm:py-20
          lg:py-24
        "
      >
        <div className="container">
          <div
            className="
              grid
              items-start
              gap-6
              lg:grid-cols-[.8fr_1.2fr]
            "
          >
            {/* TESTIMONIAL */}

            <article
              className="
                relative
                self-start
                overflow-hidden
                rounded-[28px]
                bg-navy
                p-7
                text-white
                shadow-xl
                shadow-navy/10
                sm:p-9
              "
            >
              <Quote size={38} className="text-gold" strokeWidth={1.5} />

              <h2 className="mt-5 font-serif text-3xl">
                {testimonials?.title || "Testimonials"}
              </h2>

              <div className="mt-4 h-[2px] w-10 bg-gold" />

              <p
                className="
                  mt-7
                  text-sm
                  leading-7
                  text-slate-300
                "
              >
                {testimonial?.quote ||
                  "I am writing to express my sincere appreciation for the school staff&apos;s hard work and dedication."}
              </p>

              <footer className="mt-7">
                <strong className="font-serif text-lg text-gold">
                  {testimonial?.name || "Mrs. Gurmit Kaur"}
                </strong>

                <span className="mt-1 block text-xs text-white/55">
                  {testimonial?.role || "Mother of Shivjot"}
                </span>
              </footer>

              {displayedTestimonials.length > 1 && (
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <div className="flex gap-2" aria-label="Choose testimonial">
                    {displayedTestimonials.map((item, index) => (
                      <button
                        key={`${item.name || "testimonial"}-${index}`}
                        type="button"
                        onClick={() => setActiveTestimonial(index)}
                        aria-label={`Show testimonial ${index + 1}`}
                        aria-current={
                          index === activeTestimonial ? "true" : undefined
                        }
                        className={`h-2 rounded-full transition-all ${
                          index === activeTestimonial
                            ? "w-7 bg-gold"
                            : "w-2 bg-white/25 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => showTestimonial(-1)}
                      aria-label="Previous testimonial"
                      className="grid size-9 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold hover:bg-gold"
                    >
                      <ChevronLeft size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => showTestimonial(1)}
                      aria-label="Next testimonial"
                      className="grid size-9 place-items-center rounded-full bg-gold text-white transition hover:bg-white hover:text-navy"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              )}
            </article>

            {/* WHY CHOOSE US */}

            <article
              className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-7
                shadow-[0_20px_60px_-40px_rgba(16,42,67,.4)]
                sm:p-9
              "
            >
              <SectionEyebrow>
                {whyChoose?.title || "Why Choose Us"}
              </SectionEyebrow>

              <h2
                className="
                  mt-4
                  font-serif
                  text-3xl
                  leading-tight
                  text-navy
                  sm:text-4xl
                "
              >
                An environment built around student growth.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                {whyChoose?.description ||
                  "Our experienced educators have helped shape generations of confident achievers."}
              </p>

              <div className="mt-8 space-y-4">
                {displayedWhyChooseCards.map((card, index) => (
                  <WhyChooseItem
                    key={`${card.title || "Why choose Paragon"}-${index}`}
                    icon={index % 2 === 0 ? UsersRound : ShieldCheck}
                    title={card.title || `Why Choose Paragon ${index + 1}`}
                    text={card.description}
                  />
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f5f1eb] py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -left-32 top-12 size-72 rounded-full border-[44px] border-[#c72c3b]/5" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-64 rounded-full bg-navy/[.04]" />

        <div className="container relative">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow={activitiesSection?.description || "Life at Paragon"}
              title={activitiesSection?.title || "Our Recent Activities"}
            />
            <div className="hidden shrink-0 gap-3 sm:flex">
              <button
                type="button"
                onClick={() => scrollActivities(-1)}
                aria-label="Previous activity"
                className="grid size-12 place-items-center rounded-full border border-navy/15 bg-white text-navy shadow-sm transition hover:-translate-y-0.5 hover:border-[#c72c3b] hover:bg-[#c72c3b] hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => scrollActivities(1)}
                aria-label="Next activity"
                className="grid size-12 place-items-center rounded-full bg-navy text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#c72c3b]"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={activitiesSliderRef}
            onMouseEnter={() => setActivitiesPaused(true)}
            onMouseLeave={() => setActivitiesPaused(false)}
            onFocusCapture={() => setActivitiesPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setActivitiesPaused(false);
            }}
            className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-12 sm:gap-6"
          >
            {displayedActivities.map((activity, index) => (
              <a
                key={activity.title}
                href={activity.url}
                target="_blank"
                rel="noreferrer"
                className="group w-[86%] shrink-0 snap-start overflow-hidden rounded-[26px] border border-navy/10 bg-white p-2.5 shadow-[0_18px_55px_-32px_rgba(16,42,67,.55)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_65px_-30px_rgba(16,42,67,.5)] sm:w-[70%] lg:w-[48%]"
              >
                <div className="relative overflow-hidden rounded-[20px] bg-navy">
                  <img
                    src={activity.image}
                    alt={`${activity.title} video thumbnail`}
                    loading="lazy"
                    className="aspect-video w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/75 via-transparent to-black/10" />
                  <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-md">
                    Video {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[5px] border-white/25 bg-[#c72c3b] text-white shadow-[0_12px_35px_rgba(0,0,0,.35)] transition duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#c72c3b]">
                    <Play size={22} fill="currentColor" className="ml-1" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-3 py-5 sm:px-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c72c3b]">
                      Watch highlights
                    </p>
                    <h3 className="mt-1.5 font-serif text-xl leading-snug text-navy sm:text-2xl">
                      {activity.title}
                    </h3>
                  </div>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f5f1eb] text-navy transition group-hover:bg-navy group-hover:text-white">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-2 flex justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => scrollActivities(-1)}
              aria-label="Previous activity"
              className="grid size-11 place-items-center rounded-full border border-navy/15 bg-white text-navy"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              onClick={() => scrollActivities(1)}
              aria-label="Next activity"
              className="grid size-11 place-items-center rounded-full bg-navy text-white"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-slate-200 bg-[#fbfcfd] py-16 text-navy sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -left-36 -top-36 -z-10 size-[420px] rounded-full border-[72px] border-[#c72c3b]/[.045]" />
        <div className="pointer-events-none absolute -bottom-28 right-[8%] -z-10 size-72 rounded-full border-[48px] border-navy/[.035]" />

        <div className="container relative">
          <div className="grid gap-9 lg:grid-cols-[.32fr_.68fr] lg:items-start lg:gap-12">
            <div className="lg:sticky lg:top-32">
              <span className="grid size-13 place-items-center rounded-2xl bg-[#c72c3b] text-white shadow-lg">
                <BookOpenCheck size={24} strokeWidth={1.8} />
              </span>
              <p className="mt-7 text-[10px] font-bold uppercase tracking-[.22em] text-[#c72c3b]">
                {yearBook?.description || "School Publication"}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-navy sm:text-5xl">
                {yearBook?.title || "E-Year Book 2025-26"}
              </h2>
              <div className="mt-6 h-px w-12 bg-[#c72c3b]" />
              <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">
                Explore the latest digital year book and revisit the memories, milestones, and achievements from across the school year.
              </p>
              <a
                href={yearBookUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-navy px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#c72c3b]"
              >
                Open full publication
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-[30px] border border-navy/[.07] sm:-inset-4" />
              <div className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-2 shadow-[0_30px_90px_-40px_rgba(16,42,67,.5)] sm:p-3">
                <div className="absolute left-1/2 top-0 z-10 h-1.5 w-24 -translate-x-1/2 rounded-b-full bg-[#c72c3b]" />
                <iframe
                  src={yearBookUrl}
                  title="Paragon School E-Year Book 2025-26"
                  className="h-[500px] w-full rounded-[18px] border-0 sm:h-[650px] lg:h-[760px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="
        border-r
        border-white/10
        px-4
        py-5
        last:border-r-0
        sm:px-6
        sm:py-6
      "
    >
      <strong
        className="
          block
          font-serif
          text-xl
          text-white
          sm:text-2xl
          lg:text-3xl
        "
      >
        {value}
      </strong>

      <span
        className="
          mt-1
          block
          text-[9px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-slate-400
          sm:text-[10px]
        "
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   EYEBROW
========================================================= */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="
        flex
        items-center
        gap-3
        text-[11px]
        font-bold
        uppercase
        tracking-[0.18em]
        text-gold-dark
      "
    >
      <span className="h-px w-8 bg-gold" />
      {children}
    </p>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p
        className="
          text-[11px]
          font-bold
          uppercase
          tracking-[0.2em]
          text-gold-dark
        "
      >
        {eyebrow}
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
        {title}
      </h2>

      <div
        className="
          mx-auto
          mt-4
          h-[2px]
          w-12
          rounded-full
          bg-gold
        "
      />
    </div>
  );
}

/* =========================================================
   WHY CHOOSE ITEM
========================================================= */

function WhyChooseItem({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
}) {
  return (
    <details className="group/details overflow-hidden rounded-2xl border border-slate-200 bg-[#fafbfb] transition open:border-gold/30 open:bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream text-gold-dark">
          <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
        </span>

        <h3 className="min-w-0 flex-1 font-serif text-lg leading-snug text-navy">
          {title}
        </h3>

        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-gold-dark transition duration-300 group-open/details:rotate-90 group-open/details:border-gold/30 group-open/details:bg-gold group-open/details:text-white">
          <ChevronRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </span>
      </summary>

      {text && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:ml-14 sm:px-5">
          <p className="text-sm leading-6 text-slate-600">{text}</p>
        </div>
      )}
    </details>
  );
}
