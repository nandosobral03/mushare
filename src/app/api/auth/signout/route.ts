import { NextResponse } from "next/server";

export const GET = (request: Request) => {
  const response = NextResponse.redirect(new URL("/", request.url));

  response.cookies.delete("spotify_access_token");
  response.cookies.delete("spotify_refresh_token");

  return response;
};
