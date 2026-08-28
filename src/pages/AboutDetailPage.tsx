import { PageBanner } from "../components/PageBanner";

type AboutDetailPageProps = {
  title: string;
  description: string;
  bannerImage?: string | null;
  bannerImageUrl?: string | null;
  eyebrow: string;
  introduction: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  imageCaption: string;
};

export function AboutDetailPage({
  title,
  description,
  bannerImage,
  bannerImageUrl,
  eyebrow,
  introduction,
  paragraphs,
  image,
  imageAlt,
  imageCaption,
}: AboutDetailPageProps) {
  return (
    <>
      <PageBanner
        key={title}
        title={title}
        description={description}
        image={bannerImage}
        imageUrl={bannerImageUrl}
      />
      <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
        <div
          className="absolute -right-32 top-10 size-96 rounded-full border border-navy/5"
          aria-hidden="true"
        />
        <div
          className="absolute -right-20 top-24 size-72 rounded-full border border-gold/10"
          aria-hidden="true"
        />

        <div className="container relative grid gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow flex items-center gap-3 text-gold-dark">
              <span className="h-px w-10 bg-gold" />
              {eyebrow} 
            </p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight text-navy sm:text-5xl">
              {title}
            </h2>
            <p className="mt-7 max-w-2xl border-l-2 border-gold pl-5 text-xl leading-8 text-navy sm:text-2xl sm:leading-9">
              {introduction}
            </p>
            <div className="mt-8 max-w-2xl space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <figure className="order-1 relative mx-auto w-full max-w-xl lg:order-2 lg:mx-0">
            <div
              className="absolute -left-5 -top-5 h-32 w-32 border-l-4 border-t-4 border-gold sm:-left-7 sm:-top-7"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-5 -right-5 h-40 w-40 bg-cream sm:-bottom-7 sm:-right-7"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden bg-slate-100 shadow-[0_24px_60px_rgb(16_42_67/.18)] ring-1 ring-navy/10">
              <img
                src={image}
                alt={imageAlt}
                className="aspect-[4/3] w-full object-cover object-center transition duration-700 hover:scale-[1.025]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/45 to-transparent px-6 pb-6 pt-20 text-white">
                <figcaption className="font-serif text-xl leading-snug sm:text-2xl">
                  {imageCaption}
                </figcaption>
              </div>
            </div>
            <div className="relative ml-auto mt-7 flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-[.18em] text-slate-500">
              <span className="size-2 bg-gold" />
              Paragon School · Since 1981
            </div>
          </figure>
        </div>
      </section>
    </>
  );
}
