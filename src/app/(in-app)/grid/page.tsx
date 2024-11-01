"use client";

import { useState } from "react";
import { AlbumGrid } from "@/components/AlbumGrid";
import { SelectedAlbums } from "@/components/SelectedAlbums";
import { Album } from "@/types/album";

const GridPage = () => {
  const [gridSize, setGridSize] = useState(3);
  const [selectedAlbums, setSelectedAlbums] = useState<Album[]>([]);

  return (
    <div className="flex h-full gap-8 p-8">
      <div className="flex flex-1 flex-col items-center">
        <div className="rounded-lgp-4 mb-8 flex items-center gap-4">
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
            className="focus:border-spotify focus:ring-spotify w-20 rounded-md bg-black p-2 text-center text-white outline-none focus:outline-none focus:ring-2"
          />
        </div>
        <AlbumGrid
          size={gridSize}
          selectedAlbums={selectedAlbums}
          onAlbumSelect={(album, position) => {
            const newAlbums = [...selectedAlbums];
            newAlbums[position] = album;
            setSelectedAlbums(newAlbums);
          }}
        />
      </div>
      <SelectedAlbums
        albums={Array.from({ length: gridSize * gridSize }, (_, index) =>
          selectedAlbums[index] ? { ...selectedAlbums[index], index } : null,
        )}
      />
    </div>
  );
};

export default GridPage;
