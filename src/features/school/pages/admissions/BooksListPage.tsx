import {
  BookOpenCheck,
  Download,
  FileText,
  GraduationCap,
  Info,
  Search,
  ShieldCheck,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type BooksSection = {
  type: string;
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
};

type BooksPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: BooksSection[];
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

const classLevels = [
  "Class III–V",
  "Class VI–VIII",
  "Class IX–X",
  "Class XI–XII",
];

export function BooksListPage() {
  const { data: booksPage } = useQuery({
    queryKey: ["school-page", "list-of-books"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: BooksPageData }>("pages/list-of-books");
      return response.data.data;
    },
  });

  const banner = booksPage?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const booksContent = booksPage?.sections.find(
    (section) => section.type === "list_of_books_content" && section.is_active,
  );
  const bookListUrl = mediaUrl(booksContent?.image, booksContent?.image_url) || "/book-list.pdf";

  useEffect(() => {
    applyPageSeo(booksPage?.seo);
  }, [booksPage]);

  return (
    <>
      <PageBanner
        title={banner?.title || booksPage?.title || "Books List"}
        description={plainText(banner?.description) || "Prescribed books and learning resources to begin the academic year with confidence."}
      />

      <main className="relative isolate overflow-hidden bg-[#f5f7f8]">

        {/* =====================================================
            BACKGROUND DECORATIONS
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -left-[190px]
            top-[60px]
            -z-10
            size-[390px]
            rounded-full
            border-[48px]
            border-[#c72c3b]/[0.04]
            sm:size-[450px]
            lg:-left-[250px]
            lg:size-[590px]
            lg:border-[62px]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-[180px]
            top-[280px]
            -z-10
            size-[360px]
            rounded-full
            bg-navy/[0.025]
            sm:size-[440px]
            lg:-right-[250px]
            lg:size-[560px]
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
            border-[50px]
            border-navy/[0.025]
            lg:size-[560px]
          "
          aria-hidden="true"
        />

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
            bottom-[17%]
            left-[7%]
            size-2
            rounded-full
            bg-navy/10
          "
          aria-hidden="true"
        />

        {/* =====================================================
            MAIN BOOK LIST SECTION
        ====================================================== */}

        <section
          className="
            container
            relative
            py-14
            sm:py-20
            lg:py-24
          "
        >
          <div
            className="
              grid
              gap-12
              lg:grid-cols-[.85fr_1.15fr]
              lg:items-center
              lg:gap-16
              xl:gap-24
            "
          >
            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <div className="max-w-xl">

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#c72c3b]
                  sm:text-[11px]
                "
              >
                Academic Resources
              </p>

              <h2
                className="
                  mt-4
                  font-serif
                  text-4xl
                  leading-[1.1]
                  text-navy
                  sm:text-5xl
                  lg:text-[52px]
                "
              >
                Everything they need,
                <span className="text-[#c72c3b]"> in one place.</span>
              </h2>

              <div
                className="
                  mt-6
                  h-[2px]
                  w-12
                  rounded-full
                  bg-[#c72c3b]
                "
              />

              <p
                className="
                  mt-6
                  text-[15px]
                  leading-7
                  text-slate-600
                  sm:text-base
                  sm:leading-8
                "
              >
                The prescribed books list brings together the learning
                material required across classes. Please refer to the document
                before purchasing books for the new session.
              </p>

              {/* Guidance */}

              <div className="mt-9 space-y-7">

                <div className="group flex gap-4">

                  <div
                    className="
                      grid
                      size-11
                      shrink-0
                      place-items-center
                      rounded-xl
                      bg-[#c72c3b]/[0.07]
                      text-[#c72c3b]
                      transition
                      duration-300
                      group-hover:bg-[#c72c3b]
                      group-hover:text-white
                    "
                  >
                    <GraduationCap size={21} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3
                      className="
                        font-serif
                        text-lg
                        font-semibold
                        text-navy
                      "
                    >
                      Class-wise guidance
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        leading-6
                        text-slate-600
                      "
                    >
                      Find the recommended titles and publishers in a single
                      reference.
                    </p>
                  </div>

                </div>

                <div className="group flex gap-4">

                  <div
                    className="
                      grid
                      size-11
                      shrink-0
                      place-items-center
                      rounded-xl
                      bg-[#c72c3b]/[0.07]
                      text-[#c72c3b]
                      transition
                      duration-300
                      group-hover:bg-[#c72c3b]
                      group-hover:text-white
                    "
                  >
                    <ShieldCheck size={21} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3
                      className="
                        font-serif
                        text-lg
                        font-semibold
                        text-navy
                      "
                    >
                      Always use the latest list
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        leading-6
                        text-slate-600
                      "
                    >
                      Please check this official document for any updated
                      requirements.
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* =================================================
                PDF PANEL
            ================================================== */}

            <aside
              className="
                relative
                overflow-hidden
                rounded-[24px]
                bg-navy
                p-5
                shadow-[0_25px_70px_-35px_rgba(7,27,58,.55)]
                sm:p-7
                lg:p-8
              "
            >

              {/* background circles */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-24
                  -top-24
                  size-72
                  rounded-full
                  border-[35px]
                  border-white/[0.035]
                "
                aria-hidden="true"
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  -left-20
                  size-60
                  rounded-full
                  border-[30px]
                  border-[#c72c3b]/10
                "
                aria-hidden="true"
              />

              {/* File Header */}

              <div
                className="
                  relative
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex items-center gap-3">

                  <div
                    className="
                      grid
                      size-11
                      shrink-0
                      place-items-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.07]
                      text-[#ff6673]
                    "
                  >
                    <FileText size={21} />
                  </div>

                  <div>
                    {/* <p className="text-sm font-semibold text-white">
                      {booksContent?.image?.split("/").pop() || "book-list.pdf"}
                    </p> */}

                    <p
                      className="
                        mt-1
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-slate-400
                        sm:text-[10px]
                      "
                    >
                      Official Document · PDF
                    </p>
                  </div>

                </div>

                <span
                  className="
                    w-fit
                    rounded-full
                    border
                    border-white/15
                    px-3
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-slate-300
                  "
                >
                  PDF
                </span>
              </div>

              {/* =================================================
                  DOCUMENT PREVIEW
              ================================================== */}

              <div
                className="
                  relative
                  mt-6
                  overflow-hidden
                  rounded-[18px]
                  bg-white
                  shadow-[0_18px_45px_rgba(0,0,0,.22)]
                  sm:mt-7
                "
              >
                {/* red top line */}

                <div className="h-[3px] bg-[#c72c3b]" />

                <div
                  className="
                    p-5
                    sm:p-7
                    lg:p-8
                  "
                >
                  {/* Logo */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-5
                      border-b
                      border-slate-200
                      pb-5
                    "
                  >
                    <img
                      src="/images/paragon-school-logo.webp"
                      alt="Paragon School"
                      className="
                        h-9
                        w-auto
                        max-w-[150px]
                        object-contain
                        sm:h-10
                      "
                    />

                    <span
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-[#c72c3b]
                        sm:text-[10px]
                      "
                    >
                      Book List
                    </span>
                  </div>

                  {/* Heading */}

                  <div className="mt-7">

                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-[#c72c3b]
                      "
                    >
                      Academic Resources
                    </p>

                    <h3
                      className="
                        mt-2
                        font-serif
                        text-2xl
                        text-navy
                        sm:text-3xl
                      "
                    >
                      Prescribed Books
                    </h3>

                    <p
                      className="
                        mt-2
                        text-sm
                        leading-6
                        text-slate-500
                      "
                    >
                      A simple guide for the academic session
                    </p>

                  </div>

                  {/* Class List */}

                  <div className="mt-7">

                    {classLevels.map((level, index) => (
                      <div
                        key={level}
                        className="
                          group
                          flex
                          items-center
                          justify-between
                          gap-4
                          border-b
                          border-slate-200
                          py-3.5
                          last:border-b-0
                        "
                      >
                        <div className="flex items-center gap-3">

                          <span
                            className="
                              text-[9px]
                              font-bold
                              tracking-[0.15em]
                              text-[#c72c3b]
                            "
                          >
                            0{index + 1}
                          </span>

                          <span
                            className="
                              text-sm
                              font-semibold
                              text-navy
                            "
                          >
                            {level}
                          </span>

                        </div>

                        <BookOpenCheck
                          size={17}
                          className="
                            text-slate-300
                            transition-colors
                            group-hover:text-[#c72c3b]
                          "
                        />

                      </div>
                    ))}

                  </div>

                  {/* Info */}

                  <div
                    className="
                      mt-6
                      flex
                      items-start
                      gap-2.5
                      rounded-xl
                      bg-[#f5f7f8]
                      px-4
                      py-3
                      text-xs
                      leading-5
                      text-slate-500
                    "
                  >
                    <Info
                      size={15}
                      className="
                        mt-0.5
                        shrink-0
                        text-[#c72c3b]
                      "
                    />

                    Open the PDF for complete book details.
                  </div>

                </div>
              </div>

              {/* =================================================
                  DOWNLOAD
              ================================================== */}

              <a
                href={bookListUrl}
                target="blank"
                download
                className="
                  group
                  relative
                  mt-5
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
                  shadow-lg
                  shadow-black/10
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#ae2230]
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

                Download Books List
              </a>

            </aside>
          </div>
        </section>

        {/* =====================================================
            BOTTOM INFORMATION
        ====================================================== */}

        <section
          className="
            relative
            border-y
            border-slate-200/70
            bg-white/55
            py-12
            sm:py-14
            lg:py-16
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              bottom-[-120px]
              size-64
              rounded-full
              border-[35px]
              border-[#c72c3b]/[0.03]
            "
            aria-hidden="true"
          />

          <div
            className="
              container
              relative
              grid
              gap-7
              md:grid-cols-3
              md:gap-0
            "
          >

            <InfoItem
              icon={Search}
              number="01"
              title="Easy to reference"
              copy="Use the PDF to find your class quickly."
            />

            <InfoItem
              icon={BookOpenCheck}
              number="02"
              title="Clear, class-wise list"
              copy="All prescribed resources are organised together."
            />

            <InfoItem
              icon={Download}
              number="03"
              title="Save a copy"
              copy="Download the document for easy access while shopping."
              last
            />

          </div>
        </section>

      </main>
    </>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

type InfoItemProps = {
  icon: React.ElementType;
  number: string;
  title: string;
  copy: string;
  last?: boolean;
};

function InfoItem({
  icon: Icon,
  number,
  title,
  copy,
  last = false,
}: InfoItemProps) {
  return (
    <article
      className={`
        group
        relative
        flex
        gap-4
        md:px-7
        lg:px-10

        ${!last ? "md:border-r md:border-slate-200" : ""}
      `}
    >
      <div
        className="
          grid
          size-11
          shrink-0
          place-items-center
          rounded-xl
          bg-[#c72c3b]/[0.07]
          text-[#c72c3b]
          transition-all
          duration-300
          group-hover:bg-[#c72c3b]
          group-hover:text-white
        "
      >
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <div>
        <div className="flex items-center gap-2">

          <span
            className="
              text-[9px]
              font-bold
              tracking-[0.15em]
              text-[#c72c3b]
            "
          >
            {number}
          </span>

          <span className="h-px w-5 bg-slate-300" />

        </div>

        <h3
          className="
            mt-2
            font-serif
            text-lg
            font-semibold
            text-navy
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1
            text-sm
            leading-6
            text-slate-600
          "
        >
          {copy}
        </p>
      </div>
    </article>
  );
}


