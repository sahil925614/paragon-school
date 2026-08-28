import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AboutDetailPage } from "../../../../pages/AboutDetailPage";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type AboutDirectorSettings = {
  about_director_name?: string;
  about_director_position?: string;
};

type AboutDirectorSection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: AboutDirectorSettings | [];
};

type AboutDirectorPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: AboutDirectorSection[];
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
  "The Director’s approach reflects a deep commitment to academic excellence, thoughtful innovation and the continued development of a caring, future-ready school environment.",
  "Working closely with educators and families, the role brings strategic direction to the school while ensuring that each new step remains connected to Paragon’s learner-first philosophy.",
];

export function AboutDirectorPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "about-director"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: AboutDirectorPageData }>(
        "pages/about-director",
      );
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const director = page?.sections.find(
    (section) => section.type === "about_director_content" && section.is_active,
  );
  const settings =
    director?.settings && !Array.isArray(director.settings)
      ? director.settings
      : undefined;
  const paragraphs = htmlParagraphs(director?.description);
  const directorIdentity = [
    settings?.about_director_name,
    settings?.about_director_position,
  ]
    .filter(Boolean)
    .join(" — ");

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <AboutDetailPage
      bannerImage={banner?.image}
      bannerImageUrl={banner?.image_url}
      title={director?.title || banner?.title || page?.title || "About Director"}
      description={
        plainText(banner?.description) ||
        "Learn about the leadership and approach of our Director."
      }
      eyebrow={director?.name || "Leadership profile"}
      introduction={
        directorIdentity ||
        "Progressive leadership grounded in the values and educational purpose of Paragon."
      }
      paragraphs={paragraphs.length ? paragraphs : fallbackParagraphs}
      image={
        mediaUrl(director?.image, director?.image_url) ||
        mediaUrl(banner?.image, banner?.image_url) ||
        "/images/paragon-school.webp"
      }
      imageAlt={settings?.about_director_name || "Director of Paragon Senior School"}
      imageCaption={directorIdentity || "Direction shaped by experience, empathy and ambition."}
    />
  );
}