import {
  ArrowUpRight,
  BellRing,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createElement, useEffect, useMemo, useState, type ReactNode } from "react";

export type NoticeItem = {
  id?: number;
  date?: string;
  category?: string;
  title?: string;
  description?: string;
  points?: string[];
  button_url?: string;
  button_text?: string;
  link_url?: string;
  link_text?: string;
};

// Recreate only supported editor elements; never insert raw API HTML.
function safeNoticeUrl(value?: string) {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}

function NoticeDescription({ html }: { html: string }) {
  const content = useMemo(() => {
    const document = new DOMParser().parseFromString(html, "text/html");
    const allowed = new Set([
      "p", "br", "div", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li",
      "blockquote", "h2", "h3", "h4", "a",
    ]);
    const render = (node: Node, key: number): ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent;
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const element = node as Element;
      const tag = element.tagName.toLowerCase();
      if (["script", "style", "iframe", "object", "svg"].includes(tag)) return null;
      const children = Array.from(element.childNodes).map(render);
      if (!allowed.has(tag)) return children;
      if (tag === "a") {
        const url = safeNoticeUrl(element.getAttribute("href") ?? undefined);
        return url
          ? createElement(Link, { key, to: url }, ...children)
          : createElement("span", { key }, ...children);
      }
      return createElement(tag, { key }, ...(tag === "br" ? [] : children));
    };
    return Array.from(document.body.childNodes).map(render);
  }, [html]);

  return <div className="mt-2 whitespace-pre-wrap break-words text-xs leading-5 text-slate-600 sm:text-[13px] sm:leading-6 [&_p+p]:mt-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_a]:text-[#c72c3b] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h2]:text-lg [&_h3]:text-base [&_h4]:font-bold">{content}</div>;
}

type NoticeBoardProps = {
  title?: string;
  description?: string;
  notices: NoticeItem[];
};

export function NoticeBoard({
  title = "Notice Board",
  description = "Latest school announcements",
  notices,
}: NoticeBoardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const currentIndex = notices.length ? activeIndex % notices.length : 0;

  const changeNotice = (nextIndex: number) => {
    if (!notices.length) return;
    setActiveIndex((nextIndex + notices.length) % notices.length);
  };

  useEffect(() => {
    if (paused || notices.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % notices.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, notices.length]);

  const activeNotice = notices[currentIndex];
  const buttonUrl = safeNoticeUrl(activeNotice?.button_url || activeNotice?.link_url);
  const buttonText = activeNotice?.button_text || activeNotice?.link_text;

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
        flex
        aspect-square
        flex-col
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
          shrink-0
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
                {title}
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
              {description}
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
          {String(notices.length ? currentIndex + 1 : 0).padStart(2, "0")} /{" "}
          {String(notices.length).padStart(2, "0")}
        </span>
      </div>

      {/* NOTICE CONTENT */}
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {activeNotice ? (
        <article
          key={currentIndex}
          className={`
            notice-slide-up
            flex
            flex-col
            px-4
            py-5
            transition-all
            duration-500
            ease-out
            sm:px-5
          `}
        >
          {/* META */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {activeNotice.category && <span
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
            </span>}

            {activeNotice.date && <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-[10px]
                font-medium
                text-slate-600
              "
            >
              <CalendarDays
                size={12}
                className="text-gold-dark"
              />
              {activeNotice.date}
            </span>}
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
            <NoticeDescription html={activeNotice.description} />
          )}

          {/* POINTS */}
          {activeNotice.points && (
            <ul className="mt-2 grid gap-1">
              {activeNotice.points.map((point) => (
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
          {(buttonUrl || buttonText) && (
            <Link
              to={buttonUrl || "#"}
              aria-disabled={!buttonUrl || buttonUrl === "#"}
              onClick={(event) => {
                if (!buttonUrl || buttonUrl === "#") event.preventDefault();
              }}
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
              {buttonText || "Read More"}

              <ArrowUpRight
                size={13}
                className="
                  transition-transform
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          )}
        </article>
        ) : (
          <p className="px-5 py-10 text-sm text-slate-500" role="status">
            No announcements at the moment.
          </p>
        )}
      </div>

      {/* CONTROLS */}
      {notices.length > 1 && <div
        className="
          flex
          items-center
          justify-between
          shrink-0
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
              key={notice.id ?? index}
              type="button"
              onClick={() => changeNotice(index)}
              aria-label={`Show notice ${index + 1}`}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${
                  index === currentIndex
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
            onClick={() => changeNotice(currentIndex - 1)}
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
            onClick={() => changeNotice(currentIndex + 1)}
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
      </div>}

      {/* BOTTOM ACCENT */}
      <div
        aria-hidden="true"
        className="flex h-[2px] shrink-0"
      >
        <span className="flex-[2] bg-[#c72c3b]" />
        <span className="flex-1 bg-gold" />
        <span className="flex-1 bg-navy" />
      </div>
    </div>
  );
}