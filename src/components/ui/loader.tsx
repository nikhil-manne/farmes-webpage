import { Leaf } from "lucide-react";

export function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4 p-8 animate-in fade-in duration-500">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <Leaf className="h-6 w-6 text-primary animate-pulse" />
      </div>
      <p className="font-display text-sm font-semibold tracking-wide text-muted-foreground animate-pulse">
        {text}
      </p>
    </div>
  );
}
