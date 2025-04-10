import { Icons } from "@/components/icons";

interface LoadingStateProps {
  text?: string;
  fullScreen?: boolean;
}

export function LoadingState({ text = "Loading...", fullScreen = false }: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "h-screen w-screen" : "h-full w-full"
      }`}
    >
      <Icons.loader className="h-8 w-8 animate-spin" />
      <p className="mt-4 text-sm text-muted-foreground">{text}</p>
    </div>
  );
} 