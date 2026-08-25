import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { schoolApi } from "../../features/school/api/schoolApi";

type FooterData = {
  about_title?: string;
  about_text?: string;
  quick_links?: { label: string; url: string }[];
  gallery_images?: { url?: string; image_url?: string; alt?: string }[];
  contact_title?: string;
  address?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  social?: { facebook_url?: string; instagram_url?: string; youtube_url?: string };
  copyright_text?: string;
};

const fallbackQuickLinks = [
  { label: "Admission", url: "/school/admission" },
  { label: "Gallery", url: "/school/gallery" },
  { label: "Activities", url: "/school/activities" },
  { label: "Contact", url: "/school/contact" },
];
const fallbackGalleryImages = [
  "/images/lab.webp", "/images/maths-park.webp", "/images/medical_room.webp",
  "/images/music_room.webp", "/images/school_canteen.webp", "/images/smart_classes.webp",
].map((url) => ({ url, alt: "" }));
const storageBaseUrl = "https://lightskyblue-eland-620788.hostingersite.com/storage/";

function mediaUrl(path?: string, pathUrl?: string) {
  if (path?.startsWith("/")) return path;
  if (path) return `${storageBaseUrl}${path.replace(/^\/+/, "")}`;
  if (pathUrl && !pathUrl.includes("localhost")) return pathUrl;
  return undefined;
}

