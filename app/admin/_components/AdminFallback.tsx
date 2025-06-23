import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { BrandLogo } from "@/components/brand-logo";

const AdminFallBack = () => {
  return (
    <>
      <nav
        className={`navbar w-screen fixed top-0 left-0 h-[40px] md:h-[55px] p-4 md:px-8 flex items-center justify-between shadow-black/15 shadow-lg text-white bg-black z-50`}
      >
        <Link href={"/"} className="logo">
          <BrandLogo styling="h-[45px] md:h-[60px] w-[90px] md:w-[120px]" />
        </Link>
        <div className="flex justify-between gap-2">
          <Link
            href={"/"}
            className="border hover:border-slate-400/30 hover:bg-slate-100/10 rounded-full w-[100px] flex items-center justify-center"
          >
            Back
          </Link>
          <UserButton />
        </div>
      </nav>
      <div className="mt-[70px] flex flex-col justify-center items-center h-[calc(100vh-70px)] p-4 md:p-10">
        <p className="text-xl md:text-3xl">
          You are not an adminstrator of this website. You are not allowed to
          see this section.
        </p>

        <Link
          href={"/"}
          className="border hover:border-slate-400/30  rounded-full w-[150px] h-[50px] bg-black text-white text-lg md:text-xl flex items-center justify-center my-4"
        >
          Go Back
        </Link>
      </div>
    </>
  );
};

export default AdminFallBack;
