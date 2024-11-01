import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ShareButton = ({ gridId }: { gridId: string }) => {
  const shareGrid = () => {
    const url = `${window.location.origin}/grid/${gridId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={shareGrid}>
      <span className="material-symbols-outlined text-base">share</span>
      Share
    </Button>
  );
};

export default ShareButton;
