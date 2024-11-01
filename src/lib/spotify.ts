import { cookies } from "next/headers";
import type { Album } from "@/types/album";
import axios from "axios";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const refreshAccessToken = async (refresh_token: string) => {
  try {
    const { data } = await axios.post<{
      access_token: string;
      expires_in: number;
      refresh_token: string;
    }>(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
      },
    );
    return data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

const getAccessToken = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("spotify_access_token")?.value;
  const expiresAt = cookieStore.get("spotify_token_expires_at")?.value;
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;

  if (!accessToken || !expiresAt || !refreshToken) {
    throw new Error("No authentication tokens found");
  }

  // Check if token is expired or will expire in the next minute
  if (Date.now() + 60000 > parseInt(expiresAt)) {
    const refreshedTokens = await refreshAccessToken(refreshToken);
    accessToken = refreshedTokens.access_token;

    // Update cookies with new tokens
    const newExpiresAt = Date.now() + refreshedTokens.expires_in * 1000;
    cookieStore.set("spotify_access_token", refreshedTokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshedTokens.expires_in,
    });
    cookieStore.set("spotify_token_expires_at", newExpiresAt.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return accessToken;
};

interface SpotifySearchResponse {
  albums: {
    items: Array<{
      id: string;
      name: string;
      artists: Array<{
        name: string;
      }>;
      images: Array<{
        url: string;
      }>;
    }>;
  };
}

export const searchSpotifyAlbums = async (query: string): Promise<Album[]> => {
  const accessToken = await getAccessToken();

  const { data } = await axios.get<SpotifySearchResponse>(
    `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=album&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return data.albums.items.map((item) => ({
    id: item.id,
    name: item.name,
    artist: item.artists[0]?.name ?? "",
    imageUrl: item.images[0]?.url ?? "",
  }));
};

const getUserId = async (accessToken: string): Promise<string> => {
  const { data } = await axios.get<{ id: string }>(
    "https://api.spotify.com/v1/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return data.id;
};

interface SpotifyPlaylistResponse {
  id: string;
}

interface SpotifyTrackResponse {
  items: Array<{
    uri: string;
  }>;
}

const createSpotifyPlaylistFromAlbums = async (
  albumIds: string[],
  name: string,
  description: string,
) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("No access token found");
  }
  const userId = await getUserId(accessToken);

  // Create the playlist
  const { data } = await axios.post<SpotifyPlaylistResponse>(
    `${SPOTIFY_API_URL}/users/${userId}/playlists`,
    {
      name,
      description,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  // Add the albums to the playlist
  const tracks = await Promise.all(
    albumIds.map(async (id) => {
      const { data } = await axios.get<SpotifyTrackResponse>(
        `${SPOTIFY_API_URL}/albums/${id}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data.items.map((track) => ({
        uri: track.uri,
      }));
    }),
  ).then((trackArrays) => trackArrays.flat());

  await axios.post(
    `${SPOTIFY_API_URL}/playlists/${data.id}/tracks`,
    {
      uris: tracks.map((track) => track.uri),
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export { refreshAccessToken, getUserId, createSpotifyPlaylistFromAlbums };
