import AdminButton from "@/components/AdminButton";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import { SignedIn } from "@clerk/nextjs";
import Testimonials from "@/components/Testimonials";
import ContactUsPage from "@/components/ContactUsPage";
import Flights from "@/components/Flights";

export default async function Home() {
  return (
    <>
      <NavBar />
      <AdminButton />
      <div className="overflow-hidden">
        <Hero />

        <Testimonials />
        <SignedIn>
          <Flights />
        </SignedIn>
        <ContactUsPage />
        <Footer />
      </div>
    </>
  );
}
