import React from 'react';
import { Plane, Loader2, Cloud, MapPin } from 'lucide-react';

interface AirlineLoaderProps {
  mainText?: string;
  subText?: string;
}

const Loader = ({ 
  mainText = "Finding the Best Flights",
  subText = "Searching across airlines..."
}: AirlineLoaderProps) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      {/* Main animation container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer rotating circle */}
        <div className="absolute w-full h-full rounded-full border-4 border-[hsl(142.1,76.2%,36.3%)] border-dashed animate-[spin_8s_linear_infinite]" />
        
        {/* Inner circle with pulsing effect */}
        <div className="absolute w-48 h-48 rounded-full border-4 border-[hsl(142.1,76.2%,36.3%)] opacity-50 animate-pulse" />
        
        {/* Rotating plane */}
        <div className="absolute w-full h-full animate-[spin_4s_linear_infinite]">
          <Plane 
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 text-[hsl(142.1,76.2%,36.3%)]"
            style={{ transform: 'rotate(90deg)' }}
          />
        </div>
        
        {/* Floating clouds */}
        <Cloud className="absolute top-0 left-1/4 w-8 h-8 text-muted-foreground animate-bounce" />
        <Cloud className="absolute bottom-0 right-1/4 w-8 h-8 text-muted-foreground animate-bounce delay-300" />
        
        {/* Center loading spinner */}
        <Loader2 className="w-10 h-10 text-[hsl(142.1,76.2%,36.3%)] animate-spin" />
      </div>

      {/* Destination markers */}
      <div className="flex items-center space-x-4 mt-8">
        <MapPin className="w-6 h-6 text-[hsl(142.1,76.2%,36.3%)] animate-bounce" />
        <div className="w-24 h-0.5 bg-[hsl(142.1,76.2%,36.3%)] animate-pulse" />
        <Plane className="w-6 h-6 text-[hsl(142.1,76.2%,36.3%)] animate-pulse" />
        <div className="w-24 h-0.5 bg-[hsl(142.1,76.2%,36.3%)] animate-pulse" />
        <MapPin className="w-6 h-6 text-[hsl(142.1,76.2%,36.3%)] animate-bounce delay-100" />
      </div>

      {/* Loading text */}
      <div className="mt-8 flex flex-col items-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{mainText}</h2>
        <p className="text-sm text-muted-foreground animate-pulse">{subText}</p>
      </div>
    </div>
  );
};

export default Loader;
