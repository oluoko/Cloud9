import { ChevronLeft } from "lucide-react";
import Link from "next/link";
export default function Banners() {
  return (
    <div>
      <div className="flex justify-between items-center w-[95vw] md:w-[80vw]">
        <Link
          href="/admin-dashboard"
          className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
        >
          <ChevronLeft className="size-4 md:size-5" />
        </Link>
        <Link
          href="/admin-dashboard/banners/create"
          className="rounded-xl bg-primary border border-gray-800/30 p-2"
        >
          Create a new banner
        </Link>
      </div>
      <h1>Banners</h1>
    </div>
  );
}
