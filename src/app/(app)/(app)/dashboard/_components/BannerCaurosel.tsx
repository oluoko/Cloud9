"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SearchFlights from "./SearchFlight";

interface Banner {
  id: string | number;
  title: string;
  description: string | null;
  destinationAirport: string;
  largeImageUrl: string;
  smallImageUrl: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel = ({ banners = [] }: BannerCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is typical lg breakpoint
    };

    // Run once on mount
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      }, 5000); // Changed from 1000ms to 5000ms for better user experience
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Function to toggle autoplay
  const toggleAutoplay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  return (
    <div className="relative w-full h-screen mt-5">
      <SearchFlights />
      <div
        className="relative w-full h-[90%]"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Banners */}
        <div className="relative w-full h-full overflow-hidden">
          {banners.map((slide, index) => (
            <div
              key={slide.id || index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background Image - Responsive */}
              <div className="absolute inset-0 bg-black bg-opacity-20">
                <Image
                  src={isMobile ? slide.smallImageUrl : slide.largeImageUrl}
                  alt={slide.title}
                  layout="fill"
                  objectFit="cover"
                  priority={index === currentSlide}
                  className="transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 z-20 flex items-center justify-self-stretch mr-2 md:mr-10">
                <div className="text-center text-white p-6 max-w-2xl mx-auto mr-2 md:mr-10">
                  <h2 className="text-3xl md:text-[40px] font-bold mb-4 [text-shadow:_0_2px_4px_rgb(0_0_0_/_0.8)]">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-[22px] mb-8 [text-shadow:_0_2px_4px_rgb(0_0_0_/_0.8)]">
                    {slide.description}
                  </p>
                  <a
                    href={slide.title}
                    className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-opacity-90 transition-colors duration-200 shadow-lg"
                  >
                    {slide.destinationAirport}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-white bg-opacity-25 hover:bg-opacity-50 transition-all duration-200 shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-white bg-opacity-25 hover:bg-opacity-50 transition-all duration-200 shadow-md"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 shadow-sm ${
                index === currentSlide
                  ? "bg-white w-6"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
