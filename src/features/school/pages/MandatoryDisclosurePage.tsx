import {
  Building2,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Info,
  School,
  UsersRound,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PageBanner } from "../../../components/PageBanner";
import { schoolApi } from "../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../utils/pageSeo";


/* =========================================================
   TYPES
========================================================= */

type GeneralRow = {
  sno: string;
  information: string;
  details: string;
};

type DocumentRow = {
  sno: string;
  information: string;
  link?: string;
  linkLabel?: string;
};

type StaffRow = {
  sno: string;
  information: string;
  strength: string;
  details: string;
  link?: string;
};

type InfrastructureRow = {
  sno: string;
  information: string;
  details: string;
  link?: string;
};


/* =========================================================
   DATA
   Replace these arrays with API response later.
========================================================= */

type DisclosureApiRow = {
  information?: string;
  details?: string;
  number_strength?: string;
  name_qualifications?: string;
  link_label?: string;
  link_url?: string;
  document_path?: string;
  document_path_url?: string | null;
};

type DisclosureSettings = {
  rows?: DisclosureApiRow[];
};

type DisclosureApiSection = {
  type: string;
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: DisclosureSettings | [];
};

type MandatoryDisclosurePageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: DisclosureApiSection[];
};

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

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

function sectionTitle(title: string | undefined, fallback: string) {
  return title?.replace(/^[A-E]:\s*/i, "").replace(/:\s*$/, "").trim() || fallback;
}

function rowLink(row: DisclosureApiRow) {
  if (row.document_path) return `${storageBaseUrl}${row.document_path.replace(/^\/+/, "")}`;
  if (row.document_path_url && !row.document_path_url.includes("localhost")) {
    return row.document_path_url;
  }
  return row.link_url || undefined;
}

function sectionRows(section?: DisclosureApiSection) {
  return section?.settings && !Array.isArray(section.settings)
    ? section.settings.rows || []
    : [];
}
const generalInformation: GeneralRow[] = [
  {
    sno: "1",
    information: "NAME OF THE SCHOOL",
    details: "Paragon Senior Secondary School",
  },
  {
    sno: "2",
    information: "AFFILIATION NO.(IF APPLICABLE)",
    details: "1630692",
  },
  {
    sno: "3",
    information: "SCHOOL CODE (IF APPLICABLE)",
    details: "20672",
  },
  {
    sno: "4",
    information: "COMPLETE ADDRESS WITH PIN CODE",
    details: "Site-1, Sector-71, Mohali Pin-Code-160071",
  },
  {
    sno: "5",
    information: "PRINCIPAL NAME & QUALIFICATION",
    details: "Jasmeet Kaur (M.Com, B.Ed.)",
  },
  {
    sno: "6",
    information: "SCHOOL EMAIL ID",
    details: "principalparagon2012@gmail.com",
  },
  {
    sno: "7",
    information: "CONTACT DETAILS (LANDLINE/MOBILE)",
    details: "9855953220",
  },
];


const documentsInformation: DocumentRow[] = [
  {
    sno: "1",
    information:
      "COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION, IF ANY",
    link: "#",
  },
  {
    sno: "2",
    information:
      "COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE, AS APPLICABLE",
    link: "#",
  },
  {
    sno: "3",
    information:
      "COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT",
    link: "#",
  },
  {
    sno: "4",
    information:
      "COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT'S RENEWAL IF APPLICABLE",
    link: "#",
  },
  {
    sno: "5",
    information:
      "COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE",
    link: "#",
  },
  {
    sno: "6",
    information:
      "COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY",
    link: "#",
  },
  {
    sno: "7",
    information:
      "COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION/UPGRADATION/EXTENSION OF AFFILIATION OR SELF CERTIFICATION BY SCHOOL",
    link: "#",
  },
  {
    sno: "8",
    information:
      "COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES",
    link: "#",
  },
  {
    sno: "9",
    information: "COPY OF VALID LAND CERTIFICATE",
    link: "#",
  },
  {
    sno: "10",
    information: "COPIES OF MANDATORY DISCLOSURE DETAILS SARAS 4.0",
    link: "#",
  },
];


