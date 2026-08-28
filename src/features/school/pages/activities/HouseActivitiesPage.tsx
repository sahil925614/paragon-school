import {
  CalendarDays,
  Crown,
  Shield,
  Sparkles,
  UsersRound,
} from "lucide-react";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";


/* =========================================================
   TYPES
========================================================= */

type House = {
  house: string;
  motto: string;
  captain: string;
  viceCaptain: string;
  incharge: string;
  members: string[];
};

type TableHeadingProps = {
  children: ReactNode;
};


/* =========================================================
   TEMPORARY STATIC DATA
   Replace this with API data later.
========================================================= */

type HouseRow = {
  house?: string;
  house_motto?: string;
  captain?: string;
  vice_captain?: string;
  incharge?: string;
  members?: string;
};

type HousesSettings = {
  table_title?: string;
  rows?: HouseRow[];
};

type HousesSection = {
  type: string;
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: HousesSettings | [];
};

type HousesPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: HousesSection[];
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
const houses: House[] = [
  {
    house: "Isaac Newton",
    motto: "IMAGINE - INVENT - INSPIRE",
    captain: "Bhavna Gopal (X)",
    viceCaptain: "Ananya Arora (IX)",
    incharge: "Ms. Shubhanjli Pawar",
    members: [
      "Ms. Amandeep Kaur",
      "Ms. Manisha Sharma",
      "Ms. Sukhjinder",
      "Ms. Dally",
      "Ms. Heena",
      "Ms. Neha",
      "Ms. Vipasha",
      "Ms. Sharanjeet",
      "Mr. Rocky",
      "Mr. Mukesh",
    ],
  },
];


/* =========================================================
   PAGE
========================================================= */

