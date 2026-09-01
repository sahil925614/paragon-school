import {
  Building2,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  School,
  UsersRound,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { KidsPlaceholderPage } from "./KidsPlaceholderPage";
import { kidsApi } from "../api/kidsApi";
import { applyPageSeo, type PageSeo } from "../../school/utils/pageSeo";

/* =========================================================
   DATA
========================================================= */


type DisclosureRow = {
  information?: string;
  details?: string;
  number_strength?: string;
  name_qualifications?: string;
  link_label?: string;
  link_url?: string;
  document_path?: string;
  document_path_url?: string | null;
};
type DisclosureSettings = { rows?: DisclosureRow[] };
type DisclosureApiSection = {
  type: string;
  title?: string;
  description?: string | null;
  is_active: boolean;
  settings?: DisclosureSettings | [];
};
type DisclosurePageData = {
  title: string;
  seo?: PageSeo;
  sections: DisclosureApiSection[];
};
const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";
function plainText(html?: string | null) {
  return html?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || "";
}
function sectionTitle(title?: string, fallback = "") {
  return plainText(title).replace(/^[A-E]\s*:\s*/i, "").replace(/:\s*$/, "") || fallback;
}
function sectionRows(section?: DisclosureApiSection) {
  return section?.settings && !Array.isArray(section.settings) ? section.settings.rows ?? [] : [];
}
function documentUrl(row?: DisclosureRow) {
  if (!row) return undefined;
  if (row.document_path) return `${storageBaseUrl}${row.document_path.replace(/^\/+/, "")}`;
  if (row.document_path_url && !row.document_path_url.includes("localhost")) return row.document_path_url;
  return row.link_url || undefined;
}
const generalInformation = [
  ["NAME OF THE SCHOOL", "Paragon Senior Secondary School"],
  ["AFFILIATION NO.(IF APPLICABLE)", "1630692"],
  ["SCHOOL CODE (IF APPLICABLE)", "20672"],
  [
    "COMPLETE ADDRESS WITH PIN CODE",
    "Site-1, Sector-71, Mohali Pin-Code-160071",
  ],
  ["PRINCIPAL NAME & QUALIFICATION", "Jasmeet Kaur (M.Com, B.Ed.)"],
  ["SCHOOL EMAIL ID", "paragonschool71@gmail.com"],
  ["CONTACT DETAILS (LANDLINE/MOBILE)", "9855953220"],
];

const documentsInformation = [
  "COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION, IF ANY",
  "COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE, AS APPLICABLE",
  "COPY OF NO OBJECTION CERTIFICATE(NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT",
  "COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT’S RENEWAL IF APPLICABLE",
  "COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE",
  "COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY",
  "COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION/UPGRADATION/EXTENSION OF AFFILIATION OR SELF CERTIFICATION BY SCHOOL",
  "COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES",
  "COPY OF VALID LAND CERTIFICATE",
  "COPIES OF MANDATORY DISCLOSURE DETAILS SARAS 4.0",
];

const resultAcademics = [
  "FEE STRUCTURE OF THE SCHOOL",
  "ANNUAL ACADEMIC CALENDER",
  "LIST OF SCHOOL MANAGEMENT COMMITTEE (SMC)",
  "LIST OF PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS",
  "LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION (X)",
  "LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION (XII)",
];

const teachingStaff = [
  ["PRINCIPAL", "Mrs. Jasmeet Kaur"],
  ["TOTAL NO. OF TEACHERS", "69"],
  ["PGT", "18"],
  ["TGT", "15"],
  ["PRT", "14"],
  ["PET", "03"],
  ["NTT", "10"],
  ["OTHERS", "09"],
  ["TEACHERS SECTION RATIO", "1.5:1"],
  ["DETAILS OF SPECIAL EDUCATOR", "Ms. Sarita"],
  ["DETAILS OF COUNSELLOR AND WELLNESS TEACHER", "Ms. Ruchi Chandan"],
];

const infrastructure = [
  ["TOTAL CAMPUS AREA OF THE SCHOOL (IN SQUARE MTR)", "4738"],
  ["NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)", "45*37"],
  [
    "NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)",
    "5*74",
  ],
  ["INTERNET FACILITY (Y/N)", "Yes"],
  ["NO. OF TOILETS", "Girls-20, Boys-20"],
];

/* =========================================================
   PAGE
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

    // Fallback for older browsers: content stays visible instead of disappearing.
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden =
    direction === "left"
      ? "kids-reveal-left"
      : direction === "right"
        ? "kids-reveal-right"
        : direction === "scale"
          ? "kids-reveal-scale"
          : "kids-reveal-up";

  return (
    <div
      ref={ref}
      className={`kids-disclosure-reveal ${visible ? "is-visible" : hidden} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function KidsDisclosurePage() {
  const { data: disclosurePage } = useQuery({
    queryKey: ["kids-page", "mandatory-disclosure-information"],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: DisclosurePageData }>("pages/mandatory-disclosure-information");
      return response.data.data;
    },
  });
  const banner = disclosurePage?.sections.find((section) => section.type === "home_banner" && section.is_active);
  const generalSection = disclosurePage?.sections.find((section) => section.type === "mandatory_disclosure_general" && section.is_active);
  const documentsSection = disclosurePage?.sections.find((section) => section.type === "mandatory_disclosure_documents" && section.is_active);
  const academicsSection = disclosurePage?.sections.find((section) => section.type === "mandatory_disclosure_result_academics" && section.is_active);
  const staffSection = disclosurePage?.sections.find((section) => section.type === "mandatory_disclosure_staff" && section.is_active);
  const infrastructureSection = disclosurePage?.sections.find((section) => section.type === "mandatory_disclosure_infrastructure" && section.is_active);
  const generalRows = sectionRows(generalSection);
  const documentRows = sectionRows(documentsSection);
  const academicRows = sectionRows(academicsSection);
  const staffRows = sectionRows(staffSection);
  const infrastructureRows = sectionRows(infrastructureSection);
  const infrastructureInformationRows = infrastructureRows.filter((row) => !row.link_label);
  const infrastructureLinkRow = infrastructureRows.find((row) => row.link_label);

  useEffect(() => {
    applyPageSeo(disclosurePage?.seo);
  }, [disclosurePage]);

  return (
    <>
      {/* Existing common Kids banner */}
      <KidsPlaceholderPage
        title={banner?.title || disclosurePage?.title || "Mandatory Disclosure Information"}
        description={plainText(banner?.description) || "Find important institutional information and official documents in one place."}
      />

      <main className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf8_0%,#fffaf4_45%,#fffdf8_100%)]">
        {/* =====================================================
            BACKGROUND DECORATION
        ====================================================== */}

        <div
          className="pointer-events-none absolute -left-48 top-24 size-[390px] rounded-full border-[60px] border-[#37a9df]/[0.25]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-48 top-[28%] size-[410px] rounded-full border-[65px] border-[#ffd34e]/[0.27]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -left-44 top-[63%] size-[350px] rounded-full border-[55px] border-[#ef5f6c]/[0.25]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-32 bottom-20 size-[290px] rounded-full border-[45px] border-[#20a98b]/[0.25]"
          aria-hidden="true"
        />

        <FloatingDot
          className="left-[6%] top-[7%]"
          color="#ef5f6c"
          delay="0s"
        />
        <FloatingDot
          className="right-[8%] top-[16%]"
          color="#37a9df"
          delay=".8s"
        />
        <FloatingDot
          className="left-[9%] top-[48%]"
          color="#ffd34e"
          delay="1.3s"
        />
        <FloatingDot
          className="right-[7%] top-[69%]"
          color="#20a98b"
          delay=".4s"
        />

        <DisclosureDoodle
          index={0}
          motion="orbit"
          className="right-[1.5%] top-[4%] size-32"
          delay=".2s"
        />

        <DisclosureDoodle
          index={1}
          motion="sway"
          className="left-[1.5%] top-[35%] size-36"
          delay=".8s"
        />

        <DisclosureDoodle
          index={2}
          motion="hop"
          className="right-[1.5%] top-[70%] size-36"
          delay=".4s"
        />

        {/* =====================================================
            INTRO
        ====================================================== */}

        <section className="container relative py-14 sm:py-16 lg:py-20">
          <Reveal direction="scale">
          <div className="mx-auto max-w-[1180px] text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ef5f6c]/15 bg-[#fff3f4] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#ef5f6c]">
              <span className="size-2 rounded-full bg-[#ef5f6c]" />
              School Information
            </span>

            <h2 className="mt-3 font-serif text-2xl font-bold text-[#32305f] sm:text-4xl lg:text-5xl">
              {disclosurePage?.title || "Mandatory Disclosure Information"}
            </h2>
          </div>
          </Reveal>
        </section>

        {/* =====================================================
            A. GENERAL INFORMATION
        ====================================================== */}

        <DisclosureSection
  number="A"
  revealDirection="left"
  revealDelay={0}
  title={sectionTitle(generalSection?.title, "General Information")}
  description={generalSection?.description}
  icon={School}
  color="#ef5f6c"
  lightColor="#fff3f4"