const resultAcademics: DocumentRow[] = [
  {
    sno: "1",
    information: "FEE STRUCTURE OF THE SCHOOL",
    link: "#",
  },
  {
    sno: "2",
    information: "ANNUAL ACADEMIC CALENDER",
    link: "#",
  },
  {
    sno: "3",
    information: "LIST OF SCHOOL MANAGEMENT COMMITTEE (SMC)",
    link: "#",
  },
  {
    sno: "4",
    information: "LIST OF PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS",
    link: "#",
  },
  {
    sno: "5",
    information: "LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION (X)",
    link: "#",
  },
  {
    sno: "6",
    information: "LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION (XII)",
    link: "#",
  },
];


const staffInformation: StaffRow[] = [
  {
    sno: "1",
    information: "PRINCIPAL",
    strength: "1",
    details: "Mrs. Jasmeet Kaur\nM.Com., B.Ed.",
  },
  {
    sno: "2",
    information: "VICE PRINCIPAL",
    strength: "1",
    details: "Mrs. Amarpal Kaur\nM.A., B.Ed.",
  },
  {
    sno: "3",
    information: "HEADMISTRESS/HEADMASTER",
    strength: "N.A",
    details: "N.A.",
  },
  {
    sno: "4",
    information: "TOTAL NO. OF TEACHERS",
    strength: "70",
    details: "View This",
    link: "#",
  },
  {
    sno: "",
    information: "• PGT",
    strength: "19",
    details: "View This",
    link: "#",
  },
  {
    sno: "",
    information: "• TGT",
    strength: "15",
    details: "View This",
    link: "#",
  },
  {
    sno: "",
    information: "• PRT",
    strength: "16",
    details: "View This",
    link: "#",
  },
  {
    sno: "5",
    information: "TEACHERS SECTION RATIO",
    strength: "1.5:1",
    details: "1.5:1",
  },
  {
    sno: "6",
    information: "DETAILS OF SPECIAL EDUCATOR",
    strength: "1",
    details: "Ms. Khushboo (B.Ed.)",
  },
  {
    sno: "7",
    information: "DETAILS OF COUNSELLOR & WELLNESS TEACHER",
    strength: "1",
    details: "Ms. Ruchi Chandan\nM.A. (Psychology), B.Ed.",
  },
];


const infrastructureInformation: InfrastructureRow[] = [
  {
    sno: "1",
    information: "TOTAL CAMPUS AREA OF THE SCHOOL (IN SQUARE MTR)",
    details: "4738",
  },
  {
    sno: "2",
    information: "NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)",
    details: "45*37",
  },
  {
    sno: "3",
    information:
      "NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)",
    details: "5*74",
  },
  {
    sno: "4",
    information: "NO. AND SIZE OF LIBRARY (IN SQ MTR)",
    details: "115.19",
  },
  {
    sno: "5",
    information: "INTERNET FACILITY (Y/N)",
    details: "Yes",
  },
  {
    sno: "6",
    information: "NO. OF GIRLS TOILETS",
    details: "20",
  },
  {
    sno: "7",
    information: "NO. OF BOYS TOILETS",
    details: "20",
  },
  {
    sno: "8",
    information: "NO. OF CWSN TOILETS",
    details: "02",
  },
  {
    sno: "9",
    information:
      "LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING THE INFRASTRUCTURE OF THE SCHOOL",
    details: "Click",
    link: "#",
  },
];


/* =========================================================
   PAGE
========================================================= */

