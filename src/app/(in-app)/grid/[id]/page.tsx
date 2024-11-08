import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { AlbumGrid } from "@/components/grid/AlbumGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { AddGridAsPlaylistButton } from "@/components/grid/AddGridAsPlaylistButton";
import { SelectedAlbums } from "@/components/grid/SelectedAlbums";
import ShareButton from "@/components/grid/ShareButton";
import DownloadAsImageButton from "@/components/grid/DownloadAsImageButton";
import { ContentWrapper } from "@/components/ui/ContentWrapper";
import { LikeGrid } from "./like-grid";
// import { LikeButton } from "~/components/ui/LikeButton";

type GridPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const GridPage = async ({ params }: GridPageProps) => {
  const resolvedParams = await params;
  const grid = await api.grid.getGrid({ id: resolvedParams.id });
  if (!grid) {
    notFound();
  }

  const isLiked = await api.likes.getGridLikeStatus({
    gridId: resolvedParams.id,
  });

  return (
    <>
      <PageHeader
        icon="grid_view"
        title={grid.title}
        description={`Created on ${grid.createdAt.toLocaleDateString()} by ${grid.spotifyUserId}`}
      />
      <ContentWrapper>
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="flex w-full max-w-7xl grow items-center justify-center gap-4"
            id="grid"
          >
            <div className="flex w-2/3 max-w-[min(calc(100vh-32rem),calc(100vw-16rem))] flex-col items-center">
              <AlbumGrid
                size={grid.size}
                selectedAlbums={grid.albums.map((album) => ({
                  ...album.album,
                  position: album.position,
                }))}
                readonly
              />
              <div className="mt-4 flex gap-4">
                <LikeGrid gridId={grid.id} initialIsLiked={isLiked} />
                <AddGridAsPlaylistButton id={grid.id} />
                <ShareButton gridId={grid.id} />
                <DownloadAsImageButton gridId={grid.id} />
              </div>
            </div>
            <SelectedAlbums
              albums={grid.albums.map((album, index) => ({
                name: album.album.name,
                artist: album.album.artist,
                imageUrl: album.album.imageUrl,
                id: album.album.id,
                spotifyId: album.album.spotifyId,
                index,
              }))}
            />
          </div>
        </div>
      </ContentWrapper>
    </>
  );
};

export default GridPage;
