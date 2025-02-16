"use client";

import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const showLoader = () => {
    setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 20000);
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="">
      <Hero />
      <Button onClick={showLoader}>Show loader for Styling</Button>
      <Footer />
    </div>
  );
}
