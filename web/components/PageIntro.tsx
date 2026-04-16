interface IntroStat {
  label: string;
  value: string;
}

interface IntroDetail {
  label: string;
  value: string;
}

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  stats?: IntroStat[];
  details?: IntroDetail[];
}

export function PageIntro({
  eyebrow,
  title,
  description,
  stats = [],
  details = [],
}: PageIntroProps) {
  return (
    <section className="grid gap-8 border-b border-border/70 pb-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
      <div className="space-y-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary/80">
          {eyebrow}
        </p>
        <div className="space-y-4">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>
        {stats.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-border/70 pt-3">
                <div className="font-mono text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {details.length > 0 && (
        <dl className="grid gap-4 border-t border-border/70 pt-5 lg:border-t-0 lg:border-l lg:pl-8">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="mt-2 break-words text-sm leading-6 text-foreground/80">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
