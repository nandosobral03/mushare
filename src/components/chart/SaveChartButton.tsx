"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type Album } from "@/types/spotify";
import { useRouter } from "next/navigation";

interface SaveChartButtonProps {
  title: string;
  description: string;
  albums: Album[];
}

export const SaveChartButton = ({
  title,
  description,
  albums,
}: SaveChartButtonProps) => {
  const router = useRouter();
  const createChart = api.chart.create.useMutation({
    onSuccess: (data) => {
      router.push(`/chart/${data.id}`);
    },
  });

  return (
    <Button
      onClick={() =>
        createChart.mutate({
          title,
          description,
          albumIds: albums.map((album) => album.id),
        })
      }
      disabled={!title || albums.length === 0}
    >
      Save Chart
    </Button>
  );
};
