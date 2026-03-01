
import * as React from "react";
import type { SiteConfig } from "@/lib/site-config";

export function useSiteConfig() {
    const context = React.useContext(SiteConfigContext);
    if (!context) {
      throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
  }
  

export const SiteConfigContext = React.createContext<SiteConfig | null>(null);