>
  <StandardTable
    headings={["S.No.", "Information", "Details"]}
    rows={
      generalRows.length
        ? generalRows.map((row) => [
            row.information || "",
            row.details || "",
          ])
        : generalInformation
    }
    color="#ef5f6c"
  />
</DisclosureSection>

        {/* =====================================================
            B. DOCUMENTS
        ====================================================== */}

        <DisclosureSection
  number="B"
  revealDirection="right"
  revealDelay={70}
  title={sectionTitle(
    documentsSection?.title,
    "Documents And Information"
  )}
  description={documentsSection?.description}
  icon={FileCheck2}
  color="#f2a51a"
  lightColor="#fff8e8"
>
  <DocumentTable
    rows={
      documentRows.length
        ? documentRows
        : documentsInformation.map((information) => ({
            information,
            link_label: "Click here to access",
          }))
    }
    color="#f2a51a"
  />
</DisclosureSection>

        {/* =====================================================
            C. RESULT & ACADEMICS
        ====================================================== */}

      <DisclosureSection
  number="C"
  revealDirection="left"
  revealDelay={70}
  title={sectionTitle(
    academicsSection?.title,
    "Result And Academics"
  )}
  description={academicsSection?.description}
  icon={GraduationCap}
  color="#37a9df"
  lightColor="#eef9fe"
