"use client";

import { useState } from "react";
import { Album } from "@/types/album";
import { AlbumSelector } from "./AlbumSelector";

type AlbumGridProps = {
  size: number;
  selectedAlbums: (Album | null)[];
  onAlbumSelect: (album: Album | null, position: number) => void;
  readonly?: boolean;
};

export const AlbumGrid = ({
  size,
  selectedAlbums,
  onAlbumSelect,
  readonly = false,
}: AlbumGridProps) => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const gridCells = Array.from({ length: size * size }, (_, i) => i);

  if (readonly) return;

  return (
    <>
      <div
        className="mx-auto grid aspect-square w-full gap-4"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          maxWidth: "min(calc(100vh - 32rem), calc(100vw - 32rem))",
        }}
      >
        {gridCells.map((position) => (
          <AlbumCell
            key={position}
            album={selectedAlbums[position] ?? undefined}
            onSelect={() => {
              if (selectedAlbums[position]) {
                onAlbumSelect(null, position);
              } else {
                setSelectedPosition(position);
              }
            }}
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
    onClick={onSelect}
    className="aspect-square cursor-pointer overflow-hidden rounded-lg border text-spotify transition-colors hover:bg-spotify-800 hover:text-white"
  >
    {album ? (
      <img
        src={album.imageUrl}
        alt={`${album.name} by ${album.artist}`}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-2xl">+</span>
      </div>
    )}
  </div>
);
