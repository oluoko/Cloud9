"use client";

import { ReactNode } from "react";

export default function HomePageLayout({ children }: { children: ReactNode }) {
  return <div className="my-16 md:my-20">{children}</div>;
}
