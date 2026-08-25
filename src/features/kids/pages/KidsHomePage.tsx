import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Image as ImageIcon,
  MessageCircleHeart,
  Newspaper,
  Palette,
  Play,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { kidsApi } from "../api/kidsApi";
import { applyPageSeo, type PageSeo } from "../../school/utils/pageSeo";
import { Link } from "react-router-dom";

type KidsHomeSlide = {
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  button_text?: string | null;
  button_url?: string | null;
};

type ParentSlide = {
  title?: string;
  description?: string | null;
  name?: string;
};

type HomeSettings = {
  slides?: KidsHomeSlide[] | ParentSlide[];
  items?: Array<{ text?: string }>;
};

type HomeSection = {
  type: string;
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  button_text?: string | null;
  button_url?: string | null;
  is_active: boolean;
  settings?: HomeSettings | [];
};

type KidsHomePageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: HomeSection[];
};

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(image?: string | null, imageUrl?: string | null) {
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  return undefined;
}

function decodeEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'");
}

function plainText(html?: string | null) {
  const text = html?.replace(/<br\s*\/?\s*>/gi, " ").replace(/<\/p>/gi, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || "";
  return decodeEntities(text);
}

type NewsPart = { text: string; href?: string };
type NewsItem = { text: string; href?: string; linkText?: string; parts?: NewsPart[] };

function richTextParts(html: string): NewsPart[] {
  const parts: NewsPart[] = [];
  const linkPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let cursor = 0;
  for (const match of html.matchAll(linkPattern)) {
    const index = match.index ?? 0;
    const before = plainText(html.slice(cursor, index));
    if (before) parts.push({ text: before });
    parts.push({ text: plainText(match[2]), href: decodeEntities(match[1]) });
    cursor = index + match[0].length;
  }
  const after = plainText(html.slice(cursor));
  if (after) parts.push({ text: after });
  return parts;
}

function richTextList(html?: string | null): NewsItem[] {
  if (!html) return [];
  const listItems = Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
  const blocks = listItems.length
    ? listItems.map((match) => match[1])
    : Array.from(html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)).map((match) => match[1]);
  return (blocks.length ? blocks : [html])
    .map((block) => ({ text: plainText(block), parts: richTextParts(block) }))
    .filter((item) => item.text);
}

function splitLastWords(title: string, count: number) {
  const words = title.trim().split(/\s+/);
  return {
    first: words.slice(0, -count).join(" "),
    accent: words.slice(-count).join(" "),
  };
}
function firstLink(html?: string | null) {
  return html?.match(/href=["']([^"']+)["']/i)?.[1];
}
const fallbackSlides = [
  {
    eyebrow: "A bright beginning",
    title: "Small steps. Big discoveries.",
    copy: "A colourful early-learning world where children feel confident to ask, imagine, play and grow.",
    image: "/images/para-kids-student.png",
    alt: "Happy Paragon Kids students",
    accent: "#f04f5f",
    type: "cutout",
  },
  {
    eyebrow: "Create without limits",
    title: "Every idea deserves colour.",
    copy: "Hands-on art, music and storytelling turn everyday curiosity into joyful creative expression.",
    image: "/images/art_room_1.webp",
    alt: "Creative art room at Paragon",
    accent: "#f39b24",
    type: "photo",
  },
  {
    eyebrow: "Move, laugh, belong",
    title: "Happy bodies. Braver minds.",
    copy: "Playful movement and shared adventures build confidence, friendship and healthy habits.",
    image: "/images/sports_day.webp",
    alt: "Children enjoying sports day",
    accent: "#24a95b",
    type: "photo",
  },
];

const benefits = [
  { Icon: Sparkles, title: "Curious Minds" },
  { Icon: Palette, title: "Creative Play" },
  { Icon: BookOpen, title: "Happy Learning" },
];

/* -------------------------------------------------------
   LATEST NEWS / EVENTS
------------------------------------------------------- */

const fallbackLatestNews = [
  {
    text: "Our school has been awarded for The Best School in the Category - Clean And Hygiene Environment by the FAP NATIONAL AWARDS 2022.",
  },
  {
    text: "Admission open for 2023-24 session.",
    linkText: "Click here",
    href: "https://forms.gle/LdTsxJxNSy9fDKBj7",
  },
  {
    text: "German Delegation Visit",
    href: "https://www.youtube.com/watch?v=BNMYqFn_Z6E&ab_channel=PARAGON71MOHALI",
  },
  {
    text: "Annual Function 2022",
    href: "https://www.youtube.com/watch?v=piFpCk1C8uo&ab_channel=PARAGON71MOHALI",
  },
];

function useScrollReveal<T extends HTMLElement>(
  threshold = 0.15,
  rootMargin = "0px 0px -80px 0px",
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible] as const;
}

