import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type AcademicCard = {
  title?: string;
  description?: string;
  label?: string;
  image?: string;
  image_url?: string;
};

type SubjectGroup = {
  label: string;
  subjects: string[];
};

type AcademicsSettings = {
  teaching_methodology_title?: string;
  teaching_methodology_description?: string;
  subjects_offered_title?: string;
  subjects_offered_description?: string;
  subject_groups?: SubjectGroup[];
  counselling_title?: string;
  counselling_description?: string;
  stem_title?: string;
  stem_description?: string;
  life_skills_title?: string;
  life_skills_items?: AcademicCard[];
  toppers_title?: string;
  toppers_cards?: AcademicCard[];
};

type AcademicsSection = {
  type: string;
  title: string;
  description?: string | null;
  is_active: boolean;
  settings?: AcademicsSettings | [];
};

type AcademicsPageData = {
  title: string;
  seo?: PageSeo;
  sections: AcademicsSection[];
};

type SubjectItem = {
  text: string;
  isHeading: boolean;
};

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

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

export function AcademicsPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "academics"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: AcademicsPageData }>(
        "pages/academics",
      );
      return response.data.data;
    },
  });

  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const academics = page?.sections.find(
    (section) => section.type === "academics_content" && section.is_active,
  );
  const settings =
    academics?.settings && !Array.isArray(academics.settings)
      ? academics.settings
      : undefined;

  const subjectGroups = (settings?.subject_groups ?? []).map((group) => ({
    label: plainText(group.label),
    subjects: group.subjects
      .map<SubjectItem>((subject) => ({
        text: plainText(subject),
        isHeading: /<h[1-6][\s>]/i.test(subject),
      }))
      .filter((subject) => Boolean(subject.text)),
  }));

  const lifeSkillCards = [
    {
      title: settings?.counselling_title,
      description: settings?.counselling_description,
    },
    {
      title: settings?.stem_title,
      description: settings?.stem_description,
    },
    ...(settings?.life_skills_items ?? []),
  ]
    .map((item) => ({
      title: plainText(item.title),
      copy: plainText(item.description),
    }))
    .filter((item) => item.title || item.copy);

  const toppers = (settings?.toppers_cards ?? [])
    .map((card) => ({
      image: mediaUrl(card.image, card.image_url),
      title: plainText(card.title),
      label: plainText(card.label || card.description),
    }))
    .filter((card): card is typeof card & { image: string } => Boolean(card.image));

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <>
      <PageBanner
        title={banner?.title || page?.title || "Academics"}
        description={plainText(banner?.description)}
      />

      <main className="relative isolate overflow-hidden bg-[#f5f7f8]">
        <BackgroundDecoration />

        {(settings?.teaching_methodology_title ||
          settings?.teaching_methodology_description) && (
          <section className="container relative py-14 sm:py-20 lg:py-24">
            <div className="max-w-5xl">
              <SectionHeading title={settings.teaching_methodology_title} />
              {settings.teaching_methodology_description && (
                <p className="mt-7 text-[15px] leading-8 text-slate-600 sm:text-base">
                  {plainText(settings.teaching_methodology_description)}
                </p>
              )}
            </div>
          </section>
        )}

        {(settings?.subjects_offered_title || subjectGroups.length > 0) && (
          <section className="relative overflow-hidden bg-navy py-16 text-white sm:py-20 lg:py-24">
            <div className="pointer-events-none absolute -right-40 -top-40 size-[400px] rounded-full border-[55px] border-white/[0.025]" />
            <div className="container relative">
              <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                <div className="max-w-2xl">
                  <SectionHeading
                    title={settings?.subjects_offered_title}
                    light
                  />
                </div>
                {settings?.subjects_offered_description && (
                  <p className="max-w-md text-[15px] leading-7 text-slate-300">
                    {plainText(settings.subjects_offered_description)}
                  </p>
                )}
              </div>

              {subjectGroups.length > 0 && (
                <div className="mt-12 grid gap-px overflow-hidden rounded-[20px] border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
                  {subjectGroups.map((group, index) => (
                    <article key={`${group.label}-${index}`} className="bg-navy p-6 sm:p-7">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-serif text-2xl leading-tight text-white">
                          {group.label}
                        </h3>
                        <span className="text-[10px] font-bold text-white/20">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <ul className="mt-6 space-y-3">
                        {group.subjects.map((subject, subjectIndex) =>
                          subject.isHeading ? (
                            <li
                              key={`${subject.text}-${subjectIndex}`}
                              className="border-t border-white/10 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#ff6371] first:border-0 first:pt-0"
                            >
                              {subject.text}
                            </li>
                          ) : (
                            <li
                              key={`${subject.text}-${subjectIndex}`}
                              className="flex gap-3 text-[13px] leading-5 text-slate-300 sm:text-sm"
                            >
                              <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#e24452]" />
                              {subject.text}
                            </li>
                          ),
                        )}
                      </ul>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {lifeSkillCards.length > 0 && (
          <section className="container relative py-16 sm:py-20 lg:py-24">
            <SectionHeading title={settings?.life_skills_title || "Life Skills"} />
            <div className="mt-9 grid items-stretch gap-5 md:grid-cols-2">
              {lifeSkillCards.map((card, index) => (
                <LifeSkillCard
                  key={`${card.title}-${index}`}
                  number={String(index + 1).padStart(2, "0")}
                  title={card.title}
                  copy={card.copy}
                />
              ))}
            </div>
          </section>
        )}

        {toppers.length > 0 && (
          <section className="relative border-t border-slate-200/70 bg-white/45 py-16 sm:py-20 lg:py-24">
            <div className="container relative">
              <SectionHeading title={settings?.toppers_title || "Toppers"} />
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
                {toppers.map((topper, index) => (
                  <article
                    key={`${topper.image}-${index}`}
                    className="group relative aspect-[16/11] overflow-hidden rounded-[18px] bg-slate-200 sm:rounded-[20px]"
                  >
                    <img
                      src={topper.image}
                      alt={topper.title || `${settings?.toppers_title || "Topper"} ${index + 1}`}
                      loading={index < 3 ? "eager" : "lazy"}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    {(topper.title || topper.label) && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/15 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                          {topper.label && (
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#ff6371]">
                              {topper.label}
                            </p>
                          )}
                          {topper.title && (
                            <h3 className="mt-2 font-serif text-xl leading-tight text-white sm:text-2xl">
                              {topper.title}
                            </h3>
                          )}
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function SectionHeading({ title, light = false }: { title?: string; light?: boolean }) {
  if (!title) return null;

  return (
    <div>
      <h2
        className={`font-serif text-4xl leading-[1.12] sm:text-5xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {plainText(title)}
      </h2>
      <div className="mt-5 h-[2px] w-11 rounded-full bg-[#c72c3b]" />
    </div>
  );
}

function LifeSkillCard({
  number,
  title,
  copy,
}: {
  number: string;
  title: string;
  copy: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = copy.length > 260;

  return (
    <article className="group relative flex h-full min-h-[290px] flex-col overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_-32px_rgba(7,27,58,.3)] sm:p-7">
      <div className="absolute -right-12 -top-12 size-28 rounded-full bg-[#c72c3b]/[0.035]" />
      <div className="relative flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-[0.16em] text-[#c72c3b]">
          {number}
        </span>
        <span className="h-px w-8 bg-slate-300" />
      </div>
      {title && (
        <h3 className="relative mt-5 font-serif text-2xl leading-tight text-navy">
          {title}
        </h3>
      )}
      {copy && (
        <p
          id={`life-skill-${number}`}
          className={`relative mt-4 text-[14px] leading-7 text-slate-600 sm:text-[15px] ${
            canExpand && !expanded ? "line-clamp-5" : ""
          }`}
        >
          {copy}
        </p>
      )}
      {canExpand && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`life-skill-${number}`}
          onClick={() => setExpanded((current) => !current)}
          className="relative mt-auto flex w-fit items-center gap-2 pt-6 text-xs font-bold uppercase tracking-[0.12em] text-[#c72c3b] transition hover:text-navy"
        >
          {expanded ? "See less" : "See more"}
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </article>
  );
}

function BackgroundDecoration() {
  return (
    <>
      <div className="pointer-events-none absolute -left-[190px] top-[80px] -z-10 size-[390px] rounded-full border-[48px] border-[#c72c3b]/[0.04] sm:size-[450px] lg:-left-[250px] lg:size-[590px] lg:border-[62px]" />
      <div className="pointer-events-none absolute -right-[200px] top-[22%] -z-10 size-[420px] rounded-full bg-navy/[0.025] lg:-right-[270px] lg:size-[600px]" />
      <div className="pointer-events-none absolute -left-[210px] top-[54%] -z-10 size-[430px] rounded-full border-[50px] border-navy/[0.025] lg:size-[620px]" />
    </>
  );
}
