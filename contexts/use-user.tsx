"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "@prisma/client";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";

const fetcher = async (url: string): Promise<User> => {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch");
  }

  return response.json();
};

interface UserContextType {
  me: User | null;
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { isSignedIn, isLoaded } = useAuth();

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(
    // Only fetch if user is signed in and auth is loaded
    isLoaded && isSignedIn ? "/api/user" : null,
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

  const contextValue: UserContextType = {
    me: user || null,
    isLoading: isLoading || !isLoaded,
    error,
    mutate,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useMe(): UserContextType {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useMe must be used within a UserProvider");
  }

  return context;
}
