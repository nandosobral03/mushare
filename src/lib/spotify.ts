import { cookies } from "next/headers";
import type { Album } from "@/types/album";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const refreshAccessToken = async (refresh_token: string) => {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
    });

    const data = await response.json();
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

export const searchSpotifyAlbums = async (query: string): Promise<Album[]> => {
  const accessToken = await getAccessToken();

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

const getUserId = async (accessToken: string) => {
  const userResponse = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error("Failed to fetch user data");
  }

  const userData = await userResponse.json();
  return userData.id;
};

export { refreshAccessToken, getUserId };
