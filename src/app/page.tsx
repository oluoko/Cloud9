import AdminButton from "@/components/AdminButton";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import BannerCarousel from "./(main-app)/dashboard/_components/BannerCaurosel";

export default function Home() {
  return (
    <>
      <NavBar />
      <AdminButton />
      <div className="overflow-hidden">
        <BannerCarousel />
        <Hero />
        <Footer />
      </div>
    </>
  );
}
