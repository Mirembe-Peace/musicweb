import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/app/App";
import { SiteConfigProvider } from "@/app/SiteConfigProvider";
import { AudioProvider } from '@/app/AudioContext';
import { AuthProvider } from '@/app/AuthContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { initAnalytics } from '@/lib/firebase';
import "@/style.css";

initAnalytics();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteConfigProvider>
        <AudioProvider>
          <AuthProvider>
            <TooltipProvider>
              <App />
            </TooltipProvider>
          </AuthProvider>
        </AudioProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);