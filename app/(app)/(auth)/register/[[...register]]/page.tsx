"use client";

import React, { FormEvent, useState } from "react";
import { useAuth, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import Loader from "@/components/loader";
import AuthLayout from "@/components/auth-layout";
import Separator from "@/components/custom-separator";
import OauthSignIn from "@/components/o-auth";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { SubmitButton } from "@/components/custom-button";

export default function SignUpPage() {
  const { isLoaded, setActive, signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
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

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
    }

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
      <Card className="w-[90vw] md:w-full max-w-md">
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

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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

                {passwordMismatch && (
                  <Alert>
                    <AlertDescription>Passwords do not match.</AlertDescription>
                  </Alert>
                )}

                {errors && (
                  <Alert>
                    {errors.map((el, index) => (
                      <AlertDescription key={index}>
                        {el.longMessage}
                      </AlertDescription>
                    ))}
                  </Alert>
                )}

                <div id="clerk-captcha"></div>

                <SubmitButton
                  isPending={isLoading}
                  className="w-full"
                  type="submit"
                  text="Sign Up"
                  loadingText="Signing you up"
                />
                <Separator text="Or" />
                <OauthSignIn />
              </form>
            </>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2 flex flex-col items-center justify-center">
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
              <SubmitButton
                className="w-full"
                type="submit"
                text="Verify Email"
                loadingText="Verifying Email"
              />
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center flex flex-col items-center text-sm">
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
    </AuthLayout>
  );
}
