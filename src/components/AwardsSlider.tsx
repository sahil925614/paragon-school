import { useCallback, useEffect, useRef, useState } from "react";

import { Award, X, ZoomIn } from "lucide-react";

export type AwardItem = {
  image: string;
  title: string;
  category: string;
  year?: string;
};

const defaultAwards: AwardItem[] = [
  {
    image: "/images/award1.webp",
    title: "Global Youth Film Festival",
    category: "Future Filmmaker School",
    year: "2025",
  },
  {
    image: "/images/award2.webp",
    title: "Day School Category",
    category: "Best School of the Year",
    year: "2024",
  },
  {
    image: "/images/award3.webp",
    title: "Residential School Category",
    category: "India's Best Schools",
    year: "2024",
  },
  {
    image: "/images/award4.webp",
    title: "State Awards",
    category: "Golden Principal",
    year: "2024",
  },
  {
    image: "/images/award5.webp",
    title: "Academic Excellence Award",
    category: "Mega Olympiad",
    year: "2022",
  },
  {
    image: "/images/award6.webp",
    title: "FAP National Awards",
    category: "Best Teacher Award",
    year: "2022",
  },
  {
    image: "/images/award7.webp",
    title: "FAP State Awards",
    category: "Best Infrastructure",
    year: "2022",
  },
  {
    image: "/images/award8.webp",
    title: "FAP National Award",
    category: "Best School of the Year",
    year: "2022",
  },
  {
    image: "/images/award9.webp",
    title: "National Award",
    category: "Outstanding Contribution",
    year: "2022",
  },
  {
    image: "/images/award10.webp",
    title: "National Award",
    category: "Outstanding Contribution",
    year: "2022",
  },
];

type AwardsSliderProps = {
  awards?: AwardItem[];
  title?: string;
  description?: string;
};