export function MandatoryDisclosurePage() {
  const { data: disclosurePage } = useQuery({
    queryKey: ["school-page", "mandatory-disclosure-information"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: MandatoryDisclosurePageData }>(
        "pages/mandatory-disclosure-information",
      );
      return response.data.data;
    },
  });

  const findSection = (type: string) =>
    disclosurePage?.sections.find((section) => section.type === type && section.is_active);
  const banner = findSection("home_banner");
  const generalSection = findSection("mandatory_disclosure_general");
  const documentsSection = findSection("mandatory_disclosure_documents");
  const academicsSection = findSection("mandatory_disclosure_result_academics");
  const staffSection = findSection("mandatory_disclosure_staff");
  const infrastructureSection = findSection("mandatory_disclosure_infrastructure");

  const apiGeneral: GeneralRow[] = sectionRows(generalSection).map((row, index) => ({
    sno: String(index + 1),
    information: row.information || "",
    details: row.details || "",
  }));
  const mapDocuments = (section?: DisclosureApiSection): DocumentRow[] =>
    sectionRows(section).map((row, index) => ({
      sno: String(index + 1),
      information: row.information || "",
      link: rowLink(row),
      linkLabel: row.link_label || "Click here to access",
    }));
  const apiDocuments = mapDocuments(documentsSection);
  const apiAcademics = mapDocuments(academicsSection);
  const apiStaff: StaffRow[] = sectionRows(staffSection).map((row, index) => ({
    sno: row.information?.trim().startsWith("-") ? "" : String(index + 1),
    information: row.information?.replace(/^-\s*/, "• ") || "",
    strength: row.number_strength || "",
    details: row.name_qualifications || row.link_label || row.details || "",
    link: rowLink(row),
  }));
  const apiInfrastructure: InfrastructureRow[] = sectionRows(infrastructureSection).map(
    (row, index) => ({
      sno: String(index + 1),
      information: row.information || "",
      details: row.details || row.link_label || "",
      link: rowLink(row),
    }),
  );

  const displayedGeneral = apiGeneral.length ? apiGeneral : generalInformation;
  const displayedDocuments = apiDocuments.length ? apiDocuments : documentsInformation;
  const displayedAcademics = apiAcademics.length ? apiAcademics : resultAcademics;
  const displayedStaff = apiStaff.length ? apiStaff : staffInformation;
  const displayedInfrastructure = apiInfrastructure.length
    ? apiInfrastructure
    : infrastructureInformation;

  useEffect(() => {
    applyPageSeo(disclosurePage?.seo);
  }, [disclosurePage]);

  return (
    <>
      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={banner?.title || disclosurePage?.title || "Mandatory Disclosure Information"}
        description={plainText(banner?.description) || "Access the school's required public disclosure information."}
      />

      <main className="overflow-hidden bg-[#fbfaf7]">

        {/* =====================================================
            A. GENERAL INFORMATION
        ====================================================== */}

        <DisclosureSection
          letter="A"
          title={sectionTitle(generalSection?.title, "General Information")}
          icon={School}
          background="light"
        >
          <TableWrapper>
            <table className="w-full min-w-[800px] border-collapse">
              <DisclosureTableHead
                columns={[
                  { title: "S.No.", width: "w-[90px]" },
                  { title: "Information", width: "w-[43%]" },
                  { title: "Details" },
                ]}
              />

              <tbody>
                {displayedGeneral.map((row) => (
                  <DisclosureRow key={row.sno}>
                    <SerialCell>{row.sno}</SerialCell>

                    <InformationCell>
                      {row.information}
                    </InformationCell>

                    <DetailCell>
                      {row.details}
                    </DetailCell>
                  </DisclosureRow>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </DisclosureSection>


        {/* =====================================================
            B. DOCUMENTS AND INFORMATION
        ====================================================== */}

        <DisclosureSection
          letter="B"
          title={sectionTitle(documentsSection?.title, "Documents and Information")}
          icon={FileText}
          background="muted"
        >
          <TableWrapper>
            <table className="w-full min-w-[900px] border-collapse">

              <DisclosureTableHead
                columns={[
                  { title: "S.No.", width: "w-[90px]" },
                  {
                    title: "Documents / Information",
                  },
                  {
                    title: "Upload Documents",
                    width: "w-[190px]",
                  },
                ]}
              />

              <tbody>
                {displayedDocuments.map((row) => (
                  <DisclosureRow key={row.sno}>

                    <SerialCell>
                      {row.sno}
                    </SerialCell>

                    <InformationCell>
                      {row.information}
                    </InformationCell>

                    <td className="px-5 py-4 align-middle sm:px-6">
                      <DocumentLink href={row.link}>
                        {row.linkLabel || "Click here to access"}
                      </DocumentLink>
                    </td>

                  </DisclosureRow>
                ))}
              </tbody>

            </table>
          </TableWrapper>


          {/* NOTE */}

          <div
            className="
              mt-5
              flex
              items-start
              gap-4
              rounded-2xl
              border
              border-gold/15
              bg-cream/60
              px-5
              py-4
              sm:px-6
            "
          >
            <div
              className="
                grid
                size-9
                shrink-0
                place-items-center
                rounded-lg
                bg-white
                text-gold-dark
                shadow-sm
              "
            >
              <Info
                size={17}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>

            <p className="pt-1 text-sm leading-6 text-slate-600">
              <strong className="font-semibold text-navy">
                Note:
              </strong>{" "}
              The schools needs to upload the self attested copies of above
              listed document by chairman/manager/secretary and principal. In
              case, it is noticed at later stage that uploaded documents are
              not genuine then school shall be liable for action as per norms.
            </p>
          </div>

        </DisclosureSection>


        {/* =====================================================
            C. RESULT AND ACADEMICS
        ====================================================== */}

        <DisclosureSection
          letter="C"
          title={sectionTitle(academicsSection?.title, "Result and Academics")}
          icon={GraduationCap}
          background="light"
        >
          <TableWrapper>

            <table className="w-full min-w-[850px] border-collapse">

              <DisclosureTableHead
                columns={[
                  { title: "S.No.", width: "w-[90px]" },
                  {
                    title: "Documents / Information",
                  },
                  {
                    title: "Upload Documents",
                    width: "w-[200px]",
                  },
                ]}
              />

              <tbody>
                {displayedAcademics.map((row) => (
                  <DisclosureRow key={row.sno}>

                    <SerialCell>
                      {row.sno}
                    </SerialCell>

                    <InformationCell>
                      {row.information}
                    </InformationCell>

                    <td className="px-5 py-4 sm:px-6">
                      <DocumentLink href={row.link}>
                        {row.linkLabel || "Click here to access"}
                      </DocumentLink>
                    </td>

                  </DisclosureRow>
                ))}
              </tbody>

            </table>

          </TableWrapper>
        </DisclosureSection>


        {/* =====================================================
            D. STAFF
        ====================================================== */}

        <DisclosureSection
          letter="D"
          title={sectionTitle(staffSection?.title, "Staff (Teaching)")}
          icon={UsersRound}
          background="muted"
        >
          <TableWrapper>

            <table className="w-full min-w-[950px] border-collapse">

              <DisclosureTableHead
                columns={[
                  { title: "S.No.", width: "w-[90px]" },
                  {
                    title: "Information",
                    width: "w-[43%]",
                  },
                  {
                    title: "Number / Strength",
                    width: "w-[190px]",
                  },
                  {
                    title: "Name and Qualifications",
                    width: "w-[28%]",
                  },
                ]}
              />

              <tbody>
                {displayedStaff.map((row, index) => (
                  <DisclosureRow
                    key={`${row.information}-${index}`}
                  >

                    <SerialCell>
                      {row.sno}
                    </SerialCell>

                    <InformationCell>
                      {row.information}
                    </InformationCell>

                    <DetailCell>
                      {row.strength}
                    </DetailCell>

                    <td className="px-5 py-4 sm:px-6">

                      {row.link ? (
                        <DocumentLink href={row.link}>
                          {row.details}
                        </DocumentLink>
                      ) : (
                        <span className="whitespace-pre-line text-sm leading-6 text-slate-600">
                          {row.details}
                        </span>
                      )}

                    </td>

                  </DisclosureRow>
                ))}
              </tbody>

            </table>

          </TableWrapper>
        </DisclosureSection>


        {/* =====================================================
            E. SCHOOL INFRASTRUCTURE
        ====================================================== */}

        <DisclosureSection
          letter="E"
          title={sectionTitle(infrastructureSection?.title, "School Infrastructure")}
          icon={Building2}
          background="light"
        >
          <TableWrapper>

            <table className="w-full min-w-[850px] border-collapse">

              <DisclosureTableHead
                columns={[
                  { title: "S.No.", width: "w-[90px]" },
                  {
                    title: "Information",
                  },
                  {
                    title: "Details",
                    width: "w-[200px]",
                  },
                ]}
              />

              <tbody>
                {displayedInfrastructure.map((row) => (
                  <DisclosureRow key={row.sno}>

                    <SerialCell>
                      {row.sno}
                    </SerialCell>

                    <InformationCell>
                      {row.information}
                    </InformationCell>

                    <td className="px-5 py-4 sm:px-6">

                      {row.link ? (
                        <DocumentLink href={row.link}>
                          {row.details}
                        </DocumentLink>
                      ) : (
                        <span className="text-sm leading-6 text-slate-600">
                          {row.details}
                        </span>
                      )}

                    </td>

                  </DisclosureRow>
                ))}
              </tbody>

            </table>

          </TableWrapper>
        </DisclosureSection>

      </main>
    </>
  );
}


/* =========================================================
   SECTION
========================================================= */

type DisclosureSectionProps = {
  letter: string;
  title: string;
  icon: LucideIcon;
  background: "light" | "muted";
  children: React.ReactNode;
};


function DisclosureSection({
  letter,
  title,
  icon: Icon,
  background,
  children,
}: DisclosureSectionProps) {
  return (
    <section
      className={[
        "relative overflow-hidden py-12 sm:py-14 lg:py-16",
        background === "muted"
          ? "border-y border-navy/10 bg-[#f2f5f6]"
          : "bg-[#fbfaf7]",
      ].join(" ")}
    >

      {/* Decorative ring */}

      <div
        className="
          pointer-events-none
          absolute
          -right-28
          -top-28
          size-72
          rounded-full
          border-[38px]
          border-gold/[.035]
        "
        aria-hidden="true"
      />

      <div className="container relative">

        {/* =================================================
            SECTION HEADING
        ================================================== */}

        <div className="mb-7 flex items-center gap-4 sm:mb-8">

          {/* Section Number */}

          <div
            className="
              grid
              size-12
              shrink-0
              place-items-center
              rounded-xl
              bg-navy
              text-gold
              shadow-lg
              shadow-navy/10
            "
          >
            <Icon
              size={20}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>


          <div>

            <div className="flex items-center gap-2">

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-gold-dark
                "
              >
                {letter}.
              </span>

              <h2 className="font-serif text-2xl leading-tight text-navy sm:text-3xl">
                {title}
              </h2>

            </div>

            <div
              className="mt-3 h-[2px] w-10 rounded-full bg-gold"
              aria-hidden="true"
            />

          </div>

        </div>


        {children}

      </div>

    </section>
  );
}


/* =========================================================
   TABLE WRAPPER
========================================================= */

function TableWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200
        bg-white
        shadow-[0_18px_55px_-38px_rgba(16,42,67,0.35)]
      "
    >
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}


/* =========================================================
   TABLE HEADER
========================================================= */

type TableColumn = {
  title: string;
  width?: string;
};


function DisclosureTableHead({
  columns,
}: {
  columns: TableColumn[];
}) {
  return (
    <thead>

      <tr className="bg-navy">

        {columns.map((column) => (
          <th
            key={column.title}
            scope="col"
            className={[
              column.width ?? "",
              `
                border-r
                border-white/10
                px-5
                py-4
                text-left
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-white/80
                last:border-r-0
                sm:px-6
              `,
            ].join(" ")}
          >
            {column.title}
          </th>
        ))}

      </tr>

    </thead>
  );
}


/* =========================================================
   TABLE ROW
========================================================= */

function DisclosureRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <tr
      className="
        border-b
        border-slate-100
        transition-colors
        duration-200
        last:border-b-0
        hover:bg-[#fbfaf7]
      "
    >
      {children}
    </tr>
  );
}


