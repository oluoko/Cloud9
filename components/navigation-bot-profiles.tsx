"use client";
import CloudIAImage from "@/public/assets/CloudIA.png";
import CloudALImage from "@/public/assets/CloudAL.png";
import CloseImage from "@/public/assets/close.png";
import Image from "next/image";
import { BotType } from "@/hooks/use-navigation-ai";

interface NavigationBotProfilesProps {
  activeBot: BotType;
  setActiveBot: (bot: BotType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const rippleStyles = `
  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.7; }
    50% { opacity: 0.3; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes ripple-delayed-1 {
    0% { transform: scale(1); opacity: 0; }
    33% { transform: scale(1); opacity: 0.7; }
    66% { opacity: 0.3; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes ripple-delayed-2 {
    0% { transform: scale(1); opacity: 0; }
    66% { transform: scale(1); opacity: 0.7; }
    83% { opacity: 0.3; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes rotate-switch {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-ripple { animation: ripple 2s ease-out infinite; }
  .animate-ripple-delayed-1 { animation: ripple-delayed-1 2s ease-out infinite; }
  .animate-ripple-delayed-2 { animation: ripple-delayed-2 2s ease-out infinite; }
  .animate-rotate-switch { animation: rotate-switch 0.5s ease-in-out; }
`;

const BotButton: React.FC<{
  image: any;
  alt: string;
  isActive: boolean;
  showRipple: boolean;
  onClick: () => void;
}> = ({ image, alt, isActive, showRipple, onClick }) => (
  <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50">
    {showRipple && (
      <div className="absolute inset-0 size-[65px] md:size-[70px]">
        <div className="absolute inset-0 rounded-full border-2 border-primary opacity-75 animate-ripple" />
        <div className="absolute inset-0 rounded-full border-2 border-primary opacity-75 animate-ripple-delayed-1" />
        <div className="absolute inset-0 rounded-full border-2 border-primary opacity-75 animate-ripple-delayed-2" />
      </div>
    )}
    <div
      onClick={onClick}
      className={`relative bg-background hover:bg-primary border border-primary text-foreground hover:text-background rounded-full size-[65px] hover:scale-108 md:size-[70px] shadow-lg transition-all flex items-center justify-center p-1 cursor-pointer ${
        isActive ? "bg-primary text-background" : ""
      }`}
    >
      <Image
        src={image}
        alt={alt}
        width={100}
        height={100}
        className="size-full"
      />
    </div>
  </div>
);

export default function NavigationBotProfiles({
  activeBot,
  setActiveBot,
  isOpen,
  setIsOpen,
}: NavigationBotProfilesProps) {
  const handleBotClick = (botType: BotType) => {
    setActiveBot(botType);
    setIsOpen(!isOpen);
  };

  const toggleActiveBot = () => {
    setActiveBot(activeBot === "CloudIA" ? "CloudAL" : "CloudIA");
  };

  return (
    <>
      <style jsx>{rippleStyles}</style>
      {isOpen ? (
        <BotButton
          image={CloseImage}
          alt="Close Bot Profiles"
          isActive={false}
          showRipple={false}
          onClick={() => setIsOpen(false)}
        />
      ) : activeBot === "CloudIA" ? (
        <BotButton
          image={CloudIAImage}
          alt="CloudIA"
          isActive={activeBot === "CloudIA"}
          showRipple={!isOpen}
          onClick={() => handleBotClick("CloudIA")}
        />
      ) : (
        <BotButton
          image={CloudALImage}
          alt="CloudAL"
          isActive={activeBot === "CloudAL"}
          showRipple={!isOpen}
          onClick={() => handleBotClick("CloudAL")}
        />
      )}

      <div className="fixed bottom-2 md:bottom-3 right-16 md:right-20 z-52">
        <div className="relative group">
          <button
            onClick={toggleActiveBot}
            className="relative p-2 rounded-full border transition-all duration-300 bg-background text-foreground border-gray-300 hover:border-primary hover:bg-primary hover:text-background shadow-md hover:shadow-lg cursor-pointer group-hover:scale-110 transform"
          >
            <div className="relative w-6 h-6 md:w-7 md:h-7">
              <Image
                src={activeBot === "CloudIA" ? CloudALImage : CloudIAImage}
                alt="Switch Bot"
                width={28}
                height={28}
                className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:animate-rotate-switch"
              />
            </div>
          </button>

          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Switch to {activeBot === "CloudIA" ? "CloudAL" : "CloudIA"}
          </div>
        </div>
      </div>
    </>
  );
}
