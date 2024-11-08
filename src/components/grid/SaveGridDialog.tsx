import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { type Album } from "@/types/spotify";
import { AlbumGrid } from "./AlbumGrid";
import { Input } from "../ui/input";

type SaveGridDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (title: string) => void;
  gridSize: number;
  selectedAlbums: (Album | null)[];
  isLoading: boolean;
};

const SaveGridDialog = ({
  open,
  onOpenChange,
  onConfirm,
  gridSize,
  selectedAlbums,
  isLoading,
}: SaveGridDialogProps) => {
  const [title, setTitle] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Save Your Grid</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6">
          <AlbumGrid
            size={gridSize}
            selectedAlbums={selectedAlbums.map((album, i) =>
              album ? { ...album, position: i } : null,
            )}
            readonly
          />
          <Input
            type="text"
            placeholder="Enter grid title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={() => onConfirm(title)}
            disabled={isLoading || !title.trim()}
            className="w-full rounded-full bg-spotify px-8 py-3 font-semibold text-white hover:bg-spotify/90 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Grid"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveGridDialog;
