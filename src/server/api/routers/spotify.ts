import {
  createTRPCRouter,
  publicProcedure,
  spotifyProtectedProcedure,
} from "@/server/api/trpc";
import { getUserId, searchSpotifyAlbums } from "@/lib/spotify";
import { z } from "zod";

export const spotifyRouter = createTRPCRouter({
  searchAlbums: spotifyProtectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return await searchSpotifyAlbums(input.query);
    }),
  createGrid: spotifyProtectedProcedure
    .input(
      z.object({
        size: z.number().min(1).max(10),
        albums: z.array(
          z
            .object({
              id: z.string(),
              name: z.string(),
              artist: z.string(),
              imageUrl: z.string(),
            })
            .nullable(),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = await getUserId(ctx.spotifyAccessToken);
      return await ctx.db.grid.create({
        data: {
          size: input.size,
          spotifyUserId: userId,
          albums: {
            connectOrCreate: input.albums
              .filter(
                (album): album is NonNullable<typeof album> => album !== null,
              )
              .map((album) => ({
                where: { spotifyId: album.id },
                create: {
                  spotifyId: album.id,
                  name: album.name,
                  artist: album.artist,
                  imageUrl: album.imageUrl,
                },
              })),
          },
        },
      });
    }),
});
