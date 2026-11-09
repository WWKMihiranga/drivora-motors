import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="hero-gradient flex min-h-[80dvh] items-center pt-24">
      <div className="container-x">
        <p className="ghost-text text-[9rem] leading-none md:text-[14rem]" aria-hidden>
          404
        </p>
        <h1 className="-mt-10 font-display text-3xl font-semibold md:-mt-16 md:text-5xl">This road doesn&apos;t go anywhere.</h1>
        <p className="mt-3 max-w-md text-muted-strong">The page may have moved, or the car has already found a new home.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/cars" className="btn-ink">
            Browse cars
          </Link>
          <Link href="/" className="btn-line">
            <ArrowLeft className="size-4" /> Home
          </Link>
        </div>
      </div>
    </section>
  );
}
