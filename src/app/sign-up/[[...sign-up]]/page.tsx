import { AuthImage } from "@/components/AuthImage";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex justify-between h-screen w-screen ">
      <div className="hidden md:flex w-3/5">
        <AuthImage textColor="slate-300" />
      </div>
      <div className="flex flex-col justify-center items-center w-full md:w-2/5">
        <SignUp afterSignUpUrl="/new-user" redirectUrl="/new-user" />
      </div>
    </div>
  );
};

export default SignUpPage;
