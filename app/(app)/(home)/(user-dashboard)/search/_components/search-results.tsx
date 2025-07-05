import MainFlightsInterface from "@/components/flights/main-flights-interface";
import { Skeleton } from "@/components/ui/skeleton";
import { getSearch } from "@/lib/search";

interface SearchResultsProps {
  arrival: string;
  departure: string;
  airline: string;
}
export default async function SearchResults({
  arrival,
  departure,
  airline,
}: SearchResultsProps) {
  const data = await getSearch(arrival, departure, airline);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Search Results for{" "}
        {airline && (
          <>
            Airline with name :{" "}
            <span className="font-extrabold"> {airline}</span>,{" "}
          </>
        )}
        {arrival && (
          <>
            Arrival Airport :{" "}
            <span className="font-extrabold"> {arrival}</span>{" "}
          </>
        )}
        {departure && (
          <>
            and Departure Airport:
            <span className="font-extrabold"> {departure}</span>
          </>
        )}
      </h2>
      {data.length > 0 ? (
        <div className="">
          <MainFlightsInterface flights={data} />
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          No results found. Try searching for something else!
        </p>
      )}
    </div>
  );
}
