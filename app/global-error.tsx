"use client";

import { useEffect } from "react";
import { Geist } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Last-resort error boundary for failures in the root layout itself; must define its own html/body and can't depend on LocaleProvider since the layout may be what failed. */
const GlobalError = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center bg-surface px-4 py-12 text-ink">
        <div className="w-full max-w-sm rounded-lg border border-line bg-white p-5 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-ink">
            Something went wrong
          </h1>
          <p className="mt-1 text-sm text-muted">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
