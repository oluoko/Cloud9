import { AuthImage } from "@/components/AuthImage";
import { BrandLogo } from "@/components/BrandLogo";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex justify-between h-screen w-screen overflow-x-hidden">
      <div className="hidden md:flex w-3/5 flex-col items-center justify-center">
        <AuthImage
          containerStyling=""
          heading=" Join Cloud9 – Your Journey Begins Here!"
          headingStyling=""
          text="Create an account to access seamless flight bookings, personalized travel deals, and a hassle-free journey from takeoff to landing."
          textStyling=""
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full md:w-2/5">
        <BrandLogo styling="md:hidden h-[45px] md:h-[70px] w-[90px] md:w-[140px]" />
        <SignUp afterSignUpUrl="/new-user" redirectUrl="/new-user" />
      </div>
    </div>
  );
};

export default SignUpPage;
