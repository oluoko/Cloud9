import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";
import Link from "next/link";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-10">
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
            <CardContent className="p-6 md:p-10">
              <form>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      placeholder="First name"
                      id="firstName"
                      className="mt-1.5 bg-white h-11 shadow-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      placeholder="Last name"
                      id="lastName"
                      className="mt-1.5 bg-white h-11 shadow-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      id="email"
                      className="mt-1.5 bg-white h-11 shadow-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Message"
                      className="mt-1.5 bg-white shadow-none"
                      rows={6}
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Checkbox id="acceptTerms" />
                    <Label htmlFor="acceptTerms">
                      You agree to our{" "}
                      <Link href="/terms-and-conditions" className="underline">
                        terms and conditions
                      </Link>
                      .
                    </Label>
                  </div>
                </div>
                <Button className="mt-6 w-full" size="lg">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
