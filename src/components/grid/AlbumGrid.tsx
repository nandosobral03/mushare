"use client";

import { useState } from "react";
import { type Album } from "@/types/spotify";
import { AlbumSelector } from "./AlbumSelector";

type AlbumGridProps = {
  width: number;
  height: number;
  selectedAlbums: ((Album & { position: number }) | null)[];
  onAlbumSelect?: (
    album: (Album & { position: number }) | null,
    position: number,
  ) => void;
  readonly?: boolean;
};

export const AlbumGrid = ({
  width,
  height,
  selectedAlbums,
  onAlbumSelect,
  readonly = false,
}: AlbumGridProps) => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const gridCells = Array.from({ length: width * height }, (_, i) => i);

  return (
    <>
      <div
        className="mx-auto grid w-full gap-4"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          aspectRatio: `${width}/${height}`,
          maxWidth: readonly
            ? undefined
            : "min(calc(100vh - 32rem), calc(100vw - 32rem))",
        }}
      >
        {gridCells.map((position) => (
          <AlbumCell
            key={position}
            album={selectedAlbums[position] ?? undefined}
            onSelect={() => {
              if (readonly) {
                if (selectedAlbums[position]?.spotifyId) {
                  window.open(
                    `https://open.spotify.com/album/${selectedAlbums[position]!.spotifyId}`,
                    "_blank",
                  );
                }
                return;
              }
              if (selectedAlbums[position]) {
                onAlbumSelect?.(null, position);
              } else {
                setSelectedPosition(position);
              }
            }}
            readonly={readonly}
          />
        ))}
      </div>

      {!readonly && (
        <AlbumSelector
          isOpen={selectedPosition !== null}
          onClose={() => setSelectedPosition(null)}
          onSelect={(album) => {
            if (selectedPosition !== null) {
              onAlbumSelect?.(
                { ...album, position: selectedPosition },
                selectedPosition,
              );
              setSelectedPosition(null);
            }
          }}
        />
      )}
    </>
  );
};

type AlbumCellProps = {
  album?: Album;
  onSelect: () => void;
  readonly?: boolean;
};

const AlbumCell = ({ album, onSelect, readonly }: AlbumCellProps) => (
  <div
    onClick={onSelect}
    className={`aspect-square overflow-hidden rounded-sm text-spotify transition-colors ${
      album ? "" : "border"
    } ${
      readonly && !album
        ? "cursor-default"
        : "cursor-pointer hover:bg-spotify-800 hover:text-white"
    }`}
  >
    {album ? (
      // eslint-disable-next-line @next/next/no-img-element
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