/* =========================================================
   SERIAL CELL
========================================================= */

function SerialCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-5 py-4 align-middle sm:px-6">

      <span
        className="
          inline-flex
          min-w-7
          items-center
          justify-center
          rounded-lg
          bg-navy/[.055]
          px-2
          py-1
          text-xs
          font-semibold
          text-navy
        "
      >
        {children}
      </span>

    </td>
  );
}


/* =========================================================
   INFORMATION CELL
========================================================= */

function InformationCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td
      className="
        px-5
        py-4
        text-xs
        font-medium
        uppercase
        leading-5
        tracking-[0.045em]
        text-slate-600
        sm:px-6
      "
    >
      {children}
    </td>
  );
}


/* =========================================================
   DETAIL CELL
========================================================= */

function DetailCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-5 py-4 sm:px-6">

      <span className="whitespace-pre-line text-sm leading-6 text-slate-600">
        {children}
      </span>

    </td>
  );
}


/* =========================================================
   DOCUMENT LINK
========================================================= */

function DocumentLink({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const baseClass =
    "group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold";

  if (!href || href === "#") {
    return (
      <span
        className={`${baseClass} cursor-not-allowed bg-slate-100 text-slate-400`}
        title="Document has not been uploaded yet"
      >
        <FileCheck2 size={14} strokeWidth={1.9} aria-hidden="true" />
        <span>{children}</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${baseClass} bg-gold/10 text-gold-dark transition duration-200 hover:bg-gold-dark hover:text-white`}
    >
      <FileCheck2 size={14} strokeWidth={1.9} aria-hidden="true" />
      <span>{children}</span>
      <ExternalLink
        size={12}
        className="opacity-60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
}


