import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Camera, ChevronRight, Home, Images } from "lucide-react";
import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

type GalleryImage = {
  image?: string;
  image_url?: string;
};

type GalleryAlbum = {
  title: string;
  images?: GalleryImage[];
};

type GallerySection = {
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
};

type GalleryCategoryResponse = {
  page: {
    title: string;
    slug: string;
    seo?: PageSeo;
  };
  banner?: GallerySection;
  content?: GallerySection;
  albums?: GalleryAlbum[];
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

export function GalleryCategoryPage() {
  const { categorySlug } = useParams();
  const { data, isError } = useQuery({
    queryKey: ["school-gallery-category", categorySlug],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: GalleryCategoryResponse }>(
        `gallery/${categorySlug}`,
      );
      return response.data.data;
    },
    enabled: Boolean(categorySlug),
  });

  const albums = data?.albums ?? [];
  const firstPhoto = albums
    .flatMap((album) => album.images ?? [])
    .map((image) => mediaUrl(image.image, image.image_url))
    .find(Boolean);
  const heroImage =
    mediaUrl(data?.banner?.image, data?.banner?.image_url) ||
    mediaUrl(data?.content?.image, data?.content?.image_url) ||
    firstPhoto;

  useEffect(() => {
    applyPageSeo(data?.page.seo);
  }, [data]);

  if (!categorySlug || isError) {
    return <Navigate replace to="/school/gallery" />;
  }

  return (
    <main className="bg-[#fbfaf7]">
      <section className="relative isolate min-h-[390px] overflow-hidden bg-navy text-white sm:min-h-[470px]">
        {heroImage && (
          <img src={heroImage} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071b2c]/95 via-[#102a43]/82 to-[#102a43]/45" />
        <div className="container flex min-h-[390px] flex-col justify-center py-14 sm:min-h-[470px] sm:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-300 sm:text-xs">
            <Link to="/school" className="inline-flex items-center gap-2 hover:text-white">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} className="text-gold" />
            <Link to="/school/gallery" className="hover:text-white">Gallery</Link>
            <ChevronRight size={14} className="text-gold" />
            <span className="text-white">{data?.page.title || categorySlug}</span>
          </nav>

          <div className="mt-10 max-w-3xl sm:mt-12">
            <div className="grid size-12 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur sm:size-13">
              <Camera size={24} />
            </div>
            <h1 className="mt-5 font-serif text-4xl leading-tight sm:mt-6 sm:text-6xl lg:text-7xl">
              {data?.banner?.title || data?.page.title || categorySlug}
            </h1>
            {data?.banner?.description && (
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:mt-5 sm:text-lg sm:leading-8">
                {plainText(data.banner.description)}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="container relative">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow flex items-center gap-2 text-gold-dark">
              <Images size={15} /> Photo collections
            </p>
            <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
              {data?.content?.title || data?.page.title || "Gallery"}
            </h2>
            {data?.content?.description && (
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {plainText(data.content.description)}
              </p>
            )}
          </div>

          <div className="space-y-14 sm:space-y-18">
            {albums.map((album, albumIndex) => {
              const photos = (album.images ?? [])
                .map((image) => mediaUrl(image.image, image.image_url))
                .filter((image): image is string => Boolean(image));

              return (
                <article key={`${album.title}-${albumIndex}`}>
                  <div className="mb-6 flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c72c3b]">
                        Album {String(albumIndex + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 font-serif text-2xl text-navy sm:text-3xl">
                        {album.title}
                      </h3>
                    </div>
                    <p className="text-sm font-semibold text-slate-500">
                      {photos.length} {photos.length === 1 ? "photograph" : "photographs"}
                    </p>
                  </div>

                  <div className="grid auto-rows-[220px] gap-4 sm:grid-cols-2 sm:auto-rows-[260px] lg:grid-cols-3">
                    {photos.map((photo, photoIndex) => (
                      <a
                        key={`${photo}-${photoIndex}`}
                        href={photo}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${album.title} photograph ${photoIndex + 1}`}
                        className={`group relative overflow-hidden rounded-[18px] bg-slate-200 shadow-sm ${
                          photoIndex === 0 ? "sm:row-span-2" : ""
                        } ${photoIndex === 3 ? "lg:col-span-2" : ""}`}
                      >
                        <img
                          src={photo}
                          alt={`${album.title} photograph ${photoIndex + 1}`}
                          loading={albumIndex === 0 && photoIndex < 2 ? "eager" : "lazy"}
                          className="size-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        <span className="absolute bottom-4 right-4 grid size-9 translate-y-2 place-items-center rounded-full bg-white text-navy opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
                          <Camera size={16} />
                        </span>
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          {data && albums.length === 0 && (
            <div className="rounded-[22px] border border-slate-200 bg-white px-6 py-14 text-center text-slate-500">
              Albums will appear here when photographs are published.
            </div>
          )}

          <Link to="/school/gallery" className="mt-12 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-6 py-3 text-sm font-bold text-navy shadow-sm transition hover:-translate-y-0.5 hover:border-navy/30">
            <ArrowLeft size={17} /> Back to all categories
          </Link>
        </div>
      </section>
    </main>
  );
}
