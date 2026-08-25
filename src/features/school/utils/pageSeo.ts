export type PageSeo = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical_url?: string | null;
  noindex?: boolean;
};

function ensureMeta(name: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

function ensureCanonical() {
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  return element;
}

export function applyPageSeo(seo?: PageSeo) {
  if (!seo) return;

  if (seo.title) document.title = seo.title;
  if (seo.description) ensureMeta("description").content = seo.description;
  if (seo.keywords) ensureMeta("keywords").content = seo.keywords;

  ensureMeta("robots").content = seo.noindex
    ? "noindex, nofollow"
    : "index, follow";

  const selfCanonical = `${window.location.origin}${window.location.pathname}`;
  ensureCanonical().href = seo.canonical_url
    ? new URL(seo.canonical_url, window.location.origin).href
    : selfCanonical;
}