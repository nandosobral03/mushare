import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  spotifyProtectedProcedure,
} from "@/server/api/trpc";
import { searchSpotifyAlbums } from "@/lib/spotify";

export const spotifyRouter = createTRPCRouter({
  searchAlbums: spotifyProtectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      const albums = await searchSpotifyAlbums(
        input.query,
        ctx.spotifyAccessToken,
      );
      return albums;
    }),
});
