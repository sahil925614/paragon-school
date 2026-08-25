import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { KidsPageBanner } from "../components/KidsPageBanner";
import { kidsApi } from "../api/kidsApi";
import { applyPageSeo, type PageSeo } from "../../school/utils/pageSeo";

type InfrastructureCard = {
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
};

type InfrastructureSettings = {
  cards?: InfrastructureCard[];
};

type InfrastructureSection = {
  type: string;
  title?: string;
  description?: string | null;
  is_active: boolean;
  settings?: InfrastructureSettings | [];
};

type InfrastructurePageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: InfrastructureSection[];
};

type DisplayedInfrastructureItem = {
  title: string;
  description?: string;
  image: string;
  color: string;
  soft: string;
  shape: string;
};

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(image?: string | null, imageUrl?: string | null) {
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  return undefined;
}

function plainText(html?: string | null) {
  return html?.replace(/<br\s*\/?\s*>/gi, " ").replace(/<\/p>/gi, " ").replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim() || "";
}
const infrastructureItems = [
  {
    title: "Air conditioned smart classrooms",
    image: "/images/infastructure_1.webp",
    color: "#ef5f6c",
    soft: "#fff0f2",
    shape: "rounded-[44px_80px_48px_70px]",
  },
  {
    title: "Well equipped toy rooms with age appropriate playing kits",
    image: "/images/infastructure_2.webp",
    color: "#37a9df",
    soft: "#edf9ff",
    shape: "rounded-[80px_42px_75px_45px]",
  },
  {
    title: "Uninterrupted power supply",
    image: "/images/infastructure_3.webp",
    color: "#f4b91f",
    soft: "#fff8dd",
    shape: "rounded-[45px_75px_42px_82px]",
  },
  {
    title: "CCTV Surveillance",
    image: "/images/infastructure_4.webp",
    color: "#20a98b",
    soft: "#ebfaf6",
    shape: "rounded-[75px_45px_82px_42px]",
  },
  {
    title: "Transport Facility to Mohali, Chandigarh and Kharar Area",
    image: "/images/infastructure_5.webp",
    color: "#8b65c2",
    soft: "#f5effc",
    shape: "rounded-[48px_85px_48px_70px]",
  },
  {
    title: "Well maintained and beautiful playgrounds",
    image: "/images/infastructure_6.webp",
    color: "#ef5f6c",
    soft: "#fff0f2",
    shape: "rounded-[85px_45px_75px_45px]",
  },
];

