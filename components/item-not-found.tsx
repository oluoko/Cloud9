import { capitalize } from "@/lib/utils";
import { ErrorImage } from "@/components/error-image";

export default function ItemNotFound({ item }: { item: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ErrorImage />
      <h1 className="text-4xl font-bold mb-4">{capitalize(item)} Not Found</h1>
      <p className="text-lg text-gray-600">
        The {item} you are looking for does not exist yet.
      </p>
    </div>
  );
}
