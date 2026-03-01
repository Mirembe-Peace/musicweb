import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSiteConfig } from "@/app/useSiteConfig";
import TipDialog from "@/components/TipDialog";

function NavItem({
  to,
  label,
  onClick,
}: Readonly<{
  to: string;
  label: string;
  onClick?: () => void;
}>) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "text-sm font-semibold transition-colors",
          isActive ? "text-primary" : "text-foreground/80 hover:text-foreground",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function BrandHeader() {
  const { brandName, tagline, nav, promo } = useSiteConfig();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Promo strip (mobile-first, compact) */}
      {promo.enabled && (
        <div className="border-b bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-3">
            <div className="min-w-0 text-xs font-semibold text-foreground/85 truncate">
              <span className="mr-2 inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--brand-red))]" />
                {promo.text}
              </span>
            </div>

            <Button
              size="sm"
              variant="secondary"
              asChild
              className="h-7 px-3 rounded-xl"
            >
              <Link to={promo.ctaTo}>{promo.ctaLabel}</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-black shadow-sm">
              A
            </div>
            <div className="min-w-0 leading-tight">
              <div className="font-black tracking-tight truncate">
                {brandName}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {tagline}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <NavItem key={n.to} to={n.to} label={n.label} />
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <TipDialog />

            <Button
              className="hidden sm:inline-flex"
              variant="secondary"
              asChild
            >
              <Link to="/store">Support & Buy</Link>
            </Button>

            {/* Mobile nav */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Open menu">
                    ☰
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="backdrop-blur-sm bg-white/30 dark:bg-black/30 text-white p-6 w-[320px] sm:w-[360px]"
                >
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-xl bg-primary text-primary-foreground grid place-items-center font-black">
                        A
                      </span>
                      {brandName}
                    </SheetTitle>
                  </SheetHeader>

                  <Separator className="my-4" />

                  {/* Promo (inside mobile menu too) */}
                  {promo.enabled && (
                    <div className="rounded-2xl border bg-muted/40 p-4">
                      <div className="text-xs font-bold text-muted-foreground">
                        Featured
                      </div>
                      <div className="mt-1 font-extrabold">{promo.text}</div>
                      <Button
                        className="mt-3 w-full"
                        variant="secondary"
                        asChild
                      >
                        <Link to={promo.ctaTo}>{promo.ctaLabel}</Link>
                      </Button>

                      <div className="mt-4 h-2 w-full rounded-full bg-gradient-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="flex flex-col gap-4">
                    {nav.map((n) => (
                      <NavItem key={n.to} to={n.to} label={n.label} />
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="secondary" asChild>
                      <Link to="/store">Support & Buy</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link to="/bookings">Book</Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
