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
        <div key={index} className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={album?.imageUrl ?? "/default-album-artwork.png"}
            alt={album?.name ?? "Empty album slot"}
            className={`rounded object-cover ${
              albums.length > 9 ? "h-12 w-12" : "h-16 w-16"
            }`}
          />
          <div>
            <div className="font-medium text-white">
              {index + 1}. {album?.name ?? "Empty"}
            </div>
            {album && (
              <div className="text-sm text-gray-300">{album.artist}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