export function HouseActivitiesPage() {
  const { data: housesPage } = useQuery({
    queryKey: ["school-page", "houses-activities"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: HousesPageData }>("pages/houses-activities");
      return response.data.data;
    },
  });

  const banner = housesPage?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const content = housesPage?.sections.find(
    (section) => section.type === "houses_activities_content" && section.is_active,
  );
  const planner = housesPage?.sections.find(
    (section) => section.type === "houses_activities_pdf" && section.is_active,
  );
  const settings =
    content?.settings && !Array.isArray(content.settings) ? content.settings : undefined;
  const apiHouses: House[] = (settings?.rows || [])
    .filter((row) => row.house)
    .map((row) => ({
      house: row.house || "House",
      motto: row.house_motto || "",
      captain: row.captain || "To be announced",
      viceCaptain: row.vice_captain || "To be announced",
      incharge: row.incharge || "To be announced",
      members: row.members?.split(/\r?\n/).map((member) => member.trim()).filter(Boolean) || [],
    }));
  const displayedHouses = apiHouses.length ? apiHouses : houses;
  const plannerUrl =
    mediaUrl(planner?.image, planner?.image_url) || "/school-monthly-planner.pdf";

  useEffect(() => {
    applyPageSeo(housesPage?.seo);
  }, [housesPage]);

  return (
    <>
      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={banner?.title || housesPage?.title || "House Activities"}
        description={plainText(banner?.description) || "Explore competitions and events across the school houses."}
      />

      <main className="overflow-hidden">

        {/* =====================================================
            HOUSES INTRODUCTION
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#fbfaf7] py-14 sm:py-16 lg:py-20">

          {/* Left decorative ring */}
          <div
            className="
              pointer-events-none
              absolute
              -left-28
              top-10
              size-72
              rounded-full
              border-[38px]
              border-gold/[.05]
            "
            aria-hidden="true"
          />

          {/* Right decorative shape */}
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -bottom-24
              size-72
              rounded-full
              bg-navy/[.025]
            "
            aria-hidden="true"
          />

          {/* Small dot */}
          <div
            className="
              pointer-events-none
              absolute
              right-[9%]
              top-14
              size-2.5
              rounded-full
              bg-gold/20
            "
            aria-hidden="true"
          />

          <div className="container relative">

            <div
              className="
                relative
                mx-auto
                max-w-6xl
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200/80
                bg-white
                px-6
                py-9
                shadow-[0_20px_60px_-40px_rgba(16,42,67,0.35)]
                sm:px-10
                sm:py-11
                lg:px-14
              "
            >
              {/* Card decoration */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-14
                  -top-16
                  size-44
                  rounded-full
                  border-[20px]
                  border-gold/[.055]
                "
                aria-hidden="true"
              />

              <div className="relative">

                {/* Heading */}
                <div className="flex items-center gap-4">
                  <div
                    className="
                      grid
                      size-12
                      shrink-0
                      place-items-center
                      rounded-xl
                      bg-cream
                      text-gold-dark
                      ring-1
                      ring-gold/10
                    "
                  >
                    <Shield
                      size={22}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2 className="font-serif text-3xl leading-tight text-navy sm:text-4xl">
                      {content?.title || "Houses"}
                    </h2>

                    <div
                      className="mt-3 h-[2px] w-10 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Exact existing content */}
                <p className="mt-7 max-w-5xl text-[15px] leading-8 text-slate-600 sm:text-base">
                  {plainText(content?.description) ||
                    "The students of the school are divided into four houses namely Isaac Newton, Kalpana Chawla, Rabindra Nath Tagore and Sachin Tendulkar. The house activities are managed by the house incharges. It is compulsory for every student to be a member of a house. The main idea of the house system is to build leadership, teamwork, cooperation, mutual understanding and self-reliance."}
                </p>

              </div>
            </div>
          </div>
        </section>


        {/* =====================================================
            HOUSE INCHARGES & CAPTAINS
        ====================================================== */}

        <section
  className="
    relative
    overflow-hidden
    border-y
    border-navy/10
    bg-[#f2f5f6]
    py-14
    sm:py-16
    lg:py-20
  "
>
  {/* =====================================================
      BACKGROUND DECORATION
  ===================================================== */}

  <div
    aria-hidden="true"
    className="
      pointer-events-none
      absolute
      -right-28
      top-10
      size-72
      rounded-full
      border-[42px]
      border-gold/[.035]
    "
  />

  <div
    aria-hidden="true"
    className="
      pointer-events-none
      -left-24
      bottom-[-120px]
      absolute
      size-72
      rounded-full
      bg-navy/[.025]
    "
  />

  <div className="container relative">

    {/* =====================================================
        SECTION HEADING
    ===================================================== */}

    <div className="mb-9 flex items-center gap-4 sm:mb-11">
      <div
        className="
          grid
          size-12
          shrink-0
          place-items-center
          rounded-xl
          bg-white
          text-gold-dark
          shadow-sm
          ring-1
          ring-slate-200
        "
      >
        <Crown
          size={22}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <div>
        <h2
          className="
            font-serif
            text-3xl
            leading-tight
            text-navy
            sm:text-4xl
          "
        >
          {settings?.table_title || "House Incharges and Captains"}
        </h2>

        <div
          aria-hidden="true"
          className="
            mt-3
            h-[2px]
            w-10
            rounded-full
            bg-gold
          "
        />
      </div>
    </div>

    {/* =====================================================
        HOUSE CARDS
    ===================================================== */}

    <div className="space-y-5">
      {displayedHouses.map((house, index) => (
        <article
          key={`${house.house}-${index}`}
          className="
            group
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-slate-200
            bg-white
            shadow-[0_18px_50px_-38px_rgba(16,42,67,.45)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_24px_60px_-38px_rgba(16,42,67,.5)]
          "
        >
          {/* Top accent */}

          <div
            className="
              absolute
              inset-x-0
              top-0
              h-[3px]
              bg-gradient-to-r
              from-gold
              via-gold/40
              to-transparent
            "
          />

          {/* =================================================
              MAIN HOUSE INFORMATION
          ================================================= */}

          <div
            className="
              grid
              gap-0
              md:grid-cols-2
              xl:grid-cols-[1.15fr_1.45fr_1fr_1fr_1.15fr]
            "
          >
            {/* HOUSE */}

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-slate-100
                p-5
                md:border-r
                xl:border-b-0
                xl:p-6
              "
            >
              <div
                className="
                  grid
                  size-11
                  shrink-0
                  place-items-center
                  rounded-xl
                  bg-gold/10
                  text-gold-dark
                  transition
                  duration-300
                  group-hover:bg-gold
                  group-hover:text-white
                "
              >
                <Shield
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <div>
                <p
                  className="
                    mb-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[.17em]
                    text-slate-400
                  "
                >
                  House
                </p>

                <h3
                  className="
                    font-serif
                    text-lg
                    font-semibold
                    leading-tight
                    text-navy
                  "
                >
                  {house.house}
                </h3>
              </div>
            </div>

            {/* MOTTO */}

            <div
              className="
                border-b
                border-slate-100
                p-5
                md:border-r-0
                xl:border-b-0
                xl:border-r
                xl:p-6
              "
            >
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[.17em]
                  text-slate-400
                "
              >
                House Motto
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  font-semibold
                  leading-6
                  text-navy
                "
              >
                {house.motto}
              </p>
            </div>

            {/* CAPTAIN */}

            <div
              className="
                border-b
                border-slate-100
                p-5
                md:border-r
                xl:border-b-0
                xl:p-6
              "
            >
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[.17em]
                  text-slate-400
                "
              >
                Captain
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {house.captain}
              </p>
            </div>

            {/* VICE CAPTAIN */}

            <div
              className="
                border-b
                border-slate-100
                p-5
                xl:border-b-0
                xl:border-r
                xl:p-6
              "
            >
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[.17em]
                  text-slate-400
                "
              >
                Vice Captain
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {house.viceCaptain}
              </p>
            </div>

            {/* INCHARGE */}

            <div
              className="
                p-5
                md:col-span-2
                xl:col-span-1
                xl:p-6
              "
            >
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[.17em]
                  text-slate-400
                "
              >
                Incharge
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {house.incharge}
              </p>
            </div>
          </div>

          {/* =================================================
              MEMBERS
          ================================================= */}

          <div
            className="
              border-t
              border-slate-100
              bg-[#fbfcfc]
              px-5
              py-4
              sm:px-6
              sm:py-5
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                lg:flex-row
                lg:items-start
              "
            >
              {/* Members heading */}

              <div
                className="
                  flex
                  w-[100px]
                  shrink-0
                  items-center
                  gap-2
                  pt-1
                "
              >
                <span
                  className="
                    size-1.5
                    rounded-full
                    bg-gold
                  "
                />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[.16em]
                    text-navy
                  "
                >
                  Members
                </p>
              </div>

              {/* Members list */}

              <div className="flex flex-1 flex-wrap gap-2">
                {house.members.map(
                  (member, memberIndex) => (
                    <span
                      key={`${member}-${memberIndex}`}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-slate-200
                        bg-white
                        px-3.5
                        py-2
                        text-xs
                        font-medium
                        leading-none
                        text-slate-600
                        shadow-[0_3px_10px_rgba(16,42,67,.025)]
                        transition
                        duration-200
                        hover:border-gold/30
                        hover:text-navy
                      "
                    >
                      <span
                        aria-hidden="true"
                        className="
                          size-1.5
                          shrink-0
                          rounded-full
                          bg-gold
                        "
                      />

                      {member}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>


        {/* =====================================================
            SCHOOL MONTHLY PLANNER
        ====================================================== */}

        <section
          className="
            relative
            overflow-hidden
            bg-[#fbfaf7]
            py-14
            sm:py-16
            lg:py-20
          "
        >

          {/* Background decorations */}

          <div
            className="
              pointer-events-none
              absolute
              -left-24
              top-20
              size-64
              rounded-full
              border-[34px]
              border-gold/[.045]
            "
            aria-hidden="true"
          />

          <div
            className="
              pointer-events-none
              absolute
              -right-28
              bottom-[-100px]
              size-72
              rounded-full
              bg-navy/[.025]
            "
            aria-hidden="true"
          />


          <div className="container relative">

            {/* =================================================
                HEADING
            ================================================== */}

            <div className="mb-9 flex items-center gap-4 sm:mb-10">

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
                <CalendarDays
                  size={21}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <div>

                <h2 className="font-serif text-3xl leading-tight text-navy sm:text-4xl">
                  {planner?.title || "School Monthly Planner"}
                </h2>

                <div
                  className="mt-3 h-[2px] w-10 rounded-full bg-gold"
                  aria-hidden="true"
                />

              </div>

            </div>


            {/* =================================================
                PDF
            ================================================== */}

            <div className="relative">

              {/* Back layer */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-3
                  left-6
                  right-6
                  top-6
                  -z-10
                  rounded-[28px]
                  bg-navy/[.04]
                "
                aria-hidden="true"
              />


              <div
                className="
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-slate-200
                  bg-white
                  p-2
                  shadow-[0_24px_70px_-38px_rgba(16,42,67,0.4)]
                  sm:p-3
                "
              >

                {/* Top accent */}
                <div className="h-1 w-full rounded-t-[18px] bg-gold" />


                <div className="overflow-hidden rounded-b-[18px] bg-slate-100">

                  <iframe
                    src={plannerUrl}
                    title={planner?.title || "School Monthly Planner"}
                    className="
                      h-[480px]
                      w-full
                      border-0
                      sm:h-[580px]
                      lg:h-[650px]
                    "
                  />

                </div>

              </div>

            </div>

          </div>
        </section>

      </main>
    </>
  );
}


/* =========================================================
   TABLE HEADING
========================================================= */

function TableHeading({
  children,
}: TableHeadingProps) {
  return (
    <th
      scope="col"
      className="
        border-r
        border-white/10
        px-5
        py-5
        text-[11px]
        font-bold
        uppercase
        tracking-[0.14em]
        text-white/80
        last:border-r-0
      "
    >
      {children}
    </th>
  );
}
