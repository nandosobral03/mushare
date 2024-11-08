import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getUserId } from "@/lib/spotify";
import type { Album } from "@/types/spotify";
import { cookies } from "next/headers";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(async ({ ctx }) => {
    const cookie = await cookies();
    const spotifyAccessToken = cookie.get("spotify_access_token")?.value;
    if (!spotifyAccessToken) {
      return null;
    }
    const userId = await getUserId(spotifyAccessToken);
    return await ctx.db.spotifyUser.findUnique({
      where: { spotifyId: userId },
    });
  }),
});
