import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Music,
  Image as ImageIcon,
  Package,
  Ticket,
  BookOpen,
  LogOut,
  ScanLine,
} from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/music", label: "Music", icon: Music },
  { to: "/admin/images", label: "Images", icon: ImageIcon },
  { to: "/admin/merchandise", label: "Merchandise", icon: Package },
  { to: "/admin/concerts", label: "Concerts", icon: Ticket },
  { to: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { to: "/admin/tickets", label: "Tickets", icon: ScanLine },
];

function pageTitleFromPath(pathname: string) {
  const segment = pathname.replace("/admin", "").replace("/", "");
  if (!segment) return "Dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="px-2 py-3">
            <span className="text-sm font-semibold tracking-tight">
              Ashaba Admin
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton asChild isActive={
                  end ? pathname === to : pathname.startsWith(to)
                }>
                  <NavLink to={to} end={end}>
                    <Icon />
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={logout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <span className="text-sm font-semibold">{pageTitleFromPath(pathname)}</span>
        </header>

        <main className="flex-1 overflow-auto p-4">
            <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}