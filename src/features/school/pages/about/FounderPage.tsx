import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AboutDetailPage } from "../../../../pages/AboutDetailPage";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type FounderSettings = {
  founder_name?: string;
  founder_position?: string;
};

type FounderSection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: FounderSettings | [];
};

type FounderPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: FounderSection[];
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
  "Paragon began with an ambitious yet enduring idea: young people flourish when knowledge, discipline and values are given equal importance.",
  "That founding purpose remains visible in the school’s culture today. It inspires every new initiative while keeping the institution grounded in service, responsibility and respect for each learner.",
];

export function FounderPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "founder"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: FounderPageData }>(
        "pages/founder",
      );
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const founder = page?.sections.find(
    (section) => section.type === "founder_content" && section.is_active,
  );
  const settings =
    founder?.settings && !Array.isArray(founder.settings)
      ? founder.settings
      : undefined;
  const paragraphs = htmlParagraphs(founder?.description);
  const founderIdentity = [settings?.founder_name, settings?.founder_position]
    .filter(Boolean)
    .join(" — ");

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <AboutDetailPage
      title={founder?.title || banner?.title || page?.title || "Founder"}
      description={
        plainText(banner?.description) ||
        "Meet the vision that established Paragon School."
      }
      eyebrow={founder?.name || "A founding purpose"}
      introduction={
        founderIdentity ||
        "A school created from the belief that education can shape lives and communities."
      }
      paragraphs={paragraphs.length ? paragraphs : fallbackParagraphs}
      image={
        mediaUrl(founder?.image, founder?.image_url) ||
        mediaUrl(banner?.image, banner?.image_url) ||
        "/images/paragon-school.webp"
      }
      imageAlt={`${settings?.founder_name || "Paragon School founder"}`}
      imageCaption={founderIdentity || "The vision that began Paragon’s journey."}
    />
  );
}