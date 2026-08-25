import {
  Dumbbell,
  Palette,
  UsersRound,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";


type Club = {
  name: string;
  teachers: string;
};


type ClassGroup = {
  classes: string;
  clubs: Club[];
};


type ClubSection = {
  title: string;
  icon: LucideIcon;
  groups: ClassGroup[];
};


/* =========================================================
   CLUB DATA
========================================================= */

type ApiClubRow = {
  club?: string;
  teachers?: string;
};

type ApiClubGroup = {
  label?: string;
  rows?: ApiClubRow[];
};

type ClubActivitiesSettings = {
  activity_title?: string;
  activity_groups?: ApiClubGroup[];
  sports_title?: string;
  sports_groups?: ApiClubGroup[];
};

type ClubActivitiesSection = {
  type: string;
  title?: string;
  description?: string | null;
  is_active: boolean;
  settings?: ClubActivitiesSettings | [];
};

type ClubActivitiesPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: ClubActivitiesSection[];
};

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

function mapGroups(groups?: ApiClubGroup[]): ClassGroup[] {
  return (groups || [])
    .map((group) => ({
      classes: group.label?.replace(/^Classes:\s*/i, "").trim() || "Classes",
      clubs: (group.rows || [])
        .filter((row) => row.club)
        .map((row) => ({
          name: row.club || "Club",
          teachers: row.teachers || "To be announced",
        })),
    }))
    .filter((group) => group.clubs.length > 0);
}
const clubSections: ClubSection[] = [
  {
    title: "Activity Club",
    icon: Palette,
    groups: [
      {
        classes: "III to V",
        clubs: [
          {
            name: "Personality Development",
            teachers: "Ms. Dally, Ms. Ruchi, Ms. Indu",
          },
          {
            name: "Mould & Magic (Pottery)",
            teachers:
              "Ms. Sunanda, Ms. Sonia Kotwal, Ms. Sukjinderkaur",
          },
          {
            name: "Creative Hands",
            teachers:
              "Ms. Neha, Ms. Amandeep Kaur, Ms. Priyanka Kardam",
          },
          {
            name: "Symphony",
            teachers: "Ms. Karanpreet Kaur, Mr. Harpreet Singh",
          },
        ],
      },

      {
        classes: "VI to VIII",
        clubs: [
          {
            name: "Ek Bharat Shreshtha Bharat",
            teachers: "Ms. Heena",
          },
          {
            name: "Theatre",
            teachers: "Ms. Simarpreet Kaur, Ms. Sujata",
          },
          {
            name: "Root and Routes",
            teachers: "Ms. Rajni Bhalla, Ms. Shubhanjali",
          },
          {
            name: "Crafty Mind",
            teachers: "Ms. Neha, Ms. Priyanka Sharma",
          },
          {
            name: "Personality Development",
            teachers: "Ms. Ruchi",
          },
        ],
      },
    ],
  },

  {
    title: "Sports Club",
    icon: Dumbbell,
    groups: [
      {
        classes: "III to V",
        clubs: [
          {
            name: "Basketball",
            teachers: "Mr. Mukesh Kumar, Ms. Sunanda",
          },
          {
            name: "Football",
            teachers: "Mr. Rajesh Kumar, Ms. Sukhjinder Kaur",
          },
          {
            name: "Badminton",
            teachers: "Mr. Prabhjot, Ms. Dally",
          },
          {
            name: "Boxing",
            teachers: "Mr. Ajay Sethi, Mr. Zaved",
          },
          {
            name: "Taekwondo",
            teachers: "Mr. Sarvendra Kumar, Ms. Indu Jaiswal",
          },
          {
            name: "Skating",
            teachers: "Mr. Vishal, Ms. Narinder Kaur",
          },
          {
            name: "Karate",
            teachers: "Mr. Sakand Kumar, Ms. Priyanka Kardam",
          },
          {
            name: "Volleyball",
            teachers: "Mr. Sanjay Kumar, Ms. Amandeep Kaur",
          },
          {
            name: "Yoga",
            teachers: "Ms. Mandeep Kour, Ms. Anushtha",
          },
        ],
      },

      {
        classes: "VI to VIII",
        clubs: [
          {
            name: "Football",
            teachers: "Mr. Rajesh Kumar, Ms. Simarpreet Kaur",
          },
          {
            name: "Badminton",
            teachers: "Ms. Prabhjot, Ms. Heena",
          },
          {
            name: "Basketball",
            teachers: "Mr. Mukesh, Ms. Kiran",
          },
          {
            name: "Karate",
            teachers: "Mr. Sakand Kumar, Ms. Deepshikha",
          },
          {
            name: "Boxing",
            teachers: "Mr. Ajay Sethi, Mr. Zaved",
          },
          {
            name: "Skating",
            teachers: "Mr. Vishal, Ms. Rajni Bhalla",
          },
          {
            name: "Volleyball",
            teachers: "Mr. Sanjay, Ms. Sujata",
          },
          {
            name: "Table Tennis",
            teachers: "Ms. Mandeep Kour, Mr. Anushtha",
          },
          {
            name: "Aerobics / Zumba",
            teachers: "Mr. Shubham, Ms. Chetna",
          },
        ],
      },
    ],
  },
];


