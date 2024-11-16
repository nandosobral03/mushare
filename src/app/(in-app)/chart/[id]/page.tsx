import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChartList } from "@/components/chart/ChartList";
import ShareButton from "@/components/grid/ShareButton";
import { AddChartAsPlaylistButton } from "@/components/chart/AddChartAsPlaylistButton";
import { LikeChart } from "./like-chart";

type ChartPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ChartPage = async ({ params }: ChartPageProps) => {
  const resolvedParams = await params;
  const chart = await api.chart.get({ id: resolvedParams.id });
  if (!chart) {
    notFound();
  }

  const isLiked = await api.likes.getChartLikeStatus({
    chartId: resolvedParams.id,
  });

  return (
    <>
      <PageHeader
        icon="view_list"
        title={chart.title}
        description={
          chart.description ||
          `Created on ${chart.createdAt.toLocaleDateString()}`
        }
        breadcrumbs={[
          { label: "Charts", href: "/chart" },
          { label: chart.title },
        ]}
      />
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full max-w-5xl flex-col items-center gap-4">
          <div className="flex gap-4">
            <AddChartAsPlaylistButton id={chart.id} />
            <ShareButton gridId={chart.id} />
            <LikeChart chartId={chart.id} initialIsLiked={isLiked} />
          </div>
          <ChartList
            albums={chart.albums.map((album, index) => ({
              ...album.album,
              index,
            }))}
            readonly
          />
        </div>
      </div>
    </>
  );
};

export default ChartPage;
