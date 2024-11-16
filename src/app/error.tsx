"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-spotify p-4">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-black md:text-6xl">
          Oops! Looks like the music stopped.
        </h1>
        <p className="mb-8 text-lg text-black/80 md:text-xl">
          Don&apos;t worry, we can get back to the groove.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            variant="outline"
            className="border-2 border-black bg-transparent text-black hover:bg-black hover:text-spotify"
          >
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 border-black bg-transparent text-black hover:bg-black hover:text-spotify"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
