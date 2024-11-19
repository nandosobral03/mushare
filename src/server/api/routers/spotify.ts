import { createTRPCRouter, spotifyProtectedProcedure } from "@/server/api/trpc";
import { getUserId, searchSpotifyAlbums } from "@/lib/spotify";
import { z } from "zod";
import type { Album } from "@/types/spotify";

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const CLEANUP_PROBABILITY = 0.1; // 10% chance of cleanup per request

export const spotifyRouter = createTRPCRouter({
  searchAlbums: spotifyProtectedProcedure
    .input(
      z.object({
        query: z.string({
          required_error: "Search query is required",
          invalid_type_error: "Search query must be a string",
        }),
      }),
    )
    .query(async ({ input, ctx }) => {
      // Random cleanup of old cache entries
      if (Math.random() < CLEANUP_PROBABILITY) {
        void ctx.db.searchCache.deleteMany({
          where: {
            timestamp: {
              lt: Date.now() - CACHE_TTL,
            },
          },
        });
      }

      const cacheKey = `spotify-search:${input.query}`;
      const cached = await ctx.db.searchCache.findUnique({
        where: { key: cacheKey },
      });

      if (
        cached &&
        Date.now() - Number(cached.timestamp) < 24 * 60 * 60 * 1000
      ) {
        return JSON.parse(cached.value) as Album[];
      }

      const results = await searchSpotifyAlbums(input.query);

      await ctx.db.searchCache.upsert({
        where: { key: cacheKey },
        create: {
          key: cacheKey,
          value: JSON.stringify(results),
          timestamp: Math.floor(Date.now()),
        },
        update: {
          value: JSON.stringify(results),
          timestamp: Math.floor(Date.now()),
        },
      });

      return results;
    }),
  getUser: spotifyProtectedProcedure.query(async ({ ctx }) => {
    const userId = await getUserId(ctx.spotifyAccessToken);
    return await ctx.db.spotifyUser.findUnique({
      where: { spotifyId: userId },
    });
  }),
});
