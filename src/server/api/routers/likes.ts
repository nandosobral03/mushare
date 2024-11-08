import { z } from "zod";
import { createTRPCRouter, spotifyProtectedProcedure } from "../trpc";
import { getUserId } from "@/lib/spotify";

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

  getGridLikeStatus: spotifyProtectedProcedure
    .input(z.object({ gridId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = await getUserId(ctx.spotifyAccessToken);
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

  getChartLikeStatus: spotifyProtectedProcedure
    .input(z.object({ chartId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = await getUserId(ctx.spotifyAccessToken);
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
