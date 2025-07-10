interface SeparatorProps {
  text?: string;
}

export default function Separator({ text }: SeparatorProps) {
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {text ? (
        <>
          <div
            className={`h-[1px] w-[30%] md:w-[37%] bg-foreground/30 rounded-xl`}
          ></div>
          <div className="text-xl font-semibold text-foreground/60">{text}</div>
          <div
            className={`h-[1px] w-[30%] md:w-[37%] bg-foreground/30 rounded-xl`}
          ></div>
        </>
      ) : (
        <div className={`h-[1px] w-full bg-foreground/30 rounded-xl`}></div>
      )}
    </div>
  );
}
