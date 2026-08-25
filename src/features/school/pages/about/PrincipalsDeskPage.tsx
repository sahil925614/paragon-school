import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AboutDetailPage } from "../../../../pages/AboutDetailPage";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type PrincipalSettings = {
  principal_name?: string;
  principal_position?: string;
};

type PrincipalSection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: PrincipalSettings | [];
};

type PrincipalPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: PrincipalSection[];
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
  "Our classrooms are places where questions are welcomed, effort is valued and every student is supported in finding their strengths. Academic learning becomes most meaningful when it develops confidence, judgement and character.",
  "The partnership between students, teachers and parents makes this possible. Together, we nurture a positive school culture in which children feel secure, challenged and ready to take responsibility for their growth.",
];

export function PrincipalsDeskPage() {
  const { data: page } = useQuery({
    queryKey: ["school-page", "principals-desk"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: PrincipalPageData }>(
        "pages/principals-desk",
      );
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const principal = page?.sections.find(
    (section) => section.type === "principal_desk_content" && section.is_active,
  );
  const settings =
    principal?.settings && !Array.isArray(principal.settings)
      ? principal.settings
      : undefined;
  const paragraphs = htmlParagraphs(principal?.description);
  const configuredName = settings?.principal_name?.trim();
  const principalName =
    configuredName && !/^principal name$/i.test(configuredName)
      ? configuredName
      : principal?.title;
  const principalIdentity = [principalName, settings?.principal_position]
    .filter(Boolean)
    .join(" — ");

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);

  return (
    <AboutDetailPage
      title={banner?.title || page?.title || "Principal's Desk"}
      description={
        plainText(banner?.description) ||
        "A message from the Principal of Paragon School."
      }
      eyebrow={principal?.name || "From our leadership"}
      introduction={
        principalIdentity ||
        "A thriving school is built through curiosity, care and high expectations for every learner."
      }
      paragraphs={paragraphs.length ? paragraphs : fallbackParagraphs}
      image={
        mediaUrl(principal?.image, principal?.image_url) ||
        mediaUrl(banner?.image, banner?.image_url) ||
        "/images/para-students.png"
      }
      imageAlt={principalName || "Principal of Paragon Senior School"}
      imageCaption={principalIdentity || "A caring culture where every student can thrive."}
    />
  );
}