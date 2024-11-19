"use client";

import { Button } from "@/components/ui/button";
import { ContentWrapper } from "@/components/ui/ContentWrapper";
import { PageHeader } from "@/components/ui/PageHeader";
import { useRouter } from "next/navigation";
import { useSignUpModal } from "@/hooks/useSignUpModal";

const GridPage = () => {
  const router = useRouter();
  const { showSignUpModalIfNeeded } = useSignUpModal();

  const handleCreateGrid = () => {
    const needsSignUp = showSignUpModalIfNeeded();
    if (!needsSignUp) {
      router.push("/grid/create");
    }
  };

  return (
    <>
      <PageHeader
        icon="grid_view"
        title="Album Grids"
        description="Create and share custom grids of your favorite albums from Spotify."
        breadcrumbs={[{ label: "Grids" }]}
      />
      <ContentWrapper>
        <div className="flex flex-col items-center gap-8 p-4 md:p-8">
          <div className="max-w-2xl text-center">
            <h2 className="mb-4 text-xl font-bold text-white md:text-2xl">
              What are Album Grids?
            </h2>
            <p className="mb-6 text-sm text-muted-foreground md:text-base">
              Album Grids let you show off a select number of your favorite
              albums in a custom sharable grid. Show off how much of a music
              nerd you are by selecting the best albums in a given genre, or
              simply throw together a grid of your favorite albums.
            </p>
            <div className="mb-8 grid grid-cols-1 gap-4 text-left md:grid-cols-3 md:gap-6">
              <div className="rounded-lg bg-secondary p-4">
                <span className="material-symbols-outlined mb-2 text-spotify">
                  add_circle
                </span>
                <h3 className="mb-2 text-sm font-semibold text-white md:text-base">
                  Create
                </h3>
                <p className="text-xs text-muted-foreground md:text-sm">
                  Build custom grids by selecting albums from your Spotify
                  library. Choose the perfect size to showcase your collection.
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <span className="material-symbols-outlined mb-2 text-spotify">
                  share
                </span>
                <h3 className="mb-2 text-sm font-semibold text-white md:text-base">
                  Share
                </h3>
                <p className="text-xs text-muted-foreground md:text-sm">
                  Share your grids with friends, download the grid as an image
                  and share it wherever you like to show off your musical taste.
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <span className="material-symbols-outlined mb-2 text-spotify">
                  playlist_add
                </span>
                <h3 className="mb-2 text-sm font-semibold text-white md:text-base">
                  Explore
                </h3>
                <p className="text-xs text-muted-foreground md:text-sm">
                  Explore grids created by others and see how they&apos;ve
                  showcased their musical tastes. If something catches your
                  eye, add the grid as a playlist to your Spotify library and give
                  it a listen.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleCreateGrid}
              className="w-full gap-2 md:w-auto"
            >
              <span className="material-symbols-outlined">add</span>
              Create Your First Grid
            </Button>
          </div>
        </div>
      </ContentWrapper>
    </>
  );
};

export default GridPage;
