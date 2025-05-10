import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SuccessPage({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="size-12 rounded-full bg-green-500/30 hover:bg-green-700/30 text-green-500 p-2" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">
              Payment Successful
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Congrats on your purchase. Your payment was successful. You will
              receive an email with the details shortly. We hope you enjoy your
              flight. Thank you for flying with us.
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
