import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import BannerCarousel from "./_components/BannerCaurosel";
import prisma from "@/utils/db";
import Flights from "@/components/Flights";
import Testimonials from "@/components/Testimonials";
import ContactUsPage from "@/components/ContactUsPage";

async function getBanners() {
  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      destinationAirport: true,
      largeImageUrl: true,
      smallImageUrl: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return banners;
}

export default async function Home() {
  const banners = await getBanners();
  return (
    <div className="">
      <BannerCarousel banners={banners} />
      <Flights />
      <Testimonials />
      <ContactUsPage />
      <Footer />
    </div>
  );
}
