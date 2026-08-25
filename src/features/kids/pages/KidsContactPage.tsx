import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { KidsPlaceholderPage } from "./KidsPlaceholderPage";
import { kidsApi } from "../api/kidsApi";
import { applyPageSeo, type PageSeo } from "../../school/utils/pageSeo";


type ContactEnquiry = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactSettings = {
  location_title?: string;
  location?: string;
  working_hours_title?: string;
  working_days?: string;
  working_time?: string;
  email_title?: string;
  emails?: string;
  call_title?: string;
  landline?: string;
  mobile?: string;
  map_iframe?: string;
};

type ContactSection = {
  type: string;
  title?: string;
  description?: string | null;
  is_active: boolean;
  settings?: ContactSettings | [];
};

type ContactPageData = {
  title: string;
  seo?: PageSeo;
  sections: ContactSection[];
};

function plainText(html?: string | null) {
  return html?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || "";
}

function mapSource(iframe?: string) {
  return iframe?.match(/src=["']([^"']+)["']/i)?.[1];
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -55px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden =
    direction === "left"
      ? "-translate-x-12 opacity-0"
      : direction === "right"
        ? "translate-x-12 opacity-0"
        : direction === "scale"
          ? "translate-y-5 scale-[.95] opacity-0"
          : "translate-y-10 opacity-0";

  return (
    <div
      ref={ref}
      className={`kids-contact-reveal transition-all duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hidden
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function KidsContactPage() {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { data: contactPage } = useQuery({
    queryKey: ["kids-page", "contact"],
    queryFn: async () => {
      const response = await kidsApi.get<{ data: ContactPageData }>("pages/contact");
      return response.data.data;
    },
  });

  const enquiryMutation = useMutation({
    mutationFn: (enquiry: ContactEnquiry) =>
      kidsApi.post("contact-enquiries", enquiry),
  });

  const banner = contactPage?.sections.find(
    (section) => section.type === "home_banner" && section.is_active,
  );
  const contactSection = contactPage?.sections.find(
    (section) => section.type === "contact_info" && section.is_active,
  );
  const contact =
    contactSection?.settings && !Array.isArray(contactSection.settings)
      ? contactSection.settings
      : undefined;
  const emails = contact?.emails?.split(/\r?\n/).map((email) => email.trim()).filter(Boolean) ?? [
    "paragonkids71@gmail.com",
  ];
  const mobileNumbers = contact?.mobile?.split(",").map((phone) => phone.trim()).filter(Boolean) ?? [
    "+91 8284848899",
    "9915509652",
    "9855953220",
  ];
  const mapUrl =
    mapSource(contact?.map_iframe) ||
    "https://www.google.com/maps?q=Paragon%20Senior%20Secondary%20School%20Sector%2071%20Mohali&output=embed";

  useEffect(() => {
    applyPageSeo(contactPage?.seo);
  }, [contactPage]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const enquiry: ContactEnquiry = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };

    try {
      await enquiryMutation.mutateAsync(enquiry);
      form.reset();
      setFormMessage({
        type: "success",
        text: "Thank you. Your message has been sent successfully.",
      });
    } catch (error) {
      const apiMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setFormMessage({
        type: "error",
        text: apiMessage || "We could not send your message. Please try again.",
      });
    }
  };

  return (    <>
      <KidsPlaceholderPage
        title={banner?.title || contactPage?.title || "Contact"}
        description={
          plainText(banner?.description) ||
          "Connect with our team for visits, admission support or general enquiries."
        }
      />
      <main className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf8_0%,#fffaf4_48%,#fffdf8_100%)]">

        {/* =====================================================
            BACKGROUND DECORATIONS
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute -left-40 top-28
            size-[360px]
            rounded-full
            border-[55px]
            border-[#37a9df]/[0.25]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute -right-44 top-[26%]
            size-[400px]
            rounded-full
            border-[60px]
            border-[#ffd34e]/[0.28]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute left-[6%] top-[18%]
            size-3 rounded-full
            bg-[#ef5f6c]/30
            animate-[kidsFloat_5s_ease-in-out_infinite]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute right-[8%] top-[12%]
            size-4 rounded-full
            bg-[#37a9df]/25
            animate-[kidsFloat_6s_ease-in-out_infinite_1s]
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute left-[3%] top-[62%]
            size-5 rounded-full
            bg-[#ffd34e]/40
            animate-[kidsFloat_7s_ease-in-out_infinite_.5s]
          "
          aria-hidden="true"
        />


        {/* =====================================================
            PAGE HEADING
        ====================================================== */}

        {/* <section className="container relative pt-14 sm:pt-16 lg:pt-20">

          <div className="mx-auto max-w-3xl text-center">

            


            <h1
              className="
                mt-5
                font-serif
                text-[40px]
                font-bold
                leading-[1.1]
                text-[#34305c]
                sm:text-5xl
                lg:text-[58px]
              "
            >
              Get In{" "}
              <span className="relative inline-block text-[#37a9df]">
                Touch

                <svg
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  className="
                    absolute -bottom-3 left-0
                    h-3 w-full
                    text-[#ef5f6c]
                  "
                  aria-hidden="true"
                >
                  <path
                    d="M3 8C27 3 64 2 97 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

          </div>
        </section> */}


        {/* =====================================================
            CONTACT CONTENT
        ====================================================== */}

        <section className="container relative py-14 sm:py-16 lg:py-20">

          <div
  className="
    mx-auto
    grid
    w-full
    max-w-[1180px]
    items-stretch
    gap-6
    lg:grid-cols-[1.08fr_.92fr]
    lg:gap-7
    xl:grid-cols-[1.05fr_.95fr]
    xl:gap-8
  "
>


            <Reveal direction="left" className="h-full">
            <div
  className="
    relative
    h-full
    overflow-hidden
    rounded-[28px]
    border border-[#34305c]/[0.07]
    bg-white
    p-5
    shadow-[0_25px_70px_-40px_rgba(52,48,92,.35)]
    sm:p-8
    lg:p-9
    xl:p-10
  "
>

              {/* decorative shapes */}

              <div
                className="
                  pointer-events-none
                  absolute -right-16 -top-16
                  size-48
                  rounded-full
                  bg-[#37a9df]/[0.045]
                "
                aria-hidden="true"
              />

              <div
                className="
                  pointer-events-none
                  absolute right-12 top-12
                  size-3 rounded-full
                  bg-[#ffd34e]
                  opacity-60
                "
                aria-hidden="true"
              />


              <div className="relative">

                <div className="flex items-center gap-4">

                  <span
                    className="
                      flex size-12
                      items-center justify-center
                      rounded-[16px]
                      bg-[#edf9fe]
                      font-serif
                      text-xl font-bold
                      text-[#37a9df]
                      [animation:kidsContactBob_4s_ease-in-out_infinite]
                    "
                  >
                    01
                  </span>

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-bold uppercase
                        tracking-[0.18em]
                        text-[#ef5f6c]
                      "
                    >
                      Contact Form
                    </p>

                    <h2
                      className="
                        mt-1 font-serif
                        text-2xl font-bold
                        text-[#34305c]
                        sm:text-3xl
                      "
                    >
                      Get In Touch
                    </h2>
                  </div>

                </div>


                <div className="mt-7 h-[3px] w-10 rounded-full bg-[#ef5f6c]" />


                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-8"
                >

                  <div className="grid gap-5 sm:grid-cols-2">

                    <KidsInput
                      name="name"
                      placeholder="Your Name*"
                      focusedField={focusedField}
                      setFocusedField={setFocusedField}
                    />

                    <KidsInput
                      name="email"
                      type="email"
                      placeholder="Your Email*"
                      focusedField={focusedField}
                      setFocusedField={setFocusedField}
                    />

                  </div>


                  <div className="mt-5">

                    <KidsInput
                      name="subject"
                      placeholder="Subject"
                      focusedField={focusedField}
                      setFocusedField={setFocusedField}
                    />

                  </div>


                  {/* MESSAGE */}

                  <div
                    className={`
                      relative
                      mt-5
                      overflow-hidden
                      rounded-[18px]
                      border
                      bg-[#fffdf9]
                      transition-all
                      duration-300
                      ${
                        focusedField === "message"
                          ? "border-[#37a9df] shadow-[0_10px_30px_-18px_rgba(55,169,223,.65)]"
                          : "border-[#34305c]/10"
                      }
                    `}
                  >

                    <span
                      className={`
                        absolute bottom-0 left-0
                        w-1 rounded-r-full
                        transition-all duration-300
                        ${
                          focusedField === "message"
                            ? "h-full bg-[#37a9df]"
                            : "h-0 bg-[#37a9df]"
                        }
                      `}
                    />

                    <textarea
                      name="message"
                      placeholder="Message*"
                      rows={7}
                      required
                      maxLength={5000}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      className="
                        block w-full
                        resize-none
                        bg-transparent
                        px-5 py-4
                        text-[15px]
                        leading-7
                        text-[#34305c]
                        outline-none
                        placeholder:text-[#8c8998]
                      "
                    />

                  </div>


                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={enquiryMutation.isPending}
                    className="
                      group
                      relative
                      mt-7
                      inline-flex
                      min-w-[145px]
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-[16px]
                      bg-[#ef5f6c]
                      px-7 py-4
                      text-sm
                      font-bold
                      uppercase
                      tracking-[0.08em]
                      text-white
                      shadow-[0_12px_28px_-14px_rgba(239,95,108,.7)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:scale-[1.02]
                      active:translate-y-0
                      active:scale-[.98]
                      hover:shadow-[0_18px_35px_-14px_rgba(239,95,108,.8)]
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >

                    <span
                      className="
                        absolute inset-0
                        translate-x-[-110%]
                        bg-[#37a9df]
                        transition-transform
                        duration-500
                        group-hover:translate-x-0
                      "
                    />

                    <span className="relative">
                      {enquiryMutation.isPending ? "Sending..." : "Submit"}
                    </span>

                  </button>

                  {formMessage && (
                    <p
                      role="status"
                      aria-live="polite"
                      className={`mt-5 rounded-[16px] border px-4 py-3 text-sm ${
                        formMessage.type === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {formMessage.text}
                    </p>
                  )}

                </form>

              </div>
            </div>
            </Reveal>


            {/* =================================================
                RIGHT — CONTACT DETAILS
            ================================================== */}

          {/* =================================================
    RIGHT — CONTACT DETAILS
================================================== */}

<Reveal direction="right" delay={140} className="h-full">
<aside
  className="
    relative
    h-full
    overflow-hidden
    rounded-[28px]
    border border-[#34305c]/[0.07]
    bg-white
    p-5
    shadow-[0_25px_70px_-40px_rgba(52,48,92,.28)]
    sm:p-8
    lg:p-9
    xl:p-10
  "
>
  {/* soft decorative background */}

  <div
    className="
      pointer-events-none
      absolute -right-20 -top-20
      size-60
      rounded-full
      bg-[#37a9df]/[0.055]
    "
    aria-hidden="true"
  />

  <div
    className="
      pointer-events-none
      absolute -bottom-20 -left-20
      size-56
      rounded-full
      bg-[#ffd34e]/[0.07]
    "
    aria-hidden="true"
  />

  <div
    className="
      pointer-events-none
      absolute right-8 top-10
      size-3
      rounded-full
      bg-[#ffd34e]
      animate-[kidsFloat_5s_ease-in-out_infinite]
    "
    aria-hidden="true"
  />

  <div
    className="
      pointer-events-none
      absolute right-20 top-20
      size-2
      rounded-full
      bg-[#ef5f6c]/60
      animate-[kidsFloat_6s_ease-in-out_infinite_.5s]
    "
    aria-hidden="true"
  />

  <div className="relative">

    {/* HEADER */}

    <div className="flex items-center gap-4">

      <span
        className="
          flex size-12
          shrink-0
          items-center
          justify-center
          rounded-[16px]
          bg-[#fff4d4]
          font-serif
          text-xl
          font-bold
          text-[#e9a915]
        "
      >
        02
      </span>

      <div>
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#ef5f6c]
          "
        >
          Contact Details
        </p>

        <h2
          className="
            mt-1
            font-serif
            text-2xl
            font-bold
            text-[#34305c]
            sm:text-3xl
          "
        >
          Paragon Kids
        </h2>
      </div>
    </div>

    <div className="mt-7 flex items-center gap-2">
      <span className="h-[3px] w-9 rounded-full bg-[#ef5f6c]" />
      <span className="size-[5px] rounded-full bg-[#f4a62a]" />
      <span className="size-[5px] rounded-full bg-[#37a9df]" />
      <span className="size-[5px] rounded-full bg-[#20a98b]" />
    </div>


    {/* CONTACT CARDS */}

    <div className="mt-7 space-y-4">

      {/* LOCATION */}

      <ContactCard
        number="01"
        title={contact?.location_title || "Location:"}
        color="#ef5f6c"
        background="#fff5f6"
      >
        <p>{contact?.location || "Paragon Kids Sector 71, SAS Nagar, Mohali, Punjab, PIN 160071 (India)"}</p>

      </ContactCard>


      {/* WORKING HOURS */}

      <ContactCard
        number="02"
        title={contact?.working_hours_title || "Working Hours:"}
        color="#e8a313"
        background="#fff9e9"
      >
        <p>{contact?.working_days || "Monday-Saturday"}</p>
        <p>{contact?.working_time || "9:00 AM - 2:00 PM"}</p>
      </ContactCard>


      {/* EMAIL */}

      <ContactCard
        number="03"
        title={contact?.email_title || "Email:"}
        color="#299fd3"
        background="#f0faff"
      >
        <div className="space-y-1">
          {emails.map((email) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="block break-all transition-colors duration-300 hover:text-[#ef5f6c]"
            >
              {email}
            </a>
          ))}
        </div>
      </ContactCard>


      {/* PHONE */}

      <ContactCard
        number="04"
        title={contact?.call_title || "Call Us:"}
        color="#18a487"
        background="#effbf8"
      >
        <div className="space-y-1">
          <a
            href={phoneHref(contact?.landline || "0172-5097142")}
            className="block transition-colors duration-300 hover:text-[#ef5f6c]"
          >
            Landline: {contact?.landline || "0172-5097142"}
          </a>
          <p>
            Mobile:{" "}
            {mobileNumbers.map((phone, index) => (
              <span key={phone}>
                {index > 0 && ", "}
                <a href={phoneHref(phone)} className="transition-colors hover:text-[#ef5f6c]">
                  {phone}
                </a>
              </span>
            ))}
          </p>
        </div>
      </ContactCard>

    </div>

  </div>
</aside>
</Reveal>

          </div>
        </section>


        {/* =====================================================
            MAP SECTION
        ====================================================== */}

        <section className="relative pb-16 sm:pb-20 lg:pb-24">

          <div className="container">

            <Reveal direction="scale">
            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border border-[#34305c]/[0.08]
                bg-white
                shadow-[0_25px_70px_-40px_rgba(52,48,92,.35)]
                sm:rounded-[34px]
              "
            >

              {/* colorful top line */}

              <div className="flex h-[6px]">

                <span className="flex-1 bg-[#ef5f6c]" />

                <span className="flex-1 bg-[#f4a62a]" />

                <span className="flex-1 bg-[#ffd34e]" />

                <span className="flex-1 bg-[#20a98b]" />

                <span className="flex-1 bg-[#37a9df]" />

              </div>


              {/* MAP */}

              <div
                className="
                  relative
                  h-[360px]
                  w-full
                  sm:h-[430px]
                  lg:h-[500px]
                "
              >

                <iframe
                  title="Paragon Kids Location"
                  src={mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="
                    absolute inset-0
                    h-full w-full
                    border-0
                  "
                />

              </div>

            </div>
            </Reveal>

          </div>
        </section>

      </main>


      {/* =====================================================
          PAGE ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes kidsFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(5deg); }
        }

        @keyframes kidsContactBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          35% { transform: translateY(-4px) rotate(-4deg); }
          70% { transform: translateY(-2px) rotate(4deg); }
        }

        @keyframes kidsContactPulse {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .75; transform: scale(1.35); }
        }

        @media (prefers-reduced-motion: reduce) {
          .kids-contact-reveal {
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

    </>
  );
}


/* =========================================================
   INPUT
========================================================= */

type KidsInputProps = {
  name: string;
  type?: string;
  placeholder: string;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
};


function KidsInput({
  name,
  type = "text",
  placeholder,
  focusedField,
  setFocusedField,
}: KidsInputProps) {
  const active = focusedField === name;

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-[16px]
        border
        bg-[#fffdf9]
        transition-all
        duration-300
        ${
          active
            ? "border-[#37a9df] shadow-[0_10px_30px_-18px_rgba(55,169,223,.65)]"
            : "border-[#34305c]/10"
        }
      `}
    >

      <span
        className={`
          absolute bottom-0 left-0
          w-1
          rounded-r-full
          bg-[#37a9df]
          transition-all
          duration-300
          ${active ? "h-full" : "h-0"}
        `}
      />

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required
        maxLength={255}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField(null)}
        className="
          h-[58px]
          w-full
          bg-transparent
          px-5
          text-[15px]
          text-[#34305c]
          outline-none
          placeholder:text-[#8c8998]
        "
      />

    </div>
  );
}


/* =========================================================
   CONTACT DETAIL CARD
========================================================= */

type ContactCardProps = {
  number: string;
  title: string;
  color: string;
  background: string;
  children: ReactNode;
};

function ContactCard({
  number,
  title,
  color,
  background,
  children,
}: ContactCardProps) {
  return (
    <div
      className="
        group
        relative
        min-h-[112px]
        overflow-hidden
        rounded-[20px]
        border
        border-[#34305c]/[0.07]
        px-5
        py-5
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:scale-[1.01]
        hover:shadow-[0_18px_42px_-24px_rgba(52,48,92,.38)]
        sm:px-6
      "
      style={{ backgroundColor: background }}
    >
      {/* left accent */}
      <span
        className="
          absolute
          bottom-0
          left-0
          top-0
          w-[4px]
          transition-all
          duration-300
          group-hover:w-[6px]
        "
        style={{ backgroundColor: color }}
      />

      {/* subtle circle */}
      <span
        className="
          pointer-events-none
          absolute
          -right-8
          -top-8
          size-24
          rounded-full
          opacity-[0.055]
          transition-transform
          duration-500
          group-hover:scale-125
        "
        style={{ backgroundColor: color }}
      />

      <div className="relative flex items-start gap-4">
        <div
          className="
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-[13px]
            text-[11px]
            font-extrabold
          "
          style={{
            color,
            backgroundColor: `${color}14`,
          }}
        >
          {number}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="
              font-serif
              text-[18px]
              font-bold
              leading-tight
              sm:text-[19px]
            "
            style={{ color }}
          >
            {title}
          </h3>

          <div
            className="
              mt-2
              break-words
              text-[13px]
              font-medium
              leading-[1.75]
              text-[#666274]
              sm:text-[14px]
            "
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}