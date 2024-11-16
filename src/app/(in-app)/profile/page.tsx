import { db } from "@/server/db";
import MediaScroller from "@/components/profile/MediaScroller";
import { api } from "@/trpc/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContentWrapper } from "@/components/ui/ContentWrapper";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await api.spotify.getUser();

  const [grids] = await Promise.all([
    db.grid.findMany({
      where: { spotifyUserId: session?.spotifyId },
      include: {
        albums: {
          include: {
            album: true,
          },
        },
      },
    }),
  ]);

  const charts = await db.chart.findMany({
    where: { spotifyUserId: session?.spotifyId },
    include: {
      albums: {
        include: { album: true },
      },
    },
  });

  if (!session) {
    redirect("/");
    return null;
  }

  return (
    <>
      <PageHeader
        title="Profile"
        icon="person"
        description="View your creations"
      />
      <ContentWrapper>
        <div className="flex items-center gap-2">
          {session?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.image}
              alt={session.name ?? ""}
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{session.name}</h1>
            <p className="text-sm text-gray-400">{session.email}</p>
          </div>
        </div>

        {grids.length > 0 ? (
          <MediaScroller
            title="Your Grids"
            items={grids.map((grid) => ({
              id: grid.id,
              title: grid.title,
              albums: grid.albums.map((a) => ({
                imageUrl: a.album.imageUrl,
              })),
            }))}
            type="grid"
          />
        ) : (
          <div className="mt-8 rounded-lg border border-gray-800 p-8 text-center">
            <h3 className="text-lg font-medium text-white">No Grids Yet</h3>
            <p className="mt-2 text-gray-400">
              <Link
                href="/grid/create"
                className="text-spotify hover:underline"
              >
                Create your first grid
              </Link>{" "}
              to see it here!
            </p>
          </div>
        )}

        {charts.length > 0 ? (
          <MediaScroller
            title="Your Charts"
            items={charts.map((chart) => ({
              id: chart.id,
              title: chart.title,
              albums: chart.albums.map((a) => ({
                imageUrl: a.album.imageUrl,
              })),
            }))}
            type="chart"
          />
        ) : (
          <div className="mt-8 rounded-lg border border-gray-800 p-8 text-center">
            <h3 className="text-lg font-medium text-white">No Charts Yet</h3>
            <p className="mt-2 text-gray-400">
              <Link
                href="/chart/create"
                className="text-spotify hover:underline"
              >
                Create your first chart
              </Link>{" "}
              to see it here!
            </p>
          </div>
        )}
      </ContentWrapper>
    </>
  );
}
