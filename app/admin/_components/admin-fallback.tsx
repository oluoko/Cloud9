import Link from "next/link";
import logoWhiteText from "@/public/logo white text.svg";
import Image from "next/image";
import CustomUserButton from "@/components/custom-user-button";

const AdminFallBack = () => {
  return (
    <>
      <nav
        className={`navbar w-screen fixed top-0 left-0 h-[40px] md:h-[55px] p-4 md:px-8 flex items-center justify-between shadow-black/15 shadow-lg text-white bg-black z-50`}
      >
        <Link href={"/"} className="logo">
          <div className="h-[45px] md:h-[60px] w-[90px] md:w-[120px]">
            <Image
              src={logoWhiteText}
              className="size-full"
              alt="Logo in white text"
            />
          </div>
        </Link>

        <CustomUserButton />
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
