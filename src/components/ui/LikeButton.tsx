import { Heart } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useSignUpModal } from "@/hooks/useSignUpModal";

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  className?: string;
}

export const LikeButton = ({
  isLiked,
  onToggle,
  className,
}: LikeButtonProps) => {
  const { showSignUpModalIfNeeded } = useSignUpModal();

  const handleClick = () => {
    const needsSignUp = showSignUpModalIfNeeded();
    console.log("LikeButton click:", { needsSignUp });
    if (!needsSignUp) {
      onToggle();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("hover:bg-transparent", className)}
      onClick={handleClick}
    >
      <Heart
        className={cn(
          "h-6 w-6 transition-colors",
          isLiked ? "fill-red-500 text-red-500" : "text-gray-500",
        )}
      />
    </Button>
  );
};
