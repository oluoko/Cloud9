import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import BannerCarousel from "./_components/BannerCaurosel";

export default function Home() {
  return (
    <div className="">
      <BannerCarousel />
      <Hero />
      <Footer />
    </div>
  );
}
