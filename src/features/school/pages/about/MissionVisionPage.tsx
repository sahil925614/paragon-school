import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AboutDetailPage } from "../../../../pages/AboutDetailPage";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type MissionSection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
};

type MissionPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: MissionSection[];
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
  "Our mission is to provide a balanced education that encourages curiosity, discipline, creativity and confidence. We create space for students to understand deeply, communicate clearly and act responsibly.",
  "Our vision is a learning community where academic excellence and strong human values grow together—equipping every learner to contribute with integrity in school, society and the wider world.",
];

export function MissionVisionPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "mission-and-vision"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: MissionPageData }>(
        "pages/mission-and-vision",
      );
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const mission = page?.sections.find(
    (section) => section.type === "mission_vision_content" && section.is_active,
  );
  const paragraphs = htmlParagraphs(mission?.description);

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <AboutDetailPage
      bannerImage={banner?.image}
      bannerImageUrl={banner?.image_url}
      title={mission?.title || banner?.title || page?.title || "Mission and Vision"}
      description={
        plainText(banner?.description) ||
        "The purpose and principles that guide education at Paragon."
      }
      eyebrow={mission?.name || "Our direction"}
      introduction=""
      paragraphs={paragraphs.length ? paragraphs : fallbackParagraphs}
      image={
        mediaUrl(mission?.image, mission?.image_url) ||
        mediaUrl(banner?.image, banner?.image_url) ||
        "/images/para-students.png"
      }
      imageAlt={`${mission?.title || page?.title || "Paragon School mission and vision"} image`}
      imageCaption={mission?.title || "Every learner prepared to meet a wider world."}
    />
  );
}