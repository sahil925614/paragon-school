import { PageBanner } from '../components/PageBanner'

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return <>
    <PageBanner key={title} title={title} description={description} />
    <section className="container min-h-[38vh] py-16 sm:py-20">
      <p className="eyebrow text-gold-dark">Paragon School</p>
      <h2 className="mt-4 font-serif text-3xl text-navy sm:text-4xl">Explore {title}</h2>
      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">This page is ready for the approved content and Laravel API integration.</p>
    </section>
  </>
}
