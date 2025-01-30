import { AuthImage } from "@/components/AuthImage";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex justify-between h-screen w-screen">
      <div className="flex flex-col justify-center items-center w-full md:w-1/3">
        <SignIn />
      </div>
      <div className="hidden md:flex w-2/3">
        <AuthImage textColor="slate-300" />
      </div>
    </div>
  );
};

export default SignInPage;
