import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand-logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: "login" | "register";
}

const AuthLayout = ({ children, mode }: AuthLayoutProps) => {
  const { resolvedTheme } = useTheme();
  const isSignIn = mode === "login";

  return (
    <div className="flex min-h-screen w-full">
      {/* Auth Card Section */}
      <motion.div
        initial={{ opacity: 0, x: isSignIn ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full lg:w-1/2 flex items-center justify-center p-4 
          ${isSignIn ? "lg:order-first" : "lg:order-last"}`}
      >
        {children}
      </motion.div>

      {/* Branded Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`hidden lg:flex lg:w-1/2 relative overflow-hidden
          ${"bg-primary"}`}
      >
        {/* Slanted Overlay */}
        <div
          className={`absolute top-0 h-screen w-[200%] origin-top-left
            ${
              isSignIn
                ? "left-1/2 -translate-x-1/2 rotate-[10deg] translate-y-[-10%]"
                : "left-0 -translate-x-1/4 rotate-[-10deg] translate-y-[-10%]"
            }
         
            transition-colors duration-300 bg-foreground`}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8 rounded-xl p-4"
          >
            <BrandLogo styling="h-[80px] w-[160px]" inverted />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`text-2xl font-bold mb-4 text-background`}
          >
            {isSignIn ? "Welcome Back!" : "Join Our Community"}
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`text-lg max-w-md text-background/85`}
          >
            {isSignIn
              ? "Secure access to your Cloud9 account. Let's continue your journey together."
              : "Join Cloud9 and discover a world of possibilities. Your adventure starts here."}
          </motion.p>

          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10 z-50">
            <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-background" />
            <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-background" />
            <div className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
