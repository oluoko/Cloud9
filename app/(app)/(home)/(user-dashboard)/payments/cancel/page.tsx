import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <XCircle className="size-12 rounded-full bg-red-500/30 hover:bg-red-700/30 text-red-500 p-2" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">Payment Cancelled</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong while processing your payment. You
              haven&apos;t been charged. Please try again.
            </p>
            <Link href="/">
              <Button className="w-full mt-3 md:mt-5">Back to Homepage</Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
