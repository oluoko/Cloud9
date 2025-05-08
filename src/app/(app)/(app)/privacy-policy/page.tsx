import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center text-balance gap-6  py-8">
      <Link
        href="/"
        className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary absolute left-5 top-5"
      >
        <ChevronLeft className="size-4 md:size-5" />
      </Link>
      <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4">
        Privacy Policy
      </h1>
      <p className="text-lg lg:text-xl max-w-screen-md">
        Your privacy is important to us. This Privacy Policy outlines how we
        collect, use, and protect your personal information when you use our
        flight booking platform.
      </p>
      <div className="max-w-4xl text-left space-y-6">
        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
        <p>
          We collect personal information such as your name, email address, and
          payment details when you book a flight. Additionally, we may collect
          usage data and cookies to enhance your experience.
        </p>
        <h2 className="text-2xl font-semibold">
          2. How We Use Your Information
        </h2>
        <p>
          We use your information to process bookings, improve our services, and
          provide customer support. Your data may also be used for marketing
          purposes with your consent.
        </p>
        <h2 className="text-2xl font-semibold">3. Data Protection</h2>
        <p>
          We implement security measures to protect your personal data from
          unauthorized access or disclosure.
        </p>
        <h2 className="text-2xl font-semibold">4. Third-Party Services</h2>
        <p>
          We may share your data with trusted third-party providers for payment
          processing, analytics, and customer support.
        </p>
        <h2 className="text-2xl font-semibold">5. Your Rights</h2>
        <p>
          You have the right to access, modify, or delete your personal data.
          Contact us for any requests regarding your information.
        </p>
      </div>
    </section>
  );
}
