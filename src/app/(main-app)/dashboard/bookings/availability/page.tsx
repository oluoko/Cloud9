import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

export default function Page() {
  return (
    <div className="mt-20 ">
      <div className="relative mb-10 w-screen flex justify-around items-center  bg-secondary/70">
        <div className="grid md:flex justify-center items-center gap-4">
          <div className="grid ">
            <span className="text-xl md:text-3xl">NRB</span>
            <span>Nairobi</span>
          </div>
          <span>--------</span>
          <div className="grid ">
            <span className="text-xl md:text-3xl">MBS</span>
            <span>Mombasa</span>
          </div>
        </div>
        <span>Wed, 5 March</span>
        <div className="flex items-center gap-2">
          Passenger <span>1</span>
          <User />
        </div>
        <div className="absolute bottom-0 translate-y-full left-1/2 -translate-x-1/2 rounded-b-xl bg-secondary/70 hover:bg-secondary w-[30vw] flex justify-center items-center gap-2 p-2">
          Modify
        </div>
      </div>

      <div className="my-4 mx-4 md:mx-24">
        <div className="text-xl font-bold italic">
          <span>Nairobi</span>
          <span> to </span>
          <span>Mombasa</span>
        </div>

        <Card className="flex justify-between"></Card>
      </div>

      {/* date pagination */}
    </div>
  );
}
