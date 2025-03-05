import AdminButton from "@/components/AdminButton";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { NavBar } from "@/components/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      <AdminButton />
      <div className="overflow-hidden">
        <Hero />
        <Footer />
      </div>
    </>
  );
}
