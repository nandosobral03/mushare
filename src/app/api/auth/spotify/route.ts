import { redirect } from "next/navigation";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
  throw new Error("Missing required Spotify environment variables");
}

const scope = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

export const GET = () => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: SPOTIFY_REDIRECT_URI,
  });

  return redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`,
  );
};
