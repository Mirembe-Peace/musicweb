import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function BrandFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-black">
                A
              </div>
              <div>
                <div className="font-black tracking-tight">AshabaMusic</div>
                <div className="text-xs text-muted-foreground">Culture • Soul • Live</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Showcasing culture through music — albums, singles, visuals, and live performances.
            </p>
          </div>

          {/* Links */}
          <div className="grid gap-2 text-sm">
            <div className="font-bold">Explore</div>
            <Link className="text-muted-foreground hover:text-foreground" to="/music">Music</Link>
            <Link className="text-muted-foreground hover:text-foreground" to="/videos">Videos</Link>
            <Link className="text-muted-foreground hover:text-foreground" to="/gallery">Gallery</Link>
            <Link className="text-muted-foreground hover:text-foreground" to="/bookings">Bookings</Link>
          </div>

          {/* Contact */}
          <div className="grid gap-2 text-sm">
            <div className="font-bold">Bookings</div>
            <div className="text-muted-foreground">Email: bookings@ashabamusic.com</div>
            <div className="text-muted-foreground">Phone: +256 …</div>
            <div className="text-muted-foreground">Location: Uganda</div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} AshabaMusic. All rights reserved.</div>
          <div className="flex gap-4">
            <Link className="hover:text-foreground" to="/store">Support</Link>
            <Link className="hover:text-foreground" to="/admin">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}