import { ClockIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="rounded-xl border border-base-300 bg-base-200/50 p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning/20 text-warning mb-4">
        <ClockIcon className="size-6" />
      </div>
      <h3 className="font-semibold text-lg">Too many requests</h3>
      <p className="text-base-content/70 mt-1 text-sm">
        Please wait a moment before loading notes again.
      </p>
    </div>
  );
};

export default RateLimitedUI;
