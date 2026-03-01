import * as React from "react";
import type { SiteConfig } from "@/lib/site-config";
import { defaultSiteConfig } from "@/lib/site-config";
import { SiteConfigContext } from "./useSiteConfig";

export function SiteConfigProvider({
  children,
  value,
}: Readonly<{
  children: React.ReactNode;
  value?: SiteConfig;
}>) {
  // Later: swap defaultSiteConfig for fetched API config
  return (
    <SiteConfigContext.Provider value={value ?? defaultSiteConfig}>
      {children}
    </SiteConfigContext.Provider>
  );
}