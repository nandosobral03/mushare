import type { Album } from "@/types/album";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export const searchSpotifyAlbums = async (
  query: string,
  accessToken: string,
): Promise<Album[]> => {
  const response = await fetch(
    `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=album&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch albums");
  }

  const data = await response.json();

  return data.albums.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    artist: item.artists[0].name,
    imageUrl: item.images[0].url,
  }));
};
