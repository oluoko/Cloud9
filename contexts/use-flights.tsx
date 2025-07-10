"use client";

import { createContext, useContext, ReactNode } from "react";
import { User, Flight } from "@prisma/client";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";

const fetcher = async (url: string): Promise<Flight[]> => {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch");
  }

  return response.json();
};

interface FlightsContextType {
  flights: Flight[] | null;
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

const FlightsContext = createContext<FlightsContextType | undefined>(undefined);

interface FlightsProviderProps {
  children: ReactNode;
}

export function FlightsProvider({ children }: FlightsProviderProps) {
  const { isSignedIn, isLoaded } = useAuth();

  const {
    data: flights,
    error,
    isLoading,
    mutate,
  } = useSWR(
    // Only fetch if user is signed in and auth is loaded
    isLoaded && isSignedIn ? "/api/flights" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      // Don't retry if user is not authenticated
      shouldRetryOnError: (error) => {
        return error.status !== 401 && error.status !== 403;
      },
    }
  );

  const contextValue: FlightsContextType = {
    flights: flights || null,
    isLoading: isLoading || !isLoaded,
    error,
    mutate,
  };

  return (
    <FlightsContext.Provider value={contextValue}>
      {children}
    </FlightsContext.Provider>
  );
}

export function useFlights(): FlightsContextType {
  const context = useContext(FlightsContext);
  if (!context) {
    throw new Error("useFlights must be used within a FlightsProvider");
  }
  return context;
}
