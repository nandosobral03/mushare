"use client";

import { getErrorMessage } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSignUpModal } from "@/hooks/useSignUpModal";

type AddChartAsPlaylistButtonProps = {
  id: string;
};

export const AddChartAsPlaylistButton = ({
  id,
}: AddChartAsPlaylistButtonProps) => {
  const { showSignUpModalIfNeeded } = useSignUpModal();
  const { mutate, isPending } = api.chart.createPlaylist.useMutation({
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
      {isPending ? "Creating playlist..." : "Add Chart as Playlist"}
    </Button>
  );
};
