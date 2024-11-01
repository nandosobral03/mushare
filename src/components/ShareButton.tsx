"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ShareButton = ({ gridId }: { gridId: string }) => {
  const shareGrid = () => {
    const url = `${window.location.origin}/grid/${gridId}`;
    void navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <Button variant="outline" className="gap-2" size="lg" onClick={shareGrid}>
      <span className="material-symbols-outlined text-base">share</span>
      Share
    </Button>
  );
};

export default ShareButton;
