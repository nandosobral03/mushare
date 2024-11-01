"use client";

import { useState } from "react";
import { Album } from "@/types/album";
import { AlbumSelector } from "./AlbumSelector";

type AlbumGridProps = {
  size: number;
  selectedAlbums: Album[];
  onAlbumSelect: (album: Album, position: number) => void;
};

export const AlbumGrid = ({
  size,
  selectedAlbums,
  onAlbumSelect,
}: AlbumGridProps) => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const gridCells = Array.from({ length: size * size }, (_, i) => i);

  return (
    <>
      <div
        className="grid aspect-square max-h-[calc(100vh-10rem)] max-w-[calc(100vw-10rem)] gap-4"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {gridCells.map((position) => (
          <AlbumCell
            key={position}
            album={selectedAlbums[position]}
            onSelect={() => setSelectedPosition(position)}
          />
        ))}
      </div>

      <AlbumSelector
        isOpen={selectedPosition !== null}
        onClose={() => setSelectedPosition(null)}
        onSelect={(album) => {
          if (selectedPosition !== null) {
            onAlbumSelect(album, selectedPosition);
            setSelectedPosition(null);
          }
        }}
      />
    </>
  );
};

type AlbumCellProps = {
  album?: Album;
  onSelect: () => void;
};

const AlbumCell = ({ album, onSelect }: AlbumCellProps) => (
  <div
    onClick={() => !album && onSelect()}
    className="aspect-square cursor-pointer overflow-hidden rounded-lg border transition-colors hover:bg-gray-100"
  >
    {album ? (
      <img
        src={album.imageUrl}
        alt={`${album.name} by ${album.artist}`}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        Click to select album
      </div>
    )}
  </div>
);
