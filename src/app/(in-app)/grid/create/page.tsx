"use client";

import { useState } from "react";
import { AlbumGrid } from "@/components/grid/AlbumGrid";
import { SelectedAlbums } from "@/components/grid/SelectedAlbums";
import SaveGridDialog from "@/components/grid/SaveGridDialog";
import { type Album } from "@/types/spotify";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ContentWrapper } from "@/components/ui/ContentWrapper";
import { Button } from "@/components/ui/button";

const GridPage = () => {
  const [gridSize, setGridSize] = useState(3);
  const [selectedAlbums, setSelectedAlbums] = useState<
    ((Album & { position: number }) | null)[]
  >([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const router = useRouter();

  const createGrid = api.grid.createGrid.useMutation({
    onSuccess: (grid) => {
      setShowSaveDialog(false);
      void router.push(`/grid/${grid.id}`);
      toast.success("Grid saved successfully!");
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

  const isGridComplete =
    selectedAlbums
      .slice(0, gridSize * gridSize)
      .filter((album) => album !== null).length ===
    gridSize * gridSize;

  return (
    <>
      <PageHeader
        icon="grid_view"
        title="Create Grid"
        description="Create your own album grid by selecting albums from your Spotify library."
        breadcrumbs={[
          {
            label: "Album Grids",
            href: "/grid",
          },
          {
            label: "Create",
          },
        ]}
      />
      <ContentWrapper>
        <div className="flex w-full grow gap-8 p-8">
          <div className="flex w-2/3 flex-col items-center justify-stretch">
            <div className="mb-8 flex items-center gap-4 rounded-lg p-4">
              <div className="relative w-24">
                <input
                  id="gridSize"
                  min={2}
                  max={6}
                  value={gridSize}
                  onChange={(e) =>
                    setGridSize(
                      Math.min(Math.max(Number(e.target.value), 2), 6),
                    )
                  }
                  className="w-full rounded-md bg-black p-3 text-center text-lg text-white outline-none focus:border-spotify focus:outline-none focus:ring-2 focus:ring-spotify"
                />
                <div className="absolute right-2 top-0 flex h-full flex-col justify-center">
                  <button
                    onClick={() => setGridSize(Math.min(gridSize + 1, 6))}
                    className="text-spotify hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">
                      expand_less
                    </span>
                  </button>
                  <button
                    onClick={() => setGridSize(Math.max(gridSize - 1, 2))}
                    className="text-spotify hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">
                      expand_more
                    </span>
                  </button>
                </div>
              </div>
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
                  const newAlbums = [...selectedAlbums] as (
                    | (Album & { position: number })
                    | null
                  )[];
                  newAlbums[position] = null;
                  setSelectedAlbums(newAlbums);
                }
              }}
            />
            <Button
              onClick={() => setShowSaveDialog(true)}
              disabled={!isGridComplete}
              className="mt-8"
              size="lg"
            >
              Save Grid
            </Button>
          </div>
          <SelectedAlbums
            albums={Array.from({ length: gridSize * gridSize }, (_, index) =>
              selectedAlbums[index]
                ? { ...selectedAlbums[index], index }
                : null,
            )}
          />
        </div>
      </ContentWrapper>
      <SaveGridDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onConfirm={handleSave}
        gridSize={gridSize}
        selectedAlbums={selectedAlbums}
        isLoading={createGrid.isPending}
      />
    </>
  );
};

export default GridPage;
