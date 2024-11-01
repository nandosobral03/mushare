"use client";

import { useState } from "react";
import { AlbumGrid } from "@/components/AlbumGrid";
import { SelectedAlbums } from "@/components/SelectedAlbums";
import SaveGridDialog from "@/components/SaveGridDialog";
import { type Album } from "@/types/album";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";

const GridPage = () => {
  const [gridSize, setGridSize] = useState(3);
  const [selectedAlbums, setSelectedAlbums] = useState<(Album | null)[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const router = useRouter();

  const createGrid = api.spotify.createGrid.useMutation({
    onSuccess: (grid) => {
      setShowSaveDialog(false);
      toast.success("Grid saved successfully!", {
        action: {
          label: "View Grid",
          onClick: () => router.push(`/grid/${grid.id}`),
        },
      });
    },
    onError: (error) => {
      toast.error("Failed to create grid", {
        description: getErrorMessage(error),
      });
    },
  });

  const handleSave = async (title: string) => {
    try {
      await createGrid.mutateAsync({
        size: gridSize,
        albums: selectedAlbums.slice(0, gridSize * gridSize),
        title,
      });
    } catch {
      // Error is handled by onError callback
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon="grid_view"
        title="Create Grid"
        description="Create your own album grid by selecting albums from your Spotify library."
      />
      <div className="flex grow gap-8 p-8">
        <div className="flex flex-1 flex-col items-center justify-stretch">
          <div className="mb-8 flex items-center gap-4 rounded-lg p-4">
            <label
              htmlFor="gridSize"
              className="text-sm font-medium text-gray-200"
            >
              Grid Size
            </label>
            <input
              type="number"
              id="gridSize"
              min={1}
              max={10}
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-20 rounded-md bg-black p-2 text-center text-white outline-none focus:border-spotify focus:outline-none focus:ring-2 focus:ring-spotify"
            />
          </div>
          <AlbumGrid
            size={gridSize}
            selectedAlbums={selectedAlbums}
            onAlbumSelect={(album, position) => {
              if (album) {
                const newAlbums = [...selectedAlbums];
                newAlbums[position] = album;
                setSelectedAlbums(newAlbums);
              } else {
                const newAlbums = [...selectedAlbums];
                newAlbums[position] = null;
                setSelectedAlbums(newAlbums);
              }
            }}
          />
          <button
            onClick={() => setShowSaveDialog(true)}
            className="mt-8 rounded-full bg-spotify px-8 py-3 font-semibold text-white hover:bg-spotify/90 disabled:opacity-50"
          >
            Save Grid
          </button>
        </div>
        <SelectedAlbums
          albums={Array.from({ length: gridSize * gridSize }, (_, index) =>
            selectedAlbums[index] ? { ...selectedAlbums[index], index } : null,
          )}
        />
      </div>
      <SaveGridDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onConfirm={handleSave}
        gridSize={gridSize}
        selectedAlbums={selectedAlbums}
        isLoading={createGrid.isPending}
      />
    </div>
  );
};

export default GridPage;
