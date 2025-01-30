import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <div className="selection:bg-foreground/20">{children}</div>;
}
