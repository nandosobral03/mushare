import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-spotify p-4">
      <div className="text-center">
        <span className="material-symbols-outlined mb-4 text-6xl text-black md:text-8xl">
          music_off
        </span>
        <h1 className="mb-2 text-4xl font-bold text-black md:text-6xl">
          *Record Scratch* <br /> *Freeze Frame*
        </h1>
        <p className="mb-8 text-lg text-black/80 md:text-xl">
          Yup, that&apos;s a 404. <br />
          You&apos;re probably wondering how we ended up in this situation.{" "}
          <br />
          Let&apos;s get back to where things make sense.
        </p>
        <Button
          asChild
          variant="outline"
          className="border-2 border-black bg-transparent text-black hover:bg-black hover:text-spotify"
        >
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
