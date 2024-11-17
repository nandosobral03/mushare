import {
  createTRPCRouter,
  publicProcedure,
  spotifyProtectedProcedure,
} from "@/server/api/trpc";
import { createSpotifyPlaylistFromAlbums, getUserId } from "@/lib/spotify";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const gridRouter = createTRPCRouter({
  createGrid: spotifyProtectedProcedure
    .input(
      z
        .object({
          width: z
            .number({
              required_error: "Grid width is required",
              invalid_type_error: "Grid width must be a number",
            })
            .min(2, "Grid width must be at least 2")
            .max(6, "Grid width cannot be larger than 6"),
          height: z
            .number({
              required_error: "Grid height is required",
              invalid_type_error: "Grid height must be a number",
            })
            .min(2, "Grid height must be at least 2")
            .max(12, "Grid height cannot be larger than 12"),
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
          title: z.string(),
        })
        .refine(
          (data) =>
            data.albums.length === data.width * data.height &&
            data.albums.every((album) => album !== null),
          {
            message:
              "All grid positions must be filled with albums and match the grid dimensions",
          },
        ),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = await getUserId(ctx.spotifyAccessToken);
      return await ctx.db.grid.create({
        data: {
          width: input.width,
          height: input.height,
          spotifyUserId: userId,
          albums: {
            create: input.albums
              .filter(
                (album): album is NonNullable<typeof album> => album !== null,
              )
              .map((album, index) => ({
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
          title: input.title,
        },
      });
    }),
  getGrid: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const grid = await ctx.db.grid.findUnique({
        where: { id: input.id },
        include: {
          albums: {
            include: {
              album: true,
            },
          },
        },
      });

      if (!grid) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Grid not found",
        });
      }

      return grid;
    }),
  getUserGrids: spotifyProtectedProcedure.query(async ({ ctx }) => {
    const userId = await getUserId(ctx.spotifyAccessToken);
    return await ctx.db.grid.findMany({
      where: { spotifyUserId: userId },
    });
  }),
  createPlaylistFromGrid: spotifyProtectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const grid = await ctx.db.grid.findUnique({
        where: { id: input.id },
        include: {
          albums: {
            include: {
              album: true,
            },
          },
          spotifyUser: true,
        },
      });

      if (!grid) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Grid not found",
        });
      }

      await ctx.db.grid.update({
        where: { id: input.id },
        data: { savedCount: { increment: 1 } },
      });

      return await createSpotifyPlaylistFromAlbums(
        grid.albums.map((album) => album.album.spotifyId),
        `Mushare ${grid.width}x${grid.height} - ${grid.title} by ${grid.spotifyUser.name}`,
        `Playlist created by Mushare based on the grid "${grid.title}", grid can be found at https://mushare.app/grid/${grid.id}`,
      );
    }),
});
