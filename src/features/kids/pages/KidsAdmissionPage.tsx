import {
  CalendarDays,
  Check,
  Clock3,
  FileCheck2,
  FileText,
  GraduationCap,
  School,
  UserRoundCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { KidsPlaceholderPage } from "./KidsPlaceholderPage";
import { kidsApi } from "../api/kidsApi";
import { applyPageSeo, type PageSeo } from "../../school/utils/pageSeo";

type AdmissionCard = {
  title?: string;
  description?: string | null;
};

type AgeEligibilityRow = {
  grade?: string;
  class?: string;
  age?: string;
  age_criteria?: string;
};

type AdmissionSettings = {
  cards?: AdmissionCard[];
  rows?: AgeEligibilityRow[];
};

type AdmissionSection = {
  type: string;
  title?: string;
  description?: string | null;
  is_active: boolean;
  settings?: AdmissionSettings | [];
};

type AdmissionPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: AdmissionSection[];
};

function plainText(html?: string | null) {
  return (
    html
      ?.replace(/<br\s*\/?\s*>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim() || ""
  );
}

function listItems(html?: string | null) {
  return (
    html
      ?.match(/<li[^>]*>[\s\S]*?<\/li>/gi)
      ?.map((item) => plainText(item))
      .filter(Boolean) ?? []
  );
}

function firstParagraph(html?: string | null) {
  return plainText(html?.match(/<p[^>]*>[\s\S]*?<\/p>/i)?.[0]);
}

function timingItems(html?: string | null) {
  if (!html) return [];
  return Array.from(html.matchAll(/<p[^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>/gi))
    .map((match) => ({
      label: plainText(match[1]).replace(/:$/, ""),
      time: plainText(match[2]),
    }))
    .filter((item) => item.label && item.time);
}
const admissionSteps = [
  "Come to the school campus and the counselors and coordinators will assist you with the details",
  "Form submission to be done along with the required documents mentioned in the form",
  "Can take Campus tour with prior appointments",
  "Interview/Written Test of the child shall be conducted for admission",
];

const requiredDocuments = [
  "Photocopy of Birth certificate of the child (duly attested)",
  "4 pass port size photographs of the child",
  "Photocopy of Aadhar card of the child",
  "Residential proof of the parents",
  "Medical Certificate with details of vaccination",
];

const processIcons = [School, FileText, CalendarDays, UserRoundCheck];

const processColors = [
  {
    color: "#ef5f6c",
    bg: "#fff2f4",
  },
  {
    color: "#f2a51a",
    bg: "#fff8e6",
  },
  {
    color: "#37a9df",
    bg: "#eef9fe",
  },
  {
    color: "#20a98b",
    bg: "#edfaf7",
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
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "0px 0px -55px 0px" },
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
          ? "translate-y-5 scale-[.96] opacity-0"
          : "translate-y-10 opacity-0";

  return (
    <div
      ref={ref}
      className={`admission-reveal transition-all duration-[850ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hidden
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function KidsAdmissionPage() {
  const { data: page } = useQuery({
    queryKey: ["kids-page", "admission"],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: AdmissionPageData }>("pages/admission");
      return response.data.data;
    },
  });

  const banner = page?.sections.find((section) => section.type === "home_banner" && section.is_active);
  const content = page?.sections.find((section) => section.type === "kids_admission_content" && section.is_active);
  const ageEligibility = page?.sections.find((section) => section.type === "kids_admission_age_eligibility" && section.is_active);
  const contentSettings = content?.settings && !Array.isArray(content.settings) ? content.settings : undefined;
  const ageSettings = ageEligibility?.settings && !Array.isArray(ageEligibility.settings) ? ageEligibility.settings : undefined;
  const cards = contentSettings?.cards ?? [];
  const registrationCard = cards[0];
  const documentsCard = cards[1];
  const orientationCard = cards[2];
  const policyCards = cards.slice(3, 6);
  const timingsCard = cards[6];
  const apiSteps = listItems(registrationCard?.description);
  const apiDocuments = listItems(documentsCard?.description);
  const apiTimings = timingItems(timingsCard?.description);
  const displayedSteps = apiSteps.length ? apiSteps : admissionSteps;
  const displayedDocuments = apiDocuments.length ? apiDocuments : requiredDocuments;
  const displayedPolicies = policyCards.length ? policyCards : [
    { title: "Admission Withdrawal Process", description: "Parents who wish to withdraw their children from school at the end of the session must inform the school office in writing by 10th of March of the session. Parents who wish to withdraw their children in the mid-session, must give at least one calendar month's notice in writing, or pay one month's fees, in lieu of notice. Fees once paid will not be refunded." },
    { title: "Transfer Certificate", description: "A transfer certificate can be issued only when a child is withdrawn and ceases to attend school. Transfer Certificates will not be handed over until all the dues are cleared." },
    { title: "Fees", description: "Monthly fees should be deposited before the 10th of every month. A fine of Rs.50 will be charged along with fee from 11th to 20th of the month after which the student's name will be struck off from the roll. The pupil will be readmitted only after fulfilling the other formalities." },
  ];
  const displayedTimings = apiTimings.length ? apiTimings : [
    { label: "Summer", time: "8:30 AM - 12:30 PM" },
    { label: "Winter", time: "9:00 AM - 1:00 PM" },
  ];
  const ageRows = ageSettings?.rows ?? [];

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <>
      {/* =====================================================
          COMMON KIDS PAGE BANNER
      ====================================================== */}

      <KidsPlaceholderPage
        title={banner?.title || page?.title || "Admission"}
        description={plainText(banner?.description) || "Begin the Paragon Kids journey with our welcoming admission process."}
      />

      <main className="relative overflow-hidden bg-[#fffdf8]">

        {/* =====================================================
            BACKGROUND DECORATIONS
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute -left-44 top-32
            size-[390px]
            rounded-full
            border-[60px]
            border-[#37a9df]/[0.055]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute -right-48 top-[35%]
            size-[420px]
            rounded-full
            border-[65px]
            border-[#ffd34e]/[0.08]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute -left-36 bottom-[10%]
            size-[320px]
            rounded-full
            border-[50px]
            border-[#ef5f6c]/[0.045]
          "
          aria-hidden="true"
        />

        <FloatingDot
          className="left-[5%] top-[9%]"
          color="#ef5f6c"
          delay="0s"
        />

        <FloatingDot
          className="right-[7%] top-[17%]"
          color="#37a9df"
          delay=".7s"
        />

        <FloatingDot
          className="left-[9%] top-[48%]"
          color="#ffd34e"
          delay="1.3s"
        />

        <FloatingDot
          className="right-[10%] top-[72%]"
          color="#20a98b"
          delay=".4s"
        />

        <AdmissionDoodle
          index={0}
          className="right-[1.5%] top-20 size-32 rotate-[8deg]"
          delay=".2s"
        />

        <AdmissionDoodle
          index={1}
          className="left-[1.5%] top-[39%] size-36 -rotate-[7deg]"
          delay="1.1s"
        />

        <AdmissionDoodle
          index={2}
          className="right-[2%] top-[76%] size-32 rotate-[5deg]"
          delay=".6s"
        />

        {/* =====================================================
            INTRODUCTION
        ====================================================== */}

        <section className="container relative py-16 sm:py-20 lg:py-24">

          <div className="mx-auto max-w-[1180px]">

            <Reveal className="mx-auto max-w-3xl text-center" direction="scale">

            

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
                <span className="relative inline-block text-[#37a9df]">
                  {registrationCard?.title || "Admission Registration Process"}
                  <Underline />
                </span>
              </h2>

              <p
                className="
                  mx-auto mt-7
                  max-w-4xl
                  text-[15px]
                  leading-8
                  text-[#666274]
                  sm:text-base
                "
              >
                {firstParagraph(registrationCard?.description) || "The new academic session of the school begins on April 1st every year and it is desirable that all admission formalities be completed well in advance before the said date. We will be pleased to assist you for any queries you have about our school. The following steps are involved in the admission process at Paragon Kids:"}
              </p>

            </Reveal>

            {/* =================================================
                ADMISSION STEPS
            ================================================== */}

            <div
              className="
                relative
                mt-14
                grid
                gap-5
                md:grid-cols-2
                lg:mt-16
                lg:grid-cols-4
              "
            >

              {/* connecting line desktop */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-[12%]
                  right-[12%]
                  top-[35px]
                  hidden
                  border-t-2
                  border-dashed
                  border-[#34305c]/10
                  lg:block
                "
                aria-hidden="true"
              />

              {displayedSteps.map((step, index) => {
                const Icon = processIcons[index % processIcons.length];
                const style = processColors[index % processColors.length];

                return (
                  <Reveal
                    key={step}
                    delay={index * 120}
                    direction={index % 2 === 0 ? "left" : "right"}
                    className="
                      group
                      relative
                      rounded-[26px]
                      border
                      border-[#34305c]/[0.07]
                      bg-white
                      p-6
                      shadow-[0_20px_55px_-38px_rgba(52,48,92,.35)]
                      transition-all
                      duration-300
                      hover:-translate-y-2
                      hover:shadow-[0_28px_65px_-35px_rgba(52,48,92,.3)]
                    "
                  >

                    <div
                      className="
                        relative
                        mx-auto
                        flex size-[70px]
                        items-center
                        justify-center
                        rounded-[22px]
                        transition-transform
                        duration-300
                        group-hover:-rotate-3
                        group-hover:scale-105
                        group-hover:[animation:admissionWiggle_.55s_ease-in-out]
                      "
                      style={{
                        color: style.color,
                        backgroundColor: style.bg,
                      }}
                    >
                      <Icon size={28} strokeWidth={1.8} />

                      <span
                        className="
                          absolute
                          -right-2
                          -top-2
                          flex size-7
                          items-center
                          justify-center
                          rounded-full
                          border-4
                          border-white
                          text-[9px]
                          font-extrabold
                          text-white
                        "
                        style={{
                          backgroundColor: style.color,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p
                      className="
                        mt-6
                        text-center
                        text-[14px]
                        font-medium
                        leading-7
                        text-[#5f5b70]
                      "
                    >
                      {step}
                    </p>

                    <span
                      className="
                        absolute
                        bottom-0
                        left-1/2
                        h-[4px]
                        w-10
                        -translate-x-1/2
                        rounded-t-full
                        transition-all
                        duration-300
                        group-hover:w-20
                      "
                      style={{
                        backgroundColor: style.color,
                      }}
                    />

                  </Reveal>
                );
              })}

            </div>

          </div>
        </section>

        {/* =====================================================
            REQUIRED DOCUMENTS
        ====================================================== */}

        <section className="container relative pb-16 sm:pb-20 lg:pb-24">
          <Reveal direction="left">

          <div
            className="
              mx-auto
              grid
              max-w-[1180px]
              overflow-hidden
              rounded-[32px]
              border
              border-[#34305c]/[0.07]
              bg-white
              shadow-[0_28px_80px_-50px_rgba(52,48,92,.35)]
              lg:grid-cols-[.75fr_1.25fr]
            "
          >

            {/* LEFT */}

            <div
              className="
                relative
                overflow-hidden
                bg-[#34305c]
                p-7
                sm:p-9
                lg:p-11
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  size-64
                  rounded-full
                  border-[35px]
                  border-white/[0.04]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-20
                  -left-20
                  size-52
                  rounded-full
                  bg-[#37a9df]/10
                "
              />

              <div className="relative">

                <div
                  className="
                    grid
                    size-14
                    place-items-center
                    rounded-[18px]
                    bg-white/10
                    text-[#ffd34e]
                  "
                >
                  <FileCheck2 size={27} />
                </div>

                <p
                  className="
                    mt-7
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.2em]
                    text-[#ef7b84]
                  "
                >
                  Admission Documents
                </p>

                <h2
                  className="
                    mt-3
                    max-w-md
                    font-serif
                    text-3xl
                    font-bold
                    leading-tight
                    text-white
                    sm:text-4xl
                  "
                >
                  {documentsCard?.title || "Mandatory documents required at the time of admission"}
                </h2>

                <div className="mt-7 flex items-center gap-2">
                  <span className="h-[3px] w-10 rounded-full bg-[#ef5f6c]" />
                  <span className="size-[5px] rounded-full bg-[#ffd34e]" />
                  <span className="size-[5px] rounded-full bg-[#37a9df]" />
                  <span className="size-[5px] rounded-full bg-[#20a98b]" />
                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="p-6 sm:p-9 lg:p-11">

              <p className="text-[15px] leading-7 text-[#666274]">
                {firstParagraph(documentsCard?.description) || "The following documents need to be submitted along with the Admission Form:"}
              </p>

              <div className="mt-7 space-y-3">

                {displayedDocuments.map((document, index) => {
                  const style =
                    processColors[index % processColors.length];

                  return (
                    <div
                      key={document}
                      className="
                        group
                        flex
                        items-center
                        gap-4
                        rounded-[18px]
                        border
                        border-[#34305c]/[0.06]
                        bg-[#fffdf9]
                        px-4
                        py-4
                        transition-all
                        duration-300
                        hover:translate-x-1
                        hover:bg-white
                        hover:shadow-[0_12px_30px_-25px_rgba(52,48,92,.35)]
                        sm:px-5
                      "
                    >

                      <span
                        className="
                          flex
                          size-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-[11px]
                        "
                        style={{
                          backgroundColor: style.bg,
                          color: style.color,
                        }}
                      >
                        <Check size={17} strokeWidth={3} />
                      </span>

                      <p
                        className="
                          text-[14px]
                          font-medium
                          leading-6
                          text-[#565266]
                          sm:text-[15px]
                        "
                      >
                        {document}
                      </p>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>
                  </Reveal>
        </section>

        {/* =====================================================
            PARENT ORIENTATION
        ====================================================== */}

        <section className="container relative pb-16 sm:pb-20">
          <Reveal direction="right">

          <div
            className="
              mx-auto
              max-w-[1180px]
              rounded-[30px]
              border
              border-[#37a9df]/10
              bg-[#f3fbfe]
              p-7
              sm:p-9
              lg:p-11
            "
          >

            <div
              className="
                grid
                gap-7
                lg:grid-cols-[auto_1fr]
                lg:items-start
              "
            >

              <div
                className="
                  grid
                  size-16
                  place-items-center
                  rounded-[20px]
                  bg-white
                  text-[#37a9df]
                  shadow-sm
                "
              >
                <GraduationCap size={30} />
              </div>

              <div>

                <p
                  className="
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.2em]
                    text-[#ef5f6c]
                  "
                >
                  Parents & School
                </p>

                <h2
                  className="
                    mt-2
                    font-serif
                    text-3xl
                    font-bold
                    text-[#34305c]
                    sm:text-4xl
                  "
                >
                  {orientationCard?.title || "Parent Orientation Program"}
                </h2>

                <p
                  className="
                    mt-5
                    max-w-5xl
                    text-[15px]
                    leading-8
                    text-[#666274]
                  "
                >
                  {plainText(orientationCard?.description) || "An orientation program for all parents is conducted before the beginning of each session. This program is organized to facilitate better understanding of school's vision, and learning and teaching methodologies among parents. Parents also get to know the teachers, and gain a perspective on what to expect in the upcoming session and what kind of support they would need to provide at their end."}
                </p>

              </div>

            </div>

          </div>
                  </Reveal>
        </section>

        {/* =====================================================
            POLICIES
        ====================================================== */}

        <section className="container relative pb-16 sm:pb-20 lg:pb-24">
          <Reveal direction="scale">

          <div className="mx-auto max-w-[1180px]">

            <div className="mb-10 text-center">

              <p
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.2em]
                  text-[#ef5f6c]
                "
              >
                Important Information
              </p>

              <h2
                className="
                  mt-3
                  font-serif
                  text-3xl
                  font-bold
                  text-[#34305c]
                  sm:text-4xl
                "
              >
                Admission Guidelines
              </h2>

            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {displayedPolicies.map((policy, index) => {
                const styles = [
                  { color: "#ef5f6c", background: "#fff4f5" },
                  { color: "#37a9df", background: "#f1faff" },
                  { color: "#20a98b", background: "#effbf8" },
                ];
                const style = styles[index % styles.length];
                return (
                  <InfoCard
                    key={`${policy.title}-${index}`}
                    number={String(index + 1).padStart(2, "0")}
                    title={policy.title || `Admission guideline ${index + 1}`}
                    color={style.color}
                    background={style.background}
                  >
                    {plainText(policy.description)}
                  </InfoCard>
                );
              })}

            </div>

          </div>
                  </Reveal>
        </section>

        {/* =====================================================
            AGE ELIGIBILITY + TIMINGS
        ====================================================== */}

        <section className="container relative pb-20 sm:pb-24">
          <Reveal direction="up">

          <div
            className="
              mx-auto
              grid
              max-w-[1180px]
              gap-6
              lg:grid-cols-[1.2fr_.8fr]
            "
          >

            {/* AGE */}

            <div
              className="
                overflow-hidden
                rounded-[28px]
                border
                border-[#34305c]/[0.07]
                bg-white
                shadow-[0_20px_60px_-45px_rgba(52,48,92,.35)]
              "
            >

              <div className="p-6 sm:p-8">

                <div className="flex items-center gap-4">

                  <div
                    className="
                      grid
                      size-12
                      place-items-center
                      rounded-[15px]
                      bg-[#fff2f4]
                      text-[#ef5f6c]
                    "
                  >
                    <GraduationCap size={23} />
                  </div>

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[.17em]
                        text-[#37a9df]
                      "
                    >
                      Admission
                    </p>

                    <h2
                      className="
                        mt-1
                        font-serif
                        text-3xl
                        font-bold
                        text-[#34305c]
                      "
                    >
                      {ageEligibility?.title || "Age Eligibility"}
                    </h2>
                  </div>

                </div>

                <p className="mt-6 text-[15px] text-[#666274]">
                  {plainText(ageEligibility?.description) || "Age Eligibility Criteria for seeking Admission:"}
                </p>

              </div>

              <div className="grid grid-cols-[.78fr_1.22fr]">

                <div
                  className="
                    bg-[#ef6da3]
                    px-5
                    py-4
                    text-sm
                    font-bold
                    tracking-wide
                    text-white
                  "
                >
                  Grade
                </div>

                <div
                  className="
                    border-l
                    border-white/50
                    bg-[#ef6da3]
                    px-5
                    py-4
                    text-sm
                    font-bold
                    tracking-wide
                    text-white
                  "
                >
                  Age Criteria
                </div>

              </div>

            
              {ageRows.map((row, index) => (
                <div
                  key={`${row.grade || row.class}-${index}`}
                  className="grid grid-cols-[.78fr_1.22fr] border-t border-[#34305c]/[0.07]"
                >
                  <div className="bg-white px-5 py-4 text-sm font-semibold text-[#34305c]">
                    {row.grade || row.class || `Grade ${index + 1}`}
                  </div>
                  <div className="border-l border-[#34305c]/[0.07] bg-white px-5 py-4 text-sm text-[#666274]">
                    {row.age_criteria || row.age || "—"}
                  </div>
                </div>
              ))}

            </div>

            {/* TIMINGS */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                bg-[#34305c]
                p-7
                text-white
                shadow-[0_25px_60px_-40px_rgba(52,48,92,.6)]
                sm:p-8
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-14
                  -top-14
                  size-40
                  rounded-full
                  border-[24px]
                  border-white/[0.04]
                "
              />

              <div className="relative">

                <div
                  className="
                    grid
                    size-12
                    place-items-center
                    rounded-[15px]
                    bg-white/10
                    text-[#ffd34e]
                  "
                >
                  <Clock3 size={23} />
                </div>

                <h2
                  className="
                    mt-5
                    font-serif
                    text-3xl
                    font-bold
                  "
                >
                  {timingsCard?.title || "Timings"}
                </h2>

                <div className="mt-7 space-y-3">
                  {displayedTimings.map((timing, index) => (
                    <TimingRow
                      key={`${timing.label}-${index}`}
                      label={timing.label}
                      time={timing.time}
                      color={["#ef7b84", "#37a9df", "#20a98b", "#ffd34e"][index % 4]}
                    />
                  ))}

                </div>

              </div>

            </div>

          </div>

                  </Reveal>
        </section>

      </main>

      <style>{`
        @keyframes admissionFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(4deg); }
        }

        @keyframes admissionWiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          35% { transform: rotate(-4deg) scale(1.04); }
          70% { transform: rotate(4deg) scale(1.04); }
        }

        @keyframes admissionGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(55,169,223,0); }
          50% { box-shadow: 0 0 0 9px rgba(55,169,223,.07); }
        }

        @media (prefers-reduced-motion: reduce) {
          .admission-reveal {
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
   INFO CARD
========================================================= */

function InfoCard({
  number,
  title,
  color,
  background,
  children,
}: {
  number: string;
  title: string;
  color: string;
  background: string;
  children: ReactNode;
}) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-[#34305c]/[0.07]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:shadow-[0_20px_50px_-35px_rgba(52,48,92,.35)]
        sm:p-7
      "
      style={{ backgroundColor: background }}
    >
      <span
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          size-36
          rounded-full
          opacity-[0.055]
          transition-transform
          duration-500
          group-hover:scale-125
        "
        style={{ backgroundColor: color }}
      />

      <div className="relative">

        <span
          className="
            flex
            size-10
            items-center
            justify-center
            rounded-[13px]
            text-[11px]
            font-extrabold
          "
          style={{
            color,
            backgroundColor: `${color}15`,
          }}
        >
          {number}
        </span>

        <h3
          className="
            mt-5
            font-serif
            text-2xl
            font-bold
            leading-tight
          "
          style={{ color }}
        >
          {title}
        </h3>

        <div
          className="
            mt-4
            text-[14px]
            leading-7
            text-[#625e70]
          "
        >
          {children}
        </div>

      </div>
    </article>
  );
}

/* =========================================================
   TIMING ROW
========================================================= */

function TimingRow({
  label,
  time,
  color,
}: {
  label: string;
  time: string;
  color: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
        rounded-[16px]
        border
        border-white/10
        bg-white/[0.06]
        px-4
        py-4
      "
    >
      <span
        className="font-serif text-lg font-bold"
        style={{ color }}
      >
        {label}
      </span>

      <span className="text-sm font-medium text-white/80">
        {time}
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
        animation: `admissionFloat 5s ease-in-out ${delay} infinite`,
      }}
      aria-hidden="true"
    />
  );
}

/* =========================================================
   DECORATIVE ADMISSION DOODLES
========================================================= */

function AdmissionDoodle({
  index,
  className,
  delay,
}: {
  index: 0 | 1 | 2;
  className: string;
  delay: string;
}) {
  return (
    <span
      className={`
        pointer-events-none
        absolute
        z-0
        hidden
        overflow-hidden
        opacity-[0.99]
        xl:block
        ${className}
      `}
      style={{ animation: `admissionFloat 6s ease-in-out ${delay} infinite` }}
      aria-hidden="true"
    >
      <img
        src="/images/kids/admission-doodles.png"
        alt=""
        className="absolute top-0 h-full max-w-none"
        style={{
          left: `${index * -100}%`,
          width: "300%",
        }}
      />
    </span>
  );
}

/* =========================================================
   HAND DRAWN UNDERLINE
========================================================= */

function Underline() {
  return (
    <svg
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      className="
        absolute
        -bottom-3
        left-0
        h-3
        w-full
        text-[#ef5f6c]
      "
      aria-hidden="true"
    >
      <path
        d="M3 8C27 3 64 2 97 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}