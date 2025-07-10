import { redirect } from "next/navigation";
import { Suspense } from "react";
import SearchResults from "./_components/search-results";
import { FlightInterfaceSkeleton } from "@/components/flights/main-flights-interface";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { arrival?: string; departure?: string; airline?: string };
}) {
  if (
    !searchParams.arrival ||
    !searchParams.departure ||
    !searchParams.airline
  ) {
    redirect("/");
  }

  return (
    <div className="h-screen p-8 max-w-screen">
      <Suspense fallback={<FlightInterfaceSkeleton />}>
        <SearchResults
          arrival={searchParams.arrival}
          departure={searchParams.departure}
          airline={searchParams.airline}
        />
      </Suspense>
    </div>
  );
}