export function KidsHomePage() {
  const { data: page } = useQuery({
    queryKey: ["kids-page", "home"],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: KidsHomePageData }>("pages/home");
      return response.data.data;
    },
  });
  const section = (type: string) =>
    page?.sections.find((item) => item.type === type && item.is_active);
  const heroSection = section("kids_home_slider");
  const newsSection = section("kids_home_left_card");
  const welcomeSection = section("kids_home_welcome");
  const parentsSection = section("kids_home_parents_corner");
  const aboutSection = section("kids_home_about");
  const momentsSection = section("kids_home_right_card");
  const ctaSection = section("kids_home_cta");
  const heroSettings = heroSection?.settings && !Array.isArray(heroSection.settings) ? heroSection.settings : undefined;
  const parentsSettings = parentsSection?.settings && !Array.isArray(parentsSection.settings) ? parentsSection.settings : undefined;
  const aboutSettings = aboutSection?.settings && !Array.isArray(aboutSection.settings) ? aboutSection.settings : undefined;
  const apiHeroSlides = (heroSettings?.slides || []) as KidsHomeSlide[];
  const displayedSlides = apiHeroSlides.length
    ? apiHeroSlides.map((slide, index) => {
        const fallback = fallbackSlides[index % fallbackSlides.length];
        return {
          eyebrow: heroSection?.title || fallback.eyebrow,
          title: slide.title || fallback.title,
          copy: plainText(slide.description) || fallback.copy,
          image: mediaUrl(slide.image, slide.image_url) || fallback.image,
          alt: slide.title || fallback.alt,
          accent: fallback.accent,
          type: mediaUrl(slide.image, slide.image_url) ? "photo" : fallback.type,
          buttonText: slide.button_text || "Start their journey",
          buttonUrl: slide.button_url || "/kids/admission",
        };
      })
    : fallbackSlides.map((slide) => ({ ...slide, buttonText: "Start their journey", buttonUrl: "/kids/admission" }));
  const apiNews = richTextList(newsSection?.description);
  const displayedNews: NewsItem[] = apiNews.length
    ? apiNews
    : newsSection
      ? [{ text: newsSection.title || "School update" }]
      : fallbackLatestNews;
  const parentSlides = (parentsSettings?.slides || []) as ParentSlide[];
  const displayedParentSlides = parentSlides.length ? parentSlides : [{ title: "Parents Corner", description: "I have seen a considerable improvement in my daughter since last year and hope it carries on.", name: "Bachcha Singh" }];
  const aboutItems = (aboutSettings?.items || []).map((item) => item.text?.trim()).filter((item): item is string => Boolean(item));
  const momentUrl = firstLink(momentsSection?.description) || "https://youtu.be/6K0ybpzf5IU";
  const welcomeHeading = splitLastWords(welcomeSection?.title || "Welcome to Paragon Kids", 2);
  const aboutHeading = splitLastWords(aboutSection?.title || "About Us", 1);
  const ctaHeading = splitLastWords(ctaSection?.title || "Bring Fun Life To Your Kids", 1);

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);
  const [active, setActive] = useState(0);
  const [parentActive, setParentActive] = useState(0);
  const activeParent = displayedParentSlides[parentActive % displayedParentSlides.length];
  const [paused, setPaused] = useState(false);

  const [newsRef, newsVisible] = useScrollReveal<HTMLElement>(0.12);
  const [welcomeRef, welcomeVisible] = useScrollReveal<HTMLElement>(0.12);
  const [aboutRef, aboutVisible] = useScrollReveal<HTMLElement>(0.15);
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLElement>(
    0.2,
    "0px 0px -40px 0px",
  );

  const go = (step: number) =>
    setActive((current) => (current + step + displayedSlides.length) % displayedSlides.length);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => go(1), 5500);

    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (displayedParentSlides.length < 2) return;
    const timer = window.setInterval(
      () => setParentActive((current) => (current + 1) % displayedParentSlides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [displayedParentSlides.length]);

  return (    <>
      <style>{`
        @keyframes kidsNewsFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        @keyframes kidsBubblePop {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-7px) scale(1.025); }
        }

        @keyframes kidsCtaGlow {
          0%, 100% { box-shadow: 0 25px 70px -35px rgba(50,48,95,.55); }
          50% { box-shadow: 0 30px 80px -26px rgba(37,169,224,.34); }
        }

        @keyframes kidsTinyBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.08); }
        }

        @keyframes kidsRainbowSweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @keyframes kidsSeesaw {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        .kids-seesaw {
          transform-origin: center bottom;
          animation: kidsSeesaw 2.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .kids-seesaw { animation: none; }
        }
      `}</style>

      {/* ======================================================
          HERO SLIDER
      ====================================================== */}

      <section
        className="relative overflow-hidden"
        aria-label="Paragon Kids highlights"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* colourful top strip */}
        <div className="absolute inset-x-0 top-0 h-2" />

        {/* background blobs */}
        <div className="absolute -left-24 top-24 size-72 rounded-full bg-[#f6bd28]/20 blur-2xl" />
        <div className="absolute -right-24 bottom-8 size-80 rounded-full bg-[#25a9e0]/15 blur-2xl" />

        <div className="container relative min-h-[640px] py-12 sm:py-16 lg:py-20">
          {displayedSlides.map((slide, index) => (
            <article
              key={slide.title}
              className={`grid min-h-[520px] items-center gap-10 transition-all duration-700 lg:grid-cols-[.92fr_1.08fr] ${
                index === active
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-x-4 top-12 translate-x-8 opacity-0"
              }`}
              aria-hidden={index !== active}
            >
              {/* LEFT CONTENT */}
              <div className="relative z-10 order-2 lg:order-1">
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className="h-1 w-12 rounded-full"
                    style={{ backgroundColor: slide.accent }}
                  />

                  <p
                    className="text-sm font-black uppercase tracking-[.2em]"
                    style={{ color: slide.accent }}
                  >
                    {slide.eyebrow}
                  </p>
                </div>

                <h1 className="max-w-xl text-5xl font-black leading-[.98] tracking-tight text-[#32305f] sm:text-6xl xl:text-7xl">
                  {slide.title}
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                  {slide.copy}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to={slide.buttonUrl}
                    className="
                      inline-flex items-center gap-2
                      rounded-full bg-[#f04f5f]
                      px-7 py-4
                      font-bold text-white
                      shadow-[0_10px_25px_rgba(240,79,95,.25)]
                      transition
                      duration-300
                      hover:-translate-y-1
                    "
                  >
                    {slide.buttonText}
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/kids/about/infrastructure"
                    className="
                      rounded-full
                      border-2 border-[#32305f]/15
                      bg-white
                      px-7 py-4
                      font-bold
                      text-[#32305f]
                      transition
                      duration-300
                      hover:border-[#25a9e0]
                    "
                  >
                    Meet Paragon Kids
                  </Link>
                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div className="relative order-1 min-h-[300px] lg:order-2 lg:min-h-[500px]">
                <div className="absolute inset-3 rotate-3 rounded-[3.5rem_2rem_4rem_2.5rem] bg-[#f6bd28]" />

                <div className="absolute inset-3 -rotate-2 rounded-[2.5rem_4rem_2rem_3.5rem] bg-[#25a9e0]/80" />

                <div className="absolute inset-5 overflow-hidden rounded-[3rem_2rem_3.5rem_2.5rem] bg-white shadow-2xl">
                  {slide.type === "photo" && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(
                          180deg,
                          transparent 50%,
                          rgba(50,48,95,.3)
                        ),url(${slide.image})`,
                      }}
                    />
                  )}

                  {slide.type === "cutout" && (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#fff_0_4%,transparent_4.5%),linear-gradient(135deg,#fff2b5,#d9f7f1)]" />

                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="
                          absolute inset-x-0 bottom-0
                          mx-auto
                          max-h-[94%]
                          w-auto
                          object-contain
                          drop-shadow-2xl
                        "
                      />
                    </>
                  )}
                </div>

                <span className="absolute -left-1 top-12 grid size-16 -rotate-12 place-items-center rounded-2xl bg-[#f04f5f] text-3xl text-white shadow-lg">
                  ★
                </span>

                <span className="absolute -right-1 bottom-14 grid size-14 rotate-12 place-items-center rounded-full bg-[#29aa5b] text-2xl text-white shadow-lg">
                  ✦
                </span>
              </div>
            </article>
          ))}

          {/* SLIDER CONTROLS */}

          <div className="relative z-20 mt-4 flex items-center justify-between lg:absolute lg:bottom-12 lg:left-4 lg:mt-0 gap-5">
            <div className="flex gap-2">
              {displayedSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === active
                      ? "w-10 bg-[#f04f5f]"
                      : "w-2.5 bg-[#32305f]/25 hover:bg-[#25a9e0]"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="
                  grid size-11 place-items-center
                  rounded-full
                  border border-[#32305f]/15
                  bg-white
                  text-[#32305f]
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:bg-[#f6bd28]
                "
              >
                <ArrowLeft size={18} />
              </button>

              <button
                onClick={() => go(1)}
                aria-label="Next slide"
                className="
                  grid size-11 place-items-center
                  rounded-full
                  bg-[#32305f]
                  text-white
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:bg-[#25a9e0]
                "
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          NEWS / PARENTS / MOMENTS
      ====================================================== */}

      <section
        ref={newsRef}
        className="relative overflow-hidden bg-[#fffdf8] py-20 sm:py-24 lg:py-28"
      >
        {/* Decorative background circles */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-32 top-12
            size-[330px]
            rounded-full
            border-[52px]
            border-[#25a9e0]/[.35]
          "
          style={
            newsVisible
              ? { animation: "kidsNewsFloat 7s ease-in-out infinite" }
              : undefined
          }
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-32 bottom-0
            size-[360px]
            rounded-full
            border-[55px]
            border-[#f6bd28]/[.38]
          "
          style={
            newsVisible
              ? {
                  animation:
                    "kidsNewsFloat 8s ease-in-out .5s infinite reverse",
                }
              : undefined
          }
        />

        <div className="pointer-events-none absolute left-[8%] top-24 size-3 rounded-full bg-[#f04f5f]/60" />

        <div className="pointer-events-none absolute right-[10%] top-20 size-3 rounded-full bg-[#25a9e0]/50" />

        <div className="pointer-events-none absolute bottom-20 left-[48%] size-3 rounded-full bg-[#29aa5b]/50" />

        <div className="container relative">
          {/* SECTION HEADING */}

          <div
            className={`mx-auto mb-12 max-w-2xl text-center transition-all duration-1000 ease-out lg:mb-16 ${
              newsVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <p className="text-[11px] font-black uppercase tracking-[.24em] text-[#f04f5f]">
              Around Our School
            </p>

            <h2
              className={`mt-3 font-serif text-4xl font-bold text-[#32305f] transition-all delay-150 duration-1000 sm:text-5xl ${
                newsVisible ? "scale-100 opacity-100" : "scale-[.9] opacity-0"
              }`}
            >
              What’s Happening at{" "}
              <span className="text-[#25a9e0]">Paragon Kids</span>
            </h2>

            <div
              className={`mx-auto mt-5 flex gap-1 overflow-hidden transition-all delay-500 duration-700 ${
                newsVisible ? "w-28 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <span className="h-1 flex-1 rounded-full bg-[#f04f5f]" />
              <span className="h-1 flex-1 rounded-full bg-[#f6bd28]" />
              <span className="h-1 flex-1 rounded-full bg-[#29aa5b]" />
              <span className="h-1 flex-1 rounded-full bg-[#25a9e0]" />
            </div>
          </div>

          {/* ==================================================
              CARDS
          ================================================== */}

          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr_.85fr]">
            {/* ================================================
                CARD 01 - LATEST NEWS
            ================================================ */}

            <article
              className={`group relative overflow-hidden rounded-[32px] border border-[#f04f5f]/15 bg-white p-7 shadow-[0_20px_60px_-35px_rgba(50,48,95,.28)] transition-all duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 hover:shadow-[0_28px_70px_-30px_rgba(240,79,95,.25)] sm:p-8 ${
                newsVisible
                  ? "translate-x-0 rotate-0 scale-100 opacity-100"
                  : "-translate-x-20 -rotate-2 scale-[.94] opacity-0"
              }`}
            >
              {/* decorative shape */}

              <div className="absolute -right-16 -top-16 size-44 rounded-full bg-[#f04f5f]/[.07]" />

              <div className="absolute right-10 top-12 size-2.5 rounded-full bg-[#f6bd28]" />

              {/* HEADER */}

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      grid size-14
                      place-items-center
                      rounded-[18px]
                      bg-[#f04f5f]
                      text-white
                      shadow-[0_10px_25px_rgba(240,79,95,.22)]
                      transition
                      duration-500
                      group-hover:-rotate-6
                      group-hover:scale-105
                    "
                  >
                    <Newspaper size={25} />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#f04f5f]">
                      School Updates
                    </p>

                    <h3 className="mt-1 font-serif text-2xl font-bold text-[#32305f] sm:text-[28px]">
                      {newsSection?.title || "Latest News / Events"}
                    </h3>
                  </div>
                </div>

                <span className="text-sm font-black text-[#32305f]/20">01</span>
              </div>

              {/* NEWS */}

              <div className="relative mt-8 space-y-3">
                {displayedNews.map((item, index) => (
                  <div
                    key={index}
                    className={`group/news relative rounded-2xl border border-[#32305f]/[.07] bg-[#fffaf4] px-5 py-4 transition-all duration-500 hover:border-[#f04f5f]/20 hover:bg-[#fff6f2] ${
                      newsVisible
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-6 opacity-0"
                    }`}
                    style={{ transitionDelay: `${450 + index * 100}ms` }}
                  >
                    <div className="flex gap-3">
                      <span
                        className="
                          mt-2
                          size-2
                          shrink-0
                          rounded-full
                        "
                        style={{
                          backgroundColor:
                            index === 0
                              ? "#f04f5f"
                              : index === 1
                                ? "#f6bd28"
                                : index === 2
                                  ? "#29aa5b"
                                  : "#25a9e0",
                        }}
                      />

                      <div className="text-sm leading-6 text-slate-600">
                        {item.parts?.length ? (
                          <>
                            {item.parts.map((part, partIndex) => (
                              <span key={`${part.href || part.text}-${partIndex}`}>
                                {partIndex > 0 && " "}
                                {part.href ? (
                                  <a
                                    href={part.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-bold text-[#f04f5f] underline decoration-[#f04f5f]/30 underline-offset-4 transition hover:text-[#32305f]"
                                  >
                                    {part.text}
                                  </a>
                                ) : (
                                  part.text
                                )}
                              </span>
                            ))}
                          </>
                        ) : item.href && !item.linkText ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              inline-flex
                              items-center
                              gap-2
                              font-bold
                              text-[#32305f]
                              transition
                              hover:text-[#f04f5f]
                            "
                          >
                            {item.text}

                            <ArrowUpRight
                              size={15}
                              className="
                                transition-transform
                                group-hover/news:translate-x-0.5
                                group-hover/news:-translate-y-0.5
                              "
                            />
                          </a>
                        ) : (
                          <>
                            {item.text}{" "}
                            {item.href && (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-[#f04f5f] underline decoration-[#f04f5f]/30 underline-offset-4"
                              >
                                {item.linkText}
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOTTOM DECORATION */}

              <div className="relative mt-7 flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-[#f04f5f]" />
                <span className="size-2 rounded-full bg-[#f6bd28]" />
                <span className="size-2 rounded-full bg-[#29aa5b]" />
                <span className="size-2 rounded-full bg-[#25a9e0]" />
              </div>
            </article>

            {/* ================================================
                CARD 02 - PARENTS CORNER
            ================================================ */}

            <article
              className={`group relative overflow-hidden rounded-[32px] border border-[#f6bd28]/20 bg-[#fff8dd] p-7 shadow-[0_20px_60px_-35px_rgba(50,48,95,.25)] transition-all delay-150 duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 sm:p-8 ${
                newsVisible
                  ? "translate-y-0 rotate-0 scale-100 opacity-100"
                  : "translate-y-20 rotate-2 scale-[.92] opacity-0"
              }`}
            >
              <div className="absolute -right-16 -top-16 size-44 rounded-full border-[28px] border-[#f6bd28]/10" />

              <div className="absolute bottom-8 right-8 text-7xl font-black leading-none text-[#f6bd28]/15">
                “
              </div>

              <div className="relative">
                <div
                  className="
                    grid size-14
                    place-items-center
                    rounded-[18px]
                    bg-[#f6bd28]
                    text-[#32305f]
                    shadow-lg
                    transition
                    duration-500
                    group-hover:rotate-6
                  "
                >
                  <MessageCircleHeart size={25} />
                </div>

                <p className="mt-7 text-[10px] font-black uppercase tracking-[.2em] text-[#e99a00]">
                  Parent Voices
                </p>

                <h3 className="mt-2 font-serif text-3xl font-bold text-[#32305f]">
                  {activeParent?.title || parentsSection?.title || "Parents Corner"}
                </h3>

                <blockquote className="mt-7 text-lg font-medium leading-8 text-[#32305f]/75">
                  “{plainText(activeParent?.description) || "I have seen a considerable improvement in my daughter since last year and hope it carries on."}”
                </blockquote>

                <div className="mt-7">
                  <p className="font-black text-[#32305f]">{activeParent?.name || "Bachcha Singh"}</p>
                </div>

                {/* Slider-like indicators */}

                <div className="mt-10 flex gap-2">
                  {displayedParentSlides.map((testimonial, index) => (
                    <button
                      key={`${testimonial.name}-${index}`}
                      type="button"
                      aria-label={`Show parent testimonial ${index + 1}`}
                      onClick={() => setParentActive(index)}
                      className={`h-2.5 rounded-full transition-all ${index === parentActive ? "w-8 bg-[#f6bd28]" : "w-2.5 bg-[#32305f]/15"}`}
                    />
                  ))}
                </div>
              </div>
            </article>

            {/* ================================================
                CARD 03 - MEMORABLE MOMENTS
            ================================================ */}

            <article
              className={`group relative min-h-[410px] overflow-hidden rounded-[32px] bg-[#dff7f2] shadow-[0_20px_60px_-35px_rgba(50,48,95,.25)] transition-all delay-300 duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 ${
                newsVisible
                  ? "translate-x-0 rotate-0 scale-100 opacity-100"
                  : "translate-x-20 rotate-2 scale-[.94] opacity-0"
              }`}
            >
              {/* background shapes */}

              <div className="absolute -right-16 top-16 size-48 rounded-full bg-[#29aa5b]/10" />

              <div className="absolute -bottom-20 -left-14 size-52 rounded-full bg-[#25a9e0]/10" />

              <div className="relative flex h-full flex-col p-7 sm:p-8">
                <div
                  className="
                    grid size-14
                    place-items-center
                    rounded-[18px]
                    bg-[#20a98b]
                    text-white
                    shadow-lg
                    transition
                    duration-500
                    group-hover:-rotate-6
                  "
                >
                  <ImageIcon size={25} />
                </div>

                <p className="mt-7 text-[10px] font-black uppercase tracking-[.2em] text-[#20a98b]">
                  Watch & Remember
                </p>

                <h3 className="mt-2 font-serif text-3xl font-bold text-[#32305f]">
                  {momentsSection?.title || "Memorable Moments"}
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Relive one of our memorable school moments.
                </p>

                <div className="mt-auto pt-10">
                  <a
                    href={momentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      group/watch
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      bg-[#20a98b]
                      px-5 py-4
                      text-sm
                      font-black
                      text-white
                      shadow-[0_12px_30px_rgba(32,169,139,.22)]
                      transition
                      duration-300
                      hover:-translate-y-1
                    "
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-white/20">
                        <Play size={15} fill="currentColor" />
                      </span>
                      Watch Moment
                    </span>

                    <ArrowUpRight
                      size={18}
                      className="
                        transition-transform
                        group-hover/watch:translate-x-1
                        group-hover/watch:-translate-y-1
                      "
                    />
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        ref={welcomeRef}
        className="relative overflow-hidden bg-[#fffaf1] py-20 sm:py-24 lg:py-28"
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-28 top-16 size-72 rounded-full border-[45px] border-[#25a9e0]/[.36]" />
        <div className="pointer-events-none absolute -right-28 bottom-10 size-72 rounded-full border-[45px] border-[#f6bd28]/[.39]" />

        <span className="absolute left-[8%] top-24 size-3 rounded-full bg-[#f04f5f]/60" />
        <span className="absolute right-[10%] top-20 size-3 rounded-full bg-[#25a9e0]/50" />
        <span className="absolute bottom-24 left-[12%] size-2.5 rounded-full bg-[#29aa5b]/50" />

        <div className="container relative">
          {/* HEADING */}
          <div
            className={`mx-auto max-w-4xl text-center transition-all duration-1000 ease-out ${
              welcomeVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-14 opacity-0"
            }`}
          >
            <p className="text-[11px] font-black uppercase tracking-[.24em] text-[#f04f5f]">
              Hello Little Learners
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold text-[#32305f] sm:text-5xl">
              {welcomeHeading.first}{" "}
              <span className="relative text-[#25a9e0]">
                {welcomeHeading.accent}
                <span className="absolute -bottom-3 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-[#f04f5f]" />
              </span>
            </h2>

            <p className="mx-auto mt-9 max-w-4xl text-[15px] leading-7 text-slate-600">
              {plainText(welcomeSection?.description) || "Selecting the right school for your child is one of the most important decisions a parent can make. Paragon Kids offers joyful opportunities for children to learn, explore and grow."}
            </p>
          </div>

          {/* WHAT SETS US APART */}
          <div className="relative mx-auto mt-16 max-w-6xl">
            {/* title card */}
            <div
              className={`relative z-20 mx-auto w-fit transition-all delay-300 duration-1000 ease-[cubic-bezier(.2,.9,.2,1.2)] ${
                welcomeVisible
                  ? "translate-y-0 rotate-0 scale-100 opacity-100"
                  : "translate-y-12 rotate-6 scale-[.7] opacity-0"
              }`}
            >
              <div className="kids-seesaw rotate-[-2deg] rounded-[24px] bg-[#f6bd28] px-8 py-4 shadow-[0_15px_35px_rgba(246,189,40,.22)] sm:px-12">
                <h3 className="rotate-[2deg] text-center text-2xl font-black text-[#32305f] sm:text-3xl">
                  What Sets Us Apart?
                </h3>
              </div>

              <span className="absolute -right-7 -top-5 text-3xl text-[#f04f5f]">
                ✦
              </span>
            </div>

            {/* FEATURES */}
            <div className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* 01 */}
              <div
                className={`group relative overflow-hidden rounded-[28px] border border-[#f39b24]/15 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(50,48,95,.25)] transition-all duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 ${
                  welcomeVisible
                    ? "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100"
                    : "-translate-x-16 -rotate-3 scale-[.88] opacity-0"
                }`}
                style={{ transitionDelay: "450ms" }}
              >
                <span className="absolute -right-10 -top-10 size-28 rounded-full bg-[#f39b24]/10" />

                <div className="relative">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#fff1d7] text-xl font-black text-[#f39b24] transition duration-500 group-hover:rotate-6">
                    01
                  </span>

                  <h4 className="mt-7 text-xl font-black leading-7 text-[#32305f]">
                    Always do
                    <br />
                    new things
                  </h4>

                  <div className="mt-6 h-1 w-10 rounded-full bg-[#f39b24]" />
                </div>
              </div>

              {/* 02 */}
              <div
                className={`group relative overflow-hidden rounded-[28px] border border-[#20a98b]/15 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(50,48,95,.25)] transition-all duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 ${
                  welcomeVisible
                    ? "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100"
                    : "translate-y-16 rotate-2 scale-[.88] opacity-0"
                }`}
                style={{ transitionDelay: "550ms" }}
              >
                <span className="absolute -right-10 -top-10 size-28 rounded-full bg-[#20a98b]/10" />

                <div className="relative">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#e2f7f2] text-xl font-black text-[#20a98b] transition duration-500 group-hover:-rotate-6">
                    02
                  </span>

                  <h4 className="mt-7 text-xl font-black leading-7 text-[#32305f]">
                    Hygienic
                    <br />
                    environment
                  </h4>

                  <div className="mt-6 h-1 w-10 rounded-full bg-[#20a98b]" />
                </div>
              </div>

              {/* 03 */}
              <div
                className={`group relative overflow-hidden rounded-[28px] border border-[#25a9e0]/15 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(50,48,95,.25)] transition-all duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 ${
                  welcomeVisible
                    ? "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100"
                    : "translate-x-16 rotate-3 scale-[.88] opacity-0"
                }`}
                style={{ transitionDelay: "650ms" }}
              >
                <span className="absolute -right-10 -top-10 size-28 rounded-full bg-[#25a9e0]/10" />

                <div className="relative">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#e4f5fc] text-xl font-black text-[#25a9e0] transition duration-500 group-hover:rotate-6">
                    03
                  </span>

                  <h4 className="mt-7 text-xl font-black leading-7 text-[#32305f]">
                    The teachers
                    <br />
                    really care
                  </h4>

                  <div className="mt-6 h-1 w-10 rounded-full bg-[#25a9e0]" />
                </div>
              </div>

              {/* 04 */}
              <div
                className={`group relative overflow-hidden rounded-[28px] border border-[#e83d80]/15 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(50,48,95,.25)] transition-all duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 ${
                  welcomeVisible
                    ? "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100"
                    : "-translate-x-16 rotate-2 scale-[.88] opacity-0"
                }`}
                style={{ transitionDelay: "750ms" }}
              >
                <span className="absolute -right-10 -top-10 size-28 rounded-full bg-[#e83d80]/10" />

                <div className="relative">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#fde7f0] text-xl font-black text-[#e83d80] transition duration-500 group-hover:-rotate-6">
                    04
                  </span>

                  <h4 className="mt-7 text-xl font-black leading-7 text-[#32305f]">
                    Child
                    <br />
                    safety
                  </h4>

                  <div className="mt-6 h-1 w-10 rounded-full bg-[#e83d80]" />
                </div>
              </div>

              {/* 05 */}
              <div
                className={`group relative overflow-hidden rounded-[28px] border border-[#e8c800]/20 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(50,48,95,.25)] transition-all duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 ${
                  welcomeVisible
                    ? "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100"
                    : "translate-y-16 -rotate-2 scale-[.88] opacity-0"
                }`}
                style={{ transitionDelay: "850ms" }}
              >
                <span className="absolute -right-10 -top-10 size-28 rounded-full bg-[#f6d600]/10" />

                <div className="relative">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#fff8d1] text-xl font-black text-[#d7b600] transition duration-500 group-hover:rotate-6">
                    05
                  </span>

                  <h4 className="mt-7 text-xl font-black leading-7 text-[#32305f]">
                    Technology and
                    <br />
                    hands on experiment
                  </h4>

                  <div className="mt-6 h-1 w-10 rounded-full bg-[#f0cf00]" />
                </div>
              </div>

              {/* 06 */}
              <div
                className={`group relative overflow-hidden rounded-[28px] border border-[#f04f5f]/15 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(50,48,95,.25)] transition-all duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 ${
                  welcomeVisible
                    ? "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100"
                    : "translate-x-16 -rotate-3 scale-[.88] opacity-0"
                }`}
                style={{ transitionDelay: "950ms" }}
              >
                <span className="absolute -right-10 -top-10 size-28 rounded-full bg-[#f04f5f]/10" />

                <div className="relative">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#ffe8eb] text-xl font-black text-[#f04f5f] transition duration-500 group-hover:-rotate-6">
                    06
                  </span>

                  <h4 className="mt-7 text-xl font-black leading-7 text-[#32305f]">
                    Raising up kids to be capable
                    <br />
                    and successful citizens
                  </h4>

                  <div className="mt-6 h-1 w-10 rounded-full bg-[#f04f5f]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
    ABOUT PARAGON KIDS
========================================================= */}

      <section
        ref={aboutRef}
        className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
      >
        {/* =====================================================
      ANIMATION CSS
  ===================================================== */}
        <style>{`
    @keyframes kidsFloat {
      0%, 100% {
        transform: translateY(0) rotate(-8deg);
      }
      50% {
        transform: translateY(-14px) rotate(4deg);
      }
    }

    @keyframes kidsFloatTwo {
      0%, 100% {
        transform: translateY(0) rotate(10deg);
      }
      50% {
        transform: translateY(-10px) rotate(-4deg);
      }
    }

    @keyframes kidsStar {
      0%, 100% {
        transform: rotate(5deg) scale(1);
      }
      50% {
        transform: rotate(20deg) scale(1.15);
      }
    }

    @keyframes kidsBlob {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(15px, -15px) scale(1.08);
      }
    }

    @keyframes kidsImageFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    @keyframes kidsDot {
      0%, 100% {
        transform: scale(1);
        opacity: .5;
      }
      50% {
        transform: scale(1.6);
        opacity: 1;
      }
    }
  `}</style>

        {/* =====================================================
      BACKGROUND DECORATIONS
  ===================================================== */}

        <div
          className="pointer-events-none absolute -left-32 bottom-0 size-72 rounded-full bg-[#25a9e0]/[.36]"
          style={{ animation: "kidsBlob 7s ease-in-out infinite" }}
        />

        <div
          className="pointer-events-none absolute -right-20 top-20 size-64 rounded-full bg-[#f6bd28]/[.30]"
          style={{
            animation: "kidsBlob 8s ease-in-out infinite",
            animationDelay: "1s",
          }}
        />

        {/* little floating dots */}
        <span
          className="pointer-events-none absolute left-[7%] top-[20%] size-3 rounded-full bg-[#f04f5f]"
          style={{ animation: "kidsDot 2.5s ease-in-out infinite" }}
        />

        <span
          className="pointer-events-none absolute right-[8%] top-[30%] size-3 rounded-full bg-[#25a9e0]"
          style={{
            animation: "kidsDot 3s ease-in-out infinite",
            animationDelay: ".7s",
          }}
        />

        <span
          className="pointer-events-none absolute bottom-[15%] left-[48%] size-2.5 rounded-full bg-[#29aa5b]"
          style={{
            animation: "kidsDot 2.8s ease-in-out infinite",
            animationDelay: "1.2s",
          }}
        />

        <div className="container relative">
          <div className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            {/* =====================================================
          LEFT SIDE
      ===================================================== */}

            <div
              className={`
          relative mx-auto w-full max-w-[560px]
          transition-all
          duration-[1100ms]
          ease-[cubic-bezier(.2,.8,.2,1)]
          ${
            aboutVisible
              ? "translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100"
              : "-translate-x-24 translate-y-10 scale-[.88] -rotate-3 opacity-0"
          }
        `}
            >
              {/* colourful layers */}

              <div
                className={`
            absolute inset-5
            rounded-[40px_70px_40px_70px]
            bg-[#f6bd28]
            transition-all
            delay-300
            duration-1000
            ${
              aboutVisible
                ? "rotate-3 scale-100 opacity-100"
                : "rotate-12 scale-75 opacity-0"
            }
          `}
              />

              <div
                className={`
            absolute inset-5
            rounded-[70px_40px_70px_40px]
            bg-[#25a9e0]/75
            transition-all
            delay-200
            duration-1000
            ${
              aboutVisible
                ? "-rotate-2 scale-100 opacity-100"
                : "-rotate-12 scale-75 opacity-0"
            }
          `}
              />

              {/* IMAGE */}

              <div
                className={`
            group relative
            overflow-hidden
            rounded-[45px]
            border-[8px]
            border-white
            bg-[#fffaf1]
            shadow-[0_30px_70px_-30px_rgba(50,48,95,.35)]
            transition-all
            delay-300
            duration-1000
            ${aboutVisible ? "scale-100 opacity-100" : "scale-[.82] opacity-0"}
          `}
                style={
                  aboutVisible
                    ? {
                        animation:
                          "kidsImageFloat 4.5s ease-in-out 1.2s infinite",
                      }
                    : undefined
                }
              >
                <img
                  src="/images/pic_2.webp"
                  alt="Paragon Kids learning"
                  className="
              aspect-[1.08/1]
              size-full
              object-contain
              p-5
              transition
              duration-700
              group-hover:scale-[1.04]
            "
                />
              </div>

              {/* A */}

              <span
                className={`
            absolute -left-4 top-12
            grid size-14
            place-items-center
            rounded-2xl
            bg-[#f04f5f]
            text-2xl
            font-black
            text-white
            shadow-lg
            transition-all
            delay-700
            duration-700
            ${aboutVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}
          `}
                style={
                  aboutVisible
                    ? {
                        animation: "kidsFloat 3s ease-in-out 1.3s infinite",
                      }
                    : undefined
                }
              >
                A
              </span>

              {/* 1 */}

              <span
                className={`
            absolute -right-3 top-24
            grid size-14
            place-items-center
            rounded-full
            bg-[#f6bd28]
            text-xl
            font-black
            text-[#32305f]
            shadow-lg
            transition-all
            delay-[850ms]
            duration-700
            ${aboutVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}
          `}
                style={
                  aboutVisible
                    ? {
                        animation:
                          "kidsFloatTwo 3.4s ease-in-out 1.5s infinite",
                      }
                    : undefined
                }
              >
                1
              </span>

              {/* STAR */}

              <span
                className={`
            absolute bottom-8 right-0
            grid size-14
            place-items-center
            rounded-2xl
            bg-[#29aa5b]
            text-2xl
            text-white
            shadow-lg
            transition-all
            delay-1000
            duration-700
            ${aboutVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}
          `}
                style={
                  aboutVisible
                    ? {
                        animation: "kidsStar 3s ease-in-out 1.7s infinite",
                      }
                    : undefined
                }
              >
                ★
              </span>
            </div>

            {/* =====================================================
          RIGHT CONTENT
      ===================================================== */}

            <div>
              {/* SMALL HEADING */}

              <div
                className={`
            flex items-center gap-3
            transition-all
            duration-700
            ease-out
            ${
              aboutVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-14 opacity-0"
            }
          `}
              >
                <span
                  className={`
              h-1 rounded-full
              bg-[#f04f5f]
              transition-all
              delay-300
              duration-700
              ${aboutVisible ? "w-10" : "w-0"}
            `}
                />

                <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#f04f5f]">
                  Discover Paragon Kids
                </p>
              </div>

              {/* MAIN HEADING */}

              <h2
                className={`
            mt-4
            font-serif
            text-4xl
            font-bold
            leading-tight
            text-[#32305f]
            transition-all
            delay-150
            duration-[900ms]
            ease-[cubic-bezier(.2,.8,.2,1)]
            sm:text-5xl
            ${
              aboutVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-12 scale-[.92] opacity-0"
            }
          `}
              >
                {aboutHeading.first}{" "}
                <span className="relative inline-block text-[#25a9e0]">
                  {aboutHeading.accent}
                  {/* DRAWING UNDERLINE */}
                  <span
                    className={`
                absolute
                -bottom-2
                left-0
                h-[4px]
                rounded-full
                bg-[#f04f5f]
                transition-all
                delay-[800ms]
                duration-700
                ease-out
                ${aboutVisible ? "w-full" : "w-0"}
              `}
                  />
                </span>
                {/* playful star */}
                <span
                  className={`
              ml-3 inline-block
              text-2xl
              text-[#f6bd28]
              transition-all
              delay-[1000ms]
              duration-500
              ${
                aboutVisible
                  ? "rotate-0 scale-100 opacity-100"
                  : "rotate-180 scale-0 opacity-0"
              }
            `}
                >
                  ✦
                </span>
              </h2>

              {/* DESCRIPTION */}

              <p
                className={`
            mt-7
            max-w-2xl
            text-[16px]
            leading-8
            text-slate-600
            transition-all
            delay-300
            duration-[900ms]
            ease-out
            ${
              aboutVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }
          `}
              >
                {plainText(aboutSection?.description) || "Paragon Kids provides a warm, creative and caring environment where children learn through play and guided discovery."}
              </p>

              {/* =====================================================
            ANIMATED POINTS
        ===================================================== */}

              <div className="mt-9 space-y-4">
                {/* POINT 01 */}

                <div
                  className={`
              group
              flex items-center gap-4
              rounded-2xl
              border border-[#f04f5f]/10
              bg-[#fff8f8]
              p-4
              shadow-[0_10px_30px_-25px_rgba(240,79,95,.5)]
              transition-all
              delay-[450ms]
              duration-700
              ease-out
              hover:!translate-x-2
              hover:shadow-[0_15px_35px_-22px_rgba(240,79,95,.4)]
              ${
                aboutVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }
            `}
                >
                  <span
                    className={`
                grid size-10
                shrink-0
                place-items-center
                rounded-xl
                bg-[#f04f5f]
                text-sm
                font-black
                text-white
                shadow-sm
                transition-all
                delay-[800ms]
                duration-500
                ${aboutVisible ? "rotate-0 scale-100" : "-rotate-90 scale-0"}
              `}
                  >
                    ✓
                  </span>

                  <p className="font-bold text-[#32305f]">
                    {aboutItems[0] || "Bring Fun Life To Your Kids"}
                  </p>
                </div>

                {/* POINT 02 */}

                <div
                  className={`
              group
              flex items-center gap-4
              rounded-2xl
              border border-[#f6bd28]/15
              bg-[#fffaf0]
              p-4
              shadow-[0_10px_30px_-25px_rgba(246,189,40,.5)]
              transition-all
              delay-[600ms]
              duration-700
              ease-out
              hover:!translate-x-2
              ${
                aboutVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }
            `}
                >
                  <span
                    className={`
                grid size-10
                shrink-0
                place-items-center
                rounded-xl
                bg-[#f6bd28]
                text-sm
                font-black
                text-[#32305f]
                shadow-sm
                transition-all
                delay-[950ms]
                duration-500
                ${aboutVisible ? "rotate-0 scale-100" : "-rotate-90 scale-0"}
              `}
                  >
                    ✓
                  </span>

                  <p className="font-bold text-[#32305f]">
                    {aboutItems[1] || "Amazing Playground for your kids"}
                  </p>
                </div>

                {/* POINT 03 */}

                <div
                  className={`
              group
              flex items-center gap-4
              rounded-2xl
              border border-[#20a98b]/15
              bg-[#f2fbf8]
              p-4
              shadow-[0_10px_30px_-25px_rgba(32,169,139,.5)]
              transition-all
              delay-[750ms]
              duration-700
              ease-out
              hover:!translate-x-2
              ${
                aboutVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }
            `}
                >
                  <span
                    className={`
                grid size-10
                shrink-0
                place-items-center
                rounded-xl
                bg-[#20a98b]
                text-sm
                font-black
                text-white
                shadow-sm
                transition-all
                delay-[1100ms]
                duration-500
                ${aboutVisible ? "rotate-0 scale-100" : "-rotate-90 scale-0"}
              `}
                  >
                    ✓
                  </span>

                  <p className="font-bold text-[#32305f]">
                    {aboutItems[2] || "Focus on core learning areas"}
                  </p>
                </div>
              </div>

              {/* =====================================================
            BOTTOM COLOUR DOTS
        ===================================================== */}

              <div
                className={`
            mt-9 flex items-center gap-2
            transition-all
            delay-[1000ms]
            duration-700
            ${
              aboutVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }
          `}
              >
                <span
                  className={`
              h-1 rounded-full
              bg-[#f04f5f]
              transition-all
              delay-[1100ms]
              duration-700
              ${aboutVisible ? "w-10" : "w-0"}
            `}
                />

                <span className="size-2.5 rounded-full bg-[#f6bd28]" />

                <span className="size-2.5 rounded-full bg-[#29aa5b]" />

                <span className="size-2.5 rounded-full bg-[#25a9e0]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={ctaRef}
        className="relative overflow-hidden bg-[#fffaf1] py-14 sm:py-16 lg:py-20"
      >
        {/* Background decorations */}
        <div
          className="pointer-events-none absolute -left-24 top-1/2 size-64 -translate-y-1/2 rounded-full border-[38px] border-[#25a9e0]/[.26]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-16 -top-20 size-60 rounded-full bg-[#f6bd28]/30"
          aria-hidden="true"
        />

        <span
          className="pointer-events-none absolute left-[7%] top-[20%] size-2.5 rounded-full bg-[#f04f5f]/50"
          aria-hidden="true"
        />

        <span
          className="pointer-events-none absolute right-[9%] bottom-[18%] size-3 rounded-full bg-[#20a98b]/50"
          aria-hidden="true"
        />

        <div className="container relative">
          <div
            className={`group relative overflow-hidden rounded-[32px] bg-[#32305f] px-6 py-10 shadow-[0_25px_70px_-35px_rgba(50,48,95,.55)] transition-all duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] sm:px-10 lg:px-14 lg:py-12 ${
              ctaVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-16 scale-[.94] opacity-0"
            }`}
            style={
              ctaVisible
                ? { animation: "kidsCtaGlow 4s ease-in-out 1s infinite" }
                : undefined
            }
          >
            {/* Soft colorful shapes inside card */}
            <div
              className="pointer-events-none absolute -left-16 -top-20 size-52 rounded-full bg-[#25a9e0]/15 transition-transform duration-700 group-hover:scale-110"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-24 right-[20%] size-52 rounded-full bg-[#20a98b]/10"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -right-14 -top-14 size-48 rounded-full border-[28px] border-[#f6bd28]/15"
              aria-hidden="true"
            />

            {/* Decorative dots */}
            <div
              className="pointer-events-none absolute left-[45%] top-7 hidden items-center gap-2 md:flex"
              aria-hidden="true"
            >
              <span className="size-2 rounded-full bg-[#f04f5f]" />
              <span className="size-2 rounded-full bg-[#f6bd28]" />
              <span className="size-2 rounded-full bg-[#20a98b]" />
              <span className="size-2 rounded-full bg-[#25a9e0]" />
            </div>

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              {/* Left */}
              <div
                className={`max-w-3xl transition-all delay-200 duration-900 ${
                  ctaVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-16 opacity-0"
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-1 w-10 rounded-full bg-[#f04f5f]" />
                  <span className="size-2 rounded-full bg-[#f6bd28]" />
                  <span className="size-2 rounded-full bg-[#20a98b]" />
                  <span className="size-2 rounded-full bg-[#25a9e0]" />
                </div>

                <h2 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[46px]">
                  {ctaHeading.first}{" "}
                  <span className="relative inline-block text-[#f6bd28]">
                    {ctaHeading.accent}
                    {/* playful underline */}
                    <svg
                      className="absolute -bottom-3 left-0 h-3 w-full"
                      viewBox="0 0 200 12"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8C45 2 96 3 197 7"
                        stroke="#f04f5f"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h2>

                {plainText(ctaSection?.description) && (
                  <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                    {plainText(ctaSection?.description)}
                  </p>
                )}
              </div>

              {/* Button */}
              <Link
                to={ctaSection?.button_url || "/kids/contact"}
                className={`group/button relative inline-flex shrink-0 items-center gap-4 overflow-hidden rounded-full bg-[#f04f5f] px-7 py-4 font-black uppercase tracking-[.1em] text-white shadow-[0_12px_30px_rgba(240,79,95,.3)] transition-all delay-500 duration-700 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(240,79,95,.4)] sm:px-8 ${
                  ctaVisible
                    ? "translate-x-0 scale-100 opacity-100"
                    : "translate-x-12 scale-[.8] opacity-0"
                }`}
              >
                <span className="relative z-10 text-xs">{ctaSection?.button_text || "Contact Us"}</span>

                <span className="relative z-10 grid size-8 place-items-center rounded-full bg-white text-[#f04f5f] transition duration-300 group-hover/button:translate-x-1">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </span>

                {/* hover fill */}
                <span className="absolute inset-0 origin-left scale-x-0 bg-[#25a9e0] transition-transform duration-300 group-hover/button:scale-x-100" />
              </Link>
            </div>

            {/* Bottom decorative line */}
            <div
              className="absolute inset-x-0 bottom-0 flex h-1.5"
              aria-hidden="true"
            >
              <span className="flex-1 bg-[#f04f5f]" />
              <span className="flex-1 bg-[#f6bd28]" />
              <span className="flex-1 bg-[#20a98b]" />
              <span className="flex-1 bg-[#25a9e0]" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
