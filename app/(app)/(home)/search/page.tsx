import { redirect } from "next/navigation";
import { Suspense } from "react";
import SearchResults from "./_components/search-results";

interface SearchPageProps {
  searchParams: {
    arrival?: string;
    departure?: string;
    airline?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  if (
    !searchParams.arrival ||
    !searchParams.departure ||
    !searchParams.airline
  ) {
    redirect("/");
  }

  return (
    <div className="h-screen p-8 max-w-screen mt-20">
      <Suspense>
        <SearchResults
          arrival={searchParams.arrival}
          departure={searchParams.departure}
          airline={searchParams.airline}
        />
      </Suspense>
    </div>
  );
}
