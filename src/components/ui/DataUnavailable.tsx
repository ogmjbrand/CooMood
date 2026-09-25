import { RefreshCw } from "lucide-react";

export default function DataUnavailable({
  message = "We couldn't load this right now. Please check back shortly.",
  compact = false,
}: {
  message?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex flex-col items-center gap-2 py-12 text-center"
          : "flex flex-col items-center gap-3 rounded-[2rem] bg-white py-24 text-center"
      }
    >
      <RefreshCw size={18} className="text-ink/30" />
      <p className="font-sans text-sm text-ink/50">{message}</p>
    </div>
  );
}