/* =========================================================
   PAGE
========================================================= */

export function ClubActivitiesPage() {
  const { data: clubActivitiesPage } = useQuery({
    queryKey: ["school-page", "club-activities"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: ClubActivitiesPageData }>(
        "pages/club-activities",
      );
      return response.data.data;
    },
  });

  const banner = clubActivitiesPage?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const content = clubActivitiesPage?.sections.find(
    (section) => section.type === "club_activities_content" && section.is_active,
  );
  const settings =
    content?.settings && !Array.isArray(content.settings) ? content.settings : undefined;
  const apiClubSections: ClubSection[] = settings
    ? [
        {
          title: settings.activity_title || "Activity Club",
          icon: Palette,
          groups: mapGroups(settings.activity_groups),
        },
        {
          title: settings.sports_title || "Sports Club",
          icon: Dumbbell,
          groups: mapGroups(settings.sports_groups),
        },
      ].filter((section) => section.groups.length > 0)
    : [];
  const displayedSections = apiClubSections.length ? apiClubSections : clubSections;

  useEffect(() => {
    applyPageSeo(clubActivitiesPage?.seo);
  }, [clubActivitiesPage]);

  return (
    <>
      <PageBanner
        title="Clubs Activity"
        description="Activity Club Â· Sports Club"
      />

      <main className="overflow-hidden">
        {displayedSections.map((section, index) => (
          <ClubCategory
            key={section.title}
            section={section}
            index={index}
          />
        ))}
      </main>
    </>
  );
}


/* =========================================================
   CLUB CATEGORY
========================================================= */

