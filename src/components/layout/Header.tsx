import { ArrowUpRight,
  ChevronDown,
  Menu,
  Phone,
  X,} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { schoolApi } from "../../features/school/api/schoolApi";


type HeaderFooterData = {
  logo?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
};

const storageBaseUrl =
  "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(path?: string, pathUrl?: string) {
  if (path) return `${storageBaseUrl}${path.replace(/^\/+/, "")}`;
  if (pathUrl && !pathUrl.includes("localhost")) return pathUrl;
  return undefined;
}
type MenuItem = {
  label: string;
  path: string;
};

type DropdownMenu = MenuItem & {
  matchPaths: string[];
  children: MenuItem[];
};

const aboutMenu: DropdownMenu = {
  label: "About",
  path: "#",
  matchPaths: ["/school/about", "/school/academics"],
  children: [
    { label: "History and Legacy", path: "/school/about/history-and-legacy" },
    { label: "Mission and Vision", path: "/school/about/mission-and-vision" },
    { label: "Founder", path: "/school/about/founder" },
    { label: "President's Desk", path: "/school/about/presidents-desk" },
    { label: "Director's Desk", path: "/school/about/directors-desk" },
    { label: "About Director", path: "/school/about/about-director" },
    { label: "Principal's Desk", path: "/school/about/principals-desk" },
    { label: "Academics", path: "/school/academics" },
    { label: "Infrastructure", path: "/school/about/infrastructure" },
  ],
};

const admissionMenu: DropdownMenu = {
  label: "Admission",
  path: "/school/admission",
  matchPaths: ["/school/admission", "/school/admissions"],
  children: [
    { label: "Books List", path: "/school/list-of-books" },
    {
      label: "School Leaving Certificate",
      path: "/school/school-leaving-certificate",
    },
  ],
};

const activitiesMenu: DropdownMenu = {
  label: "Activities",
  path: "#",
  matchPaths: ["/school/activities", "/school/flashbacks", "/school/club-activities", "/school/houses-activities"],
  children: [
    { label: "Flashbacks", path: "/school/flashbacks" },
    { label: "Club Activities", path: "/school/club-activities" },
    { label: "House Activities", path: "/school/houses-activities" },
  ],
};

const dropdownMenus = [aboutMenu, admissionMenu, activitiesMenu];

const standaloneLinks: MenuItem[] = [
  { label: "School Uniform", path: "/school/school-uniform" },
  { label: "Gallery", path: "/school/gallery" },
  { label: "Contact Us", path: "/school/contact" },
  {
    label: "Mandatory Disclosure Information",
    path: "/school/mandatory-disclosure-information",
  },
];

