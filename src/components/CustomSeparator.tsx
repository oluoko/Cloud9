interface SeparatorProps {
  text: string;
}

export default function Separator({ text }: SeparatorProps) {
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="h-1 bg-tertiary w-[40%]"></div>
      <div className="text-lg font-semibold text-foreground/60">{text}</div>
      <div className="h-1 bg-tertiary w-[40%]"></div>
    </div>
  );
}
