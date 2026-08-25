import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageBanner } from "../../../../components/PageBanner";

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
};

export function BeyondClassroomDetailLayout({ title, description, icon: Icon, children }: Props) {
  return (
    <main className="bg-[#fbfaf7]">
      <PageBanner title={title} description={description} />
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container">
          <article className="mx-auto max-w-4xl rounded-[22px] border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="grid size-12 place-items-center rounded-xl bg-cream text-gold-dark">
              <Icon size={23} strokeWidth={1.8} />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-navy">{title}</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">{children}</div>
            <Link to="/school" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-gold-dark">
              <ArrowLeft size={17} /> Back to home
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
