import {
  ArrowUpRight,
  BellRing,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

type NoticeItem = {
  id: number;
  date: string;
  category: string;
  title: string;
  description?: string;
  points?: string[];
  link?: string;
  linkText?: string;
};

const notices: NoticeItem[] = [
  {
    id: 1,
    date: "22 Sep 2026",
    category: "Important Update",
    title: "Admissions Open for Session 2026–27",
    description:
      "Registrations are now open. Parents can submit an admission enquiry and connect with the school office for further guidance.",
    link: "#",
    linkText: "View Details",
  },
  {
    id: 2,
    date: "22 Sep 2026",
    category: "School Timings",
    title: "School Timing Information",
    points: [
      "Summer timings: April to October",
      "Winter timings: November to March",
      "Students should report before assembly time.",
    ],
  },
  {
    id: 3,
    date: "22 Sep 2026",
    category: "Academics",
    title: "Academic Calendar & Important Dates",
    description:
      "Check upcoming examinations, activities, holidays and other important academic dates.",
    link: "#",
    linkText: "View Calendar",
  },
  {
    id: 4,
    date: "22 Sep 2026",
    category: "Notice",
    title: "Parent Communication",
    description:
      "Please stay connected with the school for circulars, schedule changes and important announcements.",
  },
];

export function NoticeBoard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  const changeNotice = (nextIndex: number) => {
    setVisible(false);

    window.setTimeout(() => {
      setActiveIndex(
        (nextIndex + notices.length) % notices.length
      );
      setVisible(true);
    }, 250);
  };

  useEffect(() => {
    if (paused || notices.length <= 1) return;

    const timer = window.setInterval(() => {
      setVisible(false);

      window.setTimeout(() => {
        setActiveIndex(
          (current) => (current + 1) % notices.length
        );
        setVisible(true);
      }, 250);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [paused]);

  const activeNotice = notices[activeIndex];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
      className="
        mt-9
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200
        bg-white
        shadow-[0_18px_50px_-35px_rgba(16,42,67,.35)]
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          bg-navy
          px-4
          py-3.5
          text-white
          sm:px-5
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="
              grid
              size-9
              shrink-0
              place-items-center
              rounded-xl
              bg-white/10
              text-[#efc65f]
            "
          >
            <BellRing size={16} />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[.18em]
                  text-[#efc65f]
                "
              >
                Notice Board
              </p>

              <span className="relative flex size-1.5">
                <span
                  className="
                    absolute
                    inline-flex
                    size-full
                    animate-ping
                    rounded-full
                    bg-[#efc65f]
                    opacity-50
                  "
                />
                <span
                  className="
                    relative
                    inline-flex
                    size-1.5
                    rounded-full
                    bg-[#efc65f]
                  "
                />
              </span>
            </div>

            <p className="mt-0.5 truncate text-xs font-medium text-white/75">
              Latest school announcements
            </p>
          </div>
        </div>

        <span
          className="
            shrink-0
            text-[9px]
            font-bold
            tracking-[.12em]
            text-white/45
          "
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(notices.length).padStart(2, "0")}
        </span>
      </div>

      {/* NOTICE CONTENT */}
      <div className="relative min-h-[205px] overflow-hidden sm:min-h-[190px]">
        <article
          className={`
            absolute
            inset-0
            flex
            flex-col
            px-4
            py-5
            transition-all
            duration-500
            ease-out
            sm:px-5
            ${
              visible
                ? "translate-y-0 opacity-100"
                : "-translate-y-5 opacity-0"
            }
          `}
        >
          {/* META */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-[#c72c3b]/10
                px-2.5
                py-1
                text-[8px]
                font-bold
                uppercase
                tracking-[.1em]
                text-[#b52030]
              "
            >
              <BellRing size={10} />
              {activeNotice.category}
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-[10px]
                font-medium
                text-slate-400
              "
            >
              <CalendarDays
                size={12}
                className="text-gold-dark"
              />
              {activeNotice.date}
            </span>
          </div>

          {/* TITLE */}
          <h3
            className="
              mt-3
              font-serif
              text-xl
              leading-tight
              text-navy
              sm:text-[23px]
            "
          >
            {activeNotice.title}
          </h3>

          {/* DESCRIPTION */}
          {activeNotice.description && (
            <p
              className="
                mt-2
                line-clamp-2
                text-xs
                leading-5
                text-slate-600
                sm:text-[13px]
                sm:leading-6
              "
            >
              {activeNotice.description}
            </p>
          )}

          {/* POINTS */}
          {activeNotice.points && (
            <ul className="mt-2 grid gap-1">
              {activeNotice.points.slice(0, 3).map((point) => (
                <li
                  key={point}
                  className="
                    flex
                    items-start
                    gap-2
                    text-xs
                    leading-5
                    text-slate-600
                  "
                >
                  <span
                    className="
                      mt-[7px]
                      size-1
                      shrink-0
                      rounded-full
                      bg-[#c72c3b]
                    "
                  />

                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {/* LINK */}
          {activeNotice.link && (
            <a
              href={activeNotice.link}
              className="
                group
                mt-auto
                inline-flex
                w-fit
                items-center
                gap-1.5
                pt-3
                text-[11px]
                font-bold
                text-[#c72c3b]
                transition
                hover:text-navy
              "
            >
              {activeNotice.linkText || "Read More"}

              <ArrowUpRight
                size={13}
                className="
                  transition-transform
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </a>
          )}
        </article>
      </div>

      {/* CONTROLS */}
      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          px-4
          py-3
          sm:px-5
        "
      >
        <div className="flex items-center gap-1.5">
          {notices.map((notice, index) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => changeNotice(index)}
              aria-label={`Show notice ${index + 1}`}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${
                  index === activeIndex
                    ? "w-7 bg-[#c72c3b]"
                    : "w-1.5 bg-slate-200 hover:bg-gold"
                }
              `}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => changeNotice(activeIndex - 1)}
            aria-label="Previous notice"
            className="
              grid
              size-8
              place-items-center
              rounded-full
              border
              border-slate-200
              text-navy
              transition
              hover:border-[#c72c3b]
              hover:bg-[#c72c3b]
              hover:text-white
            "
          >
            <ChevronLeft size={14} />
          </button>

          <button
            type="button"
            onClick={() => changeNotice(activeIndex + 1)}
            aria-label="Next notice"
            className="
              grid
              size-8
              place-items-center
              rounded-full
              bg-navy
              text-white
              transition
              hover:bg-[#c72c3b]
            "
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* BOTTOM ACCENT */}
      <div
        aria-hidden="true"
        className="flex h-[2px]"
      >
        <span className="flex-[2] bg-[#c72c3b]" />
        <span className="flex-1 bg-gold" />
        <span className="flex-1 bg-navy" />
      </div>
    </div>
  );
}