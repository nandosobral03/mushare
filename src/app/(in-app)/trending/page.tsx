"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContentWrapper } from "@/components/ui/ContentWrapper";
import { TrendingList } from "@/components/trending/TrendingList";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type DateRange = "weekly" | "monthly" | "all";

export default function TrendingPage() {
  const [dateRange, setDateRange] = useState<DateRange>("weekly");

  return (
    <>
      <PageHeader
        icon="trending_up"
        title="Trending"
        description="Discover the most popular grids and charts"
      />
      <ContentWrapper>
        <div className="mb-8 flex justify-end">
          <ToggleGroup
            type="single"
            value={dateRange}
            onValueChange={(value) => setDateRange(value as DateRange)}
          >
            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="all">All Time</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <TrendingList dateRange={dateRange} />
      </ContentWrapper>
    </>
  );
}
