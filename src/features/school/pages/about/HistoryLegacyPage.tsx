import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AboutDetailPage } from "../../../../pages/AboutDetailPage";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type HistorySection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
};

type HistoryPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: HistorySection[];
};

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(image?: string | null, imageUrl?: string | null) {
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  return undefined;
}

function plainText(html?: string | null) {
  return html?.replace(/<[^>]*>/g, "").trim() || "";
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
  "Founded in 1981, Paragon Senior Secondary School has grown with a clear commitment to meaningful education and the all-round development of every learner.",
  "Across generations, the school has brought academic rigour together with character, responsibility and opportunity. That enduring philosophy continues to guide how Paragon prepares young people for a changing world.",
];

export function HistoryLegacyPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "history-and-legacy"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: HistoryPageData }>(
        "pages/history-and-legacy",
      );
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const history = page?.sections.find(
    (section) => section.type === "history_legacy_content" && section.is_active,
  );
  const paragraphs = htmlParagraphs(history?.description);

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <AboutDetailPage
      title={history?.title || banner?.title || page?.title || "History and Legacy"}
      description={
        plainText(banner?.description) ||
        "Explore the journey and enduring legacy of Paragon School."
      }
      eyebrow={history?.name || "Our story"}
      introduction={
        plainText(banner?.description) ||
        "More than four decades of learning, values and purposeful growth."
      }
      paragraphs={paragraphs.length ? paragraphs : fallbackParagraphs}
      image={
        mediaUrl(history?.image, history?.image_url) ||
        mediaUrl(banner?.image, banner?.image_url) ||
        "/images/paragonmohali_bg.jpg"
      }
      imageAlt={`${history?.title || page?.title || "Paragon School history"} image`}
      imageCaption={history?.title || "A legacy built for the generations ahead."}
    />
  );
}