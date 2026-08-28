import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Images,
  X,
} from "lucide-react";
import {
  CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import { KidsPageBanner } from "../../components/KidsPageBanner";
import { kidsApi } from "../../api/kidsApi";
import { applyPageSeo, type PageSeo } from "../../../school/utils/pageSeo";

type GalleryImage = {
  image?: string | null;
  image_url?: string | null;
  alt?: string | null;
};

type GalleryAlbum = {
  title?: string;
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
  page: { title: string; slug: string; seo?: PageSeo };
  banner?: GallerySection;
  content?: GallerySection;
  albums?: GalleryAlbum[];
};

const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";
const categoryColors = ["#ef5f6c", "#20a98b", "#37a9df", "#f4a62a"];

function mediaUrl(image?: string | null, imageUrl?: string | null) {
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  if (imageUrl && !imageUrl.includes("localhost")) return imageUrl;
  return undefined;
}

function plainText(html?: string | null) {
  return html?.replace(/<br\s*\/?\s*>/gi, " ").replace(/<\/p>/gi, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || "";
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

function useInView<T extends HTMLElement>(
  threshold = 0.12
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return {
    ref,
    visible,
  };
}

/* =========================================================
   PAGE
========================================================= */

export function KidsGalleryCategoryPage() {
  const { categorySlug } = useParams();
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const { data, isError } = useQuery({
    queryKey: ["kids-gallery-category", categorySlug],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: GalleryCategoryResponse }>(`gallery/${categorySlug}`);
      return response.data.data;
    },
    enabled: Boolean(categorySlug),
  });

  const albums = (data?.albums ?? [])
    .map((album) => ({
      title: plainText(album.title) || data?.page.title || "Gallery album",
      photos: (album.images ?? []).flatMap((image, index) => {
        const src = mediaUrl(image.image, image.image_url);

        return src
          ? [
              {
                src,
                alt:
                  plainText(image.alt) ||
                  (plainText(album.title) || data?.page.title || "Gallery") +
                    " photograph " +
                    (index + 1),
              },
            ]
          : [];
      }),
    }))
    .filter((album) => album.photos.length > 0);
  const photos = albums.flatMap((album) => album.photos);
  const colorIndex = categorySlug
    ? Array.from(categorySlug).reduce((total, character) => total + character.charCodeAt(0), 0) % categoryColors.length
    : 0;
  const category = {
    title: data?.banner?.title || data?.page.title || categorySlug || "Gallery",
    description: plainText(data?.banner?.description),
    color: categoryColors[colorIndex],
    albums,
    photos,
  };
  const lightboxIndex = lightboxPhoto
    ? photos.findIndex((photo) => photo.src === lightboxPhoto.src)
    : -1;

  const {
    ref: headingRevealRef,
    visible: headingVisible,
  } = useInView<HTMLDivElement>(0.15);

  const {
    ref: galleryRevealRef,
    visible: galleryVisible,
  } = useInView<HTMLDivElement>(0.05);

  useEffect(() => {
    applyPageSeo(data?.page.seo);
  }, [data]);

  useEffect(() => {
    if (!lightboxPhoto || lightboxIndex < 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxPhoto(null);
      }

      if (event.key === "ArrowLeft") {
        const previousIndex =
          (lightboxIndex - 1 + photos.length) % photos.length;
        setLightboxPhoto(photos[previousIndex]);
      }

      if (event.key === "ArrowRight") {
        const nextIndex = (lightboxIndex + 1) % photos.length;
        setLightboxPhoto(photos[nextIndex]);
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxPhoto, lightboxIndex, photos]);

  if (!categorySlug || isError) {
    return (
      <Navigate
        replace
        to="/kids/gallery"
      />
    );
  }

  return (
    <>
      {/* =====================================================
          EXISTING KIDS BANNER
      ===================================================== */}

      <KidsPageBanner
        title={category.title}
        description={category.description}
      />

      {/* =====================================================
          GALLERY
      ===================================================== */}

      <main className="relative overflow-hidden bg-[#fffaf2] py-16 sm:py-20 lg:py-24">

        {/* =================================================
            BACKGROUND DECORATIONS
        ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-32
            top-24
            size-72
            rounded-full
            border-[45px]
            border-[#37a9df]/[.055]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-32
            top-[28%]
            size-80
            rounded-full
            border-[52px]
            border-[#ffd34e]/[.09]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-20
            bottom-[15%]
            size-60
            rounded-full
            bg-[#ef5f6c]/[.045]
          "
        />

        {/* dots */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[.18]
            [background-image:radial-gradient(#37a9df_1px,transparent_1px)]
            [background-size:34px_34px]
            [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_80%,transparent)]
          "
        />

        {/* floating decorations */}

        <span
          aria-hidden="true"
          className="
            kids-gallery-float
            pointer-events-none
            absolute
            left-[6%]
            top-24
            hidden
            rotate-[-12deg]
            text-3xl
            text-[#ffd34e]
            lg:block
          "
        >
          ★
        </span>

        <span
          aria-hidden="true"
          className="
            kids-gallery-float-alt
            pointer-events-none
            absolute
            right-[7%]
            top-[42%]
            hidden
            text-4xl
            text-[#ef5f6c]/60
            lg:block
          "
        >
          ✦
        </span>

        <span
          aria-hidden="true"
          className="
            kids-gallery-float
            pointer-events-none
            absolute
            bottom-[18%]
            left-[5%]
            hidden
            text-3xl
            text-[#20a98b]/60
            lg:block
          "
        >
          ●
        </span>

        <div className="container relative">

          {/* =================================================
              SECTION INTRO
          ================================================= */}

          <div
            ref={headingRevealRef}
            className={`
              mb-12
              flex
              flex-col
              gap-7
              transition-all
              duration-700
              sm:mb-14
              sm:flex-row
              sm:items-end
              sm:justify-between
              ${
                headingVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }
            `}
          >
            <div>
              {/* eyebrow */}

              <div className="flex items-center gap-3">
                <span
                  className="
                    grid
                    size-10
                    place-items-center
                    rounded-xl
                    text-white
                    shadow-lg
                  "
                  style={{
                    backgroundColor:
                      category.color,
                  }}
                >
                  <Camera size={18} />
                </span>

                <p
                  className="
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[.22em]
                  "
                  style={{
                    color:
                      category.color,
                  }}
                >
                  Photo Collection
                </p>
              </div>

              {/* heading */}

              <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-[#34305c] sm:text-4xl lg:text-5xl">
                <span className="relative inline-block">
                  {data?.content?.title || "Moments to remember"}

                  <span
                    className="
                      absolute
                      -bottom-2
                      left-0
                      h-[5px]
                      w-full
                      rounded-full
                      opacity-70
                    "
                    style={{
                      backgroundColor:
                        category.color,
                    }}
                  />
                </span>
              </h2>

              {data?.content?.description && (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#686477] sm:text-base">
                  {plainText(data.content.description)}
                </p>
              )}

              {/* colourful detail */}

              <div className="mt-7 flex items-center gap-2">
                <span className="h-1 w-9 rounded-full bg-[#ef5f6c]" />
                <span className="size-2 rounded-full bg-[#ffd34e]" />
                <span className="size-2 rounded-full bg-[#20a98b]" />
                <span className="size-2 rounded-full bg-[#37a9df]" />
              </div>
            </div>

            {/* PHOTO COUNT */}

            <div
              className="
                flex
                w-fit
                items-center
                gap-3
                rounded-full
                border
                border-[#34305c]/10
                bg-white
                px-5
                py-3
                shadow-[0_12px_35px_-24px_rgba(52,48,92,.4)]
              "
            >
              <span
                className="
                  grid
                  size-8
                  place-items-center
                  rounded-full
                  text-white
                "
                style={{
                  backgroundColor:
                    category.color,
                }}
              >
                <Images size={15} />
              </span>

              <span className="text-sm font-bold text-[#34305c]">
                {category.photos.length}{" "}
                photographs
              </span>
            </div>
          </div>

          {/* =================================================
              SCRAPBOOK GALLERY
          ================================================= */}

          <div
            ref={galleryRevealRef}
            className="space-y-12 sm:space-y-14 lg:space-y-16"
          >
            {category.albums.map((album, albumIndex) => (
              <section
                key={album.title + "-" + albumIndex}
                className={[
                  "relative rounded-[32px] border border-[#34305c]/10 bg-white/65 p-4 shadow-[0_20px_55px_-38px_rgba(52,48,92,.35)] backdrop-blur-[2px] sm:p-6 lg:p-7",
                  galleryVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0",
                  "transition-all duration-700 ease-out",
                ].join(" ")}
              >
                <div className="mb-7 flex flex-col gap-4 border-b border-[#34305c]/10 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className="grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-black text-white shadow-lg"
                      style={{ backgroundColor: category.color }}
                    >
                      {String(albumIndex + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <p
                        className="text-[10px] font-black uppercase tracking-[.2em]"
                        style={{ color: category.color }}
                      >
                        Activity album
                      </p>
                      <h3 className="mt-1 font-serif text-2xl font-bold leading-tight text-[#34305c] sm:text-3xl">
                        {album.title}
                      </h3>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-[#fffaf2] px-4 py-2 text-xs font-bold text-[#686477] ring-1 ring-[#34305c]/10">
                    {album.photos.length}{" "}
                    {album.photos.length === 1 ? "photograph" : "photographs"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-7">
                  {album.photos.map((photo, index) => {
                    const pattern = index % 6;
                    const layout =
                      pattern === 0
                        ? "lg:col-span-7"
                        : pattern === 1
                          ? "lg:col-span-5"
                          : pattern === 2
                            ? "lg:col-span-5"
                            : pattern === 3
                              ? "lg:col-span-7"
                              : "lg:col-span-6";
                    const height =
                      pattern === 0 || pattern === 3
                        ? "lg:h-[430px]"
                        : "lg:h-[360px]";
                    const rotation =
                      pattern === 0
                        ? "lg:-rotate-[1deg]"
                        : pattern === 1
                          ? "lg:rotate-[1.2deg]"
                          : pattern === 2
                            ? "lg:rotate-[.8deg]"
                            : pattern === 3
                              ? "lg:-rotate-[.8deg]"
                              : pattern === 4
                                ? "lg:rotate-[.6deg]"
                                : "lg:-rotate-[.6deg]";
                    const delay = Math.min(index * 80, 480);

                    return (
                      <figure
                        key={photo.src + "-" + index}
                        role="button"
                        tabIndex={0}
                        aria-label={"Open " + photo.alt + " in image viewer"}
                        onClick={() => setLightboxPhoto(photo)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setLightboxPhoto(photo);
                          }
                        }}
                        style={
                          {
                            "--delay": String(delay) + "ms",
                          } as CSSProperties
                        }
                        className={[
                          "group relative h-[300px] cursor-zoom-in sm:h-[340px]",
                          layout,
                          height,
                          rotation,
                          galleryVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0",
                          "transition-all duration-700 ease-out [transition-delay:var(--delay)] hover:!rotate-0 hover:-translate-y-2",
                        ].join(" ")}
                      >
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 translate-x-2 translate-y-2 rounded-[28px] opacity-20 transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3"
                          style={{ backgroundColor: category.color }}
                        />

                        <div className="relative size-full overflow-hidden rounded-[28px] border-[6px] border-white bg-white shadow-[0_22px_55px_-30px_rgba(52,48,92,.42)] transition-all duration-500 group-hover:shadow-[0_30px_65px_-28px_rgba(52,48,92,.5)]">
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            loading={albumIndex === 0 && index < 2 ? "eager" : "lazy"}
                            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                          />

                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#34305c]/80 via-[#34305c]/0 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                          <span
                            className="absolute right-4 top-4 grid size-9 translate-y-[-6px] place-items-center rounded-full bg-white text-xs font-black opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                            style={{ color: category.color }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <figcaption className="absolute inset-x-0 bottom-0 translate-y-5 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-6">
                            <div className="flex items-end gap-3">
                              <span
                                className="grid size-9 shrink-0 place-items-center rounded-xl text-white shadow-md"
                                style={{ backgroundColor: category.color }}
                              >
                                <ImageIcon size={16} />
                              </span>

                              <p className="text-sm font-bold leading-6 text-white sm:text-[15px]">
                                {photo.alt}
                              </p>
                            </div>
                          </figcaption>
                        </div>

                        {index % 3 === 0 && (
                          <span
                            aria-hidden="true"
                            className="absolute -top-2 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2 bg-[#ffd34e]/75 shadow-sm"
                          />
                        )}

                        {index % 4 === 1 && (
                          <span
                            aria-hidden="true"
                            className="absolute -right-3 -top-3 grid size-10 rotate-12 place-items-center rounded-xl bg-[#ef5f6c] text-lg text-white shadow-lg transition duration-500 group-hover:rotate-[25deg]"
                          >
                            ★
                          </span>
                        )}
                      </figure>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          {data && category.photos.length === 0 && (
            <div className="rounded-[24px] border border-[#34305c]/10 bg-white px-6 py-14 text-center text-[#6d697a] shadow-sm">
              Albums will appear here when photographs are published.
            </div>
          )}

          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <div className="mt-14 flex justify-center sm:mt-16">
            <Link
              to="/kids/gallery"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#34305c]
                px-6
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-[0_12px_30px_-15px_rgba(52,48,92,.6)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#ef5f6c]
                hover:shadow-lg
              "
            >
              <span
                className="
                  grid
                  size-8
                  place-items-center
                  rounded-full
                  bg-white/10
                  transition-transform
                  duration-300
                  group-hover:-translate-x-1
                "
              >
                <ArrowLeft size={16} />
              </span>

              Back to all categories
            </Link>
          </div>
        </div>

        {/* =================================================
            LOCAL ANIMATIONS
        ================================================= */}

        <style>{`
          @keyframes kidsGalleryFloat {
            0%, 100% {
              transform: translateY(0) rotate(-8deg);
            }

            50% {
              transform: translateY(-12px) rotate(5deg);
            }
          }

          @keyframes kidsGalleryFloatAlt {
            0%, 100% {
              transform: translateY(0) rotate(5deg);
            }

            50% {
              transform: translateY(12px) rotate(-8deg);
            }
          }

          .kids-gallery-float {
            animation: kidsGalleryFloat 4.5s ease-in-out infinite;
          }

          .kids-gallery-float-alt {
            animation: kidsGalleryFloatAlt 5.5s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .kids-gallery-float,
            .kids-gallery-float-alt {
              animation: none;
            }
          }
        `}</style>
      </main>

      {lightboxPhoto && lightboxIndex >= 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kids gallery image viewer"
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-[#071b34]/92 p-3 backdrop-blur-md sm:p-6"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              setLightboxPhoto(null);
            }
          }}
        >
          <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
              {lightboxIndex + 1} / {photos.length}
            </span>

            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close image viewer"
              className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:rotate-90 hover:bg-white hover:text-[#34305c]"
            >
              <X size={21} />
            </button>
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const previousIndex =
                  (lightboxIndex - 1 + photos.length) % photos.length;
                setLightboxPhoto(photos[previousIndex]);
              }}
              aria-label="View previous photograph"
              className="absolute left-3 z-20 grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-[#34305c] sm:left-6 sm:size-12"
            >
              <ChevronLeft size={23} />
            </button>
          )}

          <figure className="flex max-h-[calc(100vh-6rem)] max-w-[min(94vw,1200px)] flex-col items-center overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_30px_100px_rgba(0,0,0,.5)] sm:p-3">
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.alt}
              className="max-h-[calc(100vh-10rem)] max-w-full rounded-[16px] object-contain"
            />
            <figcaption className="max-w-3xl px-4 py-3 text-center text-sm font-bold text-[#34305c] sm:text-base">
              {lightboxPhoto.alt}
            </figcaption>
          </figure>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const nextIndex = (lightboxIndex + 1) % photos.length;
                setLightboxPhoto(photos[nextIndex]);
              }}
              aria-label="View next photograph"
              className="absolute right-3 z-20 grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-[#34305c] sm:right-6 sm:size-12"
            >
              <ChevronRight size={23} />
            </button>
          )}
        </div>
      )}
    </>
  );
}