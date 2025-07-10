"use client";

import CloudIAImage from "@/public/assets/CloudIA.png";
import Image from "next/image";
import { XIcon } from "lucide-react";

export default function CloudIA({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <>
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50">
        {/* Ripple animation container - only show when dialog is closed */}
        {!isOpen && (
          <div className="absolute inset-0 size-[50px] md:size-[70px]">
            {/* Multiple ripple circles with staggered animations */}
            <div className="absolute inset-0 rounded-full border-2 border-primary opacity-75 animate-ripple"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary opacity-75 animate-ripple-delayed-1"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary opacity-75 animate-ripple-delayed-2"></div>
          </div>
        )}

        {/* Main button */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-background hover:bg-primary border border-primary text-foreground hover:text-background rounded-full size-[50px] hover:scale-108 md:size-[70px]  shadow-lg transition-all flex items-center justify-center p-1 cursor-pointer"
        >
          {/* {isOpen ? (
            <XIcon className="size-6" />
          ) : ( */}
          <Image
            src={CloudIAImage}
            alt="CloudIA"
            width={100}
            height={100}
            className="size-full"
          />
          {/* )} */}
        </div>
      </div>

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        @keyframes ripple-delayed-1 {
          0% {
            transform: scale(1);
            opacity: 0;
          }
          33% {
            transform: scale(1);
            opacity: 0.7;
          }
          66% {
            opacity: 0.3;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        @keyframes ripple-delayed-2 {
          0% {
            transform: scale(1);
            opacity: 0;
          }
          66% {
            transform: scale(1);
            opacity: 0.7;
          }
          83% {
            opacity: 0.3;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }

        .animate-ripple-delayed-1 {
          animation: ripple-delayed-1 2s ease-out infinite;
        }

        .animate-ripple-delayed-2 {
          animation: ripple-delayed-2 2s ease-out infinite;
        }
      `}</style>
    </>
  );
}
