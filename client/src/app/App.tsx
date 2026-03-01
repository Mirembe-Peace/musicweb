import { Routes, Route } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";

import Home from "@/pages/Home";
import Music from "@/pages/Music";
import AlbumDetails from "@/pages/AlbumDetails";
import Gallery from "@/pages/Gallery";
import Videos from "@/pages/Videos";
import Bookings from "@/pages/Bookings";
import Store from "@/pages/Store";

import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminLogin from "@/pages/Admin/AdminLogin";
import AdminMusic from "@/pages/Admin/AdminMusic";
import AdminImages from "@/pages/Admin/AdminImages";
import AdminMerch from "@/pages/Admin/AdminMerch";
import AdminConcert from "@/pages/Admin/AdminConcert";
import AdminBookings from "@/pages/Admin/AdminBookings";
import { ProtectedRoute } from "./ProtectedRoute";

import { Toaster } from "@/components/ui/sonner";
import SocialPage from "@/pages/SocialLinks";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/albums/:id" element={<AlbumDetails />} />
          <Route path="/store" element={<Store />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/social" element={<SocialPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="music" element={<AdminMusic />} />
            <Route path="images" element={<AdminImages />} />
            <Route path="merchandise" element={<AdminMerch />} />
            <Route path="concerts" element={<AdminConcert />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Route>
      </Routes>

      <Toaster richColors position="top-right" />
    </>
  );
}