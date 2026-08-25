import {
  ArrowLeft,
  Languages,
  
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

type InnerPageSection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: { cards?: ActivityCard[] } | [];
};

type InnerPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: InnerPageSection[];
};

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(image?: string | null, imageUrl?: string | null) {
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  return undefined;
}

function plainText(html?: string | null) {
  return html?.replace(/<[^>]*>/g, "").trim() || "";
}
const germanGallery = [
  {
    src: "/images/1 (1).webp",
    alt: "Students participating in German language activities",
  },
  {
    src: "/images/2 (1).webp",
    alt: "German language exhibition at Paragon School",
  },
  {
    src: "/images/3 (1).webp",
    alt: "German language programme events and student projects",
  },
];

export function GermanLanguagePage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "german-language-teaching"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: InnerPageData }>(
        "pages/german-language-teaching",
      );
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
  const apiGallery = cards
    .map((card, index) => ({
      src: mediaUrl(card.image, card.image_url),
      alt: card.title || `German language activity ${index + 1}`,
    }))
    .filter((image): image is { src: string; alt: string } => Boolean(image.src));
  const gallery = apiGallery.length >= 3 ? apiGallery : germanGallery;
  const cardDescriptions = cards.map((card) => plainText(card.description)).filter(Boolean);
  const contentText = cardDescriptions.length
    ? cardDescriptions.join(" ")
    : plainText(content?.description);

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);
  return (
    <main className="overflow-hidden bg-[#fbfaf7]">
      {/* =====================================================
          PAGE BANNER
      ===================================================== */}
      <PageBanner
        title={banner?.title || page?.title || "German Language Teaching"}
        description={plainText(banner?.description) || "Opening young minds to language, culture and global opportunities."}
      />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        {/* Background decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 top-24 size-80 rounded-full border-[48px] border-gold/[.035]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-[45%] size-72 rounded-full bg-navy/[.025]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-140px] left-[22%] size-80 rounded-full border-[55px] border-navy/[.018]"
        />

        <div className="container relative">
          {/* =================================================
              MAIN HEADING - RESTORED
          ================================================= */}
          <header className="mx-auto max-w-4xl text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-cream text-gold-dark shadow-[0_14px_35px_-22px_rgba(16,42,67,.5)]">
              <Languages size={25} strokeWidth={1.8} />
            </span>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[.2em] text-gold-dark">
              Beyond the Classroom
            </p>

            <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl lg:text-5xl">
              {content?.title || page?.title || "German Language Teaching"}
            </h2>

            <div
              aria-hidden="true"
              className="mx-auto mt-6 flex items-center justify-center gap-2"
            >
              <span className="h-[2px] w-10 bg-gold" />
              <span className="size-1.5 rotate-45 bg-gold" />
              <span className="h-[2px] w-10 bg-gold" />
            </div>
          </header>

          {/* =================================================
              IMAGE GALLERY
          ================================================= */}
          <div className="relative mx-auto mt-12 max-w-6xl sm:mt-14">
            {/* decorative backing */}
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 hidden h-[60%] w-[52%] rounded-[30px] bg-navy sm:block"
            />

            <div
              aria-hidden="true"
              className="absolute -right-5 -top-5 hidden size-32 rounded-full border-[18px] border-gold/20 sm:block"
            />

            <div className="relative grid gap-5 lg:grid-cols-2 lg:gap-6">
              {/* FIRST IMAGE */}
              <figure className="group overflow-hidden rounded-[26px] bg-white p-2 shadow-[0_25px_65px_-38px_rgba(16,42,67,.55)]">
                <div className="relative overflow-hidden rounded-[20px] bg-slate-100">
                  <img
                    src={gallery[0].src}
                    alt={gallery[0].alt}
                    loading="eager"
                    className="aspect-[16/10] size-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/15 to-transparent" />
                </div>
              </figure>

              {/* SECOND IMAGE */}
              <figure className="group overflow-hidden rounded-[26px] bg-white p-2 shadow-[0_25px_65px_-38px_rgba(16,42,67,.55)]">
                <div className="relative overflow-hidden rounded-[20px] bg-slate-100">
                  <img
                    src={gallery[1].src}
                    alt={gallery[1].alt}
                    loading="lazy"
                    className="aspect-[16/10] size-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/15 to-transparent" />
                </div>
              </figure>
            </div>

            {/* THIRD IMAGE */}
            <figure className="group relative mx-auto mt-6 overflow-hidden rounded-[26px] bg-white p-2 shadow-[0_25px_65px_-38px_rgba(16,42,67,.55)] lg:w-[64%]">
              <div className="relative overflow-hidden rounded-[20px] bg-slate-100">
                <img
                  src={gallery[2].src}
                  alt={gallery[2].alt}
                  loading="lazy"
                  className="aspect-[16/9] size-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/15 to-transparent" />
              </div>
            </figure>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}
          <article className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_70px_-45px_rgba(16,42,67,.45)] sm:mt-16">
            {/* Top accent */}
            <div className="grid h-1.5 grid-cols-3">
              <span className="bg-navy" />
              <span className="bg-[#c72c3b]" />
              <span className="bg-gold" />
            </div>

            <div className="p-7 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 text-gold-dark">
                <span className="grid size-9 place-items-center rounded-xl bg-cream">
                  <Languages size={17} />
                </span>

                <span className="text-[11px] font-bold uppercase tracking-[.18em]">
                  {content?.title || page?.title || "German Language Teaching"}
                </span>
              </div>

              {/* =================================================
                  ORIGINAL CONTENT ONLY
              ================================================= */}
              <div className="mt-7 space-y-6 text-[15px] leading-8 text-slate-600 sm:text-base">
                {contentText ? (
                  <p>{contentText}</p>
                ) : (
                  <>
                <p>
                  The present cyber age is making the world smaller day by day.
                  In the realm of education, we can no longer remain confined
                  to the territorial limits of the cities, states and nations.
                  So, to counter the challenges of an international interface,
                  it is quite essential to understand the foreign language and
                  culture. On December 31, 2008 our school signed an agreement
                  with the Federal Republic of Germany to introduce the
                  teaching of German language in our school under the name of
                  SCHULEN; Partner der Zukunft Deutsch Partnerschule, fully
                  sponsored by the Federal Republic of Germany. Till now, 34
                  Paragonians have already spent their summer vacations in
                  Germany. Every year 2-3 students of our school visit Germany
                  under ‘Pasch Programme’. The school has a well equipped
                  German Language room. The audio Visual system and the other
                  teaching aids enrich the teaching learning process by making
                  it more interactive and student centered. German Language is
                  taught in the regular curriculum from class V onwards by a
                  well trained and qualified teacher.
                </p>

                <p>
                  Activities like German Interschool competitions, school
                  Exhibitions, Carnivals, Music and Film festivals are an
                  intrinsic part of the German Language Curriculum. Our
                  children are taught to be fit to pass the A1 Level examination
                  (conducted by Goethe Institute) by the time they are in class
                  IX. This is the first level of the six-level scale of
                  competence, laid down in the Common European Framework of
                  reference for Languages (CEFR). Upon receiving the A1 Level
                  certificate, the children become eligible to participate in
                  Youth camp in Germany. We send two children every year for
                  this. The selection criteria are set by the Goethe Institute,
                  and are usually on the basis of a basic level of German
                  Language competence (spoken, written and auditory). A curious,
                  involved, outgoing attitude with the desire to learn and try
                  different things is an absolute pre-requisite too and we
                  groom our children towards it. Children who are interested
                  may further pursue and attempt the A2 Level examination
                  through the school. We are happy to prepare them for the same
                  and further if need be.
                </p>
                  </>
                )}
              </div>
            </div>
          </article>

          {/* =================================================
              BACK LINK
          ================================================= */}
          <div className="mx-auto mt-12 max-w-6xl border-t border-slate-200 pt-8">
            <Link
              to="/school"
              className="group inline-flex items-center gap-3 text-sm font-bold text-navy transition duration-300 hover:text-gold-dark"
            >
              <span className="grid size-9 place-items-center rounded-full border border-navy/10 bg-white transition duration-300 group-hover:-translate-x-1 group-hover:border-gold/40">
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