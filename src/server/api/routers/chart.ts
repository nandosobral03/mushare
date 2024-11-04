import { z } from "zod";
import { createTRPCRouter, spotifyProtectedProcedure } from "@/server/api/trpc";
import { getUserId } from "@/lib/spotify";

export const chartRouter = createTRPCRouter({
  create: spotifyProtectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        albumIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = await getUserId(ctx.spotifyAccessToken);

      return ctx.db.chart.create({
        data: {
          title: input.title,
          description: input.description,
          spotifyUserId: userId,
          albums: {
            create: input.albumIds.map((albumId, index) => ({
              albumId,
              position: index,
            })),
          },
        },
      });
    }),
});
