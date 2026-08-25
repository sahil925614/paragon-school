import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  Home,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { KidsFooter } from "../components/KidsFooter";
import { KidsMagicCursor } from "../components/KidsMagicCursor";
import { kidsApi } from "../api/kidsApi";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";


type NavItem = {
  label: string;
  path: string;
};

type KidsFooterAnnouncementData = {
  address?: string;
  phone?: string;
  mobile?: string;
  email?: string;
};

const links: NavItem[] = [
  { label: "Admission", path: "admission" },
  { label: "Activities", path: "activities" },
  { label: "Gallery", path: "gallery" },
  { label: "Contact", path: "contact" },
];

const aboutLinks: NavItem[] = [
  { label: "Mission And Vision", path: "mission-and-vision" },
  { label: "Principal Desk", path: "principals-desk" },
  { label: "History And Legacy", path: "history-and-legacy" },
  { label: "Curriculum", path: "curriculum" },
  { label: "Founder", path: "founder" },
  { label: "Infrastructure", path: "infrastructure" },
  { label: "President Desk", path: "presidents-desk" },
  { label: "About Director", path: "about-director" },
  // { label: "About Paragon Kids", path: "about-paragon-kids" },
];

/* -------------------------------------------------------
   NAV COLOURS
------------------------------------------------------- */

const navColors: Record<string, string> = {
  Admission: "#f28c28",
  Activities: "#20a98b",
  Gallery: "#37a9df",
  Contact: "#8b65c2",
};

