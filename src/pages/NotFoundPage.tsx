import { Link } from "react-router-dom";
export function NotFoundPage() {
  return (
    <section className="container grid min-h-[60vh] place-content-center text-center">
      <p className="font-serif text-8xl text-gold">404</p>
      <h1 className="mt-4 text-3xl font-bold text-navy">Page not found</h1>
      <Link className="btn-primary mx-auto mt-8" to="/">
        Return home
      </Link>
    </section>
  );
}
