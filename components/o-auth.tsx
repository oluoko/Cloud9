"use client";

import * as React from "react";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import GoogleLogo from "@/public/assets/google.png";
import AppleLogo from "@/public/assets/apple.png";
import Image from "next/image";

export default function OauthSignIn() {
  const { signIn } = useSignIn();

  if (!signIn) return null;

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: { errors: string[] }) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.log(err.errors);
        console.error(err, null, 2);
      });
  };

  // Render a button for each supported OAuth provider
  // you want to add to your app. This example uses only Google.
  return (
    <div className="flex justify-between items-center w-full">
      <Button
        variant="outline"
        className="w-[48%] flex items-center gap-2"
        onClick={() => signInWith("oauth_google")}
        type="button"
      >
        <Image src={GoogleLogo} alt="google logo" className="size-5" />
        Google
      </Button>
      <Button
        onClick={() => signInWith("oauth_apple")}
        className="w-[48%] flex gap-2 items-center"
        type="button"
      >
        <Image src={AppleLogo} alt="google logo" className="size-5" />
        Apple
      </Button>
    </div>
  );
}
