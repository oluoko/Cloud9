"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaTiktok,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa6";
import logoImage from "@/public/assets/logo gif white text.gif";

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // If the component is not yet mounted, return null or a placeholder
  if (!mounted) {
    return null;
  }

  const socials = [
    {
      href: "https://www.facebook.com/oluokobrian",
      label: "Facebook",
      icon: FaFacebookF,
    },
    {
      href: "https://www.instagram.com/oluoko_",
      label: "Instagram",
      icon: FaInstagram,
    },
    {
      href: "https://www.tiktok.com/oluoko_",
      label: "TikTok",
      icon: FaTiktok,
    },
    { href: "https://x.com/oluoko_", label: "Twitter", icon: FaXTwitter },
  ];

  const briansSocials = [
    {
      href: "https://www.facebook.com/oluokobrian",
      label: "Facebook",
      icon: FaFacebookF,
    },
    { href: "https://github.com/oluoko", label: "Github", icon: FaGithub },
    {
      href: "https://instagram.com/oluoko_",
      label: "Instagram",
      icon: FaInstagram,
    },
    {
      href: "https://www.linkedin.com/in/brianoluoko",
      label: "Linkedin",
      icon: FaLinkedin,
    },
    {
      href: "https://tiktok.com/@oluoko_",
      label: "Tiktok",
      icon: FaTiktok,
    },
    { href: "https://x.com/@oluoko_", label: "Twitter", icon: FaXTwitter },
  ];
  return (
    <div
      className={`w-screen overflow-hidden  flex flex-col justify-center items-center py-5 md:py-[120px] p-2 md:px-10 text-white/60
       ${resolvedTheme === "dark" ? "bg-accent" : "bg-black/80"}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 w-full h-10/12">
        <div className="grid my-4 md:my-2 mx-3 md:mx-6 content-start h-full">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 grid ">
            <span>
              <Image
                src={logoImage}
                alt="logo image"
                className="size-[40vw] md:size-[150px]"
              />
            </span>
          </h3>

          <span className=" text-xs">
            Copyrights © {new Date().getFullYear()} Cloud
            <span className="text-primary text-lg md:text-xl font-black">
              9
            </span>
            . All Rights Reserved
          </span>
        </div>

        <div className="grid my-4 md:my-2 mx-3 md:mx-6 content-start  h-full">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 ">
            Follow us on:
          </h3>
          <p className="mb-2">
            Join the thousands of other followers on our social platforms and
            get our latest offers.
          </p>
          <div className="w-full flex gap-2">
            {socials.map((social) => (
              <Link href={social.href} key={social.href} target="_blank">
                <div className="rounded-full border hover:text-primary hover:border-primary border-slate-400/80 size-[30px] p-[5px]">
                  <social.icon className="size-full " />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid my-4 md:my-2 mx-3 md:mx-6 content-start h-full">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 ">
            Write to our email:
          </h3>
          <p className="mb-2">
            For any inquiries or feedback write to us at:{" "}
            <a href="mailto:brianotieno586@gmail.com" className="mb-2">
              <span className="text-white hover:text-primary">
                cloudnine@gmail.com
              </span>
            </a>
          </p>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 ">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/">
              <span className=" hover:text-primary">Home</span>
            </Link>
            <Link href="/#contact-us">
              <span className=" hover:text-primary">Talk to us</span>
            </Link>

            <Link href="/terms-and-conditions">
              <span className=" hover:text-primary">Ts & Cs</span>
            </Link>
            <Link href="/privacy-policy">
              <span className=" hover:text-primary">Privacy Policy</span>
            </Link>
          </div>
        </div>

        <div className="grid my-4 md:my-2 mx-3 md:mx-6 content-start  h-full">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 ">
            Created by:
          </h3>
          <p className="mb-2 ">
            Reach out to the developer of this site for any queries or
            suggestions.
          </p>
          <div className="w-full flex gap-2">
            {briansSocials.map((social) => (
              <Link href={social.href} key={social.href} target="_blank">
                <div className="rounded-full border hover:text-primary hover:border-primary border-slate-400/80 size-[30px] p-[5px]">
                  <social.icon className="size-full " />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
