import { SignInWithSpotify } from "@/components/SignInWithSpotify";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-black via-spotify-900 to-spotify-800">
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Image
            src="/32x32.png"
            alt="Mushare logo"
            className="h-8 w-8"
            height={32}
            width={32}
          />
          <span className="text-xl font-bold text-white">Mushare</span>
        </div>
      </nav>

      <main className="m-12 flex grow flex-col items-center justify-center gap-8 rounded-2xl px-4 text-center">
        <h1 className="max-w-4xl text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(30,215,96,0.3)] sm:text-7xl">
          Share your music taste
          <br />
          <b className="text-spotify">in style.</b>
        </h1>

        <p className="max-w-xl text-lg text-neutral-400">
          Create beautiful album grids and ranked charts from your Spotify
          library. Share your musical journey with friends and turn your
          collections into playlists instantly.
        </p>

        <div className="flex flex-col items-center gap-6">
          <Button size="lg" asChild>
            <Link href="/grid">Get Started</Link>
          </Button>
          <div className="mt-4 flex flex-wrap justify-center gap-8">
            <Feature icon="grid_view" text="Create Album Grids" />
            <Feature icon="format_list_numbered" text="Make Top Charts" />
            <Feature icon="share" text="Share them everywhere" />
          </div>
        </div>
      </main>
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-neutral-500 transition-colors hover:text-spotify">
      <span className="material-symbols-outlined">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