export function KidsInfrastructurePage() {
  const { data: page } = useQuery({
    queryKey: ["kids-page", "infrastructure"],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: InfrastructurePageData }>("pages/infrastructure");
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const content = page?.sections.find(
    (section) => section.type === "kids_infrastructure_content" && section.is_active,
  );
  const settings =
    content?.settings && !Array.isArray(content.settings) ? content.settings : undefined;
  const palette = infrastructureItems.map(({ color, soft, shape }) => ({ color, soft, shape }));
  const apiItems: DisplayedInfrastructureItem[] = (settings?.cards || [])
    .map((card, index) => {
      const style = palette[index % palette.length];
      return {
        title: card.title?.trim() || `Infrastructure facility ${index + 1}`,
        description: plainText(card.description),
        image: mediaUrl(card.image, card.image_url) || "",
        ...style,
      };
    })
    .filter((item) => Boolean(item.image));
  const displayedInfrastructureItems: DisplayedInfrastructureItem[] = apiItems.length
    ? apiItems
    : infrastructureItems;

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <>
      <KidsPageBanner
        title={banner?.title || page?.title || "Infrastructure"}
        description={plainText(banner?.description) || "Explore colourful classrooms, safe play areas and child-friendly learning spaces."}
      />

      <main className="relative overflow-hidden bg-[#fffdf8]">
        {/* =====================================================
            BACKGROUND
        ====================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[.45]
            [background-image:radial-gradient(#34305c_0.7px,transparent_0.7px)]
            [background-size:32px_32px]
          "
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          }}
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-48
            top-[12%]
            size-[380px]
            rounded-full
            bg-[#37a9df]/[.055]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-48
            top-[43%]
            size-[420px]
            rounded-full
            bg-[#ffd34e]/[.09]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-52
            bottom-[5%]
            size-[400px]
            rounded-full
            bg-[#20a98b]/[.055]
          "
        />

        {/* =====================================================
            INTRO HEADING
        ====================================================== */}

        <section className="relative py-16 sm:py-20 lg:pb-16 lg:pt-24">
          <div className="container">
            <div className="relative mx-auto max-w-4xl text-center">
              {/* little decorative shapes */}

              <span
                aria-hidden="true"
                className="
                  kids-infra-float
                  absolute
                  -left-4
                  top-3
                  hidden
                  size-8
                  -rotate-12
                  rounded-[10px]
                  bg-[#ef5f6c]
                  sm:block
                "
              />

              <span
                aria-hidden="true"
                className="
                  kids-infra-float
                  absolute
                  -right-3
                  top-8
                  hidden
                  text-3xl
                  text-[#ffd34e]
                  sm:block
                  [animation-delay:.7s]
                "
              >
                ★
              </span>

              <span
                aria-hidden="true"
                className="
                  kids-infra-float
                  absolute
                  right-[8%]
                  -bottom-5
                  hidden
                  size-5
                  rounded-full
                  bg-[#20a98b]
                  md:block
                  [animation-delay:1.2s]
                "
              />

              <h2
                className="
                  font-serif
                  text-4xl
                  font-bold
                  leading-tight
                  text-[#34305c]
                  sm:text-5xl
                  lg:text-[58px]
                "
              >
                {content?.title || "Infrastructure"}
              </h2>

              {/* hand-drawn style underline */}

              <div className="relative mx-auto mt-5 h-4 w-44">
                <svg
                  viewBox="0 0 180 16"
                  fill="none"
                  className="size-full"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10C39 2 73 13 104 7C128 3 150 4 176 8"
                    stroke="#ef5f6c"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <circle cx="63" cy="5" r="3" fill="#ffd34e" />
                  <circle cx="121" cy="7" r="3" fill="#20a98b" />
                  <circle cx="158" cy="5" r="3" fill="#37a9df" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INFRASTRUCTURE JOURNEY
        ====================================================== */}

        <section className="relative pb-20 sm:pb-24 lg:pb-32">
          <div className="container">
            <div className="relative mx-auto max-w-[1180px]">
              {/* vertical playful journey line */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-24
                  left-1/2
                  top-20
                  hidden
                  w-px
                  -translate-x-1/2
                  lg:block
                "
              >
                <div
                  className="
                    size-full
                    bg-gradient-to-b
                    from-[#ef5f6c]/20
                    via-[#37a9df]/25
                    to-[#20a98b]/20
                  "
                />

                <span className="absolute left-1/2 top-[12%] size-3 -translate-x-1/2 rounded-full bg-[#ef5f6c]" />
                <span className="absolute left-1/2 top-[32%] size-3 -translate-x-1/2 rounded-full bg-[#37a9df]" />
                <span className="absolute left-1/2 top-[52%] size-3 -translate-x-1/2 rounded-full bg-[#ffd34e]" />
                <span className="absolute left-1/2 top-[72%] size-3 -translate-x-1/2 rounded-full bg-[#20a98b]" />
                <span className="absolute left-1/2 top-[92%] size-3 -translate-x-1/2 rounded-full bg-[#8b65c2]" />
              </div>

              <div className="space-y-20 sm:space-y-24 lg:space-y-28">
                {displayedInfrastructureItems.map((item, index) => (
                  <InfrastructureStory
                    key={item.title}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <style>{`
          @keyframes kidsInfraFloat {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform: translateY(-10px) rotate(6deg);
            }
          }

          @keyframes kidsInfraStar {
            0%, 100% {
              transform: rotate(0deg) scale(1);
            }

            50% {
              transform: rotate(12deg) scale(1.12);
            }
          }

          @keyframes kidsInfraBlob {
            0%, 100% {
              transform: scale(1) rotate(0deg);
            }

            50% {
              transform: scale(1.035) rotate(2deg);
            }
          }

          .kids-infra-float {
            animation: kidsInfraFloat 4.5s ease-in-out infinite;
          }

          .kids-infra-star {
            animation: kidsInfraStar 3.5s ease-in-out infinite;
          }

          .kids-infra-blob {
            animation: kidsInfraBlob 6s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .kids-infra-float,
            .kids-infra-star,
            .kids-infra-blob {
              animation: none !important;
            }
          }
        `}</style>
      </main>
    </>
  );
}

/* =========================================================
   INFRASTRUCTURE STORY
========================================================= */

function InfrastructureStory({
  item,
  index,
}: {
  item: DisplayedInfrastructureItem;
  index: number;
}) {
  const reverse = index % 2 !== 0;

  return (
    <article
      className={`
        relative
        grid
        items-center
        gap-10
        lg:grid-cols-2
        lg:gap-20
      `}
    >
      {/* =====================================================
          IMAGE SIDE
      ====================================================== */}

      <div
        className={`
          relative
          ${reverse ? "lg:order-2" : "lg:order-1"}
        `}
      >
        {/* giant soft irregular background */}

        <div
          aria-hidden="true"
          className={`
            kids-infra-blob
            absolute
            -inset-5
            ${item.shape}
          `}
          style={{
            backgroundColor: item.soft,
          }}
        />

        {/* offset solid shape */}

        <div
          aria-hidden="true"
          className={`
            absolute
            ${
              reverse
                ? "-right-4 -top-5 rotate-3"
                : "-left-4 -top-5 -rotate-3"
            }
            h-[78%]
            w-[78%]
            ${item.shape}
            opacity-[.16]
          `}
          style={{
            backgroundColor: item.color,
          }}
        />

        {/* =================================================
            IMAGE
        ================================================== */}

        <figure
          className={`
            group
            relative
            overflow-hidden
            ${item.shape}
            border-[7px]
            border-white
            bg-white
            shadow-[0_30px_70px_-30px_rgba(52,48,92,.38)]
          `}
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              loading={index < 2 ? "eager" : "lazy"}
              className="
                size-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.045]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-[#34305c]/20
                via-transparent
                to-transparent
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
              "
            />
          </div>
        </figure>

        {/* =================================================
            DECORATIONS
        ================================================== */}

        <span
          aria-hidden="true"
          className={`
            kids-infra-star
            absolute
            ${
              reverse
                ? "-left-3 top-10"
                : "-right-3 top-12"
            }
            grid
            size-14
            place-items-center
            rounded-2xl
            text-xl
            text-white
            shadow-[0_10px_25px_rgba(52,48,92,.15)]
          `}
          style={{
            backgroundColor: item.color,
          }}
        >
          {index % 3 === 0
            ? "★"
            : index % 3 === 1
              ? "✦"
              : "●"}
        </span>

        {/* dotted pattern */}

        <div
          aria-hidden="true"
          className={`
            absolute
            ${
              reverse
                ? "-right-4 -bottom-5"
                : "-left-4 -bottom-5"
            }
            grid
            grid-cols-4
            gap-2
            opacity-30
          `}
        >
          {Array.from({ length: 16 }).map((_, dot) => (
            <span
              key={dot}
              className="size-1.5 rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          TITLE SIDE
      ====================================================== */}

      <div
        className={`
          relative
          ${
            reverse
              ? "lg:order-1 lg:text-right"
              : "lg:order-2"
          }
        `}
      >
        {/* huge number */}

        <span
          aria-hidden="true"
          className={`
            absolute
            -top-14
            select-none
            font-serif
            text-[110px]
            font-black
            leading-none
            opacity-[.065]
            sm:text-[140px]
            ${
              reverse
                ? "right-0"
                : "left-0"
            }
          `}
          style={{
            color: item.color,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative">
          {/* small label number */}

          <div
            className={`
              mb-5
              flex
              items-center
              gap-3
              ${
                reverse
                  ? "lg:flex-row-reverse"
                  : ""
              }
            `}
          >
            <span
              className="
                grid
                size-11
                shrink-0
                place-items-center
                rounded-2xl
                text-[11px]
                font-black
                tracking-[.08em]
                text-white
                shadow-[0_8px_18px_rgba(52,48,92,.12)]
              "
              style={{
                backgroundColor: item.color,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <span
              className="h-[2px] w-14 rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />

            <span
              className="
                size-2.5
                rounded-full
              "
              style={{
                backgroundColor: item.color,
              }}
            />
          </div>

          <h3
            className="
              max-w-[470px]
              font-serif
              text-3xl
              font-bold
              leading-[1.18]
              text-[#34305c]
              sm:text-4xl
              lg:text-[42px]
            "
            style={{
              marginLeft: reverse ? "auto" : undefined,
            }}
          >
            {item.title}
          </h3>

          {item.description && (
            <p
              className="mt-5 max-w-[470px] text-[15px] leading-7 text-[#625f72] sm:text-base"
              style={{ marginLeft: reverse ? "auto" : undefined }}
            >
              {item.description}
            </p>
          )}

          {/* playful bottom stroke */}

          <div
            className={`
              mt-7
              flex
              items-center
              gap-2
              ${
                reverse
                  ? "lg:justify-end"
                  : ""
              }
            `}
          >
            <span
              className="h-2 w-14 rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />

            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor: item.color,
                opacity: 0.55,
              }}
            />

            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor: item.color,
                opacity: 0.25,
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}