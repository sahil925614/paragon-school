import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  ExternalLink,
  FileText,
  ShieldCheck,
  Shirt,
} from "lucide-react";

import { PageBanner } from "../../../components/PageBanner";
import { schoolApi } from "../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../utils/pageSeo";

type UniformSection = {
  type: string;
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
};

type UniformPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: UniformSection[];
};

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(
  image?: string | null,
  imageUrl?: string | null
) {
  if (image) {
    return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  }

  if (imageUrl && !imageUrl.includes("localhost")) {
    return imageUrl;
  }

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

export function SchoolUniformPage() {
  const { data: uniformPage } = useQuery({
    queryKey: ["school-page", "school-uniform"],

    queryFn: async () => {
      const response = await schoolApi.get<{
        data: UniformPageData;
      }>("pages/school-uniform");

      return response.data.data;
    },
  });

  const banner = uniformPage?.sections.find(
    (section) =>
      section.type === "home_banner" &&
      section.is_active
  );

  const uniformContent = uniformPage?.sections.find(
    (section) =>
      section.type === "uniform_details_content" &&
      section.is_active
  );

  const uniformPdfUrl =
    mediaUrl(
      uniformContent?.image,
      uniformContent?.image_url
    ) || "/uniform-details.pdf";

  const uniformDocumentTitle =
    uniformContent?.title || "Uniform Details";

  const uniformDescription =
    plainText(uniformContent?.description) ||
    plainText(banner?.description) ||
    "View or download the official school uniform document for complete details.";

  useEffect(() => {
    applyPageSeo(uniformPage?.seo);
  }, [uniformPage]);

  return (
    <>
      {/* =====================================================
          PAGE BANNER
      ===================================================== */}

      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={
          banner?.title ||
          uniformPage?.title ||
          "Uniform Details"
        }
        description={
          plainText(banner?.description) ||
          "School Uniform"
        }
      />

      {/* =====================================================
          MAIN PAGE
      ===================================================== */}

      <main className="relative overflow-hidden bg-[#f7f8f8]">

  {/* =====================================================
      BACKGROUND DECORATIONS
  ===================================================== */}

  <div
    aria-hidden="true"
    className="
      pointer-events-none
      absolute
      -left-44
      top-20
      size-[420px]
      rounded-full
      border-[65px]
      border-gold/[.035]
    "
  />

  <div
    aria-hidden="true"
    className="
      pointer-events-none
      absolute
      -right-44
      bottom-20
      size-[420px]
      rounded-full
      bg-navy/[.025]
    "
  />

  {/* =====================================================
      DOCUMENT ACTION CARD
  ===================================================== */}

  <section className="container relative py-12 sm:py-14 lg:py-16">

    <div
      className="
        mx-auto
        max-w-6xl
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-[0_20px_60px_-42px_rgba(16,42,67,.4)]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          p-5
          sm:p-6
          md:flex-row
          md:items-center
          md:justify-between
          lg:px-7
        "
      >

        {/* FILE INFORMATION */}

        <div className="flex min-w-0 items-center gap-4">

          <div
            className="
              grid
              size-14
              shrink-0
              place-items-center
              rounded-2xl
              bg-[#eef2f5]
              text-navy
            "
          >
            <FileText
              size={25}
              strokeWidth={1.7}
            />
          </div>

          <div className="min-w-0">

            <p
              className="
                truncate
                font-serif
                text-xl
                leading-tight
                text-navy
                sm:text-2xl
              "
            >
              {uniformDocumentTitle}
            </p>

            <div
              className="
                mt-2
                flex
                flex-wrap
                items-center
                gap-2
                text-[10px]
                font-bold
                uppercase
                tracking-[.14em]
                text-slate-400
              "
            >
              <span>Official Document</span>

              <span className="size-1 rounded-full bg-slate-300" />

              <span>PDF</span>
            </div>

          </div>
        </div>


        {/* ACTION BUTTONS */}

        <div
          className="
            flex
            shrink-0
            flex-col
            gap-2.5
            sm:flex-row
          "
        >

          <a
            href={uniformPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-navy/15
              bg-white
              px-5
              text-sm
              font-bold
              text-navy
              transition-all
              duration-300
              hover:border-navy
              hover:bg-navy
              hover:text-white
            "
          >
            Open Document

            <ExternalLink
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </a>

          <a
            href={uniformPdfUrl}
            target="_blank"
            download
            className="
              group
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gold-dark
              px-5
              text-sm
              font-bold
              text-white
              shadow-[0_10px_25px_-15px_rgba(199,44,59,.7)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#ad2331]
            "
          >
            <Download
            
              size={16}
              className="
                transition-transform
                group-hover:translate-y-0.5
              "
            />

            Download PDF
          </a>

        </div>
      </div>


      {/* VERIFIED STRIP */}

      <div
        className="
          flex
          items-center
          gap-2.5
          border-t
          border-slate-100
          bg-[#fafbfb]
          px-5
          py-3
          text-xs
          leading-5
          text-slate-500
          sm:px-6
          lg:px-7
        "
      >
        <ShieldCheck
          size={16}
          strokeWidth={1.8}
          className="shrink-0 text-emerald-600"
        />

        <span>
          This document is provided directly through the school dashboard.
        </span>
      </div>

    </div>
  </section>


  {/* =====================================================
      PDF PREVIEW
  ===================================================== */}

  <section
    className="
      relative
      border-t
      border-slate-200
      bg-[#eef1f3]
      py-12
      sm:py-14
      lg:py-16
    "
  >
    <div className="container">

      <div className="mx-auto max-w-6xl">

        {/* SECTION HEADING */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >

          <div>
            <p
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[.2em]
                text-gold-dark
              "
            >
              Document Preview
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-2xl
                text-navy
                sm:text-3xl
              "
            >
              View the uniform document
            </h2>
          </div>


          <a
            href={uniformPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              inline-flex
              w-fit
              items-center
              gap-2
              text-xs
              font-bold
              text-navy
              transition
              hover:text-gold-dark
            "
          >
            View full screen

            <ExternalLink
              size={14}
              className="
                transition-transform
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </a>

        </div>


        {/* =================================================
            PDF VIEWER
        ================================================= */}

        <article
          className="
            overflow-hidden
            rounded-[26px]
            border
            border-slate-200
            bg-white
            shadow-[0_28px_75px_-48px_rgba(16,42,67,.55)]
          "
        >

          {/* DOCUMENT BAR */}

          <div
            className="
              flex
              min-h-[58px]
              items-center
              justify-between
              gap-4
              border-b
              border-slate-200
              bg-white
              px-4
              sm:px-5
            "
          >

            <div className="flex min-w-0 items-center gap-3">

              <div
                className="
                  grid
                  size-8
                  shrink-0
                  place-items-center
                  rounded-lg
                  bg-gold/10
                  text-gold-dark
                "
              >
                <FileText
                  size={15}
                  strokeWidth={1.8}
                />
              </div>

              <p
                className="
                  truncate
                  text-xs
                  font-bold
                  text-navy
                  sm:text-sm
                "
              >
                {uniformDocumentTitle}
              </p>

            </div>


            <a
              href={uniformPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open uniform document in a new tab"
              className="
                grid
                size-9
                shrink-0
                place-items-center
                rounded-lg
                border
                border-slate-200
                text-slate-500
                transition
                hover:border-navy
                hover:bg-navy
                hover:text-white
              "
            >
              <ExternalLink size={15} />
            </a>

          </div>


          {/* PDF */}

          <div className="relative bg-[#dfe4e7] p-2 sm:p-3">

            <div
              className="
                overflow-hidden
                rounded-[16px]
                bg-white
              "
            >

              <iframe
                src={`${uniformPdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                title={`${uniformDocumentTitle} PDF preview`}
                className="
                  h-[500px]
                  w-full
                  bg-white
                  sm:h-[650px]
                  md:h-[740px]
                  lg:h-[820px]
                "
              />

            </div>

          </div>

        </article>


        {/* MOBILE DOWNLOAD */}

        <a
          href={uniformPdfUrl}
          target="_blank"
          download
          className="
            mt-5
            flex
            min-h-13
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-navy
            px-5
            text-sm
            font-bold
            text-white
            transition
            hover:bg-[#123e67]
            sm:hidden
          "
        >
          <Download size={17} />

          Download Uniform PDF
        </a>

      </div>
    </div>
  </section>

</main>
    </>
  );
}