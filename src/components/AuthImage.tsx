import { BrandLogo } from "./BrandLogo";

interface AuthImageProps {
  containerStyling: string;
  heading: string;
  headingStyling: string;
  text: string;
  textStyling: string;
}

export function AuthImage({
  containerStyling,
  heading,
  headingStyling,
  text,
  textStyling,
}: AuthImageProps) {
  return (
    <div className={"w-[70% ] flex flex-col items-center justify-center"}>
      <BrandLogo styling="w-[50vw] md:w-[30vw]" />

      <div
        className={`${containerStyling} flex flex-col items-center justify-center `}
      >
        <div className={`${headingStyling} text-4xl font-black mb-3`}>
          {heading}
        </div>
        <div
          className={`${textStyling} w-[70%] text-2xl tracking-wider text-secondary-foreground/70`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