>
  <DocumentTable
    rows={
      academicRows.length
        ? academicRows
        : resultAcademics.map((information) => ({
            information,
            link_label: "Click here to access",
          }))
    }
    color="#37a9df"
  />
</DisclosureSection>

        {/* =====================================================
            D. STAFF
        ====================================================== */}

      <DisclosureSection
  number="D"
  revealDirection="right"
  revealDelay={70}
  title={sectionTitle(staffSection?.title, "Staff (Teaching)")}
  description={staffSection?.description}
  icon={UsersRound}
  color="#20a98b"
  lightColor="#edfaf7"
>
  <StandardTable
    headings={[
      "S.No.",
      "Information",
      "Number / Strength",
      "Name and Qualifications",
    ]}
    rows={
      staffRows.length
        ? staffRows.map((row) => [
            row.information || "",
            row.number_strength || "",
            row.name_qualifications || row.details || "",
          ])
        : teachingStaff
    }
    color="#20a98b"
  />
</DisclosureSection>

        {/* =====================================================
            E. INFRASTRUCTURE
        ====================================================== */}

       <DisclosureSection
  number="E"
  revealDirection="left"
  revealDelay={70}
  title={sectionTitle(
    infrastructureSection?.title,
    "School Infrastructure"
  )}
  description={infrastructureSection?.description}
  icon={Building2}
  color="#ef6da3"
  lightColor="#fff2f7"
