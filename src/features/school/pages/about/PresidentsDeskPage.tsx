import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AboutDetailPage } from "../../../../pages/AboutDetailPage";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type PresidentSettings = {
  president_name?: string;
  president_position?: string;
};

type PresidentSection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: PresidentSettings | [];
};

type PresidentPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: PresidentSection[];
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

function htmlParagraphs(html?: string | null) {
  return (
    html
      ?.match(/<p[^>]*>[\s\S]*?<\/p>/gi)
      ?.map((paragraph) => plainText(paragraph))
      .filter(Boolean) ?? []
  );
}

const fallbackParagraphs = [
  "At Paragon, our responsibility extends beyond academic achievement. We seek to build a culture in which young people learn to think independently, care for others and approach every opportunity with purpose.",
  "With the partnership of families, educators and the wider community, we remain committed to an environment where every student is encouraged to grow, contribute and lead with integrity.",
];

export function PresidentsDeskPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "presidents-desk"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: PresidentPageData }>(
        "pages/presidents-desk",
      );
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const president = page?.sections.find(
    (section) => section.type === "president_desk_content" && section.is_active,
  );
  const settings =
    president?.settings && !Array.isArray(president.settings)
      ? president.settings
      : undefined;
  const paragraphs = htmlParagraphs(president?.description);
  const presidentIdentity = [settings?.president_name, settings?.president_position]
    .filter(Boolean)
    .join(" — ");

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <AboutDetailPage
      title={president?.title || banner?.title || page?.title || "President's Desk"}
      description={
        plainText(banner?.description) ||
        "A message from the President of Paragon School."
      }
      eyebrow={president?.name || "From our leadership"}
      introduction={
        presidentIdentity ||
        "Education must give children both strong roots and the confidence to explore new horizons."
      }
      paragraphs={paragraphs.length ? paragraphs : fallbackParagraphs}
      image={
        mediaUrl(president?.image, president?.image_url) ||
        mediaUrl(banner?.image, banner?.image_url) ||
        "/images/paragonmohali_bg.jpg"
      }
      imageAlt={settings?.president_name || "President of Paragon Senior School"}
      imageCaption={presidentIdentity || "Leading with purpose, building for tomorrow."}
    />
  );
}