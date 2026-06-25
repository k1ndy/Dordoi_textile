export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-cream-deep/50">
      <div className="ornament-strip absolute left-0 top-0 h-1 w-full" />
      <div className="container-x py-12 sm:py-16">
        <span className="section-eyebrow">{eyebrow}</span>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-ink-soft">{subtitle}</p>}
      </div>
    </section>
  );
}
