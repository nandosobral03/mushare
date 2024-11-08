"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Music, Heart, Grid } from "lucide-react";
import { SignInWithSpotify } from "../SignInWithSpotify";
import { useSignUpModal } from "@/hooks/useSignUpModal";
import { DownloadIcon } from "@radix-ui/react-icons";

export const SignUpModal = () => {
  const { isOpen, onClose } = useSignUpModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-white drop-shadow-[0_0_15px_rgba(30,215,96,0.3)]">
            Join Mushare
            <span className="mt-1 block text-spotify">Share your taste.</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-black/20 p-4 transition-colors hover:bg-black/30">
              <Heart className="h-6 w-6 text-spotify-50 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
              <p className="text-neutral-200">
                Like and save your favorite grids
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-black/20 p-4 transition-colors hover:bg-black/30">
              <Grid className="h-6 w-6 text-spotify-200 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <p className="text-neutral-200">
                Create your own grids and charts
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-black/20 p-4 transition-colors hover:bg-black/30">
              <DownloadIcon className="h-6 w-6 text-spotify-400 drop-shadow-[0_0_8px_rgba(30,215,96,0.5)]" />
              <p className="text-neutral-200">
                Save grids and charts directly to Spotify playlists
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-black/20 p-4 transition-colors hover:bg-black/30">
              <Music className="h-6 w-6 text-spotify drop-shadow-[0_0_8px_rgba(30,215,96,0.5)]" />
              <p className="text-neutral-200">
                Share your creations with the world
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <SignInWithSpotify />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
