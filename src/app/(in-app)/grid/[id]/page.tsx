import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { AlbumGrid } from "@/components/AlbumGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { AddGridAsPlaylistButton } from "@/components/AddGridAsPlaylistButton";

type GridPageProps = {
  params: {
    id: string;
  };
};

const GridPage = async ({ params }: GridPageProps) => {
  const grid = await api.spotify.getGrid({ id: params.id });
  if (!grid) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon="grid_view"
        title={grid.title}
        description={`Created on ${grid.createdAt.toLocaleDateString()}`}
      />
      <div className="flex grow flex-col items-center justify-center gap-4 p-8">
        <div className="w-full max-w-[min(calc(100vh-32rem),calc(100vw-16rem))]">
          <AlbumGrid size={grid.size} selectedAlbums={grid.albums} readonly />
        </div>
        <AddGridAsPlaylistButton id={grid.id} />
      </div>
    </div>
  );
};

export default GridPage;