export function Header() {
  const { data: footer } = useQuery({
    queryKey: ["school-footer"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: HeaderFooterData }>("footer");
      return response.data.data;
    },
  });
  const announcementAddress = footer?.address || "Sector 71, Mohali";
  const announcementEmails = footer?.email
    ?.split(",")
    .map((email) => email.trim())
    .filter(Boolean) || [
      "principalparagon2012@gmail.com",
      "paragonschool71@gmail.com",
    ];
  const primaryEmail = announcementEmails[0] || "principalparagon2012@gmail.com";
  const secondaryEmail = announcementEmails[1] || primaryEmail;
  const phone = footer?.phone || "0172-5097142";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const logo = mediaUrl(footer?.logo, footer?.logo_url) || "/images/paragon-school-logo.webp";
  const [open, setOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileDropdown(null);
    setOpenDesktopDropdown(null);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [pathname]);
  const preventHeaderDrag = (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 0 && event.target instanceof Element && event.target.closest("a, button")) {
      event.preventDefault();
    }
  };

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileDropdown(null);
  };

  const isMenuActive = (menu: DropdownMenu) =>
    menu.matchPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

  const desktopDropdown = (menu: DropdownMenu) => (
    <div
      className="group relative flex h-20 items-center"
      key={menu.label}
      onMouseEnter={() => setOpenDesktopDropdown(menu.label)}
      onMouseLeave={() => setOpenDesktopDropdown(null)}
      onFocus={() => setOpenDesktopDropdown(menu.label)}
    >
      <NavLink
        className={`nav-link inline-flex items-center gap-1 whitespace-nowrap ${isMenuActive(menu) ? "text-gold-dark" : ""}`}
        to={menu.path}
        onClick={(event) => {
          setOpenDesktopDropdown(null);
          event.currentTarget.blur();
        }}
      >
        {menu.label}
        <ChevronDown
          className={`transition-transform duration-300 ${openDesktopDropdown === menu.label ? "rotate-180" : ""}`}
          size={14}
        />
      </NavLink>
      <div
        className={`absolute left-0 top-full z-50 w-64 transition-all duration-300 ease-out ${openDesktopDropdown === menu.label ? "block translate-y-0 opacity-100" : "hidden"}`}
      >
        <div className="overflow-hidden border-t-2 border-gold bg-white py-2 shadow-xl ring-1 ring-slate-200">
          {menu.children.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                `block border-b border-slate-100 px-5 py-3 text-sm font-medium transition last:border-0 hover:bg-cream hover:text-gold-dark ${isActive ? "bg-cream text-gold-dark" : "text-slate-700"}`
              }
              to={item.path}
              onClick={(event) => {
                setOpenDesktopDropdown(null);
                event.currentTarget.blur();
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );

  const mobileDropdownMenu = (menu: DropdownMenu) => {
    const expanded = mobileDropdown === menu.label;
    return (
      <div key={menu.label}>
        <div className="flex items-center rounded-lg hover:bg-slate-100">
          <NavLink
            className={`flex-1 px-3 py-3 ${isMenuActive(menu) ? "font-semibold text-gold-dark" : ""}`}
            to={menu.path}
            onClick={closeMobileMenu}
          >
            {menu.label}
          </NavLink>
          <button
            className="grid size-11 place-items-center"
            aria-label={`Toggle ${menu.label} menu`}
            aria-expanded={expanded}
            onClick={() => setMobileDropdown(expanded ? null : menu.label)}
          >
            <ChevronDown
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              size={17}
            />
          </button>
        </div>
        {expanded && (
          <div className="ml-3 border-l-2 border-slate-200 pl-3">
            {menu.children.map((item) => (
              <NavLink
                key={item.path}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm hover:bg-cream hover:text-gold-dark ${isActive ? "font-semibold text-gold-dark" : "text-slate-600"}`
                }
                to={item.path}
                onClick={closeMobileMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header onMouseDownCapture={preventHeaderDrag} onDragStart={(event) => event.preventDefault()} className="sticky top-0 z-50 select-none border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* =========================================================
    TOP ANNOUNCEMENT BAR
========================================================= */}

<div
  className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
    isScrolled
      ? "pointer-events-none -translate-y-1 grid-rows-[0fr] opacity-0"
      : "translate-y-0 grid-rows-[1fr] opacity-100"
  }`}
  aria-hidden={isScrolled}
>
<div className="relative z-[60] min-h-0 overflow-hidden bg-[#08294d] text-white">
  <div className="container flex min-h-[38px] items-center">

    {/* =====================================================
        ANNOUNCEMENT LABEL
    ====================================================== */}

    <div
      className="
        relative
        z-20
        flex
        h-[38px]
        shrink-0
        items-center
        gap-2
        bg-[#c72c3b]
        px-3
        text-[9px]
        font-bold
        uppercase
        tracking-[0.14em]
        text-white

        sm:px-4
        sm:text-[10px]

        lg:px-5
      "
    >
      {/* Pulsing Dot */}
      <span className="relative flex size-2">
        <span
          className="
            absolute
            inline-flex
            size-full
            animate-ping
            rounded-full
            bg-white
            opacity-50
          "
        />

        <span
          className="
            relative
            inline-flex
            size-2
            rounded-full
            bg-white
          "
        />
      </span>

      <span className="hidden sm:inline">
        School Updates
      </span>

      <span className="sm:hidden">
        Updates
      </span>

      {/* angled edge */}
      <span
        className="
          absolute
          -right-[10px]
          top-0
          h-full
          w-5
          skew-x-[-18deg]
          bg-[#c72c3b]
        "
        aria-hidden="true"
      />
    </div>

    {/* =====================================================
        MOVING NEWS / INFORMATION
    ====================================================== */}

    <div
      className="
        relative
        min-w-0
        flex-1
        overflow-hidden
        pl-5
        pr-3
      "
    >
      {/* subtle fade edges */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-10
          w-6
          bg-gradient-to-r
          from-[#08294d]
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          z-10
          w-10
          bg-gradient-to-l
          from-[#08294d]
          to-transparent
        "
      />

      <div className="announcement-track flex w-max items-center">
        {/* FIRST COPY */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-8
            pr-8
            text-[10px]
            font-medium
            text-white/85
            sm:text-[11px]
          "
        >
          <span className="whitespace-nowrap">
            CBSE Affiliated
          </span>

          <span className="size-1 rounded-full bg-[#e63946]" />

          <span className="whitespace-nowrap">
            {announcementAddress}
          </span>

          <span className="size-1 rounded-full bg-[#e63946]" />

          <a
            href={`mailto:${primaryEmail}`}
            className="
              whitespace-nowrap
              transition-colors
              hover:text-white
            "
          >
            {primaryEmail}
          </a>

          <span className="size-1 rounded-full bg-[#e63946]" />

          <a
            href={`mailto:${secondaryEmail}`}
            className="
              whitespace-nowrap
              transition-colors
              hover:text-white
            "
          >
            {secondaryEmail}
          </a>
        </div>

        {/* DUPLICATE COPY
            Required for seamless infinite animation
        */}

        <div
          aria-hidden="true"
          className="
            flex
            shrink-0
            items-center
            gap-8
            pr-8
            text-[10px]
            font-medium
            text-white/85
            sm:text-[11px]
          "
        >
          <span className="whitespace-nowrap">
            CBSE Affiliated
          </span>

          <span className="size-1 rounded-full bg-[#e63946]" />

          <span className="whitespace-nowrap">
            {announcementAddress}
          </span>

          <span className="size-1 rounded-full bg-[#e63946]" />

          <span className="whitespace-nowrap">
            {primaryEmail}
          </span>

          <span className="size-1 rounded-full bg-[#e63946]" />

          <span className="whitespace-nowrap">
            {secondaryEmail}
          </span>
        </div>
      </div>
    </div>

    {/* =====================================================
        RIGHT ACTIONS
    ====================================================== */}

    <div
      className="
        relative
        z-20
        hidden
        h-[38px]
        shrink-0
        items-center
        bg-[#08294d]
        lg:flex
      "
    >
      {/* PHONE */}

      <a
        href={phoneHref}
        className="
          group
          flex
          h-full
          items-center
          gap-2
          border-l
          border-white/10
          px-4
          text-[10px]
          font-semibold
          text-white/85
          transition
          hover:bg-white/[0.06]
          hover:text-white
        "
      >
        <Phone
          size={12}
          className="
            text-[#e63946]
            transition-transform
            group-hover:scale-110
          "
        />

        {phone}
      </a>

      {/* PARAGON KIDS */}

     <Link
  to="/kids"
  className="
    group
    flex
    h-[38px]
    items-center
    gap-2
    bg-[#c72c3b]
    px-5
    text-[10px]
    font-bold
    uppercase
    tracking-[0.08em]
    text-white
    transition-colors
    hover:bg-[#b52030]
  "
>
  Go to Paragon Kids

  <ArrowUpRight
    size={13}
    className="
      transition-transform
      duration-300
      group-hover:-translate-y-0.5
      group-hover:translate-x-0.5
    "
  />
</Link>
    </div>
  </div>
</div>
</div>
      <div className="container flex h-20 items-center justify-between">
        <Link
          to="/school"
          className="flex shrink-0 items-center"
          onClick={closeMobileMenu}
        >
          <img
            src={logo}
            alt="Paragon School Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink
            end
            className={({ isActive }) =>
              `nav-link whitespace-nowrap ${isActive ? "text-gold-dark" : ""}`
            }
            to="/school"
          >
            Home
          </NavLink>
          {desktopDropdown(aboutMenu)}
          {desktopDropdown(admissionMenu)}
          <NavLink
            className={({ isActive }) =>
              `nav-link whitespace-nowrap ${isActive ? "text-gold-dark" : ""}`
            }
            to="/school/school-uniform"
          >
            School Uniform
          </NavLink>
          {desktopDropdown(activitiesMenu)}
          {standaloneLinks.slice(1).map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                `nav-link whitespace-nowrap ${isActive ? "text-gold-dark" : ""}`
              }
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="lg:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="container max-h-[calc(100vh-7rem)] overflow-y-auto border-t py-4 lg:hidden">
          <NavLink
            end
            className={({ isActive }) =>
              `block rounded-lg px-3 py-3 hover:bg-slate-100 ${isActive ? "font-semibold text-gold-dark" : ""}`
            }
            to="/school"
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>
          {dropdownMenus.slice(0, 2).map(mobileDropdownMenu)}
          <NavLink
            className={({ isActive }) =>
              `block rounded-lg px-3 py-3 hover:bg-slate-100 ${isActive ? "font-semibold text-gold-dark" : ""}`
            }
            to="/school/school-uniform"
            onClick={closeMobileMenu}
          >
            School Uniform
          </NavLink>
          {mobileDropdownMenu(activitiesMenu)}
          {standaloneLinks.slice(1).map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-3 hover:bg-slate-100 ${isActive ? "font-semibold text-gold-dark" : ""}`
              }
              to={item.path}
              onClick={closeMobileMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}






