import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  spotifyProtectedProcedure,
} from "../trpc";
import { getUserId } from "@/lib/spotify";
import { cookies } from "next/headers";

export const likesRouter = createTRPCRouter({
  toggleGridLike: spotifyProtectedProcedure
    .input(z.object({ gridId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = await getUserId(ctx.spotifyAccessToken);
      const existingLike = await ctx.db.gridLike.findUnique({
        where: {
          userId_gridId: {
            userId,
            gridId: input.gridId,
          },
        },
      });

      if (existingLike) {
        await ctx.db.gridLike.delete({
          where: { id: existingLike.id },
        });
        return false;
      }

      await ctx.db.gridLike.create({
        data: {
          userId,
          gridId: input.gridId,
        },
      });
      return true;
    }),

  toggleChartLike: spotifyProtectedProcedure
    .input(z.object({ chartId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = await getUserId(ctx.spotifyAccessToken);
      const existingLike = await ctx.db.chartLike.findUnique({
        where: {
          userId_chartId: {
            userId,
            chartId: input.chartId,
          },
        },
      });

      if (existingLike) {
        await ctx.db.chartLike.delete({
          where: { id: existingLike.id },
        });
        return false;
      }

      await ctx.db.chartLike.create({
        data: {
          userId,
          chartId: input.chartId,
        },
      });
      return true;
    }),

  getGridLikeStatus: publicProcedure
    .input(z.object({ gridId: z.string() }))
    .query(async ({ ctx, input }) => {
      const cookie = await cookies();
      const spotifyAccessToken = cookie.get("spotify_access_token")?.value;
      if (!spotifyAccessToken) {
        return false;
      }

      const userId = await getUserId(spotifyAccessToken);
      const like = await ctx.db.gridLike.findUnique({
        where: {
          userId_gridId: {
            userId,
            gridId: input.gridId,
          },
        },
      });
      return !!like;
    }),

  getChartLikeStatus: publicProcedure
    .input(z.object({ chartId: z.string() }))
    .query(async ({ ctx, input }) => {
      const cookie = await cookies();
      const spotifyAccessToken = cookie.get("spotify_access_token")?.value;
      if (!spotifyAccessToken) {
        return false;
      }
      const userId = await getUserId(spotifyAccessToken);
      const like = await ctx.db.chartLike.findUnique({
        where: {
          userId_chartId: {
            userId,
            chartId: input.chartId,
          },
        },
      });
      return !!like;
    }),
});