export function KidsLayout() {
  const { data: footer } = useQuery({
    queryKey: ["kids-footer"],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: KidsFooterAnnouncementData }>("footer");
      return response.data.data;
    },
  });
  const mobileNumbers = footer?.mobile
    ?.split(",")
    .map((number) => number.trim())
    .filter(Boolean) ?? ["+91 8284848899", "9915509652", "9855953220"];

  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [desktopAboutOpen, setDesktopAboutOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);

    setDesktopAboutOpen(false);

    // A focused desktop dropdown link keeps `group-focus-within` active after
    // React Router changes the page. Release that focus so the menu closes and
    // no longer sits above the new page intercepting pointer events.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [location.pathname]);
  const preventHeaderDrag = (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 0 && event.target instanceof Element && event.target.closest("a, button")) {
      event.preventDefault();
    }
  };

  const closeMenu = () => {
    setOpen(false);
    setAboutOpen(false);
    setDesktopAboutOpen(false);
  };

  const aboutActive =
    location.pathname === "/kids/about" ||
    location.pathname.startsWith("/kids/about/");

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#34305c]">
      <KidsMagicCursor />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header onMouseDownCapture={preventHeaderDrag} onDragStart={(event) => event.preventDefault()} className={`sticky top-0 z-50 select-none transition-all duration-500 ${scrolled ? "kids-header-scrolled" : ""}`}>
        <div className="relative overflow-hidden bg-[#34305c] text-white">
  {/* playful background */}
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -left-8 -top-10 size-24 rounded-full bg-[#ef5f6c]/15" />
    <div className="absolute left-[28%] -bottom-12 size-24 rounded-full bg-[#ffd34e]/10" />
    <div className="absolute right-[24%] -top-12 size-28 rounded-full bg-[#20a98b]/10" />
  </div>

  {/* little decorative stars */}
  <span
    aria-hidden="true"
    className="kids-announcement-star pointer-events-none absolute left-[8%] top-2 text-[10px] text-[#ffd34e]/70"
  >
    ★
  </span>

  <span
    aria-hidden="true"
    className="kids-announcement-star kids-star-delay pointer-events-none absolute right-[30%] bottom-1 text-[9px] text-[#37a9df]/80"
  >
    ✦
  </span>

  <div className="container relative flex min-h-[42px] items-center gap-3 py-1.5">
    
    {/* =================================================
        MOVING ANNOUNCEMENT AREA
    ================================================= */}

    <div className="relative min-w-0 flex-1 overflow-hidden">
      {/* fade edges */}
      {/* <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#34305c] to-transparent" /> */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#34305c] to-transparent" />

      <div className="announcement-track flex w-max items-center will-change-transform">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="
              flex
              shrink-0
              items-center
              gap-5
              pr-5
              text-[10px]
              font-bold
              tracking-[.06em]
              text-white/90
              sm:gap-7
              sm:pr-7
              sm:text-[11px]
            "
          >
            {/* Address */}
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[#37a9df]">●</span>
              {footer?.address || "Paragon Kids Sector 71, SAS Nagar, Mohali, Punjab, PIN 160071 (India)"}
            </span>

            <span className="size-1.5 shrink-0 rounded-full bg-[#ffd34e]" />

            {/* Landline */}
            <a
              href={`tel:${(footer?.phone || "0172-5097142").replace(/[^\d+]/g, "")}`}
              className="whitespace-nowrap transition-colors hover:text-[#ffd34e]"
            >
              {footer?.phone || "0172-5097142"}
            </a>

            <span className="size-1.5 shrink-0 rounded-full bg-[#20a98b]" />

            {/* Mobile numbers */}
            <span className="flex items-center gap-2 whitespace-nowrap">
              {mobileNumbers.map((number, index) => (
                <span key={number} className="contents">
                  {index > 0 && <span className="text-[#ef5f6c]">•</span>}
                  <a
                    href={`tel:${number.replace(/[^\d+]/g, "")}`}
                    className="transition-colors hover:text-[#ffd34e]"
                  >
                    {number}
                  </a>
                </span>
              ))}
            </span>

            <span className="size-1.5 shrink-0 rounded-full bg-[#37a9df]" />

            {/* Email */}
            <a
              href={`mailto:${footer?.email || "paragonkids71@gmail.com"}`}
              className="flex items-center gap-1.5 whitespace-nowrap font-black text-[#ffd34e] transition-colors hover:text-white"
            >
              {footer?.email || "paragonkids71@gmail.com"}
              <span aria-hidden="true">→</span>
            </a>

            <span className="size-1.5 shrink-0 rounded-full bg-[#ef5f6c]" />
          </div>
        ))}
      </div>
    </div>

    {/* =================================================
        FIXED GO TO PARAGON SCHOOL BUTTON
    ================================================= */}

    <Link
      to="/school"
      className="
        group
        relative
        z-20
        flex
        shrink-0
        items-center
        gap-2
        overflow-hidden
        rounded-full
        border
        border-white/20
        bg-white
        px-3
        py-2
        text-[10px]
        font-black
        text-[#34305c]
        shadow-[0_5px_18px_rgba(0,0,0,.15)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-[#ffd34e]
        hover:bg-[#ffd34e]
        sm:px-4
        sm:text-[11px]
      "
    >
      {/* tiny animated dot */}
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ef5f6c] opacity-50" />
        <span className="relative inline-flex size-2 rounded-full bg-[#ef5f6c]" />
      </span>

      <span className="hidden whitespace-nowrap xs:inline sm:inline">
        Go to Paragon School
      </span>

      {/* mobile short text */}
      <span className="whitespace-nowrap sm:hidden">
        School
      </span>

      <ArrowUpRight
        size={13}
        strokeWidth={2.7}
        className="
          text-[#ef5f6c]
          transition-all
          duration-300
          group-hover:-translate-y-0.5
          group-hover:translate-x-0.5
          group-hover:text-[#34305c]
        "
      />

      {/* shine */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-10
          w-7
          -skew-x-12
          bg-white/60
          opacity-0
          blur-sm
          transition-all
          duration-700
          group-hover:left-[110%]
          group-hover:opacity-100
        "
      />
    </Link>
  </div>

  {/* colourful bottom line */}
  <div
    aria-hidden="true"
    className="absolute inset-x-0 bottom-0 flex h-[2px]"
  >
    <span className="flex-1 bg-[#ef5f6c]" />
    <span className="flex-1 bg-[#ffd34e]" />
    <span className="flex-1 bg-[#20a98b]" />
    <span className="flex-1 bg-[#37a9df]" />
    <span className="flex-1 bg-[#8b65c2]" />
  </div>
</div>

        {/* MAIN NAVBAR */}

        <div className={`relative border-b border-[#f0e9df] bg-white/95 backdrop-blur-xl transition-all duration-500 ${scrolled ? "shadow-[0_14px_40px_rgba(52,48,92,0.13)]" : "shadow-[0_8px_30px_rgba(52,48,92,0.06)]"}`}>

          {/* Decorative top color strip */}

          <div className="kids-rainbow-strip absolute inset-x-0 top-0 flex h-[4px] overflow-hidden">
            <span className="flex-1 bg-[#f28c28]" />
            <span className="flex-1 bg-[#ef5f6c]" />
            <span className="flex-1 bg-[#ffd34e]" />
            <span className="flex-1 bg-[#20a98b]" />
            <span className="flex-1 bg-[#37a9df]" />
            <span className="flex-1 bg-[#8b65c2]" />
          </div>

          <div
            className="
              container
              flex
              h-[86px]
              items-center
              justify-between
              gap-5
              pt-1
              lg:h-[94px]
            "
          >

            {/* LOGO */}

            <Link
              to="/kids"
              onClick={closeMenu}
              className="
                group
                relative
                z-10
                flex
                shrink-0
                items-center
              "
            >
              <img
                src="/images/paragon-kids-logo.webp"
                alt="Paragon Kids"
                className="
                  h-[58px]
                  w-auto
                  object-contain
                  transition-transform
                  duration-300
                  group-hover:-rotate-2 group-hover:scale-[1.07]
                  sm:h-[64px]
                  xl:h-[68px]
                "
              />
            </Link>

            {/* =================================================
                DESKTOP NAV
            ================================================= */}

            <nav className="hidden h-full items-center lg:flex">

              {/* HOME */}

              <NavLink
                to="/kids"
                end
                className={({ isActive }) =>
                  `
                    relative
                    flex
                    h-full
                    items-center
                    px-3
                    text-[14px]
                    font-bold
                    transition
                    xl:px-4
                    ${
                      isActive
                        ? "text-[#ef5f6c]"
                        : "text-[#494564] hover:text-[#ef5f6c]"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    Home

                    {isActive && (
                      <span
                        className="
                          absolute
                          bottom-[18px]
                          left-1/2
                          h-[3px]
                          w-5
                          -translate-x-1/2
                          rounded-full
                          bg-[#ef5f6c]
                        "
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* ABOUT DROPDOWN */}

              <div className="relative flex h-full items-center">

                <NavLink
                  to="/kids/about"
                  aria-haspopup="menu"
                  aria-expanded={desktopAboutOpen}
                  onClick={(event) => {
                    event.preventDefault();
                    setDesktopAboutOpen((previous) => !previous);
                  }}
                  className={`
                    relative
                    flex
                    h-full
                    items-center
                    gap-1.5
                    px-3
                    text-[14px]
                    font-bold
                    transition
                    xl:px-4
                    ${
                      aboutActive
                        ? "text-[#f28c28]"
                        : "text-[#494564] hover:text-[#f28c28]"
                    }
                  `}
                >
                  About

                  <ChevronDown
                    size={15}
                    strokeWidth={2.5}
                    className={`transition-transform duration-300 ${desktopAboutOpen ? "rotate-180" : ""}`}
                  />

                  {aboutActive && (
                    <span
                      className="
                        absolute
                        bottom-[18px]
                        left-1/2
                        h-[3px]
                        w-5
                        -translate-x-1/2
                        rounded-full
                        bg-[#f28c28]
                      "
                    />
                  )}
                </NavLink>

                {/* DROPDOWN */}

                <div
                  className={`
                    absolute
                    z-50
                    left-1/2
                    top-[calc(100%-4px)]
                    w-[600px]
                    -translate-x-[38%]
                    transition-all
                    duration-300
                    ease-[cubic-bezier(.2,.8,.2,1)]
                    ${
                      desktopAboutOpen
                        ? "block translate-y-0 opacity-100"
                        : "hidden"
                    }
                  `}
                >
                  {/* invisible bridge prevents dropdown closing */}

                  <div className="h-3" />

                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-[24px]
                      border
                      border-[#f0e8dc]
                      bg-white
                      p-5
                      shadow-[0_24px_65px_rgba(52,48,92,0.16)]
                    "
                  >

                    {/* decorative circles */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-12
                        -top-12
                        size-32
                        rounded-full
                        bg-[#ffd34e]/15
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -bottom-12
                        -left-12
                        size-32
                        rounded-full
                        bg-[#37a9df]/10
                      "
                    />

                    {/* dropdown heading */}

                    <div className="relative mb-4 flex items-center gap-3 border-b border-[#eee7dc] pb-4">

                      <div
                        className="
                          grid
                          size-10
                          place-items-center
                          rounded-xl
                          bg-[#fff4e7]
                          text-[#f28c28]
                        "
                      >
                        <Info size={18} />
                      </div>

                      <div>
                        <p className="font-serif text-lg font-bold text-[#34305c]">
                          Discover Paragon Kids
                        </p>

                        <p className="text-xs text-slate-500">
                          Know more about our school
                        </p>
                      </div>

                    </div>

                    {/* links */}

                    <div className="relative grid grid-cols-2 gap-2">

                      {aboutLinks.map((item, index) => {

                        const colors = [
                          "#f28c28",
                          "#ef5f6c",
                          "#37a9df",
                          "#20a98b",
                          "#8b65c2",
                        ];

                        const color = colors[index % colors.length];

                        return (
                          <NavLink
                            key={item.path}
                            to={`/kids/about/${item.path}`}
                            end
                            onClick={() => setDesktopAboutOpen(false)}
                            className={({ isActive }) =>
                              `
                                group/item
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-3
                                py-3
                                text-[13px]
                                font-semibold
                                transition
                                ${
                                  isActive
                                    ? "bg-[#fff1dc] text-[#34305c] ring-1 ring-inset ring-[#f28c28]/20"
                                    : "text-slate-600 hover:text-[#f28c28]"
                                }
                              `
                            }
                          >

                            <span
                              className="
                                size-2
                                shrink-0
                                rounded-full
                                transition-transform
                                group-hover/item:scale-125
                              "
                              style={{ backgroundColor: color }}
                            />

                            {item.label}

                          </NavLink>
                        );
                      })}

                    </div>

                  </div>
                </div>

              </div>

              {/* STANDARD NAV LINKS */}

              {links.map((item) => {

                const color = navColors[item.label];

                return (
                  <NavLink
                    key={item.path}
                    to={`/kids/${item.path}`}
                    className={({ isActive }) =>
                      `
                        group/nav
                        relative
                        flex
                        h-full
                        items-center
                        px-3
                        text-[14px]
                        font-bold
                        transition
                        xl:px-4
                        ${
                          isActive
                            ? ""
                            : "text-[#494564]"
                        }
                      `
                    }
                    style={({ isActive }) => ({
                      color: isActive ? color : undefined,
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className="transition-colors"
                          style={
                            {
                              "--hover-color": color,
                            } as React.CSSProperties
                          }
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = color;
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.color = "";
                            }
                          }}
                        >
                          {item.label}
                        </span>

                        {isActive && (
                          <span
                            className="
                              absolute
                              bottom-[18px]
                              left-1/2
                              h-[3px]
                              w-5
                              -translate-x-1/2
                              rounded-full
                            "
                            style={{ backgroundColor: color }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* DISCLOSURE */}

              <NavLink
                to="/kids/mandatory-disclosure"
                className={({ isActive }) =>
                  `
                    ml-3
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    px-4
                    py-2.5
                    text-[12px]
                    font-bold
                    transition-all
                    duration-300
                    xl:px-5
                    ${
                      isActive
                        ? "bg-[#34305c] text-white"
                        : "border border-[#34305c]/15 bg-[#f8f6ff] text-[#34305c] hover:-translate-y-0.5 hover:bg-[#34305c] hover:text-white"
                    }
                  `
                }
              >
                Disclosure

                <ArrowUpRight size={14} />
              </NavLink>

            </nav>

            {/* =================================================
                MOBILE BUTTON
            ================================================= */}

            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen((previous) => !previous)}
              className="
                grid
                size-11
                place-items-center
                rounded-xl
                bg-[#fff3df]
                text-[#ef5f6c]
                transition
                hover:bg-[#ef5f6c]
                hover:text-white
                lg:hidden
              "
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        {open && (
          <div
            className="
              max-h-[calc(100vh-86px)]
              overflow-y-auto
              border-b
              border-[#eee5d8]
              bg-white
              shadow-xl
              lg:hidden
            "
          >
            <nav className="container py-5">

              {/* HOME */}

              <NavLink
                to="/kids"
                end
                onClick={closeMenu}
                className={({ isActive }) =>
                  `
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3.5
                    font-bold
                    transition
                    ${
                      isActive
                        ? "bg-[#fff0f1] text-[#ef5f6c]"
                        : "text-[#494564] hover:bg-[#fffaf2]"
                    }
                  `
                }
              >
                <span className="grid size-8 place-items-center rounded-lg bg-[#fff0f1] text-[#ef5f6c]">
                  <Home size={16} />
                </span>

                Home
              </NavLink>

              {/* ABOUT */}

              <div className="mt-1">

                <button
                  type="button"
                  onClick={() => setAboutOpen((previous) => !previous)}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3.5
                    text-left
                    font-bold
                    transition
                    ${
                      aboutActive
                        ? "bg-[#fff4e7] text-[#f28c28]"
                        : "text-[#494564] hover:bg-[#fffaf2]"
                    }
                  `}
                >
                  <span>About</span>

                  <ChevronDown
                    size={17}
                    className={`transition-transform duration-300 ${
                      aboutOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {aboutOpen && (
                  <div className="mx-3 mt-2 grid gap-1 rounded-2xl bg-[#fffaf3] p-2">

                    <NavLink
                      to="#"
                      onClick={closeMenu}
                      className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[#f28c28]"
                    >
                      About Paragon
                    </NavLink>

                    {aboutLinks.map((item, index) => {

                      const colors = [
                        "#f28c28",
                        "#ef5f6c",
                        "#37a9df",
                        "#20a98b",
                        "#8b65c2",
                      ];

                      return (
                        <NavLink
                          key={item.path}
                          to={`/kids/about/${item.path}`}
                          onClick={closeMenu}
                          className={({ isActive }) =>
                            `
                              flex
                              items-center
                              gap-3
                              rounded-lg
                              px-3
                              py-2.5
                              text-sm
                              transition
                              ${
                                isActive
                                  ? "bg-white font-semibold text-[#34305c] shadow-sm"
                                  : "text-slate-600 hover:bg-white"
                              }
                            `
                          }
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{
                              backgroundColor:
                                colors[index % colors.length],
                            }}
                          />

                          {item.label}
                        </NavLink>
                      );
                    })}

                  </div>
                )}

              </div>

              {/* NORMAL LINKS */}

              <div className="mt-1 space-y-1">

                {links.map((item) => {

                  const color = navColors[item.label];

                  return (
                    <NavLink
                      key={item.path}
                      to={`/kids/${item.path}`}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-4
                          py-3.5
                          font-bold
                          transition
                          ${
                            isActive
                              ? "bg-[#faf8ff]"
                              : "text-[#494564] hover:bg-[#fffaf2]"
                          }
                        `
                      }
                      style={({ isActive }) => ({
                        color: isActive ? color : undefined,
                      })}
                    >
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />

                      {item.label}
                    </NavLink>
                  );
                })}

              </div>

              {/* MOBILE DISCLOSURE */}

              <NavLink
                to="/kids/mandatory-disclosure"
                onClick={closeMenu}
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  bg-[#34305c]
                  px-4
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                "
              >
                Mandatory Disclosure Information

                <ArrowUpRight size={16} />
              </NavLink>

            </nav>
          </div>
        )}

      </header>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main>
        <Outlet />
      </main>

      <KidsFooter />

      <style>{`
        @keyframes kidsAnnouncementMarquee {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-50%,0,0); }
        }
        @keyframes kidsRainbowGlow {
          0%,100% { filter: saturate(1); opacity: .92; }
          50% { filter: saturate(1.35) brightness(1.08); opacity: 1; }
        }
        @keyframes kidsMenuIn {
          from { opacity: 0; transform: translateY(-10px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes kidsLogoFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .announcement-track {
          animation: kidsAnnouncementMarquee 24s linear infinite;
        }
          @keyframes kidsAnnouncementStar {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: .55;
  }

  50% {
    transform: translateY(-3px) rotate(14deg) scale(1.18);
    opacity: 1;
  }
}

.kids-announcement-star {
  animation: kidsAnnouncementStar 2.8s ease-in-out infinite;
}

.kids-star-delay {
  animation-delay: 1.1s;
}
        .announcement-track:hover { animation-play-state: paused; }
        .kids-rainbow-strip { animation: kidsRainbowGlow 3.8s ease-in-out infinite; }
        header:not(.kids-header-scrolled) img[alt="Paragon Kids"] {
          animation: kidsLogoFloat 3.6s ease-in-out infinite;
        }
        .kids-header-scrolled .announcement-track { animation-duration: 31s; }
        @media (max-width: 1023px) {
          header nav { animation: kidsMenuIn .32s cubic-bezier(.2,.8,.2,1) both; }
        }
        @media (prefers-reduced-motion: reduce) {
          .announcement-track, .kids-rainbow-strip, header img[alt="Paragon Kids"], header nav {
            animation: none !important;
          }
        }
      `}</style>

    </div>
  );
}