import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Images } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { PageBanner } from "../../../components/PageBanner";
import { schoolApi } from "../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../utils/pageSeo";

type GalleryCategory = {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  url?: string;
};

type GallerySection = {
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
};

type GalleryResponse = {
  page: {
    title: string;
    slug: string;
    seo?: PageSeo;
  };
  banner?: GallerySection;
  content?: GallerySection;
  categories?: GalleryCategory[];
};

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

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

export function GalleryPage() {
  const { data } = useQuery({
    queryKey: ["school-gallery"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: GalleryResponse }>("gallery");
      return response.data.data;
    },
  });

  const categories = data?.categories ?? [];

  useEffect(() => {
    applyPageSeo(data?.page.seo);
  }, [data]);

  return (
    <>
      <PageBanner
        image={data?.banner?.image}
        imageUrl={data?.banner?.image_url}
        title={data?.banner?.title || data?.page.title || "Gallery"}
        description={plainText(data?.banner?.description)}
      />

      <main className="relative isolate overflow-hidden border-t border-slate-200/70 bg-[#f4f7f8] py-14 sm:py-18 lg:py-22">
        <BackgroundDecoration />

        <div className="container relative">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12 lg:mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c72c3b] sm:text-[11px]">
              Gallery collections
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-navy sm:text-4xl lg:text-[42px]">
              {data?.content?.title || data?.page.title || "Gallery"}
            </h2>
            {data?.content?.description && (
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                {plainText(data.content.description)}
              </p>
            )}
            <div className="mx-auto mt-5 h-[2px] w-11 rounded-full bg-[#c72c3b]" />
          </div>

          {categories.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
              {categories.map((category, index) => {
                const cover = mediaUrl(category.image, category.image_url);

                return (
                  <Link
                    key={category.id || category.slug}
                    to={`/school/gallery/${category.slug}`}
                    className="group relative isolate min-h-[330px] overflow-hidden rounded-[22px] bg-navy shadow-[0_15px_40px_-24px_rgba(15,42,67,.45)] ring-1 ring-slate-900/[.04] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_25px_55px_-25px_rgba(15,42,67,.55)] sm:min-h-[370px] lg:min-h-[400px]"
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        loading={index < 3 ? "eager" : "lazy"}
                        className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                      />
                    ) : (
                      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-navy to-[#1d4b6e]" />
                    )}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071b2c] via-[#071b2c]/55 to-transparent" />

                    <span className="absolute right-5 top-5 text-[11px] font-bold tracking-[0.12em] text-white/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                      <div className="mb-5 grid size-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#c72c3b]/60 group-hover:bg-[#c72c3b]">
                        <Images size={20} strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <h3 className="max-w-[90%] font-serif text-[25px] leading-[1.15] text-white sm:text-[27px] lg:text-[29px]">
                        {category.title}
                      </h3>
                      <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/90">
                          Open collection
                        </span>
                        <span className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 group-hover:border-[#c72c3b] group-hover:bg-[#c72c3b]">
                          <ArrowRight size={15} strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#c72c3b] transition-all duration-500 group-hover:w-full" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[22px] border border-slate-200 bg-white px-6 py-14 text-center text-slate-500">
              Gallery categories will appear here when they are published.
            </div>
          )}

          {categories.length > 0 && (
            <div className="mt-10 flex items-center justify-center gap-2.5 text-center text-xs text-slate-500 sm:mt-12 sm:text-sm">
              <Images size={17} className="shrink-0 text-[#c72c3b]" strokeWidth={1.8} />
              <span>{categories.length} gallery {categories.length === 1 ? "category" : "categories"}</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function BackgroundDecoration() {
  return (
    <>
      <div className="pointer-events-none absolute -left-[115px] top-[90px] -z-10 size-[260px] rounded-full border-[30px] border-[#c72c3b]/[0.045] sm:-left-[125px] sm:size-[310px] sm:border-[36px] lg:-left-[145px] lg:top-[120px] lg:size-[360px] lg:border-[42px]" />
      <div className="pointer-events-none absolute -right-[120px] top-[32%] -z-10 size-[260px] rounded-full bg-[#0b2e57]/[0.025] sm:-right-[140px] sm:size-[330px] lg:-right-[170px] lg:size-[420px]" />
      <div className="pointer-events-none absolute -bottom-[150px] left-[15%] -z-10 size-[280px] rounded-full border-[34px] border-[#0b2e57]/[0.025] lg:size-[380px] lg:border-[46px]" />
    </>
  );
}
