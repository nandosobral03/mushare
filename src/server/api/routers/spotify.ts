import {
  createTRPCRouter,
  publicProcedure,
  spotifyProtectedProcedure,
} from "@/server/api/trpc";
import { getUserId, searchSpotifyAlbums } from "@/lib/spotify";
import { z } from "zod";

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
    .query(async ({ input }) => {
      return await searchSpotifyAlbums(input.query);
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
            .max(5, "Grid size cannot be larger than 5"),
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
          title: input.title,
        },
      });
    }),
});
