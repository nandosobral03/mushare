import { Heart } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  className?: string;
}

export const LikeButton = ({
  isLiked,
  onToggle,
  className,
}: LikeButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn("hover:bg-transparent", className)}
    onClick={onToggle}
  >
    <Heart
      className={cn(
        "h-6 w-6 transition-colors",
        isLiked ? "fill-red-500 text-red-500" : "text-gray-500",
      )}
    />
  </Button>
);