>
          <StandardTable
            headings={["S.No.", "Information", "Details"]}
            rows={infrastructureInformationRows.length ? infrastructureInformationRows.map((row) => [row.information || "", row.details || ""]) : infrastructure}
            color="#ef6da3"
          />

          {/* Last row from provided data */}
          <div className="grid border-x border-b border-[#34305c]/[0.07] bg-white md:grid-cols-[80px_1fr_180px]">
            <div className="border-b border-[#34305c]/[0.07] px-5 py-5 text-sm font-bold text-[#34305c] md:border-b-0 md:border-r">
              6
            </div>

            <div className="border-b border-[#34305c]/[0.07] px-5 py-5 text-[13px] font-semibold leading-6 text-[#555166] md:border-b-0 md:border-r">
              {infrastructureLinkRow?.information || "LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING THE INFRASTRUCTURE OF THE SCHOOL"}
            </div>

            <div className="flex items-center px-5 py-5">
              {documentUrl(infrastructureLinkRow) ? (
                <a
                  href={documentUrl(infrastructureLinkRow)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#ef6da3] transition hover:gap-3"
                >
                  {infrastructureLinkRow?.link_label || "Click"}
                  <ExternalLink size={15} />
                </a>
              ) : (
                <span className="text-sm font-semibold text-[#8c8998]">Not uploaded</span>
              )}
            </div>
          </div>
        </DisclosureSection>

        <div className="h-8 sm:h-14" />
      </main>

      <style>{`
        .kids-table-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-x: contain;
        }
        .kids-table-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }

        .kids-disclosure-reveal {
          will-change: transform, opacity, filter;
          transition:
            opacity 850ms cubic-bezier(.16,1,.3,1),
            transform 950ms cubic-bezier(.16,1,.3,1),
            filter 900ms cubic-bezier(.16,1,.3,1);
        }
        .kids-reveal-up { opacity: 0; transform: translate3d(0,70px,0); filter: blur(5px); }
        .kids-reveal-left { opacity: 0; transform: translate3d(-90px,28px,0) rotate(-1.2deg); filter: blur(5px); }
        .kids-reveal-right { opacity: 0; transform: translate3d(90px,28px,0) rotate(1.2deg); filter: blur(5px); }
        .kids-reveal-scale { opacity: 0; transform: translate3d(0,35px,0) scale(.90); filter: blur(6px); }
        .kids-disclosure-reveal.is-visible { opacity: 1; transform: translate3d(0,0,0) scale(1) rotate(0); filter: blur(0); }

        @keyframes disclosureFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(9deg); }
        }
        @keyframes disclosureDoodleOrbit {
          0%, 100% { transform: translate3d(0,0,0) rotate(-5deg); }
          25% { transform: translate3d(12px,-10px,0) rotate(2deg); }
          50% { transform: translate3d(2px,-21px,0) rotate(7deg); }
          75% { transform: translate3d(-11px,-9px,0) rotate(0deg); }
        }
        @keyframes disclosureDoodleSway {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          35% { transform: translateY(-18px) rotate(7deg); }
          70% { transform: translateY(-7px) rotate(-2deg); }
        }
        @keyframes disclosureDoodleHop {
          0%, 100% { transform: translateY(0) scale(1); }
          18% { transform: translateY(-20px) scale(1.03,.97); }
          36% { transform: translateY(0) scale(.97,1.03); }
          52% { transform: translateY(-8px) scale(1.01,.99); }
          68% { transform: translateY(0) scale(1); }
        }
        @keyframes disclosurePulse {
          0%, 100% { transform: scale(1); opacity: .35; }
          50% { transform: scale(1.55); opacity: .75; }
        }
        @keyframes disclosureShine {
          0% { transform: translateX(-160%) rotate(18deg); }
          45%, 100% { transform: translateX(360%) rotate(18deg); }
        }

        .group\/section { position: relative; }
        .group\/section::after {
          content: "";
          position: absolute;
          pointer-events: none;
          top: -40%;
          left: -20%;
          width: 12%;
          height: 180%;
          opacity: .16;
          background: linear-gradient(90deg, transparent, white, transparent);
          animation: disclosureShine 7s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .kids-disclosure-reveal {
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
            filter: none !important;
          }
          .group\/section::after, [style*="disclosureFloat"], .disclosure-doodle { animation: none !important; }
        }
      `}</style>
    </>
  );
}

