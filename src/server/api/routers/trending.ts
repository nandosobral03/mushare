import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { type Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

export const trendingRouter = createTRPCRouter({
  getItems: publicProcedure
    .input(
      z.object({
        dateRange: z.enum(["weekly", "monthly", "all"]),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { dateRange, cursor } = input;

      const dateFilter: Prisma.DateTimeFilter | undefined =
        dateRange === "all"
          ? undefined
          : {
              gte:
                dateRange === "weekly"
                  ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            };

      const [grids, charts] = await Promise.all([
        ctx.db.grid.findMany({
          take: ITEMS_PER_PAGE,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
          where: {
            createdAt: dateFilter,
          },
          orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
          include: {
            _count: {
              select: { likes: true },
            },
            albums: {
              include: {
                album: true,
              },
              take: 4,
            },
            spotifyUser: true,
          },
        }),
        ctx.db.chart.findMany({
          take: ITEMS_PER_PAGE,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
          where: {
            createdAt: dateFilter,
          },
          orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
          include: {
            _count: {
              select: { likes: true },
            },
            albums: {
              include: {
                album: true,
              },
              take: 4,
            },
            spotifyUser: true,
          },
        }),
      ]);

      const items = [...grids, ...charts].sort(
        (a, b) => b._count.likes - a._count.likes,
      );

      const nextCursor =
        items.length === ITEMS_PER_PAGE
          ? items[items.length - 1]?.id
          : undefined;

      return {
        items,
        nextCursor,
      };
    }),
});
