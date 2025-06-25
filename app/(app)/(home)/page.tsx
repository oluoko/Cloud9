import ContactUsPage from "@/components/contact-us-page";
import Footer from "@/components/footer";
import Testimonials from "@/components/testimonials";
import imageOne from "@/public/images/dev/banners/1.jpeg";
import imageTwo from "@/public/images/dev/banners/2.jpeg";
import imageOneLargeScreen from "@/public/images/dev/banners/1-large-screens.jpeg";
import imageTwoLargeScreen from "@/public/images/dev/banners/2-large-screens.jpeg";
import prisma from "@/utils/db";
import BannerCarousel from "@/components/banner-carousel";
import Flights from "@/components/flights";

export default async function Home() {
  let banners = await prisma.banner.findMany({
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

  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const flights = await prisma.flight.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

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
    <div className="overflow-hidden">
      <BannerCarousel banners={banners} />
      <Flights flights={flights} />
      <Testimonials testimonials={testimonials} />
      <ContactUsPage />
      <Footer />
    </div>
  );
}
