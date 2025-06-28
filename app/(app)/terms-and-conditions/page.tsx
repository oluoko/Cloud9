import Footer from "@/components/footer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="overflow-hidden">
      {" "}
      <section className="min-h-screen flex flex-col items-center justify-center text-center text-balance gap-6 mx-auto px-4 py-8">
        <Link
          href="/"
          className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary absolute left-5 top-5"
        >
          <ChevronLeft className="size-4 md:size-5" />
        </Link>
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Terms and Conditions
        </h1>
        <p className="text-lg lg:text-xl max-w-screen-md">
          By using our airline booking platform, you agree to the following
          terms and conditions.
        </p>
        <div className="max-w-4xl text-left space-y-6">
          <h2 className="text-2xl font-semibold">1. User Agreement</h2>
          <p>
            Users must provide accurate booking details and comply with airline
            policies.
          </p>
          <h2 className="text-2xl font-semibold">2. Booking and Payments</h2>
          <p>
            Payments are securely processed. Refunds and changes are subject to
            airline rules.
          </p>
          <h2 className="text-2xl font-semibold">
            3. Cancellations and Refunds
          </h2>
          <p>
            Cancellation policies vary. Refunds depend on airline terms and
            processing timelines.
          </p>
          <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
          <p>
            We are not liable for losses due to delays, cancellations, or
            third-party actions.
          </p>
          <h2 className="text-2xl font-semibold">5. Changes to Terms</h2>
          <p>
            These terms may be updated periodically. Continued use signifies
            acceptance of changes.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
