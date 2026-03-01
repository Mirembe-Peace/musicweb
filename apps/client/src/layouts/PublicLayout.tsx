import { Outlet } from "react-router-dom";
import BrandHeader from "@/components/BrandHeader";
import BrandFooter from "@/components/BrandFooter";
import MusicPlayer from "@/components/MusicPlayer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <BrandHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <BrandFooter />
      <MusicPlayer />
    </div>
  );
}