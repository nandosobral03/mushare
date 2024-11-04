"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const DownloadAsImageButton = ({ gridId }: { gridId: string }) => {
  const { data } = api.spotify.getGrid.useQuery({ id: gridId });

  const downloadImage = () => {
    if (!data) return;

    const gridElement = document.querySelector("#grid");
    if (!gridElement) return;

    // Use html2canvas to capture the grid element
    void import("html2canvas").then((html2canvas) => {
      void html2canvas
        .default(gridElement as HTMLElement, {
          backgroundColor: "#000000",
          scale: 2, // Higher quality
          logging: false,
          useCORS: true, // Allow loading cross-origin images
          allowTaint: true,
          onclone: (doc) => {
            // Remove buttons from clone
            const buttons = doc.querySelector("#grid")?.querySelector(".mt-4");
            buttons?.remove();
          },
        })
        .then((canvas) => {
          const link = document.createElement("a");
          link.download = `${data.title}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          toast.success("Grid downloaded successfully!");
        });
    });
  };

  return (
    <Button
      variant="ghost"
      className="gap-2 p-3 text-white"
      size="lg"
      onClick={downloadImage}
    >
      <span className="material-symbols-outlined text-2xl">download</span>
    </Button>
  );
};

export default DownloadAsImageButton;
