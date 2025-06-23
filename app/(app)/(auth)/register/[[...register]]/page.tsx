"use client";

import React, { FormEvent, useState } from "react";
import { useAuth, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import Loader from "@/components/loader";
import AuthLayout from "@/components/auth-layout";
import Separator from "@/components/custom-separator";
import OauthSignIn from "@/components/o-auth";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import LoadingDots from "@/components/loading-dots";

export default function SignUpPage() {
  const { isLoaded, setActive, signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>();
  const [authStage, setAuthStage] = useState<
    "initial" | "redirecting" | "registering" | "verifying"
  >("initial");
  const [codeLength, setCodeLength] = useState(6);

  const router = useRouter();

  const { userId } = useAuth();
  console.log("userId:: ", userId);

  if (userId) {
    router.push("/saving-info");
  }

  if (!isLoaded) {
    return (
      <Loader
        mainText="Preparing Sign Up"
        subText="Setting up secure registration"
      />
    );
  }

  if (authStage === "redirecting") {
    return (
      <Loader
        mainText="Registration Complete"
        subText="Let's complete your profile"
      />
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isLoading) return;

    try {
      setIsLoading(true);
      setErrors(undefined);
      setAuthStage("registering");

      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
      setAuthStage("initial");
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
      setAuthStage("initial");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isLoading) return;

    try {
      setIsLoading(true);
      setAuthStage("verifying");
      const completeSignup = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignup.status !== "complete") {
        throw new Error(JSON.stringify(completeSignup, null, 2));
      }

      setAuthStage("redirecting");
      await setActive({ session: completeSignup.createdSessionId });
      router.push("/saving-info");
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
      setAuthStage("initial");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="register">
      <div className="flex flex-col items-center justify-center">
        <Card className="w-[90vw] md:w-full max-w-md my-4">
          <CardHeader>
            {!pendingVerification ? (
              <CardTitle className="font-bold text-center text-2xl">
                Welcome to
                <span className="font-black text-3xl">
                  {" "}
                  Cloud
                  <span className="text-primary text-4xl">9</span>
                </span>
                . Sign up to get started.
              </CardTitle>
            ) : (
              <CardTitle className="font-bold text-center text-2xl">
                Verify your email
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            {!pendingVerification ? (
              <>
                {/* <div className="space-y-6">
                <SocialAuthButtons mode="sign-up" />
              </div> */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="size-5 text-foreground" />
                        ) : (
                          <Eye className="size-5 text-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors && (
                    <Alert>
                      {errors.map((el, index) => (
                        <AlertDescription key={index}>
                          {el.longMessage}
                        </AlertDescription>
                      ))}
                    </Alert>
                  )}
                  {/* CAPTCHA Widget */}
                  <div id="clerk-captcha"></div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-6 animate-spin" />
                        <LoadingDots text="Signing you up" />
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                  <Separator text="Sign Up" />
                  <OauthSignIn />
                </form>
              </>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <InputOTP
                    maxLength={codeLength}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={code}
                    onChange={(value) => setCode(value)}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      {[...Array(codeLength)].map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {errors && (
                  <Alert>
                    {errors.map((el, index) => (
                      <AlertDescription key={index}>
                        {el.longMessage}
                      </AlertDescription>
                    ))}
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <LoadingDots text="Verifying email" />
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center flex flex-col items-center">
            {!pendingVerification && (
              <>
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign In
                  </Link>
                </p>{" "}
                <p className="text-sm text-muted-foreground mt-4">
                  By signing up to create an account, you are accepting our{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="font-medium text-primary hover:underline"
                  >
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-medium text-primary hover:underline"
                  >
                    privacy policy.
                  </Link>
                </p>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </AuthLayout>
  );
}
