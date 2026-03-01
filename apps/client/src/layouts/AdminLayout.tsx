import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Music, Image as ImageIcon, Package, Ticket, BookOpen, LogOut, ScanLine } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import { Button } from "@/components/ui/button";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
    isActive 
      ? "bg-primary text-primary-foreground shadow-md" 
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col pt-8 px-4 shadow-sm">
        <div className="mb-10 px-4 flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-primary" />
          <h1 className="text-xl font-black tracking-tighter">ASHABA ADMIN</h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/music" className={linkClass}>
            <Music className="h-4 w-4" />
            Music
          </NavLink>
          <NavLink to="/admin/images" className={linkClass}>
            <ImageIcon className="h-4 w-4" />
            Images
          </NavLink>
          <NavLink to="/admin/merchandise" className={linkClass}>
            <Package className="h-4 w-4" />
            Merchandise
          </NavLink>
          <NavLink to="/admin/concerts" className={linkClass}>
            <Ticket className="h-4 w-4" />
            Concerts
          </NavLink>
          <NavLink to="/admin/bookings" className={linkClass}>
            <BookOpen className="h-4 w-4" />
            Bookings
          </NavLink>
          <NavLink to="/admin/tickets" className={linkClass}>
            <ScanLine className="h-4 w-4" />
            Tickets
          </NavLink>
        </nav>

        <div className="mt-auto pb-8 px-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 font-bold"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}