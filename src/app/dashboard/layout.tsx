import { ReactNode } from "react";
import { NavBar } from "./_components/Navbar";
import AdminButton from "@/components/AdminButton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="selection:bg-foreground/20">
      <NavBar />
      <AdminButton />
      <div className="min-h-screen bg-[radial-gradient(hsl(0,32%,17%,40%),hsl(24,27%,23%,2 9%),hsl(var(--background))_60%)] flex items-center justify-center text-center text-balance flex-col gap-8 px-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
