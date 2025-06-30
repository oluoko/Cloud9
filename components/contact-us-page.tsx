"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LoadingDots from "./loading-dots";
import { toast } from "sonner";

export default function ContactUsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          message,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to send message.");
        console.error("Error sending message:", errorData);
      } else {
        toast.success("Message sent successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-10"
      id="contact-us"
    >
      <div className="w-full max-w-screen-xl mx-auto px-6 xl:px-0">
        <b className="text-muted-foreground">Contact Us</b>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
          Talk to us to day
        </h2>
        <p className="mt-3 text-base sm:text-lg">
          We&apos;d love to hear from you. Please fill out this form or shoot us
          an email.
        </p>
        <div className="mt-6 grid lg:grid-cols-2 gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                <MailIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Email</h3>
              <p className="my-2.5 text-muted-foreground">
                Our friendly team is here to help.
              </p>
              <Link
                className="font-medium text-primary"
                href="franciskyalo38@gmail.com"
              >
                cloudnine@gmail.com
              </Link>
            </div>
            {/* <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                <MessageCircle />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Live chat</h3>
              <p className="my-2.5 text-muted-foreground">
                Our friendly team is here to help.
              </p>
              <Link className="font-medium text-primary" href="#">
                Start new chat
              </Link>
            </div> */}
            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                <MapPinIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Office</h3>
              <p className="my-2.5 text-muted-foreground">
                Come say hello at our office HQ.
              </p>
              <Link
                className="font-medium text-primary"
                href="https://map.google.com"
                target="_blank"
              >
                6742-3010 Kesses <br /> Uasin Gishu, Kenya.
              </Link>
            </div>
            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                <PhoneIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Phone</h3>
              <p className="my-2.5 text-muted-foreground">
                Mon-Fri from 8am to 5pm.
              </p>
              <div className="font-medium text-primary">+254 716 191 015</div>
              <div className="font-medium text-primary">+254 112 558 808</div>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-accent shadow-none">
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      placeholder="First name"
                      id="firstName"
                      className="mt-1.5 bg-background/70 h-11 shadow-none"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      placeholder="Last name"
                      id="lastName"
                      className="mt-1.5 bg-background/70 h-11 shadow-none"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      id="email"
                      className="mt-1.5 bg-background/70 h-11 shadow-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Message"
                      className="mt-1.5 bg-background/70 shadow-none"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    See our{" "}
                    <Link href="/terms-and-conditions" className="underline">
                      terms and conditions.
                    </Link>
                  </div>
                </div>
                <Button className="mt-6 w-full" size="lg" disabled={isLoading}>
                  {isLoading ? <LoadingDots text="Sending" /> : "Send Message"}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