/* =========================================================
   SECTION WRAPPER
========================================================= */

function DisclosureSection({
  number,
  title,
  description,
  icon: Icon,
  color,
  lightColor,
  children,
  revealDirection = "up",
  revealDelay = 0,
}: {
  number: string;
  title: string;
  description?: string | null;
  icon: React.ElementType;
  color: string;
  lightColor: string;
  children: ReactNode;
  revealDirection?: "up" | "left" | "right" | "scale";
  revealDelay?: number;
}) {
  const descriptionText = plainText(description);

  return (
    <section className="container relative pb-12 sm:pb-16">
      <Reveal direction={revealDirection} delay={revealDelay}>
        <div className="mx-auto max-w-[1180px]">
          {/* SECTION HEADING */}
          <div className="mb-5 flex items-center gap-4 sm:mb-7">
            <div
              className="relative grid size-14 shrink-0 place-items-center rounded-[18px]"
              style={{
                backgroundColor: lightColor,
                color,
              }}
            >
              <Icon
                size={24}
                strokeWidth={1.9}
                className="transition-transform duration-500 group-hover/section:-rotate-6 group-hover/section:scale-110"
              />

              <span
                className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border-[3px] border-[#fffdf8] text-[9px] font-extrabold text-white"
                style={{ backgroundColor: color }}
              >
                {number}
              </span>
            </div>

            <div>
              <p
                className="text-[9px] font-extrabold uppercase tracking-[.2em]"
                style={{ color }}
              >
                Section {number}
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold text-[#34305c] sm:text-3xl">
                {title}
              </h2>
            </div>

            <div className="ml-auto hidden items-center gap-1.5 sm:flex">
              <span
                className="h-[3px] w-8 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="size-[5px] rounded-full bg-[#ef5f6c]" />
              <span className="size-[5px] rounded-full bg-[#ffd34e]" />
              <span className="size-[5px] rounded-full bg-[#37a9df]" />
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="group/section overflow-hidden rounded-[26px] border border-[#34305c]/[0.07] bg-white shadow-[0_22px_65px_-45px_rgba(52,48,92,.32)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_75px_-42px_rgba(52,48,92,.38)]">
            <div className="kids-table-scroll overflow-x-auto">
              {children}
            </div>
          </div>

          {/* DYNAMIC DESCRIPTION / NOTE */}
          {descriptionText && (
            <div
              className="mt-6 flex items-start gap-3 rounded-[18px] border px-5 py-4"
              style={{
                borderColor: `${color}26`,
                backgroundColor: lightColor,
              }}
            >
              <div
                className="mt-[9px] size-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />

              <p className="text-[13px] leading-6 text-[#666274]">
                <strong className="text-[#34305c]">Note:</strong>{" "}
                {descriptionText}
              </p>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/* =========================================================
   STANDARD INFORMATION TABLE
========================================================= */

function StandardTable({ headings, rows, color }: { headings: string[]; rows: string[][]; color: string }) {
  return (
    <table className="w-full min-w-[760px] border-collapse text-left">
      <thead><tr style={{ backgroundColor: color }}>
        {headings.map((heading, index) => <th key={heading} className={`${index === 0 ? "w-[85px]" : ""} border-r border-white/25 px-5 py-4 text-[11px] font-extrabold uppercase tracking-[.12em] text-white last:border-r-0`}>{heading}</th>)}
      </tr></thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row[0]}-${index}`} className="group border-b border-[#34305c]/[0.065] last:border-b-0 transition-colors duration-300 hover:bg-[#fffaf4]">
            <td className="border-r border-[#34305c]/[0.065] px-5 py-[18px] align-top"><span className="flex size-7 items-center justify-center rounded-lg text-[10px] font-extrabold transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" style={{ color, backgroundColor: `${color}12` }}>{index + 1}</span></td>
            {row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`} className="whitespace-pre-line border-r border-[#34305c]/[0.065] px-5 py-[18px] align-top text-[13px] font-medium leading-6 text-[#666274] last:border-r-0 first:font-semibold first:text-[#555166]">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function DocumentTable({ rows, color }: { rows: DisclosureRow[]; color: string }) {
  return (
    <table className="w-full min-w-[800px] border-collapse text-left">
      <thead><tr style={{ backgroundColor: color }}>
        <th className="w-[85px] border-r border-white/25 px-5 py-4 text-[11px] font-extrabold uppercase tracking-[.12em] text-white">S.No.</th>
        <th className="border-r border-white/25 px-5 py-4 text-[11px] font-extrabold uppercase tracking-[.12em] text-white">Documents/Information</th>
        <th className="w-[190px] px-5 py-4 text-[11px] font-extrabold uppercase tracking-[.12em] text-white">Upload Documents</th>
      </tr></thead>
      <tbody>
        {rows.map((row, index) => {
          const url = documentUrl(row);
          return <tr key={`${row.information}-${index}`} className="group border-b border-[#34305c]/[0.065] last:border-b-0 transition-colors duration-300 hover:bg-[#fffaf4]">
            <td className="border-r border-[#34305c]/[0.065] px-5 py-[17px] align-top"><span className="flex size-7 items-center justify-center rounded-lg text-[10px] font-extrabold" style={{ color, backgroundColor: `${color}12` }}>{index + 1}</span></td>
            <td className="border-r border-[#34305c]/[0.065] px-5 py-[17px] text-[12px] font-semibold leading-6 text-[#555166] sm:text-[13px]">{row.information}</td>
            <td className="px-5 py-[17px]">{url ? <a href={url} target="_blank" rel="noreferrer" className="group/link inline-flex items-center gap-2 whitespace-nowrap text-[12px] font-bold transition-all duration-300 hover:-translate-y-0.5 hover:gap-3 sm:text-[13px]" style={{ color }}>{row.link_label || "Click here to access"}<ExternalLink size={14} /></a> : <span className="text-[12px] font-semibold text-[#8c8998]">Not uploaded</span>}</td>
          </tr>;
        })}
      </tbody>
    </table>
  );
}
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
      className={`pointer-events-none absolute size-3 rounded-full opacity-40 ${className}`}
      style={{
        backgroundColor: color,
        animation: `disclosureFloat 5s ease-in-out ${delay} infinite`,
      }}
      aria-hidden="true"
    />
  );
}

/* =========================================================
   ANIMATED DISCLOSURE DOODLES
========================================================= */

function DisclosureDoodle({
  index,
  motion,
  className,
  delay,
}: {
  index: 0 | 1 | 2;
  motion: "orbit" | "sway" | "hop";
  className: string;
  delay: string;
}) {
  const animations = {
    orbit: "disclosureDoodleOrbit 7s ease-in-out infinite",
    sway: "disclosureDoodleSway 5.8s ease-in-out infinite",
    hop: "disclosureDoodleHop 6.4s ease-in-out infinite",
  };

  return (
    <span
      className={`disclosure-doodle pointer-events-none absolute z-0 hidden overflow-hidden opacity-[0.96] xl:block ${className}`}
      style={{ animation: `${animations[motion]} ${delay}` }}
      aria-hidden="true"
    >
      <img
        src="/images/kids/disclosure-doodles.png"
        alt=""
        className="absolute top-0 h-full max-w-none"
        style={{ left: `${index * -100}%`, width: "300%" }}
      />
    </span>
  );
}

/* =========================================================
   UNDERLINE
========================================================= */

function Underline() {
  return (
    <svg
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      className="absolute -bottom-3 left-0 h-3 w-full text-[#ef5f6c]"
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