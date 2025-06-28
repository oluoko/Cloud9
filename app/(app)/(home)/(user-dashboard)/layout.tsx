"use client";

import { ReactNode } from "react";

export default function HomePageLayout({ children }: { children: ReactNode }) {
  return <div className="mt-12 md:mt-20">{children}</div>;
}
