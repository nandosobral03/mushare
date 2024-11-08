import { type Album } from "@/types/spotify";

type SelectedAlbumsChartProps = {
  albums: ((Album & { index: number }) | null)[];
};

export const SelectedAlbumsChart = ({ albums }: SelectedAlbumsChartProps) => (
  <div className="w-80 border-l pl-8">
    <div className="space-y-4">
      {albums.map((album, index) => (
        <div key={index} className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={album?.imageUrl ?? "/default-album-artwork.png"}
            alt={album?.name ?? "Empty album slot"}
            className="h-16 w-16 rounded object-cover"
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
