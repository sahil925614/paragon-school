import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Images,
  X,
  Maximize2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { PageBanner } from "../../../../components/PageBanner";
import { schoolApi } from "../../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../../utils/pageSeo";

/* =========================================================
   TYPES
========================================================= */

type Flashback = {
  title: string;
  description: string;
  images?: string[];
};

type FlashbackImageData = {
  image?: string;
  image_url?: string;
};

type FlashbackCardData = {
  title?: string;
  description?: string | null;
  images?: FlashbackImageData[];
};

type FlashbackSettings = {
  cards?: FlashbackCardData[];
};

type FlashbackSection = {
  type: string;
  title?: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: FlashbackSettings | [];
};

type FlashbacksPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: FlashbackSection[];
};

/* =========================================================
   MEDIA
========================================================= */

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(image?: string, imageUrl?: string) {
  if (image) {
    return `${storageBaseUrl}${image.replace(/^\/+/, "")}`;
  }

  if (imageUrl && !imageUrl.includes("localhost")) {
    return imageUrl;
  }

  return undefined;
}

/* =========================================================
   TEXT HELPERS
========================================================= */

function repairText(value: string) {
  return value
    .replace(/â€™/g, "’")
    .replace(/â€˜/g, "‘")
    .replace(/â€œ/g, "“")
    .replace(/â€/g, "”")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/Â/g, "");
}

