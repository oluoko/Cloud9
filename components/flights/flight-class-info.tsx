interface FlightClassInfoProps {
  low: {
    price: number;
    seats: number;
  };
  middle: {
    price: number;
    seats: number;
  };
  executive: {
    price: number;
    seats: number;
  };
}

export function FlightClassInfo({
  low,
  middle,
  executive,
}: FlightClassInfoProps) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      <div className="bg-background/60 p-2 rounded ">
        <p className="text-sm text-gray-500">Low</p>
        <p className="font-semibold flex items-center">
          <span className="font-bold">Ksh</span> {low.price}
        </p>
        <p className="text-xs text-gray-500">{low.seats} seats</p>
      </div>
      <div className="bg-background/60 p-2 rounded ">
        <p className="text-sm text-gray-500">Middle</p>
        <p className="font-semibold flex items-center">
          <span className="font-bold">Ksh</span> {middle.price}
        </p>
        <p className="text-xs text-gray-500">{middle.seats} seats</p>
      </div>
      <div className="bg-background/60 p-2 rounded ">
        <p className="text-sm text-gray-500">Executive Class</p>
        <p className="font-semibold flex items-center">
          <span className="font-bold">Ksh</span> {executive.price}
        </p>
        <p className="text-xs text-gray-500">{executive.seats} seats</p>
      </div>
    </div>
  );
}
