import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Flights() {
  return (
    <div className="">
      <div className="flex justify-between items-center w-[95vw] md:w-[80vw]">
        <Link
          href="/admin-dashboard"
          className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
        >
          <ChevronLeft className="size-4 md:size-5" />
        </Link>
        <Link
          href="/admin-dashboard/flights/create"
          className="rounded-xl bg-primary border border-gray-800/30 p-2"
        >
          Create a new flight
        </Link>
      </div>
      <h1>Flights</h1>
    </div>
  );
}
