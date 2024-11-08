"use client";

import { LikeButton } from "@/components/ui/LikeButton";
import { api } from "@/trpc/react";
import { useState } from "react";

export const LikeChart = ({
  chartId,
  initialIsLiked,
}: {
  chartId: string;
  initialIsLiked: boolean;
}) => {
  const utils = api.useUtils();
  const { data: isLiked } = api.likes.getChartLikeStatus.useQuery({ chartId });
  const [isAnimating, setIsAnimating] = useState(false);

  const { mutate: toggleLike } = api.likes.toggleChartLike.useMutation({
    onMutate: () => {
      setIsAnimating(true);
      utils.likes.getChartLikeStatus.setData({ chartId }, !isLiked);
    },
    onSuccess: () => {
      void utils.likes.getChartLikeStatus.invalidate();
    },
    onSettled: () => {
      setTimeout(() => setIsAnimating(false), 300);
    },
  });

  return (
    <LikeButton
      isLiked={isLiked ?? initialIsLiked}
      onToggle={() => toggleLike({ chartId })}
      className={
        isAnimating ? "scale-110 transition-transform" : "transition-transform"
      }
    />
  );
};
