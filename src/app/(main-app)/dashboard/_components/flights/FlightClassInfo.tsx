import { DollarSign } from "lucide-react";

export function FlightClassInfo({ economy, business, firstClass }) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-sm text-gray-500">Economy</p>
        <p className="font-semibold flex items-center">
          <DollarSign className="h-4 w-4" />
          {economy.price}
        </p>
        <p className="text-xs text-gray-500">{economy.seats} seats</p>
      </div>
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-sm text-gray-500">Business</p>
        <p className="font-semibold flex items-center">
          <DollarSign className="h-4 w-4" />
          {business.price}
        </p>
        <p className="text-xs text-gray-500">{business.seats} seats</p>
      </div>
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-sm text-gray-500">First Class</p>
        <p className="font-semibold flex items-center">
          <DollarSign className="h-4 w-4" />
          {firstClass.price}
        </p>
        <p className="text-xs text-gray-500">{firstClass.seats} seats</p>
      </div>
    </div>
  );
}