function plainText(html?: string | null) {
  const text =
    html
      ?.replace(/<br\s*\/?\s*>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim() || "";

  return repairText(text);
}

function repairHtml(html?: string | null) {
  if (!html) return "";
  return repairText(html).trim();
}

/* =========================================================
   PAGE
========================================================= */

export function FlashbacksPage() {
  const { data: flashbacksPage } = useQuery({
    queryKey: ["school-page", "flashbacks"],

    queryFn: async () => {
      const response = await schoolApi.get<{
        data: FlashbacksPageData;
      }>("pages/flashbacks");

      return response.data.data;
    },
  });

  const banner = flashbacksPage?.sections.find(
    (section) =>
      section.type === "home_banner" &&
      section.is_active,
  );

  const content = flashbacksPage?.sections.find(
    (section) =>
      section.type === "flashbacks_content" &&
      section.is_active,
  );

  const contentSettings =
    content?.settings &&
    !Array.isArray(content.settings)
      ? content.settings
      : undefined;

  const apiFlashbacks: Flashback[] = (
    contentSettings?.cards || []
  )
    .filter((card) => card.title)
    .map((card, index) => {
      const images = (card.images || [])
        .map((image) =>
          mediaUrl(image.image, image.image_url),
        )
        .filter(
          (image): image is string =>
            Boolean(image),
        );

      return {
        title: repairText(
          card.title || `Flashback ${index + 1}`,
        ),
        description: repairHtml(card.description),
        images,
      };
    });

  useEffect(() => {
    applyPageSeo(flashbacksPage?.seo);
  }, [flashbacksPage]);

  return (
    <>
      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={
          banner?.title ||
          flashbacksPage?.title ||
          "Flashbacks"
        }
        description={
          plainText(banner?.description) ||
          "Flashbacks"
        }
      />

      <main className="relative overflow-hidden bg-[#f8f9fa]">
        {/* BACKGROUND DECORATION */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-48
            top-52
            size-[420px]
            rounded-full
            border-[55px]
            border-[#c72c3b]/[.025]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-52
            top-[55%]
            size-[460px]
            rounded-full
            border-[60px]
            border-navy/[.02]
          "
        />

        <section className="container py-14 sm:py-16 lg:py-20">
          {/* PAGE HEADING */}

          <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#c72c3b] sm:text-[11px]">
              {plainText(content?.description) ||
                "School Memories"}
            </p>

            <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl lg:text-[44px]">
              {content?.title || "Flashbacks"}
            </h1>

            <div className="mx-auto mt-4 h-[2px] w-11 bg-[#c72c3b]" />
          </header>

          {/* TIMELINE */}

          <div className="relative mx-auto max-w-6xl">
            <div
              aria-hidden="true"
              className="
                absolute
                bottom-0
                left-[38px]
                top-0
                hidden
                w-px
                bg-gradient-to-b
                from-slate-200
                via-slate-200
                to-transparent
                lg:block
              "
            />

            <div className="space-y-10 sm:space-y-12 lg:space-y-14">
              {apiFlashbacks.map(
                (flashback, index) => (
                  <FlashbackStory
                    key={`${flashback.title}-${index}`}
                    flashback={flashback}
                    index={index}
                  />
                ),
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* =========================================================
   STORY
========================================================= */

function FlashbackStory({
  flashback,
  index,
}: {
  flashback: Flashback;
  index: number;
}) {
  const images = flashback.images || [];

  return (
    <article
      className="
        relative
        lg:grid
        lg:grid-cols-[78px_minmax(0,1fr)]
        lg:gap-8
      "
    >
      {/* TIMELINE NUMBER */}

      <div className="relative z-10 hidden lg:block">
        <div
          className="
            grid
            size-[76px]
            place-items-center
            rounded-full
            border
            border-slate-200
            bg-white
            shadow-[0_10px_30px_-20px_rgba(7,27,58,.35)]
          "
        >
          <span className="font-serif text-xl text-navy">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* CARD */}

      <div
        className="
          overflow-hidden
          rounded-[22px]
          border
          border-slate-200/80
          bg-white
          shadow-[0_16px_45px_-38px_rgba(7,27,58,.3)]
          sm:rounded-[24px]
        "
      >
        {/* =====================================================
            IMAGES FIRST
        ===================================================== */}

        {images.length > 0 && (
          <CompactGallery
            images={images}
            title={flashback.title}
            storyIndex={index}
          />
        )}

        {/* =====================================================
            CONTENT AFTER IMAGES
        ===================================================== */}

        <div className="px-6 pb-7 pt-7 sm:px-8 sm:pb-8 sm:pt-8 lg:px-10">
          {/* MOBILE LABEL */}

          <div className="mb-3 flex items-center gap-3 lg:hidden">
            <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c72c3b]">
              Flashback{" "}
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="h-px w-8 bg-slate-200" />
          </div>

          {/* DESKTOP LABEL */}

          <div className="hidden items-center gap-3 lg:flex">
            <span className="text-[9px] font-bold uppercase tracking-[.22em] text-[#c72c3b]">
              Flashback
            </span>

            <span className="h-px w-8 bg-slate-200" />

            {images.length > 0 && (
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[.15em] text-slate-400">
                <Images size={12} />

                {images.length}{" "}
                {images.length === 1
                  ? "photograph"
                  : "photographs"}
              </span>
            )}
          </div>

          <h2
            className="
              mt-2
              max-w-4xl
              font-serif
              text-[27px]
              leading-[1.2]
              text-navy
              sm:text-[31px]
              lg:mt-3
              lg:text-[34px]
            "
          >
            {flashback.title}
          </h2>

          <div className="mt-4 h-[2px] w-9 bg-[#c72c3b]" />

          {flashback.description && (
            <div
              className="
                mt-5
                max-w-5xl
                text-[14px]
                leading-[1.85]
                text-slate-600
                sm:text-[15px]
                [&_p]:mb-4
                [&_p:last-child]:mb-0
                [&_strong]:font-bold
                [&_b]:font-bold
                [&_em]:italic
                [&_i]:italic
                [&_u]:underline
                [&_a]:text-[#c72c3b]
                [&_a]:underline
                [&_ul]:my-4
                [&_ul]:list-disc
                [&_ul]:pl-6
                [&_ol]:my-4
                [&_ol]:list-decimal
                [&_ol]:pl-6
                [&_li]:mb-1
              "
              dangerouslySetInnerHTML={{
                __html: flashback.description,
              }}
            />
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   COMPACT GALLERY
========================================================= */

function CompactGallery({
  images,
  title,
  storyIndex,
}: {
  images: string[];
  title: string;
  storyIndex: number;
}) {
  const [modalIndex, setModalIndex] =
    useState<number | null>(null);

  /* ONE IMAGE */

  if (images.length === 1) {
    return (
      <>
        <div className="h-[260px] overflow-hidden border-b border-slate-100 bg-[#f1f3f5] sm:h-[330px] lg:h-[380px]">
          <GalleryImage
            src={images[0]}
            title={title}
            index={0}
            eager={storyIndex === 0}
            onClick={() => setModalIndex(0)}
          />
        </div>

        <ImageModal
          images={images}
          title={title}
          activeIndex={modalIndex}
          onChange={setModalIndex}
          onClose={() => setModalIndex(null)}
        />
      </>
    );
  }

  /* TWO IMAGES */

  if (images.length === 2) {
    return (
      <>
        <div
          className="
            grid
            h-[260px]
            grid-cols-2
            gap-[2px]
            overflow-hidden
            border-b
            border-slate-100
            bg-[#eef1f3]
            sm:h-[330px]
            lg:h-[380px]
          "
        >
          {images.map((src, index) => (
            <GalleryImage
              key={`${src}-${index}`}
              src={src}
              title={title}
              index={index}
              eager={
                storyIndex === 0 && index === 0
              }
              onClick={() => setModalIndex(index)}
            />
          ))}
        </div>

        <ImageModal
          images={images}
          title={title}
          activeIndex={modalIndex}
          onChange={setModalIndex}
          onClose={() => setModalIndex(null)}
        />
      </>
    );
  }

  /* THREE IMAGES */

  if (images.length === 3) {
    return (
      <>
        <div
          className="
            grid
            h-[280px]
            grid-cols-2
            grid-rows-2
            gap-[2px]
            overflow-hidden
            border-b
            border-slate-100
            bg-[#eef1f3]
            sm:h-[350px]
            lg:h-[400px]
          "
        >
          <div className="row-span-2 min-h-0">
            <GalleryImage
              src={images[0]}
              title={title}
              index={0}
              eager={storyIndex === 0}
              onClick={() => setModalIndex(0)}
            />
          </div>

          <GalleryImage
            src={images[1]}
            title={title}
            index={1}
            onClick={() => setModalIndex(1)}
          />

          <GalleryImage
            src={images[2]}
            title={title}
            index={2}
            onClick={() => setModalIndex(2)}
          />
        </div>

        <ImageModal
          images={images}
          title={title}
          activeIndex={modalIndex}
          onChange={setModalIndex}
          onClose={() => setModalIndex(null)}
        />
      </>
    );
  }

  /* FOUR IMAGES */

  if (images.length === 4) {
    return (
      <>
        <div
          className="
            grid
            h-[300px]
            grid-cols-2
            grid-rows-2
            gap-[2px]
            overflow-hidden
            border-b
            border-slate-100
            bg-[#eef1f3]
            sm:h-[370px]
            lg:h-[420px]
          "
        >
          {images.map((src, index) => (
            <GalleryImage
              key={`${src}-${index}`}
              src={src}
              title={title}
              index={index}
              eager={
                storyIndex === 0 && index === 0
              }
              onClick={() => setModalIndex(index)}
            />
          ))}
        </div>

        <ImageModal
          images={images}
          title={title}
          activeIndex={modalIndex}
          onChange={setModalIndex}
          onClose={() => setModalIndex(null)}
        />
      </>
    );
  }

  /* 5+ IMAGES */

  return (
    <CompactSlider
      images={images}
      title={title}
      eager={storyIndex === 0}
    />
  );
}

/* =========================================================
   COMPACT SLIDER
========================================================= */

function CompactSlider({
  images,
  title,
  eager = false,
}: {
  images: string[];
  title: string;
  eager?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const [modalIndex, setModalIndex] =
    useState<number | null>(null);

  const timer = useRef<number | null>(null);

  function previous() {
    setActive(
      (current) =>
        (current - 1 + images.length) %
        images.length,
    );
  }

  function next() {
    setActive(
      (current) =>
        (current + 1) % images.length,
    );
  }

  useEffect(() => {
    if (
      paused ||
      images.length <= 1 ||
      modalIndex !== null
    ) {
      return;
    }

    timer.current = window.setInterval(() => {
      setActive(
        (current) =>
          (current + 1) % images.length,
      );
    }, 4500);

    return () => {
      if (timer.current) {
        window.clearInterval(timer.current);
      }
    };
  }, [paused, images.length, modalIndex]);

  return (
    <>
      <div
        className="
          relative
          h-[290px]
          overflow-hidden
          border-b
          border-slate-100
          bg-[#eef1f3]
          sm:h-[360px]
          lg:h-[410px]
        "
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* SLIDES */}

        {images.map((src, index) => (
          <button
            type="button"
            key={`${src}-${index}`}
            onClick={() => setModalIndex(index)}
            aria-label={`Open photograph ${index + 1}`}
            className={`
              absolute
              inset-0
              size-full
              cursor-zoom-in
              transition-all
              duration-700

              ${
                index === active
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-[1.015] opacity-0"
              }
            `}
          >
            <img
              src={src}
              alt={`${title} photograph ${index + 1}`}
              loading={
                eager && index === 0
                  ? "eager"
                  : "lazy"
              }
              className="
                size-full
                object-contain
                p-1
              "
            />
          </button>
        ))}

        {/* LIGHT OVERLAY */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/20 via-transparent to-transparent" />

        {/* COUNTER */}

        <div
          className="
            absolute
            left-4
            top-4
            z-20
            flex
            items-center
            gap-2
            rounded-full
            bg-navy/70
            px-3
            py-1.5
            text-[10px]
            font-bold
            text-white
            shadow-sm
            backdrop-blur-md
          "
        >
          <Images size={13} />
          {active + 1} / {images.length}
        </div>

        {/* VIEW ICON */}

        <button
          type="button"
          onClick={() => setModalIndex(active)}
          aria-label="View full image"
          className="
            absolute
            right-4
            top-4
            z-20
            grid
            size-9
            place-items-center
            rounded-full
            bg-navy/70
            text-white
            backdrop-blur-md
            transition
            hover:bg-white
            hover:text-navy
          "
        >
          <Maximize2 size={15} />
        </button>

        {/* PREVIOUS */}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            previous();
          }}
          aria-label="Previous photograph"
          className="
            absolute
            left-4
            top-1/2
            z-20
            grid
            size-10
            -translate-y-1/2
            place-items-center
            rounded-full
            border
            border-white/30
            bg-navy/60
            text-white
            shadow-md
            backdrop-blur-md
            transition
            hover:bg-white
            hover:text-navy
          "
        >
          <ArrowLeft size={17} />
        </button>

        {/* NEXT */}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            next();
          }}
          aria-label="Next photograph"
          className="
            absolute
            right-4
            top-1/2
            z-20
            grid
            size-10
            -translate-y-1/2
            place-items-center
            rounded-full
            border
            border-white/30
            bg-navy/60
            text-white
            shadow-md
            backdrop-blur-md
            transition
            hover:bg-white
            hover:text-navy
          "
        >
          <ArrowRight size={17} />
        </button>

        {/* PROGRESS */}

        <div
          className="
            absolute
            bottom-4
            left-1/2
            z-20
            flex
            max-w-[80%]
            -translate-x-1/2
            gap-1.5
            rounded-full
            bg-navy/50
            px-3
            py-2
            backdrop-blur-md
          "
        >
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActive(index);
              }}
              aria-label={`Show photograph ${index + 1}`}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300

                ${
                  index === active
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/45 hover:bg-white"
                }
              `}
            />
          ))}
        </div>
      </div>

      <ImageModal
        images={images}
        title={title}
        activeIndex={modalIndex}
        onChange={setModalIndex}
        onClose={() => setModalIndex(null)}
      />
    </>
  );
}

/* =========================================================
   GALLERY IMAGE
========================================================= */

function GalleryImage({
  src,
  title,
  index,
  eager = false,
  onClick,
}: {
  src: string;
  title: string;
  index: number;
  eager?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${title} photograph ${index + 1}`}
      className="
        group
        relative
        block
        h-full
        w-full
        cursor-zoom-in
        overflow-hidden
        bg-[#eef1f3]
        text-left
      "
    >
      <img
        src={src}
        alt={`${title} photograph ${index + 1}`}
        loading={eager ? "eager" : "lazy"}
        className="
          size-full
          object-contain
          p-1
          transition-transform
          duration-500
          ease-out
          group-hover:scale-[1.015]
        "
      />

      {/* SUBTLE HOVER */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-navy/0
          transition
          duration-300
          group-hover:bg-navy/[.04]
        "
      />

      {/* ZOOM BUTTON */}

      <span
        className="
          pointer-events-none
          absolute
          bottom-3
          right-3
          grid
          size-9
          translate-y-2
          place-items-center
          rounded-full
          bg-navy/75
          text-white
          opacity-0
          shadow-lg
          backdrop-blur
          transition-all
          duration-300
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        <Maximize2 size={15} />
      </span>
    </button>
  );
}

/* =========================================================
   IMAGE MODAL / LIGHTBOX
========================================================= */

function ImageModal({
  images,
  title,
  activeIndex,
  onChange,
  onClose,
}: {
  images: string[];
  title: string;
  activeIndex: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const isOpen = activeIndex !== null;

  function previous() {
    if (activeIndex === null) return;

    onChange(
      (activeIndex - 1 + images.length) %
        images.length,
    );
  }

  function next() {
    if (activeIndex === null) return;

    onChange(
      (activeIndex + 1) % images.length,
    );
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyboard(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }

      if (
        event.key === "ArrowLeft" &&
        images.length > 1
      ) {
        previous();
      }

      if (
        event.key === "ArrowRight" &&
        images.length > 1
      ) {
        next();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  }, [isOpen, activeIndex, images.length]);

  if (activeIndex === null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image viewer`}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-[#06172a]/95
        p-3
        backdrop-blur-md
        sm:p-6
        lg:p-8
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* TOP BAR */}

      <div
        className="
          absolute
          left-4
          right-4
          top-4
          z-30
          flex
          items-center
          justify-between
          sm:left-6
          sm:right-6
          sm:top-6
        "
      >
        <div>
          <p className="max-w-[65vw] truncate text-sm font-semibold text-white sm:text-base">
            {title}
          </p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-[.18em] text-white/50">
            Photograph {activeIndex + 1} of{" "}
            {images.length}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="
            grid
            size-11
            shrink-0
            place-items-center
            rounded-full
            border
            border-white/15
            bg-white/10
            text-white
            backdrop-blur
            transition
            hover:rotate-90
            hover:bg-white
            hover:text-navy
          "
        >
          <X size={20} />
        </button>
      </div>

      {/* IMAGE */}

      <div
        className="
          relative
          flex
          h-[calc(100vh-120px)]
          w-full
          max-w-7xl
          items-center
          justify-center
          pt-10
        "
      >
        <img
          src={images[activeIndex]}
          alt={`${title} photograph ${
            activeIndex + 1
          }`}
          className="
            max-h-full
            max-w-full
            select-none
            object-contain
            shadow-[0_30px_100px_rgba(0,0,0,.35)]
          "
        />

        {/* NAVIGATION */}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous photograph"
              className="
                absolute
                left-0
                top-1/2
                z-20
                grid
                size-11
                -translate-y-1/2
                place-items-center
                rounded-full
                border
                border-white/15
                bg-black/35
                text-white
                shadow-xl
                backdrop-blur
                transition
                hover:bg-white
                hover:text-navy
                sm:left-3
                sm:size-12
              "
            >
              <ArrowLeft size={20} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next photograph"
              className="
                absolute
                right-0
                top-1/2
                z-20
                grid
                size-11
                -translate-y-1/2
                place-items-center
                rounded-full
                border
                border-white/15
                bg-black/35
                text-white
                shadow-xl
                backdrop-blur
                transition
                hover:bg-white
                hover:text-navy
                sm:right-3
                sm:size-12
              "
            >
              <ArrowRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* BOTTOM DOTS */}

      {images.length > 1 && (
        <div
          className="
            absolute
            bottom-5
            left-1/2
            z-30
            flex
            max-w-[80vw]
            -translate-x-1/2
            items-center
            gap-1.5
            overflow-x-auto
            rounded-full
            border
            border-white/10
            bg-black/25
            px-3
            py-2
            backdrop-blur
          "
        >
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange(index)}
              aria-label={`View photograph ${
                index + 1
              }`}
              className={`
                h-1.5
                shrink-0
                rounded-full
                transition-all

                ${
                  index === activeIndex
                    ? "w-7 bg-white"
                    : "w-1.5 bg-white/35 hover:bg-white/70"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}