import {
  createTRPCRouter,
  publicProcedure,
  spotifyProtectedProcedure,
} from "@/server/api/trpc";
import {
  createSpotifyPlaylistFromAlbums,
  getUserId,
  searchSpotifyAlbums,
} from "@/lib/spotify";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { Album } from "@/types/spotify";

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
          timestamp: Date.now(),
        },
        update: {
          value: JSON.stringify(results),
          timestamp: Date.now(),
        },
      });

      return results;
    }),
  createGrid: spotifyProtectedProcedure
    .input(
      z
        .object({
          size: z
            .number({
              required_error: "Grid size is required",
              invalid_type_error: "Grid size must be a number",
            })
            .min(2, "Grid size must be at least 2")
            .max(6, "Grid size cannot be larger than 5"),
          albums: z.array(
            z
              .object({
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
              })
              .nullable(),
          ),
          title: z.string(),
        })
        .refine(
          (data) =>
            // length of albums array is size * size
            data.albums.length === data.size * data.size &&
            data.albums.every((album) => album !== null),
          {
            message:
              "All grid positions must be filled with albums and match the grid size",
          },
        ),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = await getUserId(ctx.spotifyAccessToken);
      return await ctx.db.grid.create({
        data: {
          size: input.size,
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

      return await createSpotifyPlaylistFromAlbums(
        grid.albums.map((album) => album.album.spotifyId),
        `Mushare ${grid.size}x${grid.size} - ${grid.title} by ${grid.spotifyUser.name}`,
        `Playlist created by Mushare based on the grid "${grid.title}", grid can be found at https://mushare.app/grid/${grid.id}`,
      );
    }),
  getUser: spotifyProtectedProcedure.query(async ({ ctx }) => {
    const userId = await getUserId(ctx.spotifyAccessToken);
    return await ctx.db.spotifyUser.findUnique({
      where: { spotifyId: userId },
    });
  }),
});
