import Footer from "@/components/Footer";
import BannerCarousel from "./_components/BannerCaurosel";
import prisma from "@/utils/db";
import Flights from "@/components/Flights";
import Testimonials from "@/components/Testimonials";
import ContactUsPage from "@/components/ContactUsPage";
import imageOne from "../../../../public/images/dev/banners/1.jpeg";
import imageTwo from "../../../../public/images/dev/banners/2.jpeg";
import imageOneLargeScreen from "../../../../public/images/dev/banners/1-large-screens.jpeg";
import imageTwoLargeScreen from "../../../../public/images/dev/banners/2-large-screens.jpeg";

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
  let banners = await getBanners();
  if (!banners || banners.length === 0) {
    banners = [
      {
        id: "1",
        title: "Welcome to Our Airline Booking Platform",
        description: "Book your flights with ease and convenience.",
        destinationAirport: "Any Major City",
        largeImageUrl: imageOneLargeScreen.src,
        smallImageUrl: imageOne.src,
      },
      {
        id: "2",
        title: "Explore the World with Us",
        description: "Discover amazing destinations at unbeatable prices.",
        destinationAirport: "Anywhere in the World",
        largeImageUrl: imageTwoLargeScreen.src,
        smallImageUrl: imageTwo.src,
      },
    ];
  }
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