export function Footer() {
  const { data: footer } = useQuery({
    queryKey: ["school-footer"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: FooterData }>("footer");
      return response.data.data;
    },
  });
  const quickLinks = footer?.quick_links?.length ? footer.quick_links : fallbackQuickLinks;
  const galleryImages = footer?.gallery_images?.length ? footer.gallery_images : fallbackGalleryImages;

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute -right-36 -top-36 size-[380px] rounded-full border-[55px] border-white/[0.025]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-44 -left-40 size-[360px] rounded-full border-[50px] border-[#c72c3b]/[0.06]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[48%] top-16 size-1.5 rounded-full bg-[#c72c3b]/40" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#c72c3b]" />

      <div className="container relative mx-auto px-0 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16 xl:py-[72px]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_.7fr_1fr_1.35fr] lg:gap-8 xl:gap-12">
          <div className="lg:pr-4">
            <h2 className="max-w-[300px] font-serif text-[26px] leading-[1.12] text-white sm:text-[28px] lg:text-[30px]">
              {footer?.about_title || "About Paragon71, Mohali."}
            </h2>
            <TitleLine />
            <p className="mt-6 max-w-[320px] text-[12px] leading-[1.9] text-slate-300/85 sm:text-[13px]">
              {footer?.about_text || "Paragon Senior Secondary School has grown steadily with a clear educational purpose since its inception."}
            </p>
            <div className="mt-7">
              <p className="font-serif text-[16px] font-medium text-white">Explore Us:</p>
              <div className="mt-4 flex items-center gap-2.5">
                <SocialLink  href={footer?.social?.facebook_url || "https://www.facebook.com/ParagonSchool71/?ref=pages_you_manage"} label="Facebook"><FacebookIcon /></SocialLink>
                <SocialLink href={footer?.social?.instagram_url || "https://www.instagram.com/paragon71_official/"} label="Instagram"><InstagramIcon /></SocialLink>
                <SocialLink href={footer?.social?.youtube_url || "https://www.youtube.com/channel/UC-6R6GUkRcUCKLhcG_UAlFQ"} label="YouTube"><YoutubeIcon /></SocialLink>
              </div>
            </div>
          </div>

          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <nav className="mt-6 flex flex-col items-start gap-1">
              {quickLinks.map((link, index) => <FooterNavLink key={`${link.label}-${index}`} url={link.url}>{link.label}</FooterNavLink>)}
            </nav>
          </div>

          <div>
            <FooterHeading>Gallery</FooterHeading>
            <div className="mt-7 grid max-w-[260px] grid-cols-3 gap-2">
              {galleryImages.map((image, index) => {
                const source = mediaUrl(image.url, "image_url" in image ? image.image_url : undefined);
                return source ? (
                  <Link key={`${source}-${index}`} to="/school/gallery" aria-label={image.alt || `Gallery image ${index + 1}`} className="group relative aspect-[1.08/1] overflow-hidden rounded-lg bg-white/[0.07] ring-1 ring-white/[0.08]">
                    <img src={source} alt={image.alt || ""} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 grid place-items-center bg-[#071f3b]/0 transition-all duration-300 group-hover:bg-[#071f3b]/60"><ArrowUpRight size={16} className="translate-y-1 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" /></div>
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          <div>
            <FooterHeading>{footer?.contact_title || "Contact"}</FooterHeading>
            <div className="mt-7 space-y-5">
              <ContactRow icon={<MapPin size={16} strokeWidth={1.8} />} label="Location">
                <address className="not-italic">{footer?.address || "Paragon Senior Secondary School Sector 71, SAS Nagar, Mohali, Punjab, PIN 160071 (India)"}</address>
              </ContactRow>
              <ContactRow icon={<Phone size={15} strokeWidth={1.8} />} label="Phone">
                <p>Landline: {footer?.phone || "0172-5097142"}</p>
                <p>Mobile: {footer?.mobile || "+91 8284848899, 9915509652, 9855953220"}</p>
              </ContactRow>
              <ContactRow icon={<Mail size={15} strokeWidth={1.8} />} label="Email">
                <p className="break-words">{footer?.email || "principalparagon2012@gmail.com, paragonschool71@gmail.com"}</p>
              </ContactRow>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.08] bg-[#061f3d]/50">
        <div className="container mx-auto px-5 py-5 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] leading-5 text-slate-400 sm:text-[11px]">
            {footer?.copyright_text || `Copyright © ${new Date().getFullYear()} Paragon School. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return <div className="group flex items-start gap-3.5"><ContactIcon>{icon}</ContactIcon><div className="min-w-0"><p className="text-[11px] font-semibold text-white">{label}</p><div className="mt-1.5 space-y-1 text-[12px] leading-[1.8] text-slate-300/80">{children}</div></div></div>;
}

function FooterNavLink({ url, children }: { url: string; children: React.ReactNode }) {
  const className = "group relative flex w-full items-center rounded-lg py-2 text-[13px] text-slate-300/85 transition-all duration-300 hover:translate-x-1 hover:text-white";
  const content = <><span className="mr-0 h-[5px] w-0 rounded-full bg-[#c72c3b] opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:w-[5px] group-hover:opacity-100" />{children}</>;
  return url.startsWith("/") ? <Link to={url} className={className}>{content}</Link> : <a href={url} className={className}>{content}</a>;
}
function FooterHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="
          font-serif
          text-[23px]
          leading-tight
          text-white
          sm:text-[25px]
        "
      >
        {children}
      </h3>

      <TitleLine />
    </div>
  );
}


/* =========================================================
   RED TITLE LINE
========================================================= */

function TitleLine() {
  return (
    <div className="mt-3 flex items-center gap-1.5">
      <span className="h-[2px] w-8 rounded-full bg-[#c72c3b]" />
      <span className="size-1 rounded-full bg-[#c72c3b]/60" />
    </div>
  );
}


/* =========================================================
   CONTACT ICON
========================================================= */

function ContactIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      className="
        grid size-9 shrink-0
        place-items-center
        rounded-xl
        border border-white/[0.09]
        bg-white/[0.045]
        text-[#ef4a58]
        transition-all duration-300

        group-hover:border-[#c72c3b]/40
        group-hover:bg-[#c72c3b]/10
      "
    >
      {children}
    </span>
  );
}


/* =========================================================
   SOCIAL LINK
========================================================= */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        grid size-10
        place-items-center
        rounded-full
        border border-white/[0.12]
        bg-white/[0.06]
        text-white/75
        transition-all duration-300

        hover:-translate-y-1
        hover:border-[#c72c3b]
        hover:bg-[#c72c3b]
        hover:text-white
      "
    >
      {children}
    </a>
  );
}


/* =========================================================
   FACEBOOK
========================================================= */

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[15px] fill-current"
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.024 1.792-4.695 4.533-4.695 1.312 0 2.686.236 2.686.236v2.973h-1.513c-1.49 0-1.956.931-1.956 1.887v2.259h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}


/* =========================================================
   INSTAGRAM
========================================================= */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[15px] fill-current"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.668-.072-4.948C23.728 2.694 21.31.273 16.948.073 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}


/* =========================================================
   YOUTUBE
========================================================= */

function YoutubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[17px] fill-current"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
