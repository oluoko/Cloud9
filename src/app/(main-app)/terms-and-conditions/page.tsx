export function TermsAndConditions() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center text-balance gap-6">
      <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4">
        Terms and Conditions
      </h1>
      <p className="text-lg lg:text-xl max-w-screen-md">
        By using our airline booking platform, you agree to the following terms
        and conditions.
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
        <h2 className="text-2xl font-semibold">3. Cancellations and Refunds</h2>
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
  );
}