function ClubCategory({
  section,
  index,
}: {
  section: ClubSection;
  index: number;
}) {
  const Icon = section.icon;
  const isSports = index % 2 !== 0;

  return (
    <section
      aria-labelledby={`club-section-${index}`}
      className={[
        "relative overflow-hidden",
        isSports
          ? "bg-[#fbfaf7] py-14 sm:py-16 lg:py-20"
          : "border-y border-navy/10 bg-[#f4f7f8] py-14 sm:py-16 lg:py-20",
      ].join(" ")}
    >
      {/* =====================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      {!isSports && (
        <>
          <div
            className="pointer-events-none absolute -left-24 top-16 size-64 rounded-full border-[34px] border-gold/[.05]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -right-24 bottom-[-70px] size-72 rounded-full bg-navy/[.025]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-[8%] top-12 size-3 rounded-full bg-gold/20"
            aria-hidden="true"
          />
        </>
      )}

      {isSports && (
        <>
          {/* large subtle circle */}
          <div
            className="pointer-events-none absolute -right-28 top-24 size-80 rounded-full border-[40px] border-navy/[.035]"
            aria-hidden="true"
          />

          {/* bottom gold circle */}
          <div
            className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full border-[38px] border-gold/[.045]"
            aria-hidden="true"
          />

          {/* small decorative dots */}
          <div
            className="pointer-events-none absolute left-[7%] top-[22%] size-2 rounded-full bg-gold/20"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-[8%] bottom-[15%] size-3 rounded-full bg-navy/[.06]"
            aria-hidden="true"
          />
        </>
      )}

      <div className="container relative">
        {/* =====================================================
            ACTIVITY CLUB HEADING
        ====================================================== */}

        {!isSports && (
          <div className="mb-8 flex items-center gap-4 sm:mb-10">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-gold-dark shadow-sm ring-1 ring-slate-200">
              <Icon
                size={22}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                id={`club-section-${index}`}
                className="font-serif text-3xl leading-tight text-navy sm:text-4xl"
              >
                {section.title}
              </h2>

              <div
                className="mt-3 h-[2px] w-10 rounded-full bg-gold"
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {/* =====================================================
            SPORTS CLUB FEATURE HEADER
        ====================================================== */}

       {isSports && (
  <div className="mb-9 flex items-center gap-4 sm:mb-10">
    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy text-gold shadow-lg shadow-navy/10">
      <Icon
        size={22}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </div>

    <div>
      <h2
        id={`club-section-${index}`}
        className="font-serif text-3xl leading-tight text-navy sm:text-4xl"
      >
        {section.title}
      </h2>

      <div
        className="mt-3 h-[2px] w-10 rounded-full bg-gold"
        aria-hidden="true"
      />
    </div>
  </div>
)}

        {/* =====================================================
            CLASS GROUPS
        ====================================================== */}

        <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
          {section.groups.map((group) => (
            <ClubTable
              key={group.classes}
              group={group}
              sports={isSports}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   CLUB TABLE
========================================================= */

function ClubTable({
  group,
  sports,
}: {
  group: ClassGroup;
  sports: boolean;
}) {
  return (
    <article
      className="
        group/card
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-[0_18px_50px_-30px_rgba(16,42,67,0.35)]
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_24px_60px_-28px_rgba(16,42,67,0.4)]
      "
    >
      {/* =====================================================
          CARD HEADER
      ====================================================== */}

      <header
        className={[
          "relative overflow-hidden px-5 py-5 text-white sm:px-6",
          sports ? "bg-gold-dark" : "bg-navy",
        ].join(" ")}
      >
        {/* decorative ring */}
        <div
          className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full border-[14px] border-white/[.06] transition duration-500 group-hover/card:scale-110"
          aria-hidden="true"
        />

        {/* second subtle circle */}
        <div
          className="pointer-events-none absolute right-4 top-3 size-12 rounded-full bg-white/[.025]"
          aria-hidden="true"
        />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
              Classes
            </p>

            <h3 className="mt-1 font-serif text-2xl leading-tight">
              {group.classes}
            </h3>
          </div>

          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold ring-1 ring-white/10">
            <UsersRound
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>
        </div>
      </header>

      {/* =====================================================
          COLUMN HEADINGS
      ====================================================== */}

      <div className="hidden grid-cols-[minmax(150px,0.85fr)_minmax(230px,1.45fr)] border-b border-slate-200 bg-[#f7f8f9] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:grid">
        <span>Club</span>
        <span>Teachers</span>
      </div>

      {/* =====================================================
          ROWS
      ====================================================== */}

      <div className="divide-y divide-slate-100">
        {group.clubs.map((club, clubIndex) => (
          <div
            key={`${club.name}-${clubIndex}`}
            className="
              group/row
              grid
              gap-2
              px-5
              py-4
              transition-colors
              duration-200
              hover:bg-[#faf9f6]
              sm:grid-cols-[minmax(150px,0.85fr)_minmax(230px,1.45fr)]
              sm:gap-6
              sm:px-6
            "
          >
            {/* Club */}
            <div className="flex items-start gap-3">
              <span
                className="
                  mt-[9px]
                  size-1.5
                  shrink-0
                  rounded-full
                  bg-gold
                  ring-4
                  ring-gold/10
                  transition
                  duration-200
                  group-hover/row:ring-gold/20
                "
                aria-hidden="true"
              />

              <p className="font-semibold leading-6 text-navy">
                {club.name}
              </p>
            </div>

            {/* Teachers */}
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:hidden">
                Teachers
              </p>

              <p className="text-sm leading-6 text-slate-600">
                {club.teachers}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

