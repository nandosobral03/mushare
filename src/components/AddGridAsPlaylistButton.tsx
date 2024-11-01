"use client";

import { getErrorMessage } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

type AddGridAsPlaylistButtonProps = {
  id: string;
};

export const AddGridAsPlaylistButton = ({
  id,
}: AddGridAsPlaylistButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const createPlaylist = api.spotify.createPlaylistFromGrid.useMutation();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await createPlaylist.mutateAsync({
        id,
      });
      toast.success("Playlist created successfully!");
    } catch (error) {
      toast.error(getErrorMessage(error));
      ``;
      console.error("Failed to create playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="w-full max-w-sm rounded-full bg-spotify px-8 py-3 font-semibold text-white hover:bg-spotify/90 disabled:opacity-50"
    >
      {isLoading ? "Creating playlist..." : "Add Grid as Playlist"}
    </button>
  );
};
