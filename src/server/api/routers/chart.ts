import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  spotifyProtectedProcedure,
} from "@/server/api/trpc";
import { getUserId } from "@/lib/spotify";
import { createSpotifyPlaylistFromAlbums } from "@/lib/spotify";
import { TRPCError } from "@trpc/server";

export const chartRouter = createTRPCRouter({
  create: spotifyProtectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        albums: z.array(
          z.object({
            id: z.string({
              required_error: "Album ID is required",
              invalid_type_error: "Album ID must be a string",
            }),
            name: z.string({
              required_error: "Album name is required",
              invalid_type_error: "Album name must be a string",
            }),
            artist: z.string({
              required_error: "Artist name is required",
              invalid_type_error: "Artist name must be a string",
            }),
            imageUrl: z.string({
              required_error: "Album image URL is required",
              invalid_type_error: "Album image URL must be a string",
            }),
          }),
        ),
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
            create: input.albums.map((album, index) => ({
              id: album.id,
              position: index,
              album: {
                connectOrCreate: {
                  where: { spotifyId: album.id },
                  create: {
                    spotifyId: album.id,
                    name: album.name,
                    artist: album.artist,
                    imageUrl: album.imageUrl,
                  },
                },
              },
            })),
          },
        },
      });
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chart = await ctx.db.chart.findUnique({
        where: { id: input.id },
        include: {
          albums: {
            include: {
              album: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      if (!chart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chart not found",
        });
      }

      return chart;
    }),

  createPlaylist: spotifyProtectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chart = await ctx.db.chart.findUnique({
        where: { id: input.id },
        include: {
          albums: {
            include: {
              album: true,
            },
            orderBy: {
              position: "asc",
            },
          },
          spotifyUser: true,
        },
      });

      if (!chart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chart not found",
        });
      }

      return await createSpotifyPlaylistFromAlbums(
        chart.albums.map((album) => album.album.spotifyId),
        `Mushare Chart - ${chart.title} by ${chart.spotifyUser.name}`,
        `Chart created by Mushare. View the original at https://mushare.app/chart/${chart.id}`,
      );
    }),
});
