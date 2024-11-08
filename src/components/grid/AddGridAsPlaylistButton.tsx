"use client";

import { getErrorMessage } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSignUpModal } from "@/hooks/useSignUpModal";

type AddGridAsPlaylistButtonProps = {
  id: string;
};

export const AddGridAsPlaylistButton = ({
  id,
}: AddGridAsPlaylistButtonProps) => {
  const { showSignUpModalIfNeeded } = useSignUpModal();
  const { mutate, isPending } = api.grid.createPlaylistFromGrid.useMutation({
    onSuccess: () => toast.success("Playlist created successfully!"),
    onError: (error) => {
      toast.error(getErrorMessage(error));
      console.error("Failed to create playlist:", error);
    },
  });

  const handleClick = () => {
    const needsSignUp = showSignUpModalIfNeeded();
    if (!needsSignUp) {
      mutate({ id });
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="w-full max-w-sm"
      size="lg"
    >
      {isPending ? "Creating playlist..." : "Add Grid as Playlist"}
    </Button>
  );
};
