"use client";

import { Button } from "@/components/ui/button";
import { ContentWrapper } from "@/components/ui/ContentWrapper";
import { PageHeader } from "@/components/ui/PageHeader";
import { useRouter } from "next/navigation";
import { useSignUpModal } from "@/hooks/useSignUpModal";

const ChartsPage = () => {
  const router = useRouter();
  const { showSignUpModalIfNeeded } = useSignUpModal();

  const handleCreateChart = () => {
    const needsSignUp = showSignUpModalIfNeeded();
    if (!needsSignUp) {
      router.push("/chart/create");
    }
  };

  return (
    <>
      <PageHeader
        icon="bar_chart"
        title="Album Charts"
        description="Create and share ranked lists of your favorite albums from Spotify."
        breadcrumbs={[{ label: "Album Charts" }]}
      />
      <ContentWrapper>
        <div className="flex flex-col items-center gap-8 p-4 md:p-8">
          <div className="max-w-2xl text-center">
            <h2 className="mb-4 text-xl font-bold text-white md:text-2xl">
              What are Album Charts?
            </h2>
            <p className="mb-6 text-sm text-muted-foreground md:text-base">
              Album Charts let you create ranked lists of your favorite albums.
              Whether you want to showcase your top albums of all time, rank
              albums from a specific artist, or create a themed chart - the
              possibilities are endless.
            </p>
            <div className="mb-8 grid grid-cols-1 gap-4 text-left md:grid-cols-3 md:gap-6">
              <div className="rounded-lg bg-secondary p-4">
                <span className="material-symbols-outlined mb-2 text-spotify">
                  format_list_numbered
                </span>
                <h3 className="mb-2 text-sm font-semibold text-white md:text-base">
                  Rank
                </h3>
                <p className="text-xs text-muted-foreground md:text-sm">
                  Create ranked lists of albums from your Spotify library. Drag
                  and drop to arrange them in your preferred order.
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
                  Share your charts with friends, download them as images, and
                  showcase your musical rankings wherever you like.
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <span className="material-symbols-outlined mb-2 text-spotify">
                  playlist_add
                </span>
                <h3 className="mb-2 text-sm font-semibold text-white md:text-base">
                  Listen
                </h3>
                <p className="text-xs text-muted-foreground md:text-sm">
                  Turn any chart into a Spotify playlist with a single click.
                  Discover new music through other users&apos; rankings and add them
                  to your library.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleCreateChart}
              className="w-full gap-2 md:w-auto"
            >
              <span className="material-symbols-outlined">add</span>
              Create Your First Chart
            </Button>
          </div>
        </div>
      </ContentWrapper>
    </>
  );
};

export default ChartsPage;
