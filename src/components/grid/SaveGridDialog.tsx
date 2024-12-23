import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { type Album } from "@/types/spotify";
import { AlbumGrid } from "./AlbumGrid";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type SaveGridDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (title: string) => void;
  gridHeight: number;
  gridWidth: number;
  selectedAlbums: (Album | null)[];
  isLoading: boolean;
};

const SaveGridDialog = ({
  open,
  onOpenChange,
  onConfirm,
  gridHeight,
  gridWidth,
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
          <div className="max-h-[300px] w-full overflow-y-auto">
            <AlbumGrid
              height={gridHeight}
              width={gridWidth}
              selectedAlbums={selectedAlbums.map((album, i) =>
                album ? { ...album, position: i } : null,
              )}
              readonly
            />
          </div>
          <Input
            type="text"
            placeholder="Enter grid title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button
            onClick={() => onConfirm(title)}
            disabled={isLoading || !title.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined mr-2 animate-spin">
                  progress_activity
                </span>
                Saving...
              </>
            ) : (
              "Save Grid"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveGridDialog;
