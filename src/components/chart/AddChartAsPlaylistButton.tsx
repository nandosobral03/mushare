"use client";

import { getErrorMessage } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AddChartAsPlaylistButtonProps = {
  id: string;
};

export const AddChartAsPlaylistButton = ({
  id,
}: AddChartAsPlaylistButtonProps) => {
  const { mutate, isPending } = api.chart.createPlaylist.useMutation({
    onSuccess: () => toast.success("Playlist created successfully!"),
    onError: (error) => {
      toast.error(getErrorMessage(error));
      console.error("Failed to create playlist:", error);
    },
  });

  return (
    <Button
      onClick={() => mutate({ id })}
      disabled={isPending}
      className="w-full max-w-sm"
      size="lg"
    >
      {isPending ? "Creating playlist..." : "Add Chart as Playlist"}
    </Button>
  );
};
