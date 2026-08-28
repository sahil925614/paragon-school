import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  BookOpen,
  UsersRound,
  WalletCards,
  Download,
  Check,
} from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { PageBanner } from '../../../../components/PageBanner'
import { schoolApi } from '../../api/schoolApi'
import { applyPageSeo, type PageSeo } from '../../utils/pageSeo'

type AdmissionCard = {
  title?: string;
  description?: string;
};

type AdmissionSettings = {
  cards?: AdmissionCard[];
  form_ii_x_pdf?: string;
  form_xi_xii_pdf?: string;
};

type AdmissionSection = {
  type: string;
  name: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active: boolean;
  settings?: AdmissionSettings | [];
};

type AdmissionPageData = {
  title: string;
  slug: string;
  seo?: PageSeo;
  sections: AdmissionSection[];
};

const storageBaseUrl = 'https://lightskyblue-eland-620788.hostingersite.com/storage/';

function mediaUrl(image?: string | null, imageUrl?: string | null) {
  if (image) return `${storageBaseUrl}${image.replace(/^\/+/, '')}`;
  if (imageUrl && !imageUrl.includes('localhost')) return imageUrl;
  return undefined;
}

function plainText(html?: string | null) {
  return (
    html
      ?.replace(/<br\s*\/?\s*>/gi, ' ')
      .replace(/<\/p>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim() || ''
  );
}

function listItems(html?: string | null) {
  return (
    html
      ?.match(/<li[^>]*>[\s\S]*?<\/li>/gi)
      ?.map((item) => plainText(item))
      .filter(Boolean) ?? []
  );
}
const documents = [
  'Photographs',
  'Date Of Birth Certificate',
  'School Leaving Certificate',
  'Detailed Marks Card',
  'Aadhar Card',
  'PAN Card of Parents',
]

const admissionSteps = [
  <>School academic year is from April to March.</>,

  <>Admissions are on first come first basis.</>,

  <>
    Registration forms for admission are available at school&apos;s
    Administrative office or can be downloaded here:{' '}
    <a
      href="/admission-form-2-10.pdf"
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-gold-dark underline decoration-gold/40 underline-offset-4 transition hover:text-navy"
    >
      for II to X
    </a>{' '}
    and{' '}
    <a
      href="/admission-form-11-12.pdf"
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-gold-dark underline decoration-gold/40 underline-offset-4 transition hover:text-navy"
    >
      for XI-XII
    </a>
    .
  </>,

  <>
    Parents are required to apply for admission in the prescribed forms
    along with the required documents and submit at Administrative office.
  </>,

  <>
    No change in the Date of Birth of a student is permissible once he/she
    is admitted.
  </>,
]

export function AdmissionsPage() {
  const { data: page } = useQuery({
    queryKey: ['school-page', 'admission'],
    queryFn: async () => {
      const response = await schoolApi.get<{ data: AdmissionPageData }>(
        'pages/admission',
      );
      return response.data.data;
    },
  });
  const banner = page?.sections.find(
    (section) => section.type === 'home_banner' && section.is_active,
  );
  const admission = page?.sections.find(
    (section) => section.type === 'admission_content' && section.is_active,
  );
  const bookList = page?.sections.find(
    (section) => section.type === 'admission_book_list' && section.is_active,
  );
  const admissionAge = page?.sections.find(
    (section) => section.type === 'admission_age_of_admission' && section.is_active,
  );
  const settings =
    admission?.settings && !Array.isArray(admission.settings)
      ? admission.settings
      : undefined;
  const cards = settings?.cards ?? [];
  const registrationCard = cards[0];
  const documentsCard = cards[1];
  const orientationCard = cards[2];
  const feesCard = cards[3];
  const formIiXUrl = mediaUrl(settings?.form_ii_x_pdf) || '/admission-form-2-10.pdf';
  const formXiXiiUrl = mediaUrl(settings?.form_xi_xii_pdf) || '/admission-form-11-12.pdf';
  const registrationItems = listItems(registrationCard?.description);
  const displayedDocuments = listItems(documentsCard?.description);
  const dynamicSteps: ReactNode[] = registrationItems.map((item, index) =>
    index === 2 ? (
      <>
        Registration forms are available at the school office or can be downloaded here:{' '}
        <a href={formIiXUrl} target="_blank" rel="noreferrer" className="font-semibold text-gold-dark underline decoration-gold/40 underline-offset-4 transition hover:text-navy">for II to X</a>{' '}
        and{' '}
        <a href={formXiXiiUrl} target="_blank" rel="noreferrer" className="font-semibold text-gold-dark underline decoration-gold/40 underline-offset-4 transition hover:text-navy">for XI-XII</a>.
      </>
    ) : item,
  );
  const displayedSteps = dynamicSteps.length ? dynamicSteps : admissionSteps;
  const bookListUrl = mediaUrl(bookList?.image, bookList?.image_url) || '/school/admissions/books-list';
  const admissionAgeUrl = mediaUrl(admissionAge?.image, admissionAge?.image_url) || '/admission-age.pdf';
  const bookListAction = /\.pdf(?:$|\?)/i.test(bookListUrl) ? 'Open PDF' : 'View Book List';
  const admissionAgeAction = /\.pdf(?:$|\?)/i.test(admissionAgeUrl) ? 'Open PDF' : 'View Admission Ages';

  useEffect(() => {
    applyPageSeo(page?.seo);
  }, [page]);
  return (
    <main className="overflow-hidden">
      <PageBanner
        image={banner?.image}
        imageUrl={banner?.image_url}
        title={banner?.title || page?.title || "Admission Process"}
        description={plainText(banner?.description) || "Everything you need to know about admissions, required documents, fees and eligibility."}
      />

      {/* =====================================================
          ADMISSION REGISTRATION + DOCUMENTS
      ====================================================== */}
      <section className="container py-16 sm:py-20 lg:py-24">
        <div className="grid items-start gap-7 lg:grid-cols-[1.25fr_.9fr]">

          {/* Admission Registration */}
          <article className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-9 lg:p-10">
            
            {/* decorative circle */}
            <div
              className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full border-[18px] border-gold/[.08]"
              aria-hidden="true"
            />

            {/* Heading */}
            <div className="relative flex items-center gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold-dark">
                <FileText size={21} />
              </div>

              <h2 className="font-serif text-2xl leading-tight text-navy sm:text-3xl">
                {registrationCard?.title || admission?.title || "Admission Registration Process"}
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative mt-8">
              {displayedSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-[18px_1fr] gap-4 pb-6 last:pb-0"
                >
                  {/* Timeline column */}
                  <div className="relative flex justify-center">
                    {/* vertical line */}
                    {index !== displayedSteps.length - 1 && (
                      <span
                        className="absolute left-1/2 top-[14px] h-[calc(100%+10px)] w-px -translate-x-1/2 bg-gold/25"
                        aria-hidden="true"
                      />
                    )}

                    {/* bullet */}
                    <span
                      className="relative z-10 mt-[6px] block size-3 shrink-0 rounded-full bg-gold ring-4 ring-white"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Text */}
                  <div className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Documents Required */}
          <article className="relative overflow-hidden rounded-[28px] bg-navy p-6 text-white shadow-xl shadow-navy/15 sm:p-9 lg:p-10">
            {/* Decorative elements */}
            <div
              className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full border-[22px] border-white/[.05]"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-white/[.025]"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="grid size-12 place-items-center rounded-xl bg-white/10 text-gold">
                <FileText size={23} />
              </div>

              {/* <p className="eyebrow mt-7 text-gold">
                {documentsCard?.title || "Documents Required"}
              </p> */}

              <h2 className="mt-3 font-serif text-2xl text-white">
                {documentsCard?.title || "Documents for Admission"}
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
{plainText(documentsCard?.description?.match(/<p[^>]*>[\s\S]*?<\/p>/i)?.[0]) || "The following documents need to be submitted along with the Admission Form."}
              </p>

              <ul className="mt-7 grid gap-3">
                {(displayedDocuments.length ? displayedDocuments : documents).map((document) => (
                  <li
                    key={document}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.055] px-4 py-3.5 text-sm text-slate-200 transition duration-300 hover:border-gold/30 hover:bg-white/[.09]"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                      <Check size={13} strokeWidth={3} />
                    </span>

                    <span>{document}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================
          ORIENTATION + FEES
      ====================================================== */}
      <section className="relative overflow-hidden border-y border-navy/10 bg-[#f4f7f8] py-16 sm:py-20 lg:py-24">
        <div
          className="absolute -left-24 top-12 size-72 rounded-full border-[38px] border-gold/5"
          aria-hidden="true"
        />

        <div
          className="absolute -right-20 bottom-0 size-60 rounded-full bg-navy/[.035]"
          aria-hidden="true"
        />

        <div className="container grid gap-6 lg:grid-cols-2">

          {/* Parent Orientation */}
          <article className="group relative isolate overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/5 sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gold" />

            <div
              className="absolute -bottom-14 -right-12 -z-10 size-52 rounded-full bg-cream transition duration-500 group-hover:scale-110"
              aria-hidden="true"
            />

            <div className="flex items-start justify-between gap-6">
              <div className="grid size-12 place-items-center rounded-xl bg-cream text-gold-dark">
                <UsersRound size={23} />
              </div>

              <span className="font-serif text-5xl leading-none text-navy/10">
                01
              </span>
            </div>

            <h2 className="mt-8 max-w-md font-serif text-3xl leading-tight text-navy">
              {orientationCard?.title || "Parent Orientation Program"}
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-600">
{plainText(orientationCard?.description) || "An orientation program helps parents understand the school vision, teaching methodologies, expectations and the support learners need at home."}
            </p>
          </article>

          {/* Fees */}
          <article className="group relative isolate overflow-hidden rounded-[28px] bg-navy p-7 text-white shadow-lg shadow-navy/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/20 sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gold" />

            <div
              className="absolute -bottom-14 -right-12 -z-10 size-52 rounded-full border-[28px] border-white/5 transition duration-500 group-hover:scale-110"
              aria-hidden="true"
            />

            <div className="flex items-start justify-between gap-6">
              <div className="grid size-12 place-items-center rounded-xl bg-white/10 text-gold">
                <WalletCards size={23} />
              </div>

              <span className="font-serif text-5xl leading-none text-white/10">
                02
              </span>
            </div>

            <h2 className="mt-8 font-serif text-3xl leading-tight text-white">
              {feesCard?.title || "Fees"}
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-300">
{plainText(feesCard?.description) || "Monthly fees should be deposited before the 10th of every month. Late payment and readmission rules apply as notified by the school."}
            </p>
          </article>
        </div>
      </section>

      {/* =====================================================
          QUICK LINKS
      ====================================================== */}
      <section className="container py-16 sm:py-20 lg:py-24">
        <div className="mb-9 text-center">
          <p className="eyebrow text-gold-dark">Admission Resources</p>

          <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
            Useful Information
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Access important admission resources and information for the
            upcoming academic session.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Book List */}
          <a
            href={bookListUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative isolate overflow-hidden rounded-[28px] bg-navy p-7 text-white shadow-lg shadow-navy/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy/20 sm:p-9"
          >
            {/* Background decoration */}
            <div
              className="absolute -right-12 -top-14 -z-10 size-48 rounded-full border-[22px] border-white/[.07] transition duration-500 group-hover:scale-110"
              aria-hidden="true"
            />

            <div className="relative flex min-h-[180px] flex-col justify-between">
              <div className="flex items-start justify-between gap-6">
                <div className="grid size-12 place-items-center rounded-xl bg-white/10 text-white">
                  <BookOpen size={23} />
                </div>

                <div className="grid size-11 place-items-center rounded-full border border-white/15 text-gold transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-white group-hover:bg-white group-hover:text-navy">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Academic Resource
                </p>

                <h3 className="mt-2 font-serif text-3xl">
                  {bookList?.title || "Book List"}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
                  View the prescribed books and academic material for
                  students.
                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition group-hover:border-white/40 group-hover:bg-white group-hover:text-navy">
                  <FileText size={15} aria-hidden="true" />
                  {bookListAction}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </div>
              </div>
            </div>
          </a>

          {/* Age of Admission */}
          <a
            href={admissionAgeUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative isolate overflow-hidden rounded-[28px] bg-gold-dark p-7 text-white shadow-lg shadow-gold-dark/15 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-dark/20 sm:p-9"
          >
            <div
              className="absolute -right-12 -top-14 -z-10 size-48 rounded-full border-[22px] border-white/[.08] transition duration-500 group-hover:scale-110"
              aria-hidden="true"
            />

            <div className="relative flex min-h-[180px] flex-col justify-between">
              <div className="flex items-start justify-between gap-6">
                <div className="grid size-12 place-items-center rounded-xl bg-white/10 text-white">
                  <CalendarDays size={23} />
                </div>

                <div className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-white group-hover:bg-white group-hover:text-gold-dark">
                  <Download size={19} />
                </div>
              </div>

              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  Eligibility Guide
                </p>

                <h3 className="mt-2 font-serif text-3xl">
                  {admissionAge?.title || "Age of Admission"}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
                  Check the age criteria and eligibility requirements for
                  admission.
                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition group-hover:border-white group-hover:bg-white group-hover:text-gold-dark">
                  <FileText size={15} aria-hidden="true" />
                  {admissionAgeAction}
                  <Download size={14} aria-hidden="true" />
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>
    </main>
  )
}
