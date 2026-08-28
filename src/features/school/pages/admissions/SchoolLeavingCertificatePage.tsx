import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  ScrollText,
} from "lucide-react";
import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type CertificateCard = {
  title?: string;
  pdf?: string;
};

type CertificateSettings = {
  cards?: CertificateCard[];
};

type CertificateSection = {
  type: string;
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: CertificateSettings | [];
};

type CertificatePageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: CertificateSection[];
};

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(path?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path) && !path.includes("localhost")) return path;
  return `${storageBaseUrl}${path.replace(/^\/+/, "")}`;
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

const fallbackCertificates: CertificateCard[] = Array.from(
  { length: 4 },
  (_, index) => ({
    title: `Certificate Document ${String(index + 1).padStart(2, "0")}`,
  }),
);

export function SchoolLeavingCertificatePage() {
  const { data: certificatePage } = useQuery({
    queryKey: ["school-page", "school-leaving-certificate"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: CertificatePageData }>(
        "pages/school-leaving-certificate",
      );
      return response.data.data;
    },
  });

  const banner = certificatePage?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const withdrawal = certificatePage?.sections.find(
    (section) =>
      section.type === "school_leaving_certificate_withdrawal_process" &&
      section.is_active,
  );
  const transfer = certificatePage?.sections.find(
    (section) =>
      section.type === "school_leaving_certificate_transfer_certificate" &&
      section.is_active,
  );
  const withdrawalSettings =
    withdrawal?.settings && !Array.isArray(withdrawal.settings)
      ? withdrawal.settings
      : undefined;
  const certificates = withdrawalSettings?.cards?.length
    ? withdrawalSettings.cards
    : fallbackCertificates;

  useEffect(() => {
    applyPageSeo(certificatePage?.seo);
  }, [certificatePage]);

  return (
    <>
      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={
          banner?.title ||
          certificatePage?.title ||
          "School Leaving Certificate (SLC)"
        }
        description={
          plainText(banner?.description) ||
          "Admission withdrawal process and transfer certificate information."
        }
      />

      <main className="overflow-hidden bg-[#fcfbf8]">
        <section className="container py-18 sm:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:p-12">
            <div
              className="absolute -right-24 -top-28 size-80 rounded-full border-[40px] border-cream"
              aria-hidden="true"
            />
            <div className="relative max-w-4xl">
              <div className="grid size-13 place-items-center rounded-2xl bg-cream text-gold-dark">
                <ScrollText size={25} />
              </div>
              <h2 className="mt-7 font-serif text-4xl leading-tight text-navy">
                {withdrawal?.title || "Admission Withdrawal Process"}
              </h2>
              {withdrawal?.description ? (
                <div
                  className="mt-6 text-base leading-8 text-slate-600 [&_strong]:font-semibold [&_strong]:text-navy"
                  dangerouslySetInnerHTML={{ __html: withdrawal.description }}
                />
              ) : (
                <p className="mt-6 text-base leading-8 text-slate-600">
                  Parents who wish to withdraw their children from school at the
                  end of the session must inform the school office in writing by
                  10th of March of the session. Parents who wish to withdraw
                  their children in the mid-session, must give at least one
                  calendar month&apos;s notice in writing, or pay one
                  month&apos;s fees, in lieu of notice.{" "}
                  <strong className="font-semibold text-navy">
                    Fees once paid will not be refunded.
                  </strong>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-navy/10 bg-[#f1f5f6] py-18 sm:py-24">
          <div className="container">
            <div className="mb-10 flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-xl bg-navy text-gold">
                <FileText size={23} />
              </div>
              <h2 className="font-serif text-3xl text-navy sm:text-4xl lg:text-5xl">
                {certificatePage?.title || "School Leaving Certificate"}
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
              {certificates.map((document, index) => (
                <CertificatePreview
                  key={document.pdf || `${document.title}-${index}`}
                  index={index + 1}
                  title={
                    document.title?.trim() ||
                    `Certificate Document ${String(index + 1).padStart(2, "0")}`
                  }
                  url={mediaUrl(document.pdf)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="container py-18 sm:py-24">
          <article className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white shadow-xl shadow-navy/15 sm:p-10 lg:p-12">
            <div
              className="absolute -bottom-24 -right-20 size-72 rounded-full border-[30px] border-white/5"
              aria-hidden="true"
            />
            <div className="relative grid gap-7 md:grid-cols-[auto_1fr] md:items-start">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/10 text-gold">
                <FileCheck2 size={28} />
              </div>
              <div>
                <h2 className="font-serif text-4xl text-white">
                  {transfer?.title || "Transfer Certificate"}
                </h2>
                {transfer?.description ? (
                  <div
                    className="mt-5 max-w-4xl leading-8 text-slate-300"
                    dangerouslySetInnerHTML={{ __html: transfer.description }}
                  />
                ) : (
                  <p className="mt-5 max-w-4xl leading-8 text-slate-300">
                    A transfer certificate can be issued only when a child is
                    withdrawn and ceases to attend school. Transfer Certificates
                    will not be handed over until all the dues are cleared.
                  </p>
                )}
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

function CertificatePreview({
  index,
  title,
  url,
}: {
  index: number;
  title: string;
  url?: string;
}) {
  return (
    <article className="group relative isolate flex min-h-[230px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(7,27,58,.38)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-30px_rgba(7,27,58,.32)] sm:p-7">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#c72c3b]" />
      <div
        className="pointer-events-none absolute -right-16 -top-16 -z-10 size-48 rounded-full border-[24px] border-[#c72c3b]/[0.045] transition duration-500 group-hover:scale-110"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-5">
        <div className="grid size-13 shrink-0 place-items-center rounded-2xl bg-navy text-white shadow-lg shadow-navy/10">
          <FileText size={25} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#c72c3b]/15 bg-[#c72c3b]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#c72c3b]">
            PDF Document
          </span>
          <span className="font-serif text-2xl text-navy/15">
            {String(index).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="mt-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c72c3b]">
          School Leaving Certificate
        </p>
        <h3 className="mt-2 max-w-md font-serif text-2xl leading-tight text-navy sm:text-[28px]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Open the official document to view, print or save a copy.
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
        {url ? (
          <>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c72c3b] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#aa2230]"
            >
              Open PDF
              <ExternalLink size={15} aria-hidden="true" />
            </a>
            {/* <a
              href={url}
              download
              aria-label={`Download ${title}`}
              className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-navy transition hover:border-navy hover:bg-navy hover:text-white"
            >
              <Download size={17} aria-hidden="true" />
            </a> */}
          </>
        ) : (
          <span className="rounded-xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-500">
            Document unavailable
          </span>
        )}
      </div>
    </article>
  );
}
