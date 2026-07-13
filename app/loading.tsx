import { Loader2 } from "lucide-react";

/** Fallback UI shown while a route segment streams in. */
const Loading = () => {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Loader2 className="h-6 w-6 animate-spin text-brand" />
    </main>
  );
};

export default Loading;
