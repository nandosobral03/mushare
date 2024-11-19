
import { PageHeader } from "@/components/ui/PageHeader";
import { ContentWrapper } from "@/components/ui/ContentWrapper";
import { TrendingList } from "@/components/trending/TrendingList";

export default function TrendingPage() {
  return (
    <>
      <PageHeader
        icon="trending_up"
        title="Most Popular"
        description="Discover the most popular grids and charts"
        breadcrumbs={[{ label: "Most Popular" }]}
      />
      <ContentWrapper>
        <TrendingList dateRange="all" />
      </ContentWrapper>
    </>
  );
}
