import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Download, FileText, Shirt } from "lucide-react";
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

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(image?: string | null, imageUrl?: string | null) {
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

export function SchoolUniformPage() {
  const { data: uniformPage } = useQuery({
    queryKey: ["school-page", "school-uniform"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: UniformPageData }>("pages/school-uniform");
      return response.data.data;
    },
  });

  const banner = uniformPage?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const uniformContent = uniformPage?.sections.find(
    (section) => section.type === "uniform_details_content" && section.is_active,
  );
  const uniformPdfUrl =
    mediaUrl(uniformContent?.image, uniformContent?.image_url) || "/uniform-details.pdf";
  const uniformDocumentTitle = uniformContent?.title || "Uniform Details";

  useEffect(() => {
    applyPageSeo(uniformPage?.seo);
  }, [uniformPage]);

  return (
    <>
      <PageBanner
        title={banner?.title || uniformPage?.title || "Uniform Details"}
        description={plainText(banner?.description) || "School Uniform"}
      />

      <main className="relative isolate overflow-hidden bg-[#f4f7f8]">

        {/* =====================================================
            BACKGROUND DECORATIONS
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -left-[150px]
            top-[90px]
            -z-10
            size-[330px]
            rounded-full
            border-[42px]
            border-[#c72c3b]/[0.045]
            sm:size-[390px]
            lg:-left-[210px]
            lg:size-[520px]
            lg:border-[58px]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-[170px]
            top-[22%]
            -z-10
            size-[360px]
            rounded-full
            bg-navy/[0.025]
            lg:-right-[230px]
            lg:size-[520px]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-[230px]
            -left-[180px]
            -z-10
            size-[420px]
            rounded-full
            border-[48px]
            border-navy/[0.025]
            lg:size-[560px]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-[180px]
            -right-[160px]
            -z-10
            size-[360px]
            rounded-full
            border-[44px]
            border-[#c72c3b]/[0.035]
            lg:size-[470px]
          "
          aria-hidden="true"
        />

        {/* Small decorative dots */}

        <span
          className="
            pointer-events-none
            absolute
            right-[8%]
            top-[11%]
            size-2
            rounded-full
            bg-[#c72c3b]/25
          "
          aria-hidden="true"
        />

        <span
          className="
            pointer-events-none
            absolute
            bottom-[13%]
            left-[8%]
            size-2
            rounded-full
            bg-navy/10
          "
          aria-hidden="true"
        />

        {/* =====================================================
            UNIFORM SECTION
        ====================================================== */}

        <section
          className="
            container
            relative
            py-14
            sm:py-18
            lg:py-22
          "
        >
          <div
            className="
              grid
              gap-10
              lg:grid-cols-[0.78fr_1.22fr]
              lg:items-center
              lg:gap-14
              xl:gap-20
            "
          >

            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <div className="relative">

              {/* Section icon */}

              <div
                className="
                  grid
                  size-14
                  place-items-center
                  rounded-2xl
                  border
                  border-[#c72c3b]/10
                  bg-[#c72c3b]/[0.07]
                  text-[#c72c3b]
                  shadow-sm
                "
              >
                <Shirt size={26} strokeWidth={1.8} />
              </div>

              {/* Label */}

              <p
                className="
                  mt-7
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#c72c3b]
                  sm:text-[11px]
                "
              >
                School Uniform
              </p>

              {/* Heading */}

              <h2
                className="
                  mt-3
                  max-w-lg
                  font-serif
                  text-4xl
                  leading-[1.12]
                  text-navy
                  sm:text-[44px]
                  lg:text-[48px]
                "
              >
                {uniformDocumentTitle}
              </h2>

              <div
                className="
                  mt-5
                  h-[2px]
                  w-11
                  rounded-full
                  bg-[#c72c3b]
                "
              />

              {/* Document card */}

              <div
                className="
                  mt-8
                  flex
                  items-center
                  gap-4
                  rounded-[18px]
                  border
                  border-slate-200/80
                  bg-white
                  p-4
                  shadow-[0_12px_35px_-28px_rgba(7,27,58,.35)]
                  sm:p-5
                "
              >
                <div
                  className="
                    grid
                    size-12
                    shrink-0
                    place-items-center
                    rounded-xl
                    bg-navy
                    text-white
                  "
                >
                  <FileText size={21} />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      font-semibold
                      text-navy
                    "
                  >
                    {uniformDocumentTitle}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.13em]
                      text-slate-400
                      sm:text-[11px]
                    "
                  >
                    PDF Document
                  </p>
                </div>
              </div>

              {/* Download button */}

              <a
                href={uniformPdfUrl}
                target="_blank"
                download
                className="
                  group
                  mt-4
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2.5
                  rounded-xl
                  bg-[#c72c3b]
                  px-5
                  py-4
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_12px_28px_-14px_rgba(199,44,59,.55)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#ad2331]
                  hover:shadow-[0_16px_32px_-14px_rgba(199,44,59,.65)]
                "
              >
                <Download
                  size={18}
                  
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-y-0.5
                  "
                />

                Download Uniform Details
              </a>

            </div>

            {/* =================================================
                DOCUMENT PREVIEW
            ================================================== */}

            <article
              className="
                relative
                overflow-hidden
                rounded-[22px]
                bg-navy
                p-3
                shadow-[0_24px_60px_-30px_rgba(7,27,58,.55)]
                sm:p-5
                lg:p-6
              "
            >

              {/* Background grid */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  opacity-30
                  [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)]
                  [background-size:30px_30px]
                "
                aria-hidden="true"
              />

              {/* Decorative circle inside navy card */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  size-56
                  rounded-full
                  border-[35px]
                  border-white/[0.025]
                "
                aria-hidden="true"
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  -left-20
                  size-52
                  rounded-full
                  border-[30px]
                  border-[#c72c3b]/10
                "
                aria-hidden="true"
              />

              {/* Paper */}

              <div
                className="
                  relative
                  mx-auto
                  max-w-2xl
                  bg-white
                  px-5
                  py-6
                  shadow-[0_18px_45px_rgba(0,0,0,.2)]
                  sm:px-8
                  sm:py-8
                  lg:px-10
                  lg:py-10
                "
              >

                {/* Paper header */}

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-slate-200
                    pb-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <img
                    src="/images/paragon-school-logo.webp"
                    alt="Paragon School"
                    className="
                      h-10
                      w-auto
                      self-start
                      object-contain
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-[#c72c3b]
                    "
                  >
                    {uniformDocumentTitle}
                  </span>
                </div>

                {/* Winter uniform */}

                <div className="mt-7">

                  <SectionHeading>
                    Winter Uniform
                  </SectionHeading>

                  <div
                    className="
                      mt-5
                      overflow-hidden
                      rounded-lg
                      border
                      border-slate-200
                      text-sm
                    "
                  >
                    <UniformRow
                      title="Boys"
                      items={[
                        "Yellow T-Shirt (Full Sleeves)",
                        "Navy Blue Tracksuit with Yellow Stripes",
                        "Blue Socks",
                        "Black Shoes",
                        "Navy Blue Patka (Keshdhari Boys)",
                      ]}
                    />

                    <UniformRow
                      title="Girls"
                      items={[
                        "Pink T-Shirt (Full Sleeves)",
                        "Navy Blue Tracksuit with Pink Stripes",
                        "Blue Socks",
                        "Black Shoes",
                        "Navy Blue Rubber Bands / Ribbons",
                      ]}
                    />
                  </div>

                </div>

                {/* House uniform */}

                <div className="mt-8">

                  <SectionHeading>
                    House Uniform (Summer & Winter)
                  </SectionHeading>

                  <div
                    className="
                      mt-5
                      flex
                      flex-col
                      gap-2
                      rounded-lg
                      border
                      border-slate-200
                      bg-[#f7f9fa]
                      px-4
                      py-4
                      text-sm
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <span className="font-semibold text-navy">
                      House Uniform Days
                    </span>

                    <span
                      className="
                        font-bold
                        text-[#c72c3b]
                      "
                    >
                      Mondays & Tuesdays
                    </span>
                  </div>

                </div>

              </div>

            </article>

          </div>
        </section>

      </main>
    </>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">

      <span
        className="
          h-7
          w-[3px]
          rounded-full
          bg-[#c72c3b]
        "
      />

      <h3
        className="
          font-serif
          text-xl
          leading-tight
          text-navy
          sm:text-2xl
        "
      >
        {children}
      </h3>

    </div>
  );
}

/* =========================================================
   UNIFORM ROW
========================================================= */

function UniformRow({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div
      className="
        grid
        border-b
        border-slate-200
        last:border-b-0
        sm:grid-cols-[8rem_1fr]
      "
    >

      <div
        className="
          border-b
          border-slate-200
          bg-[#f5f7f8]
          px-4
          py-4
          font-semibold
          text-navy
          sm:border-b-0
          sm:border-r
        "
      >
        {title}
      </div>

      <ul
        className="
          space-y-2
          px-4
          py-4
          text-[13px]
          leading-5
          text-slate-600
          sm:text-sm
        "
      >
        {items.map((item) => (
          <li
            key={item}
            className="
              relative
              pl-4
              before:absolute
              before:left-0
              before:top-[8px]
              before:size-1.5
              before:rounded-full
              before:bg-[#c72c3b]/70
            "
          >
            {item}
          </li>
        ))}
      </ul>

    </div>
  );
}

