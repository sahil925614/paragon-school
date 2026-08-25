import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { PageBanner } from "../../../components/PageBanner";
import { schoolApi } from "../api/schoolApi";
import { applyPageSeo, type PageSeo } from "../utils/pageSeo";


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
  title: string;
  description?: string | null;
  is_active: boolean;
  settings?: ContactSettings | [];
};

type ContactPageData = {
  seo?: PageSeo;
  sections: ContactSection[];
};

function plainText(html?: string | null) {
  return html?.replace(/<[^>]*>/g, "").trim() || "";
}

function mapSource(iframe?: string) {
  return iframe?.match(/src=["']([^"']+)["']/i)?.[1];
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
/* =========================================================
   CONTACT PAGE
========================================================= */

export function ContactPage() {
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const enquiryMutation = useMutation({
    mutationFn: (enquiry: ContactEnquiry) =>
      schoolApi.post("contact-enquiries", enquiry),
  });

  const submitEnquiry = async (event: FormEvent<HTMLFormElement>) => {
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
  const { data: contactPage } = useQuery({
    queryKey: ["school-contact"],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: ContactPageData }>("pages/contact");
      return response.data.data;
    },
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
  const emails = contact?.emails?.split(/\r?\n/).filter(Boolean) ?? [
    "principalparagon2012@gmail.com",
    "paragonschool71@gmail.com",
  ];
  const mobileNumbers = contact?.mobile?.split(",").map((phone) => phone.trim()).filter(Boolean) ?? [
    "+91 8284848899",
    "9915509652",
    "9855953220",
  ];
  const mapUrl =
    mapSource(contact?.map_iframe) ||
    "https://www.google.com/maps?q=Paragon+Senior+Secondary+School+Sector+71+SAS+Nagar+Mohali+Punjab&output=embed";

  useEffect(() => {
    applyPageSeo(contactPage?.seo);
  }, [contactPage]);
  return (
    <>
      <PageBanner
        title={banner?.title || "Contact Us"}
        description={plainText(banner?.description) || "Connect with the Paragon School team."}
      />

      <main className="overflow-hidden">

        {/* =====================================================
            CONTACT FORM + INFORMATION
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#f4f7f8] py-14 sm:py-16 lg:py-20">

          {/* Background Decorations */}

          <div
            className="
              pointer-events-none
              absolute
              -left-28
              top-16
              size-72
              rounded-full
              border-[38px]
              border-gold/[.05]
            "
            aria-hidden="true"
          />

          <div
            className="
              pointer-events-none
              absolute
              -right-28
              bottom-[-120px]
              size-80
              rounded-full
              bg-navy/[.025]
            "
            aria-hidden="true"
          />

          <div
            className="
              pointer-events-none
              absolute
              right-[8%]
              top-14
              size-2.5
              rounded-full
              bg-gold/20
            "
            aria-hidden="true"
          />


          <div className="container relative">

            <div className="grid items-stretch gap-6 lg:grid-cols-[1.25fr_.75fr]">

              {/* =================================================
                  CONTACT FORM
              ================================================== */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-[0_20px_60px_-38px_rgba(16,42,67,0.35)]
                  sm:p-8
                  lg:p-10
                "
              >

                {/* Decorative Circle */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    size-44
                    rounded-full
                    border-[20px]
                    border-gold/[.055]
                  "
                  aria-hidden="true"
                />


                <div className="relative">

                  {/* Heading */}

                  <div className="mb-8">

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          grid
                          size-11
                          shrink-0
                          place-items-center
                          rounded-xl
                          bg-cream
                          text-gold-dark
                          ring-1
                          ring-gold/10
                        "
                      >
                        <Send
                          size={20}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>


                      <div>

                        <h2 className="font-serif text-2xl leading-tight text-navy sm:text-3xl">
                          In case of any query
                        </h2>

                        <div
                          className="mt-3 h-[2px] w-10 rounded-full bg-gold"
                          aria-hidden="true"
                        />

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      FORM
                  ================================================== */}

                  <form className="space-y-4" onSubmit={submitEnquiry}>

                    {/* Name + Email */}

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>
                        <label
                          htmlFor="name"
                          className="sr-only"
                        >
                          Your Name
                        </label>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          maxLength={255}
                          placeholder="Your Name*"
                          className="
                            h-12
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-[#fafbfb]
                            px-4
                            text-sm
                            text-navy
                            outline-none
                            transition
                            placeholder:text-slate-400
                            hover:border-slate-300
                            focus:border-gold
                            focus:bg-white
                            focus:ring-4
                            focus:ring-gold/10
                          "
                        />
                      </div>


                      <div>
                        <label
                          htmlFor="email"
                          className="sr-only"
                        >
                          Your Email
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          maxLength={255}
                          placeholder="Your Email*"
                          className="
                            h-12
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-[#fafbfb]
                            px-4
                            text-sm
                            text-navy
                            outline-none
                            transition
                            placeholder:text-slate-400
                            hover:border-slate-300
                            focus:border-gold
                            focus:bg-white
                            focus:ring-4
                            focus:ring-gold/10
                          "
                        />
                      </div>

                    </div>


                    {/* Subject */}

                    <div>

                      <label
                        htmlFor="subject"
                        className="sr-only"
                      >
                        Subject
                      </label>

                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        maxLength={255}
                        placeholder="Subject*"
                        className="
                          h-12
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-[#fafbfb]
                          px-4
                          text-sm
                          text-navy
                          outline-none
                          transition
                          placeholder:text-slate-400
                          hover:border-slate-300
                          focus:border-gold
                          focus:bg-white
                          focus:ring-4
                          focus:ring-gold/10
                        "
                      />

                    </div>


                    {/* Message */}

                    <div>

                      <label
                        htmlFor="message"
                        className="sr-only"
                      >
                        Message
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        rows={7}
                        required
                        maxLength={5000}
                        placeholder="Message*"
                        className="
                          w-full
                          resize-none
                          rounded-xl
                          border
                          border-slate-200
                          bg-[#fafbfb]
                          px-4
                          py-4
                          text-sm
                          leading-6
                          text-navy
                          outline-none
                          transition
                          placeholder:text-slate-400
                          hover:border-slate-300
                          focus:border-gold
                          focus:bg-white
                          focus:ring-4
                          focus:ring-gold/10
                        "
                      />

                    </div>


                    {/* Submit */}

                    <div className="pt-2">

                      <button
                        type="submit"
                        disabled={enquiryMutation.isPending}
                        className="
                          group
                          inline-flex
                          min-h-12
                          items-center
                          justify-center
                          gap-2.5
                          rounded-xl
                          bg-gold-dark
                          px-6
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.12em]
                          text-white
                          shadow-lg
                          shadow-gold-dark/15
                          transition
                          duration-300
                          hover:-translate-y-0.5
                          hover:shadow-xl
                          hover:shadow-gold-dark/20
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      >
                        {enquiryMutation.isPending ? "Sending..." : "Send Message"}

                        <Send
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />

                      </button>

                    </div>

                    {formMessage && (
                      <p
                        role="status"
                        aria-live="polite"
                        className={`rounded-xl border px-4 py-3 text-sm ${
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


              {/* =================================================
                  CONTACT INFORMATION
              ================================================== */}

              <aside
                className="
                  relative
                  overflow-hidden
                  rounded-[28px]
                  bg-navy
                  p-6
                  text-white
                  shadow-xl
                  shadow-navy/15
                  sm:p-8
                  lg:p-9
                "
              >

                {/* Background decorations */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    size-48
                    rounded-full
                    border-[22px]
                    border-white/[.05]
                  "
                  aria-hidden="true"
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-20
                    size-56
                    rounded-full
                    bg-white/[.025]
                  "
                  aria-hidden="true"
                />


                <div className="relative">

                  {/* ================= LOCATION ================= */}

                  <ContactItem
                    icon={MapPin}
                    title={contact?.location_title || "Location:"}
                  >
                    <p>{contact?.location || "Paragon Senior Secondary School Sector 71, SAS Nagar, Mohali, Punjab, PIN 160071 (India)"}</p>
                  </ContactItem>


                  <ContactDivider />


                  {/* ================= WORKING HOURS ================= */}

                  <ContactItem
                    icon={Clock3}
                    title={contact?.working_hours_title || "Working Hours:"}
                  >
                    <p>{contact?.working_days || "Monday-Saturday"}</p>
                    <p>{contact?.working_time || "9:00 AM - 2:00 PM"}</p>
                  </ContactItem>


                  <ContactDivider />


                  {/* ================= EMAIL ================= */}

                  <ContactItem
                    icon={Mail}
                    title={contact?.email_title || "Email:"}
                  >
                    <div className="space-y-1">

{emails.map((email) => (
                        <a
                          key={email}
                          href={`mailto:${email}`}
                          className="block break-all text-gold transition hover:text-white"
                        >
                          {email}
                        </a>
                      ))}

                    </div>
                  </ContactItem>


                  <ContactDivider />


                  {/* ================= CALL ================= */}

                  <ContactItem
                    icon={Phone}
                    title={contact?.call_title || "Call Us:"}
                  >

                    <div className="space-y-1">

<p>
                        Landline:{" "}
                        <a href={phoneHref(contact?.landline || "0172-5097142")} className="transition hover:text-gold">
                          {contact?.landline || "0172-5097142"}
                        </a>
                      </p>

                      <p>
                        Mobile:{" "}
                        {mobileNumbers.map((phone, index) => (
                          <span key={phone}>
                            {index > 0 && ", "}
                            <a href={phoneHref(phone)} className="transition hover:text-gold">
                              {phone}
                            </a>
                          </span>
                        ))}
                      </p>

                    </div>

                  </ContactItem>

                </div>

              </aside>

            </div>

          </div>

        </section>


        {/* =====================================================
            MAP
        ====================================================== */}

        <section className="relative bg-white py-14 sm:py-16 lg:py-20">

          <div className="container">

            {/* Map Heading */}

            <div className="mb-8 flex items-center gap-4">

              <div
                className="
                  grid
                  size-12
                  shrink-0
                  place-items-center
                  rounded-xl
                  bg-navy
                  text-gold
                  shadow-lg
                  shadow-navy/10
                "
              >
                <MapPin
                  size={21}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>


              <div>

                <h2 className="font-serif text-3xl leading-tight text-navy sm:text-4xl">
                  Location
                </h2>

                <div
                  className="mt-3 h-[2px] w-10 rounded-full bg-gold"
                  aria-hidden="true"
                />

              </div>

            </div>


            {/* Map */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200
                bg-slate-100
                p-2
                shadow-[0_22px_65px_-38px_rgba(16,42,67,0.4)]
                sm:p-3
              "
            >

              <div
                className="
                  overflow-hidden
                  rounded-[20px]
                  bg-slate-100
                "
              >

                <iframe
                  title="Paragon Senior Secondary School Location"
                  src={mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="
                    h-[350px]
                    w-full
                    border-0
                    sm:h-[420px]
                    lg:h-[480px]
                  "
                />

              </div>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}


/* =========================================================
   CONTACT ITEM
========================================================= */

type ContactItemProps = {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
};


function ContactItem({
  icon: Icon,
  title,
  children,
}: ContactItemProps) {
  return (
    <div className="flex items-start gap-4">

      <div
        className="
          grid
          size-11
          shrink-0
          place-items-center
          rounded-xl
          bg-white/10
          text-gold
          ring-1
          ring-white/10
        "
      >
        <Icon
          size={19}
          strokeWidth={1.9}
          aria-hidden="true"
        />
      </div>


      <div className="min-w-0 pt-0.5">

        <h3 className="font-serif text-lg text-white">
          {title}
        </h3>

        <div className="mt-2 text-sm leading-6 text-slate-300">
          {children}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   DIVIDER
========================================================= */

function ContactDivider() {
  return (
    <div
      className="my-6 h-px bg-white/10"
      aria-hidden="true"
    />
  );
}