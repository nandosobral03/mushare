"use client";

import { LikeButton } from "@/components/ui/LikeButton";
import { api } from "@/trpc/react";
import { useState } from "react";

export const LikeGrid = ({
  gridId,
  initialIsLiked,
}: {
  gridId: string;
  initialIsLiked: boolean;
}) => {
  const utils = api.useUtils();
  const { data: isLiked } = api.likes.getGridLikeStatus.useQuery({ gridId });
  const [isAnimating, setIsAnimating] = useState(false);

  const { mutate: toggleLike } = api.likes.toggleGridLike.useMutation({
    onMutate: () => {
      setIsAnimating(true);
      utils.likes.getGridLikeStatus.setData({ gridId }, !isLiked);
    },
    onSuccess: () => {
      void utils.likes.getGridLikeStatus.invalidate();
    },
    onSettled: () => {
      setTimeout(() => setIsAnimating(false), 300);
    },
  });

  return (
    <LikeButton
      isLiked={isLiked ?? initialIsLiked}
      onToggle={() => toggleLike({ gridId })}
      className={
        isAnimating ? "scale-110 transition-transform" : "transition-transform"
      }
    />
  );
};
