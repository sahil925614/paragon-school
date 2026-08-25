import {
  ArrowLeft,
  CalendarDays,
  Cross,
  Earth,
  Flag,
  GraduationCap,
  HandHelping,
  Languages,
  TentTree,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageBanner } from "../../../components/PageBanner";

type ExperienceDetail = { title: string; text: string; icon: LucideIcon };

const experienceDetails: Record<string, ExperienceDetail> = {
  "german-language-teaching": {
    title: "German Language",
    text: "In the realm of education, we can no longer remain confined to the territorial limits of the cities, states and nations.",
    icon: Languages,
  },
  "red-cross-unit": {
    title: "Red Cross Unit",
    text: "St. John Ambulance (India) Indian Red Cross Society District Branch SAS Nagar has sanctioned this coveted unit to the school.",
    icon: Cross,
  },
  nss: {
    title: "NSS",
    text: "Social work is a professional and co-curricular discipline committed to the pursuit of social welfare, social change and social justice. The motto of NSS is Not Me But You.",
    icon: HandHelping,
  },
  ncc: {
    title: "NCC",
    text: "NCC facility both for boys and girls for junior Army Wing is provided in the school under the National Cadet Corps management.",
    icon: GraduationCap,
  },
  excursion: {
    title: "Excursion",
    text: "The school organizes trips and tours for the students in the nearby areas of Chandigarh and sometimes within the city itself, with the aim of fostering values such as responsibility and confidence.",
    icon: Earth,
  },
  "important-days": {
    title: "Important Days",
    text: "List of important days in the year and monthly themes of the months.",
    icon: CalendarDays,
  },
  "scouts-and-guides": {
    title: "Scouts and Guides",
    text: "The little champs of Paragon actively participated in the Scout and Guide Camp.",
    icon: TentTree,
  },
  nda: {
    title: "NDA",
    text: "At Paragon School, we take immense pride in our association with Mohali Defence Academy, India's No. 1 NDA Coaching Institute.",
    icon: Flag,
  },
};

export function BeyondTheClassroomPage() {
  const { experienceSlug } = useParams();
  const experience = experienceSlug
    ? experienceDetails[experienceSlug]
    : undefined;
  if (!experience) return <Navigate replace to="/school" />;
  const Icon = experience.icon;

  return (
    <main className="bg-[#fbfaf7]">
      <PageBanner title={experience.title} description={experience.text} />
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container">
          <article className="mx-auto max-w-4xl rounded-[22px] border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="grid size-12 place-items-center rounded-xl bg-cream text-gold-dark">
              <Icon size={23} strokeWidth={1.8} />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-navy">
              {experience.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {experience.text}
            </p>
            <Link
              to="/school"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-gold-dark"
            >
              <ArrowLeft size={17} /> Back to home
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
