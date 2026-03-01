export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: Readonly<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
}>) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-bold text-foreground/80">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {eyebrow}
        </div>
      )}

      <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-foreground">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}