export function AwardsSlider({
  awards = defaultAwards,
  title = "Our Awards",
  description = "Recognized Excellence",
}: AwardsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Main slider drag
  |--------------------------------------------------------------------------
  */

  const sliderDragging = useRef(false);
  const sliderMoved = useRef(false);

  const sliderStartX = useRef(0);
  const sliderStartScrollLeft = useRef(0);

  /*
  |--------------------------------------------------------------------------
  | Responsive cards
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const updatePerView = () => {
      const width = window.innerWidth;

      if (width >= 1536) {
        setPerView(5);
      } else if (width >= 1280) {
        setPerView(4);
      } else if (width >= 900) {
        setPerView(3);
      } else if (width >= 600) {
        setPerView(2);
      } else {
        setPerView(1);
      }
    };

    updatePerView();

    window.addEventListener("resize", updatePerView);

    return () => {
      window.removeEventListener("resize", updatePerView);
    };
  }, []);

  const maxIndex = Math.max(0, awards.length - perView);

  useEffect(() => {
    if (active > maxIndex) {
      setActive(maxIndex);
    }
  }, [active, maxIndex]);

  /*
  |--------------------------------------------------------------------------
  | Scroll slider
  |--------------------------------------------------------------------------
  */

  const scrollToCard = useCallback((index: number) => {
    const track = trackRef.current;

    if (!track) return;

    const card = track.children[index] as HTMLElement | undefined;

    if (!card) return;

    track.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, maxIndex));

      setActive(nextIndex);
      scrollToCard(nextIndex);
    },
    [maxIndex, scrollToCard],
  );

  /*
  |--------------------------------------------------------------------------
  | Auto play
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isPaused || maxIndex <= 0 || lightboxIndex !== null) {
      return;
    }

    const interval = window.setInterval(() => {
      setActive((previous) => {
        const next = previous >= maxIndex ? 0 : previous + 1;

        scrollToCard(next);

        return next;
      });
    }, 2000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused, maxIndex, scrollToCard, lightboxIndex]);

  /*
  |--------------------------------------------------------------------------
  | Detect slider position
  |--------------------------------------------------------------------------
  */

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];

    if (!cards.length) return;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - track.scrollLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActive(Math.min(closestIndex, maxIndex));
  };

  /*
  |--------------------------------------------------------------------------
  | Desktop mouse drag
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const finishDesktopDrag = () => {
      if (!sliderDragging.current) return;

      sliderDragging.current = false;
      sliderMoved.current = false;
      setIsPaused(false);
    };

    window.addEventListener("pointerup", finishDesktopDrag);
    window.addEventListener("pointercancel", finishDesktopDrag);
    window.addEventListener("blur", finishDesktopDrag);

    return () => {
      window.removeEventListener("pointerup", finishDesktopDrag);
      window.removeEventListener("pointercancel", finishDesktopDrag);
      window.removeEventListener("blur", finishDesktopDrag);
    };
  }, []);
  const handleSliderPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    // Let mobile/tablet use native touch scrolling.
    if (event.pointerType !== "mouse") {
      return;
    }

    const track = trackRef.current;

    if (!track) return;

    sliderDragging.current = true;
    sliderMoved.current = false;

    sliderStartX.current = event.clientX;
    sliderStartScrollLeft.current = track.scrollLeft;

    setIsPaused(true);
  };

  const handleSliderPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType !== "mouse" || !sliderDragging.current) {
      return;
    }

    const track = trackRef.current;

    if (!track) return;

    const distance = event.clientX - sliderStartX.current;

    /*
     * Important:
     * normal desktop clicks can move a few pixels.
     * Don't treat that as dragging.
     */
    if (Math.abs(distance) > 8) {
      sliderMoved.current = true;
    }

    if (sliderMoved.current) {
      track.scrollLeft = sliderStartScrollLeft.current - distance;
    }
  };

  const handleSliderPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    sliderDragging.current = false;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }

    window.setTimeout(() => {
      setIsPaused(false);
    }, 500);
  };

  /*
  |--------------------------------------------------------------------------
  | Award click
  |--------------------------------------------------------------------------
  */

  const handleAwardClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    /*
     * If the user dragged the slider,
     * don't open the popup.
     */
    if (sliderMoved.current) {
      sliderMoved.current = false;

      event.preventDefault();

      return;
    }

    /*
     * Normal desktop click / mobile tap.
     */
    setLightboxIndex(index);
  };

  /*
  |--------------------------------------------------------------------------
  | Lightbox controls
  |--------------------------------------------------------------------------
  */

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const showPreviousImage = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === 0 ? awards.length - 1 : current - 1;
    });
  }, []);

  const showNextImage = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === awards.length - 1 ? 0 : current + 1;
    });
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Keyboard navigation
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [lightboxIndex, closeLightbox, showPreviousImage, showNextImage]);

  /*
  |--------------------------------------------------------------------------
  | Lock body when popup is open
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxIndex]);

  return (
    <>
      <section
        className="
          relative
          overflow-hidden
          border-y
          border-navy/10
          bg-[#f7f8f7]
          py-14
          sm:py-16
          lg:py-20
        "
      >
        {/* Decorative background */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-32
            top-10
            size-80
            rounded-full
            border-[40px]
            border-[#c72c3b]/[.035]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-32
            bottom-[-120px]
            size-96
            rounded-full
            bg-navy/[.025]
          "
        />

        {/* =====================================================
            HEADING
        ====================================================== */}

        <div
          className="
            relative
            mx-auto
            max-w-3xl
            px-4
            text-center
            sm:px-6
          "
        >
          <div
            className="
              mx-auto
              grid
              size-12
              place-items-center
              rounded-2xl
              border
              border-slate-200
              bg-white
              text-[#c72c3b]
              shadow-sm
            "
          >
            <Award size={22} strokeWidth={1.8} />
          </div>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              font-medium
              leading-6
              text-slate-500
              sm:text-base
            "
          >
            {description || "Recognized Excellence"}
          </p>

          <h2
            className="
              mt-2
              font-serif
              text-3xl
              font-semibold
              leading-tight
              text-navy
              sm:text-4xl
              lg:text-[44px]
            "
          >
            {title || "Our Awards"}
          </h2>

          <div
            className="
              mx-auto
              mt-4
              h-[2px]
              w-12
              rounded-full
              bg-[#c72c3b]
            "
          />
        </div>

        {/* =====================================================
            FULL WIDTH SLIDER
        ====================================================== */}

        <div
          className="
            relative
            mt-10
            w-full
            sm:mt-12
          "
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            onScroll={handleScroll}
            onPointerDown={handleSliderPointerDown}
            onPointerMove={handleSliderPointerMove}
            onPointerUp={handleSliderPointerUp}
            onPointerCancel={handleSliderPointerUp}
            className="
              flex
              select-none
              snap-x
              snap-mandatory
              gap-4
              overflow-x-auto
              scroll-smooth
              px-4
              pb-6
              pt-2
              sm:gap-5
              sm:px-6
              lg:px-10
              xl:px-14
              2xl:px-16
              [&::-webkit-scrollbar]:hidden
            "
            style={{
              scrollbarWidth: "none",
              touchAction: "pan-y",
            }}
          >
            {awards.map((award, index) => (
              <article
                key={`${award.title}-${index}`}
                className="
                    group
                    relative
                    shrink-0
                    snap-start
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-slate-200/80
                    bg-white
                    p-2
                    shadow-[0_14px_40px_-25px_rgba(16,42,67,.35)]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_45px_-22px_rgba(16,42,67,.42)]
                  "
                style={{
                  width: `calc(
                      (100% - ${(perView - 1) * 20}px - ${
                        perView === 1 ? 32 : perView === 2 ? 48 : 100
                      }px) / ${perView}
                    )`,
                }}
              >
                {/* IMAGE */}

                <button
                  type="button"
                  onClick={(event) => handleAwardClick(event, index)}
                  aria-label={`View ${award.title}`}
                  className="
                      relative
                      block
                      w-full
                      cursor-zoom-in
                      overflow-hidden
                      rounded-[15px]
                      bg-slate-100
                      text-left
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#c72c3b]
                    "
                >
                  <img
                    src={award.image}
                    alt={award.title}
                    draggable={false}
                    loading="lazy"
                    className="
                        aspect-[4/3]
                        w-full
                        select-none
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-[1.035]
                      "
                  />

                  {/* Hover overlay */}

                  <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        bg-navy/0
                        transition
                        duration-300
                        group-hover:bg-navy/20
                      "
                  >
                    <div
                      className="
                          grid
                          size-11
                          scale-75
                          place-items-center
                          rounded-full
                          bg-white
                          text-navy
                          opacity-0
                          shadow-lg
                          transition
                          duration-300
                          group-hover:scale-100
                          group-hover:opacity-100
                        "
                    >
                      <ZoomIn size={19} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Year */}

                  {award.year && (
                    <span
                      className="
                          pointer-events-none
                          absolute
                          right-3
                          top-3
                          rounded-full
                          border
                          border-white/50
                          bg-white/95
                          px-3
                          py-1.5
                          text-[10px]
                          font-bold
                          text-navy
                          shadow-sm
                          backdrop-blur
                        "
                    >
                      {award.year}
                    </span>
                  )}
                </button>

                {/* CARD CONTENT */}

                <div
                  className="
                      px-2
                      pb-3
                      pt-4
                      sm:px-3
                    "
                >
                  <p
                    className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.13em]
                        text-[#c72c3b]
                      "
                  >
                    {award.category}
                  </p>

                  <h3
                    className="
                        mt-1.5
                        font-serif
                        text-[17px]
                        font-semibold
                        leading-snug
                        text-navy
                        sm:text-lg
                      "
                  >
                    {award.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          {/* =====================================================
              DOT NAVIGATION
          ====================================================== */}

          {maxIndex > 0 && (
            <div
              className="
                mt-1
                flex
                items-center
                justify-center
                gap-2
                px-4
              "
            >
              {Array.from({
                length: maxIndex + 1,
              }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to award slide ${index + 1}`}
                  className={`
                    h-1.5
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      active === index
                        ? "w-7 bg-[#c72c3b]"
                        : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    }
                  `}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          IMAGE POPUP
      ====================================================== */}

      {lightboxIndex !== null && (
        <AwardLightbox
          awards={awards}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrevious={showPreviousImage}
          onNext={showNextImage}
        />
      )}
    </>
  );
}

/* ========================================================================
   LIGHTBOX
======================================================================== */

type AwardLightboxProps = {
  awards: AwardItem[];
  activeIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function AwardLightbox({
  awards,
  activeIndex,
  onClose,
  onPrevious,
  onNext,
}: AwardLightboxProps) {
  const startX = useRef(0);
  const currentX = useRef(0);

  const [dragOffset, setDragOffset] = useState(0);

  const [dragging, setDragging] = useState(false);

  const award = awards[activeIndex];

  /*
  |--------------------------------------------------------------------------
  | Start drag
  |--------------------------------------------------------------------------
  */

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    /*
     * Only primary mouse button.
     */
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    startX.current = event.clientX;
    currentX.current = event.clientX;

    setDragging(true);

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  /*
  |--------------------------------------------------------------------------
  | Drag
  |--------------------------------------------------------------------------
  */

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    currentX.current = event.clientX;

    const distance = currentX.current - startX.current;

    setDragOffset(distance);
  };

  /*
  |--------------------------------------------------------------------------
  | Finish drag
  |--------------------------------------------------------------------------
  */

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const distance = currentX.current - startX.current;

    const threshold = 60;

    if (distance > threshold) {
      onPrevious();
    } else if (distance < -threshold) {
      onNext();
    }

    setDragging(false);
    setDragOffset(0);

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Award image viewer"
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-slate-950/70
        p-3
        backdrop-blur-sm
        sm:p-5
        lg:p-8
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div
        className="
          pointer-events-none
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
          sm:top-5
        "
      >
        {/* Counter */}

        <div
          className="
            rounded-full
            border
            border-white/10
            bg-white/10
            px-3
            py-2
            text-xs
            font-semibold
            text-white/80
            backdrop-blur
          "
        >
          {activeIndex + 1} / {awards.length}
        </div>

        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close image"
          className="
            pointer-events-auto
            grid
            size-11
            place-items-center
            rounded-full
            border
            border-white/15
            bg-white/10
            text-white
            backdrop-blur
            transition
            duration-300
            hover:rotate-90
            hover:bg-white
            hover:text-navy
          "
        >
          <X size={21} strokeWidth={1.8} />
        </button>
      </div>

      {/* =====================================================
          DRAG / SWIPE AREA
      ====================================================== */}

      <div
        className="
          relative
          flex
          w-full
          max-w-[920px]
          select-none
          items-center
          justify-center
          overflow-hidden
          rounded-[24px]
          bg-white
          p-3
          shadow-[0_24px_80px_rgba(0,0,0,.32)]
          sm:p-4
        "
        style={{
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`
            flex
            w-full
            max-w-full
            flex-col
            items-center
            justify-center
            ${dragging ? "" : "transition-all duration-300 ease-out"}
          `}
          style={{
            transform: `
              translateX(${dragOffset}px)
              scale(${dragging ? 0.985 : 1})
            `,
            opacity: dragging
              ? Math.max(0.55, 1 - Math.abs(dragOffset) / 700)
              : 1,
          }}
        >
          {/* IMAGE */}

          <img
            key={award.image}
            src={award.image}
            alt={award.title}
            draggable={false}
            className="
              max-h-[58vh]
              w-full
              select-none
              rounded-[16px]
              bg-slate-100
              object-contain
              sm:max-h-[62vh]
            "
          />

          {/* =====================================================
              IMAGE INFORMATION
          ====================================================== */}

          <div
            className="
              mt-3
              max-w-2xl
              px-4
              pb-2
              text-center
              text-navy
              sm:mt-4
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
              "
            >
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#ef5262]
                "
              >
                {award.category}
              </span>

              {award.year && (
                <>
                  <span
                    className="
                      size-1
                      rounded-full
                      bg-slate-300
                    "
                  />

                  <span
                    className="
                      text-[11px]
                      font-medium
                      text-slate-500
                    "
                  >
                    {award.year}
                  </span>
                </>
              )}
            </div>

            <h3
              className="
                mt-2
                font-serif
                text-lg
                font-semibold
                leading-tight
                sm:text-xl
                md:text-2xl
              "
            >
              {award.title}
            </h3>

            <p
              className="
                mt-2
                text-[10px]
                font-medium
                tracking-wide
                text-slate-400
                sm:text-[11px]
              "
            >
              Drag or swipe to view other awards
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE PROGRESS
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-3
          left-1/2
          flex
          -translate-x-1/2
          items-center
          gap-1.5
          sm:hidden
        "
      >
        {awards.map((_, index) => (
          <span
            key={index}
            className={`
              h-1
              rounded-full
              transition-all
              duration-300
              ${activeIndex === index ? "w-5 bg-white" : "w-1 bg-white/25"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
