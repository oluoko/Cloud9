import { AuthImage } from "@/components/AuthImage";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex justify-between h-screen w-screen">
      <div className="flex flex-col justify-center items-center w-full md:w-2/5 md:pl-4">
        <SignIn />
      </div>
      <div className="hidden md:flex flex-col items-center justify-centerw-2/3">
        <AuthImage
          containerStyling=""
          heading="Welcome Back to Cloud9"
          headingStyling=""
          text="Your next adventure is just a click away. Sign in to book flights, manage reservations, and unlock exclusive deals."
          textStyling=""
        />
      </div>
    </div>
  );
};

export default SignInPage;
