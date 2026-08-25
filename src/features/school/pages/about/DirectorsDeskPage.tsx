import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AboutDetailPage } from "../../../../pages/AboutDetailPage";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type DirectorSettings = {
  director_name?: string;
  director_position?: string;
};

type DirectorSection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: DirectorSettings | [];
};

type DirectorPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: DirectorSection[];
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
  "As we move forward, we remain committed to upholding the values that have shaped Paragon. Our vision blends tradition with modernity—nurturing creativity, character and critical thinking while embracing new educational opportunities.",
  "Together with our educators, supportive parents and bright young learners, we will continue to create a school community where every child is valued, inspired and prepared for a promising future.",
];

export function DirectorsDeskPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "directors-desk"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: DirectorPageData }>(
        "pages/directors-desk",
      );
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const director = page?.sections.find(
    (section) => section.type === "director_desk_content" && section.is_active,
  );
  const settings =
    director?.settings && !Array.isArray(director.settings)
      ? director.settings
      : undefined;
  const paragraphs = htmlParagraphs(director?.description);
  const directorIdentity = [settings?.director_name, settings?.director_position]
    .filter(Boolean)
    .join(" — ");

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <AboutDetailPage
      title={director?.title || banner?.title || page?.title || "Director's Desk"}
      description={
        plainText(banner?.description) ||
        "A message from the Director of Paragon School."
      }
      eyebrow={director?.name || "From our leadership"}
      introduction={
        directorIdentity ||
        "Our legacy is rooted in excellence, innovation and an unwavering commitment to young minds."
      }
      paragraphs={paragraphs.length ? paragraphs : fallbackParagraphs}
      image={
        mediaUrl(director?.image, director?.image_url) ||
        mediaUrl(banner?.image, banner?.image_url) ||
        "/images/para-students.png"
      }
      imageAlt={settings?.director_name || "Director of Paragon Senior School"}
      imageCaption={directorIdentity || "Every decision begins with the future of our learners."}
    />
  );
}