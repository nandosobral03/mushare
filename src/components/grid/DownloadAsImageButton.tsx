"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const DownloadAsImageButton = ({ gridId }: { gridId: string }) => {
  const { data } = api.grid.getGrid.useQuery({ id: gridId });

  const downloadImage = () => {
    if (!data) return;

    const gridElement = document.querySelector("#grid");
    if (!gridElement) return;

    // Load and convert favicon to base64 first
    const loadFaviconAsBase64 = () => {
      return new Promise<string>((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = window.location.origin + "/32x32.png";

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
      });
    };

    void loadFaviconAsBase64().then((faviconBase64) => {
      void import("html2canvas").then((html2canvas) => {
        void html2canvas
          .default(gridElement as HTMLElement, {
            backgroundColor: "#000000",
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            onclone: (doc) => {
              const buttons = doc
                .querySelector("#grid")
                ?.querySelector(".mt-4");
              buttons?.remove();

              const grid = doc.querySelector("#grid");
              grid?.classList.add("relative");

              const watermark = doc.createElement("div");
              watermark.classList.add(
                "absolute",
                "bottom-4",
                "right-4",
                "m-2",
                "text-spotify",
                "flex",
                "items-center",
                "justify-center",
                "gap-2",
              );

              const favicon = doc.createElement("img");
              favicon.src = faviconBase64;
              favicon.width = 32;
              favicon.height = 32;
              favicon.classList.add("my-auto");
              watermark.appendChild(favicon);
              doc.querySelector("#grid")?.appendChild(watermark);
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
