"use client";

import { type Album } from "@/types/spotify";

type SelectedAlbumsProps = {
  albums: ((Album & { index: number }) | null)[];
};

export const SelectedAlbums = ({ albums }: SelectedAlbumsProps) => (
  <div className="flex-1 border-l pl-8">
    <div
      className={`grid ${albums.length > 16 ? "grid-cols-2" : "grid-cols-1"} gap-4`}
    >
      {albums.map((album, index) => (
        <div
          key={index}
          className={`flex gap-3 ${album?.spotifyId ? "cursor-pointer hover:opacity-80" : ""}`}
          onClick={() => {
            if (album?.spotifyId) {
              window.open(
                `https://open.spotify.com/album/${album.spotifyId}`,
                "_blank",
              );
            }
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={album?.imageUrl ?? "/default-album-artwork.png"}
            alt={album?.name ?? "Empty album slot"}
            className={`rounded object-cover ${
              albums.length > 9 ? "h-12 w-12" : "h-16 w-16"
            }`}
          />
          <div>
            <div className="font-medium text-foreground">
              {index + 1}. {album?.name ?? "Empty"}
            </div>
            {album && (
              <div className="text-sm text-muted-foreground">
                {album.artist}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
