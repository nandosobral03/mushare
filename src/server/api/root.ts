import { spotifyRouter } from "@/server/api/routers/spotify";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { chartRouter } from "./routers/chart";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
  chart: chartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.spotify.searchAlbums({ query: "..." });
 *       ^? SpotifyAlbum[]
 */
export const createCaller = createCallerFactory(appRouter);
