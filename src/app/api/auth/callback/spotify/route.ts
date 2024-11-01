import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";
import { refreshAccessToken } from "@/lib/spotify";
import axios from "axios";

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

interface SpotifyUserResponse {
  id: string;
  email: string;
  display_name: string;
  images?: {
    url: string;
  }[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const { data } = await axios.post<SpotifyTokenResponse>(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
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

    if (!data.access_token) {
      const refresh_token = request.cookies.get("spotify_refresh_token")?.value;

      if (refresh_token) {
        const refreshedTokens = await refreshAccessToken(refresh_token);
        data.access_token = refreshedTokens.access_token;
        data.expires_in = refreshedTokens.expires_in;

        if (refreshedTokens.refresh_token) {
          data.refresh_token = refreshedTokens.refresh_token;
        }
      } else {
        return NextResponse.json(
          { error: "Failed to get access token" },
          { status: 401 },
        );
      }
    }

    const response = NextResponse.redirect(new URL("/grid", request.url));

    const expiresAt = Date.now() + data.expires_in * 1000;

    response.cookies.set("spotify_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.expires_in,
    });

    response.cookies.set("spotify_token_expires_at", expiresAt.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    if (data.refresh_token) {
      response.cookies.set("spotify_refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    const { data: userData } = await axios.get<SpotifyUserResponse>(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      },
    );

    await db.spotifyUser.upsert({
      where: { spotifyId: userData.id },
      update: {
        email: userData.email,
        name: userData.display_name,
        image: userData.images?.[0]?.url,
      },
      create: {
        spotifyId: userData.id,
        email: userData.email,
        name: userData.display_name,
        image: userData.images?.[0]?.url,
      },
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to exchange code for token" },
      { status: 500 },
    );
  }
}
