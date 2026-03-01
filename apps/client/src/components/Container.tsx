import type { ReactNode } from "react";

export default function Container({ children }: { readonly children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4">{children}</div>;
}
